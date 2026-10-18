/**
 * Rule thresholds. These are starting values: tune them on the starter kit.
 * The Live demo always uses DEFAULT_CONFIG so the scripted path never changes;
 * the Rules lab sliders edit a sandbox copy.
 */
export interface RulesConfig {
  /** R2: amount ≥ this multiple of the member's usual payment. */
  r2Multiple: number;
  /** R3: amount ≥ this share of the balance (0–1). */
  r3Share: number;
  /** R5: password reset / phone / email change within this many hours. */
  r5WindowHours: number;
  /** R6: large new deposit, then a new recipient within this many hours. */
  r6WindowHours: number;
  /** R6: what counts as a "large" deposit (dollars). */
  r6LargeDeposit: number;
  /** R6: a deposit is "new" if the same source hasn't paid in within this many days. */
  r6NewSourceDays: number;
  /**
   * Review floor: everyday payments under this amount skip R1–R4,
   * so a $40 first payment to a friend never pauses. R5–R7 still apply.
   */
  reviewFloor: number;
}

export const DEFAULT_CONFIG: Readonly<RulesConfig> = Object.freeze({
  r2Multiple: 3,
  r3Share: 0.5,
  r5WindowHours: 72,
  r6WindowHours: 72,
  r6LargeDeposit: 2000,
  r6NewSourceDays: 60,
  reviewFloor: 250,
});

export const RULE_LABELS: Record<string, string> = {
  R1: 'First payment to this recipient',
  R2: 'Much bigger than this member’s usual payment',
  R3: 'Uses up a large share of the balance',
  R4: 'Hard to undo (wire or instant P2P)',
  R5: 'Password reset, or phone or email changed, recently',
  R6: 'Big new deposit, then money out to a new recipient',
  R7: 'Trying again after a hold (retry, split, or type switch)',
};

export const RULE_IDS = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7'] as const;
