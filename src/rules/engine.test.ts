import { describe, it, expect } from 'vitest';
import { evaluatePayment, decideLane, runRules } from './engine';
import { DEFAULT_CONFIG } from './config';
import type { BankEvent, Member } from '../types';

describe('Otterly Safe Rules Engine', () => {
  const baseMember: Member = {
    member_id: 'M-TEST',
    display_name: 'Test Member',
    age_band: '35–44',
    usual_payment: 500,
    balance: 10000,
    trusted_contact: {
      name: 'Taylor',
      relation: 'sister',
      phone: '(253) 555-0100',
    },
    own_rules: [],
    practice_history: [],
    role: 'lookalike',
  };

  it('Lane 1: detects Takeover lane when profile changed (R5) + new payee + large payment (R2)', () => {
    const history: BankEvent[] = [
      {
        event_id: 'E-PWD',
        member_id: 'M-TEST',
        timestamp: '2026-10-18T02:03:00-07:00',
        type: 'password_reset',
        amount: null,
        channel: 'online',
        payment_type: null,
        recipient_id: null,
        new_recipient: false,
        status: null,
        hold_count: 0,
      },
      {
        event_id: 'E-PHN',
        member_id: 'M-TEST',
        timestamp: '2026-10-18T02:05:00-07:00',
        type: 'phone_change',
        amount: null,
        channel: 'online',
        payment_type: null,
        recipient_id: null,
        new_recipient: false,
        status: null,
        hold_count: 0,
      },
    ];

    const payment: BankEvent = {
      event_id: 'E-PAY-TAKEOVER',
      member_id: 'M-TEST',
      timestamp: '2026-10-18T02:08:00-07:00',
      type: 'payment',
      amount: 4000, // 8x usual ($500) -> R2
      channel: 'online',
      payment_type: 'p2p',
      recipient_id: 'R-STRANGER',
      new_recipient: true, // new recipient
      status: 'pending',
      hold_count: 0,
      balance_before: 10000,
    };

    const res = evaluatePayment(payment, baseMember, history, DEFAULT_CONFIG);
    expect(res.lane).toBe('takeover');
    expect(res.paused).toBe(true);
    expect(res.fired).toContain('R5');
    expect(res.fired).toContain('R2');
  });

  it('Lane 2: detects Scam Signs lane (R1 + R4 + R2/R3) on $9,800 wire to new recipient', () => {
    const history: BankEvent[] = [];
    const payment: BankEvent = {
      event_id: 'E-SCAM-WIRE',
      member_id: 'M-TEST',
      timestamp: '2026-10-18T10:42:00-07:00',
      type: 'payment',
      amount: 9800, // 19.6x usual ($500), 98% of balance ($10,000) -> R2 + R3
      channel: 'mobile',
      payment_type: 'wire', // wire -> R4
      recipient_id: 'R-SAFE-VAULT',
      new_recipient: true, // R1
      status: 'pending',
      hold_count: 0,
      balance_before: 10000,
    };

    const res = evaluatePayment(payment, baseMember, history, DEFAULT_CONFIG);
    expect(res.lane).toBe('scam');
    expect(res.paused).toBe(true);
    expect(res.fired).toContain('R1');
    expect(res.fired).toContain('R2');
    expect(res.fired).toContain('R3');
    expect(res.fired).toContain('R4');
  });

  it('Lane 2 variant: detects Scam Signs via R6 (large deposit then quick payment to new payee)', () => {
    const history: BankEvent[] = [
      {
        event_id: 'E-DEP-1',
        member_id: 'M-TEST',
        timestamp: '2026-10-17T09:00:00-07:00',
        type: 'deposit',
        amount: 3500, // > $2000 large deposit
        channel: 'mobile',
        payment_type: null,
        recipient_id: 'SRC-NEW-EMPLOYER',
        new_recipient: false,
        status: 'sent',
        hold_count: 0,
      },
    ];

    const payment: BankEvent = {
      event_id: 'E-JOB-SCAM',
      member_id: 'M-TEST',
      timestamp: '2026-10-18T10:00:00-07:00',
      type: 'payment',
      amount: 1200,
      channel: 'mobile',
      payment_type: 'p2p',
      recipient_id: 'R-SUPPLIER',
      new_recipient: true,
      status: 'pending',
      hold_count: 0,
      balance_before: 13500,
    };

    const res = evaluatePayment(payment, baseMember, history, DEFAULT_CONFIG);
    expect(res.lane).toBe('scam');
    expect(res.fired).toContain('R6');
  });

  it('Lane 2 variant: detects Scam Signs via R7 (retrying after a previous hold)', () => {
    const history: BankEvent[] = [
      {
        event_id: 'E-PREV-HELD',
        member_id: 'M-TEST',
        timestamp: '2026-10-18T09:00:00-07:00',
        type: 'payment',
        amount: 2000,
        channel: 'mobile',
        payment_type: 'p2p',
        recipient_id: 'R-SHADY',
        new_recipient: true,
        status: 'held',
        hold_count: 1,
      },
    ];

    const payment: BankEvent = {
      event_id: 'E-RETRY',
      member_id: 'M-TEST',
      timestamp: '2026-10-18T09:15:00-07:00',
      type: 'payment',
      amount: 900, // split smaller amount
      channel: 'mobile',
      payment_type: 'p2p',
      recipient_id: 'R-SHADY',
      new_recipient: true,
      status: 'pending',
      hold_count: 1,
      retry_of: 'E-PREV-HELD',
      balance_before: 10000,
    };

    const res = evaluatePayment(payment, baseMember, history, DEFAULT_CONFIG);
    expect(res.lane).toBe('scam');
    expect(res.fired).toContain('R7');
  });

  it('Lane 3: detects Legitimate Look-alike lane (R1 or R2 alone, e.g., $5,000 ACH to roofing contractor)', () => {
    const history: BankEvent[] = [];
    const payment: BankEvent = {
      event_id: 'E-ROOFING',
      member_id: 'M-TEST',
      timestamp: '2026-10-18T13:30:00-07:00',
      type: 'payment',
      amount: 5000, // R1 (new payee) + R2 (10x usual $500), but ACH (not R4) and no profile changes (not R5)
      channel: 'mobile',
      payment_type: 'ach',
      recipient_id: 'R-RIDGELINE',
      recipient_category: 'contractor',
      new_recipient: true,
      status: 'pending',
      hold_count: 0,
      balance_before: 18500, // amount is 27% of balance (not R3)
    };

    const res = evaluatePayment(payment, baseMember, history, DEFAULT_CONFIG);
    expect(res.lane).toBe('lookalike');
    expect(res.paused).toBe(true);
    expect(res.fired).toContain('R1');
    expect(res.fired).toContain('R2');
    expect(res.fired).not.toContain('R4');
  });

  it('Lane 3 softening: Member own rule allows contractor payment up to $6,000 without pause', () => {
    const memberWithOwnRule: Member = {
      ...baseMember,
      own_rules: [
        {
          rule_id: 'RULE-CONTRACTOR-6K',
          kind: 'allow_category_up_to',
          amount: 6000,
          category: 'contractor',
          label: {
            en: 'Contractor payments up to $6,000 won’t pause',
            es: 'Pagos a contratistas de hasta $6,000 no se pausarán',
          },
          created_at: '2026-10-18T13:40:00-07:00',
          source: 'lookalike',
        },
      ],
    };

    const payment: BankEvent = {
      event_id: 'E-ROOFING-2',
      member_id: 'M-TEST',
      timestamp: '2026-10-18T14:00:00-07:00',
      type: 'payment',
      amount: 5000,
      channel: 'mobile',
      payment_type: 'ach',
      recipient_id: 'R-RIDGELINE',
      recipient_category: 'contractor',
      new_recipient: true,
      status: 'pending',
      hold_count: 0,
      balance_before: 18500,
    };

    const res = evaluatePayment(payment, memberWithOwnRule, [], DEFAULT_CONFIG);
    expect(res.lane).toBe('lookalike');
    expect(res.paused).toBe(false); // softened!
    expect(res.ownRuleId).toBe('RULE-CONTRACTOR-6K');
  });

  it('Lane 4: Normal payments do not fire rules and do not pause', () => {
    const payment: BankEvent = {
      event_id: 'E-REGULAR-GROCERY',
      member_id: 'M-TEST',
      timestamp: '2026-10-18T11:00:00-07:00',
      type: 'payment',
      amount: 140,
      channel: 'mobile',
      payment_type: 'p2p',
      recipient_id: 'P-REGULAR-FRIEND',
      new_recipient: false, // known payee
      status: 'pending',
      hold_count: 0,
      balance_before: 9000,
    };

    const res = evaluatePayment(payment, baseMember, [], DEFAULT_CONFIG);
    expect(res.lane).toBe('normal');
    expect(res.paused).toBe(false);
    expect(res.fired.length).toBe(0);
  });

  it('Missed Scam: Repeat small transfers ($300 ACH) to an existing payee bypass rules', () => {
    // Existing payee added months ago, payments sent weekly at usual amounts
    const payment: BankEvent = {
      event_id: 'E-MISSED-SCAM',
      member_id: 'M-TEST',
      timestamp: '2026-10-18T19:30:00-07:00',
      type: 'payment',
      amount: 300, // < 3x usual ($500), < 50% balance
      channel: 'mobile',
      payment_type: 'ach',
      recipient_id: 'R-EXISTING-PLATFORM',
      new_recipient: false, // NOT a new recipient
      status: 'pending',
      hold_count: 0,
      balance_before: 3200,
    };

    const res = evaluatePayment(payment, baseMember, [], DEFAULT_CONFIG);
    // Rules intentionally miss this because it fits normal pattern on credit union data alone
    expect(res.lane).toBe('normal');
    expect(res.paused).toBe(false);
  });

  it('Exclusions: Internal transfers between own accounts never pause', () => {
    const payment: BankEvent = {
      event_id: 'E-INTERNAL-SAVINGS',
      member_id: 'M-TEST',
      timestamp: '2026-10-18T10:00:00-07:00',
      type: 'payment',
      amount: 8000, // 80% balance
      channel: 'mobile',
      payment_type: 'internal',
      recipient_id: 'SAV-M-TEST',
      new_recipient: true,
      status: 'pending',
      hold_count: 0,
      balance_before: 10000,
    };

    const res = evaluatePayment(payment, baseMember, [], DEFAULT_CONFIG);
    expect(res.lane).toBe('normal');
    expect(res.paused).toBe(false);
  });
});
