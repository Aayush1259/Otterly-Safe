/**
 * Otterly Safe data model.
 * Only Sound's own account data is represented here: payment amount, timing,
 * channel, payment type, status, new-recipient flag, recent profile changes,
 * password resets, held-payment status, balances, history comparisons and
 * trusted-contact enrollment. Nothing else is modelled on purpose.
 */

export type Lang = 'en' | 'es';
export interface Localized {
  en: string;
  es: string;
}

export type PaymentType = 'p2p' | 'ach' | 'wire' | 'internal';
export type EventType =
  | 'login'
  | 'password_reset'
  | 'phone_change'
  | 'email_change'
  | 'payee_added'
  | 'payment'
  | 'deposit';
export type EventStatus = 'pending' | 'held' | 'sent';
export type Channel = 'mobile' | 'online' | 'branch' | 'phone' | 'direct_deposit';

export interface TrustedContact {
  name: string;
  relation: string;
  phone: string; // always a fictional 555-01xx number
}

export type OwnRuleKind = 'hold_new_payees_over' | 'allow_category_up_to';

export interface OwnRule {
  rule_id: string;
  kind: OwnRuleKind;
  amount: number;
  category?: string;
  label: Localized;
  created_at: string;
  source: 'practice' | 'lookalike' | 'seed';
}

export interface PracticeRecord {
  card_id: string;
  date: string; // ISO date
  correct: boolean;
}

export type MemberRole = 'anchor' | 'lookalike';

export interface Member {
  member_id: string;
  display_name: string;
  age_band: string;
  usual_payment: number;
  balance: number;
  trusted_contact: TrustedContact | null;
  own_rules: OwnRule[];
  practice_history: PracticeRecord[];
  role: MemberRole;
  placeholder?: boolean;
  phone_on_file?: string;
  email_on_file?: string;
  story?: string;
}

export interface BankEvent {
  event_id: string;
  member_id: string;
  timestamp: string; // ISO 8601 with offset
  type: EventType;
  amount: number | null;
  channel: Channel | null;
  payment_type: PaymentType | null;
  recipient_id: string | null; // payee for payments, source for deposits
  recipient_name?: string | null;
  recipient_category?: string | null;
  new_recipient: boolean;
  status: EventStatus | null;
  hold_count: number;
  balance_before?: number | null;
  retry_of?: string | null;
  detail?: string | null;
}

export interface Clue {
  phrase: Localized; // exact words inside the card content
  why: Localized; // one-line explanation
}

export type CardFormat = 'text' | 'call' | 'email' | 'payment_request' | 'listing' | 'in_app';

export interface Card {
  card_id: string;
  scam_type: string;
  format: CardFormat;
  sender: Localized;
  content: Localized;
  is_scam: boolean;
  clues: Clue[];
  protect_action: Localized;
}

export type RuleId = 'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'R6' | 'R7';
export type Lane = 'takeover' | 'scam' | 'lookalike' | 'normal';

export interface Reason {
  id: RuleId | 'OWN';
  plainText: string;
}

export interface RuleResult {
  lane: Lane;
  reasons: Reason[];
  evidenceEventIds: string[];
  fired: RuleId[];
  paused: boolean;
  ownRuleId?: string;
}

export type Decision = 'pending' | 'release' | 'keep_holding' | 'escalate' | 'verified_not_member' | 'recovery_open';
export type CaseKind = 'pause' | 'verification' | 'recovery';

export interface AuditEntry {
  at: string;
  who: string;
  action: string;
  why: string;
}

export interface CaseAnswer {
  question: string;
  answer: string;
}

export interface Case {
  case_id: string;
  member_id: string;
  event_id: string;
  lane: Lane;
  kind: CaseKind;
  reasons: Reason[];
  answers: CaseAnswer[];
  decision: Decision;
  audit: AuditEntry[];
  created_at: string;
  source: 'seed' | 'demo';
  scenario?: string;
  flags?: string[];
}

export interface MemberKeyRow {
  member_id: string;
  expected: 'scam' | 'takeover' | 'legit';
  note?: string;
}

export interface Dataset {
  source: 'seed' | 'kit';
  generated_for: string;
  members: Member[];
  events: BankEvent[];
  cards: Card[];
  cases: Case[];
  member_key: MemberKeyRow[];
}
