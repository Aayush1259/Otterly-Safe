/**
 * Otterly Safe rules engine.
 * Pure, deterministic, explainable functions. No ML score, no network calls.
 * Inputs are limited to Sound's own account data (see src/types.ts).
 */
import type { BankEvent, Lane, Member, Reason, RuleId, RuleResult } from '../types';
import { DEFAULT_CONFIG, type RulesConfig } from './config';
import { ago, minutesBetween, money } from '../lib/format';

const HOUR_MS = 3_600_000;
const t = (iso: string) => new Date(iso).getTime();

export interface RuleHit {
  id: RuleId;
  plainText: string;
  evidence: string[];
}

/** Events strictly before the payment (or the same instant but a different id). */
function priorEvents(payment: BankEvent, history: BankEvent[]): BankEvent[] {
  const pt = t(payment.timestamp);
  return history.filter(
    (e) => e.member_id === payment.member_id && e.event_id !== payment.event_id && t(e.timestamp) <= pt,
  );
}

const PROFILE_LABEL: Record<string, string> = {
  password_reset: 'Password reset',
  phone_change: 'Phone number changed',
  email_change: 'Email changed',
};

/** R1 — first payment to this recipient (uses the new-recipient flag). */
export function r1FirstPayment(payment: BankEvent, history: BankEvent[], cfg: RulesConfig): RuleHit | null {
  if (!payment.new_recipient || (payment.amount ?? 0) < cfg.reviewFloor) return null;
  const added = priorEvents(payment, history).find(
    (e) => e.type === 'payee_added' && e.recipient_id === payment.recipient_id,
  );
  return {
    id: 'R1',
    plainText: 'First payment to this person',
    evidence: [payment.event_id, ...(added ? [added.event_id] : [])],
  };
}

/** R2 — amount ≥ N× the member's usual payment. */
export function r2BigVsUsual(payment: BankEvent, member: Member, cfg: RulesConfig): RuleHit | null {
  const amt = payment.amount ?? 0;
  if (amt < cfg.reviewFloor || member.usual_payment <= 0) return null;
  const multiple = amt / member.usual_payment;
  if (multiple < cfg.r2Multiple) return null;
  const shown = multiple >= 10 ? Math.floor(multiple) : Math.round(multiple * 10) / 10;
  return { id: 'R2', plainText: `${shown}x your usual payment`, evidence: [payment.event_id] };
}

/** R3 — amount ≥ X% of the balance before the payment. */
export function r3ShareOfBalance(payment: BankEvent, member: Member, cfg: RulesConfig): RuleHit | null {
  const amt = payment.amount ?? 0;
  const bal = payment.balance_before ?? member.balance;
  if (amt < cfg.reviewFloor || bal <= 0) return null;
  const share = amt / bal;
  if (share < cfg.r3Share) return null;
  return { id: 'R3', plainText: `${Math.round(share * 100)}% of the balance`, evidence: [payment.event_id] };
}

/** R4 — hard to undo: wire or instant P2P. */
export function r4HardToUndo(payment: BankEvent, cfg: RulesConfig): RuleHit | null {
  if ((payment.amount ?? 0) < cfg.reviewFloor) return null;
  if (payment.payment_type === 'wire') return { id: 'R4', plainText: 'Wire: hard to undo', evidence: [payment.event_id] };
  if (payment.payment_type === 'p2p')
    return { id: 'R4', plainText: 'Instant P2P: hard to undo', evidence: [payment.event_id] };
  return null;
}

/** R5 — password reset or phone/email change within the window. */
export function r5ProfileChange(payment: BankEvent, history: BankEvent[], cfg: RulesConfig): RuleHit | null {
  const pt = t(payment.timestamp);
  const changes = priorEvents(payment, history)
    .filter((e) => e.type in PROFILE_LABEL && pt - t(e.timestamp) <= cfg.r5WindowHours * HOUR_MS)
    .sort((a, b) => t(a.timestamp) - t(b.timestamp));
  if (changes.length === 0) return null;
  const labels = Array.from(new Set(changes.map((c) => PROFILE_LABEL[c.type])));
  const first = changes[0];
  return {
    id: 'R5',
    plainText: `${labels.join(' + ')} in the last ${ago(minutesBetween(first.timestamp, payment.timestamp))}`,
    evidence: changes.map((c) => c.event_id),
  };
}

/** R6 — a large *new* deposit, then a payment to a new recipient within the window. */
export function r6DepositThenNewPayee(payment: BankEvent, history: BankEvent[], cfg: RulesConfig): RuleHit | null {
  if (!payment.new_recipient) return null;
  const pt = t(payment.timestamp);
  const prior = priorEvents(payment, history);
  const deposit = prior
    .filter(
      (e) =>
        e.type === 'deposit' &&
        (e.amount ?? 0) >= cfg.r6LargeDeposit &&
        pt - t(e.timestamp) <= cfg.r6WindowHours * HOUR_MS,
    )
    .find((d) => {
      // "New" = this source hasn't paid in recently (so payroll never trips R6).
      const since = t(d.timestamp) - cfg.r6NewSourceDays * 24 * HOUR_MS;
      return !prior.some(
        (e) =>
          e.type === 'deposit' &&
          e.event_id !== d.event_id &&
          e.recipient_id === d.recipient_id &&
          t(e.timestamp) < t(d.timestamp) &&
          t(e.timestamp) >= since,
      );
    });
  if (!deposit) return null;
  return {
    id: 'R6',
    plainText: `${money(deposit.amount ?? 0)} new deposit ${ago(minutesBetween(deposit.timestamp, payment.timestamp))} earlier, then a new payee`,
    evidence: [deposit.event_id, payment.event_id],
  };
}

/** R7 — a retry, split amount or payment-type switch after a hold. */
export function r7AfterHold(payment: BankEvent, history: BankEvent[]): RuleHit | null {
  const held = priorEvents(payment, history)
    .filter((e) => e.type === 'payment' && (e.status === 'held' || e.hold_count > 0))
    .sort((a, b) => t(b.timestamp) - t(a.timestamp));
  const h =
    held.find((e) => payment.retry_of === e.event_id) ??
    held.find((e) => e.recipient_id === payment.recipient_id) ??
    (payment.hold_count > 0 ? held[0] : undefined);
  if (!h) return null;
  let plainText = 'Tried again after a hold';
  if (h.payment_type && payment.payment_type && h.payment_type !== payment.payment_type) {
    plainText = `Switched from ${h.payment_type.toUpperCase()} to ${payment.payment_type.toUpperCase()} after a hold`;
  } else if ((payment.amount ?? 0) < (h.amount ?? 0)) {
    plainText = 'Split into a smaller amount after a hold';
  }
  return { id: 'R7', plainText, evidence: [h.event_id, payment.event_id] };
}

export function runRules(
  payment: BankEvent,
  member: Member,
  history: BankEvent[],
  cfg: RulesConfig = DEFAULT_CONFIG,
): RuleHit[] {
  return [
    r1FirstPayment(payment, history, cfg),
    r2BigVsUsual(payment, member, cfg),
    r3ShareOfBalance(payment, member, cfg),
    r4HardToUndo(payment, cfg),
    r5ProfileChange(payment, history, cfg),
    r6DepositThenNewPayee(payment, history, cfg),
    r7AfterHold(payment, history),
  ].filter((h): h is RuleHit => h !== null);
}

/**
 * Lanes:
 *  - Takeover:  R5 + new recipient + (R2 or R3)
 *  - Scam signs: not takeover, and (R1 + R4 + (R2 or R3)) or R6 or R7
 *  - Look-alike: R1 or R2 without scam signs, or covered by the member's own rule
 *  - Normal:    nothing above applies
 * Member "allow" rules never soften the Takeover or Scam-signs lanes.
 */
export function decideLane(fired: Set<RuleId>, isNewRecipient: boolean): Lane {
  const big = fired.has('R2') || fired.has('R3');
  if (fired.has('R5') && isNewRecipient && big) return 'takeover';
  if ((fired.has('R1') && fired.has('R4') && big) || fired.has('R6') || fired.has('R7')) return 'scam';
  if (fired.has('R1') || fired.has('R2')) return 'lookalike';
  return 'normal';
}

export function evaluatePayment(
  payment: BankEvent,
  member: Member,
  history: BankEvent[],
  cfg: RulesConfig = DEFAULT_CONFIG,
): RuleResult {
  if (payment.type !== 'payment' || payment.payment_type === 'internal') {
    // Transfers between the member's own accounts never pause.
    return { lane: 'normal', reasons: [], evidenceEventIds: [], fired: [], paused: false };
  }
  const hits = runRules(payment, member, history, cfg);
  const fired = new Set(hits.map((h) => h.id));
  let lane = decideLane(fired, payment.new_recipient);
  const reasons: Reason[] = hits.map((h) => ({ id: h.id, plainText: h.plainText }));
  const evidence = new Set(hits.flatMap((h) => h.evidence));
  const amt = payment.amount ?? 0;
  let paused = lane !== 'normal';
  let ownRuleId: string | undefined;

  // Member's own "hold" rule (e.g. from Practice): can add a pause, never remove one.
  const hold = member.own_rules.find(
    (r) => r.kind === 'hold_new_payees_over' && payment.new_recipient && amt > r.amount,
  );
  if (hold) {
    reasons.push({ id: 'OWN', plainText: `Your rule: hold new payees over ${money(hold.amount)}` });
    ownRuleId = hold.rule_id;
    if (lane === 'normal') lane = 'lookalike';
    paused = true;
    evidence.add(payment.event_id);
  }

  // Member's own "allow" rule (e.g. contractors up to $6,000): only softens the look-alike lane.
  const allow = member.own_rules.find(
    (r) =>
      r.kind === 'allow_category_up_to' &&
      r.category &&
      payment.recipient_category === r.category &&
      amt <= r.amount,
  );
  if (allow && lane === 'lookalike' && !hold) {
    reasons.push({ id: 'OWN', plainText: `Covered by your rule: ${r2s(allow.category)} up to ${money(allow.amount)}` });
    ownRuleId = allow.rule_id;
    paused = false;
  }

  return { lane, reasons, evidenceEventIds: Array.from(evidence), fired: hits.map((h) => h.id), paused, ownRuleId };
}

function r2s(category?: string) {
  return category === 'contractor' ? 'contractor payments' : `${category ?? ''} payments`;
}

export const LANE_SEVERITY: Record<Lane, number> = { takeover: 3, scam: 2, lookalike: 1, normal: 0 };

/** Evaluate every payment for one member; return the most severe result (latest wins ties). */
export function evaluateMember(
  member: Member,
  events: BankEvent[],
  cfg: RulesConfig = DEFAULT_CONFIG,
): { result: RuleResult; event: BankEvent | null } {
  const mine = events
    .filter((e) => e.member_id === member.member_id)
    .sort((a, b) => t(a.timestamp) - t(b.timestamp));
  let best: { result: RuleResult; event: BankEvent | null } = {
    result: { lane: 'normal', reasons: [], evidenceEventIds: [], fired: [], paused: false },
    event: null,
  };
  for (const e of mine) {
    if (e.type !== 'payment') continue;
    const r = evaluatePayment(e, member, mine, cfg);
    if (LANE_SEVERITY[r.lane] >= LANE_SEVERITY[best.result.lane]) best = { result: r, event: e };
  }
  return best;
}
