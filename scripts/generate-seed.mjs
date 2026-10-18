// Deterministic synthetic seed generator for Otterly Safe.
// Run: npm run seed   → writes src/data/seed.json
// Every person, payee and number is fictional. Phone numbers use 555-01xx.
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, '..', 'src', 'data', 'seed.json');

// ---------- helpers ----------
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pad = (n) => String(n).padStart(2, '0');
// Day 0 = 2026-07-18. All times Pacific (PDT, -07:00) — DST ends Nov 1.
function iso(day, hh, mm) {
  const d = new Date(Date.UTC(2026, 6, 18 + day));
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(hh)}:${pad(mm)}:00-07:00`;
}
function at(date, hh, mm) {
  return `${date}T${pad(hh)}:${pad(mm)}:00-07:00`;
}
const DAYS = 92; // ≈ 90 days of history, ending Oct 17; Oct 18 is demo day.

function base(member_id, timestamp, type, extra = {}) {
  return {
    event_id: '',
    member_id,
    timestamp,
    type,
    amount: null,
    channel: null,
    payment_type: null,
    recipient_id: null,
    recipient_name: null,
    recipient_category: null,
    new_recipient: false,
    status: null,
    hold_count: 0,
    balance_before: null,
    retry_of: null,
    detail: null,
    ...extra,
  };
}

// ---------- members ----------
const members = [
  {
    member_id: 'ANCHOR-A',
    display_name: 'Anchor A',
    placeholder: true,
    role: 'anchor',
    age_band: '65–74',
    usual_payment: 800,
    balance: 14200,
    trusted_contact: { name: 'Maya', relation: 'daughter', phone: '(253) 555-0147' },
    own_rules: [],
    practice_history: [
      { card_id: 'c-fraud-text', date: '2026-10-03', correct: true },
      { card_id: 'c-grandchild', date: '2026-09-21', correct: true },
    ],
    phone_on_file: '(253) 555-0113',
    email_on_file: 'anchor.a@example.com',
    story: 'Placeholder for a starter-kit anchor. A caller posing as the "fraud department" says to wire savings to a "safe account".',
  },
  {
    member_id: 'ANCHOR-B',
    display_name: 'Anchor B',
    placeholder: true,
    role: 'anchor',
    age_band: '55–64',
    usual_payment: 400,
    balance: 6500,
    trusted_contact: null,
    own_rules: [],
    practice_history: [],
    phone_on_file: '(253) 555-0161',
    email_on_file: 'anchor.b@example.com',
    story: 'Placeholder anchor. Account takeover at 2 am: password reset, phone change, new payee, instant P2P.',
  },
  {
    member_id: 'ANCHOR-C',
    display_name: 'Anchor C',
    placeholder: true,
    role: 'anchor',
    age_band: '35–44',
    usual_payment: 350,
    balance: 3200,
    trusted_contact: null,
    own_rules: [],
    practice_history: [{ card_id: 'c-rental', date: '2026-08-30', correct: false }],
    phone_on_file: '(253) 555-0124',
    email_on_file: 'anchor.c@example.com',
    story: 'Placeholder anchor. Weekly ACH payments to an "investment platform" payee added months ago. The rules miss it.',
  },
  {
    member_id: 'ANCHOR-D',
    display_name: 'Anchor D',
    placeholder: true,
    role: 'anchor',
    age_band: '18–24',
    usual_payment: 150,
    balance: 3350,
    trusted_contact: null,
    own_rules: [],
    practice_history: [],
    phone_on_file: '(253) 555-0138',
    email_on_file: 'anchor.d@example.com',
    story: 'Placeholder anchor. Fake remote job mails a check, then asks for most of it back by P2P; retries after a hold.',
  },
  {
    member_id: 'L2001',
    display_name: 'Rosa Delgado',
    role: 'lookalike',
    age_band: '45–54',
    usual_payment: 1200,
    balance: 18500,
    trusted_contact: { name: 'Luis', relation: 'brother', phone: '(253) 555-0172' },
    own_rules: [],
    practice_history: [{ card_id: 'c-job-check', date: '2026-09-12', correct: true }],
    phone_on_file: '(253) 555-0109',
    email_on_file: 'rosa.d@example.com',
    story: 'Fictional legitimate member. Pays a new roofing contractor after a storm.',
  },
  {
    member_id: 'L2002',
    display_name: 'Ken Okafor',
    role: 'lookalike',
    age_band: '35–44',
    usual_payment: 500,
    balance: 7800,
    trusted_contact: null,
    own_rules: [],
    practice_history: [],
    phone_on_file: '(253) 555-0115',
    email_on_file: 'ken.o@example.com',
    story: 'Fictional legitimate member. First payment to a new daycare.',
  },
  {
    member_id: 'L2003',
    display_name: 'Linh Tran',
    role: 'lookalike',
    age_band: '25–34',
    usual_payment: 900,
    balance: 9000,
    trusted_contact: null,
    own_rules: [],
    practice_history: [{ card_id: 'c-direct-deposit', date: '2026-09-02', correct: true }],
    phone_on_file: '(253) 555-0120',
    email_on_file: 'linh.t@example.com',
    story: 'Fictional legitimate member. Pays fall tuition to a community college.',
  },
  {
    member_id: 'L2004',
    display_name: 'Marisol Vega',
    role: 'lookalike',
    age_band: '55–64',
    usual_payment: 1000,
    balance: 30000,
    trusted_contact: null,
    own_rules: [],
    practice_history: [],
    phone_on_file: '(253) 555-0131',
    email_on_file: 'marisol.v@example.com',
    story: 'Fictional legitimate member. Wires a car down payment to a dealer. The rules over-flag her as scam signs.',
  },
  {
    member_id: 'L2005',
    display_name: 'Sam Whitfield',
    role: 'lookalike',
    age_band: '65–74',
    usual_payment: 600,
    balance: 12000,
    trusted_contact: { name: 'Ruth', relation: 'wife', phone: '(253) 555-0186' },
    own_rules: [],
    practice_history: [{ card_id: 'c-gov-giftcards', date: '2026-09-28', correct: true }],
    phone_on_file: '(253) 555-0142',
    email_on_file: 'sam.w@example.com',
    story: 'Fictional legitimate member. Sends a birthday gift by P2P to a grandson he pays often.',
  },
  {
    member_id: 'L2006',
    display_name: 'Priya Raman',
    role: 'lookalike',
    age_band: '18–24',
    usual_payment: 300,
    balance: 2400,
    trusted_contact: null,
    own_rules: [],
    practice_history: [],
    phone_on_file: '(253) 555-0153',
    email_on_file: 'priya.r@example.com',
    story: 'Fictional legitimate member. First rent payment to a new apartment near campus.',
  },
];

// ---------- baseline history profiles ----------
const profiles = {
  'ANCHOR-A': { pay: 2100, payEvery: 30, payName: 'Pension (example)', bills: [['Harbor View Rent (example)', 'rent', 800, 1], ['Tacoma Power & Water (example)', 'utility', 140, 12], ['Bluebird Mobile (example)', 'phone', 55, 20]], friends: ['Maya (example)'], p2p: [20, 80] },
  'ANCHOR-B': { pay: 1900, payEvery: 14, payName: 'Pacific Freight Co. (example)', bills: [['Cedar Loan Servicing (example)', 'mortgage', 400, 5], ['Tacoma Power & Water (example)', 'utility', 120, 15]], friends: ['Jordan (example)', 'Casey (example)'], p2p: [15, 90] },
  'ANCHOR-C': { pay: 1600, payEvery: 14, payName: 'Northwind Clinic (example)', bills: [['Maple Court Rent (example)', 'rent', 350, 1], ['Bluebird Mobile (example)', 'phone', 60, 18]], friends: ['Alex (example)'], p2p: [20, 60] },
  'ANCHOR-D': { pay: 620, payEvery: 14, payName: 'Campus Dining (example)', bills: [['Bluebird Mobile (example)', 'phone', 45, 10]], friends: ['Roommate Jess (example)', 'Kai (example)'], p2p: [10, 60] },
  L2001: { pay: 3100, payEvery: 14, payName: 'Puget Health (example)', bills: [['Cedar Loan Servicing (example)', 'mortgage', 1200, 3], ['Tacoma Power & Water (example)', 'utility', 180, 14], ['Bluebird Mobile (example)', 'phone', 90, 21]], friends: ['Luis (example)'], p2p: [25, 120] },
  L2002: { pay: 2400, payEvery: 14, payName: 'Rainier Logistics (example)', bills: [['Oak Street Rent (example)', 'rent', 500, 1], ['Tacoma Power & Water (example)', 'utility', 110, 9]], friends: ['Ade (example)'], p2p: [20, 80] },
  L2003: { pay: 2600, payEvery: 14, payName: 'Sound Dental (example)', bills: [['Alder Flats Rent (example)', 'rent', 900, 1], ['Bluebird Mobile (example)', 'phone', 65, 17]], friends: ['Mai (example)', 'Tuan (example)'], p2p: [15, 70] },
  L2004: { pay: 3800, payEvery: 14, payName: 'Tideline Realty (example)', bills: [['Cedar Loan Servicing (example)', 'mortgage', 1000, 2], ['Tacoma Power & Water (example)', 'utility', 160, 13]], friends: ['Elena (example)'], p2p: [30, 150] },
  L2005: { pay: 2300, payEvery: 30, payName: 'Pension (example)', bills: [['Harbor View Rent (example)', 'rent', 600, 1], ['Tacoma Power & Water (example)', 'utility', 130, 11]], friends: ['Grandson Theo (example)'], p2p: [25, 100] },
  L2006: { pay: 900, payEvery: 14, payName: 'Campus Library (example)', bills: [['Dorm Housing (example)', 'rent', 300, 1], ['Bluebird Mobile (example)', 'phone', 40, 22]], friends: ['Sana (example)', 'Leo (example)'], p2p: [10, 50] },
};

const slug = (s) => s.toUpperCase().replace(/\(EXAMPLE\)/g, '').replace(/[^A-Z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 18);

const events = [];
function push(e) {
  events.push(e);
  return e;
}

members.forEach((m, mi) => {
  const p = profiles[m.member_id];
  const rnd = mulberry32(1000 + mi * 77);
  const short = m.member_id.replace('ANCHOR-', 'A').replace('L', 'L');
  for (let day = 0; day < DAYS; day++) {
    const date = new Date(Date.UTC(2026, 6, 18 + day));
    const dom = date.getUTCDate();
    if (day % p.payEvery === (mi % p.payEvery)) {
      push(base(m.member_id, iso(day, 6, 0), 'deposit', { amount: p.pay, channel: 'direct_deposit', recipient_id: `SRC-${slug(p.payName)}`, recipient_name: p.payName, status: 'sent' }));
    }
    for (const [name, category, amount, billDay] of p.bills) {
      if (dom === billDay) {
        const amt = category === 'utility' ? Math.round(amount * (0.85 + rnd() * 0.3)) : amount;
        push(base(m.member_id, iso(day, 9, 15), 'payment', { amount: amt, channel: 'online', payment_type: 'ach', recipient_id: `P-${slug(name)}`, recipient_name: name, recipient_category: category, status: 'sent' }));
      }
    }
    if (rnd() < 0.16) {
      const f = p.friends[Math.floor(rnd() * p.friends.length)];
      const amt = Math.round(p.p2p[0] + rnd() * (p.p2p[1] - p.p2p[0]));
      push(base(m.member_id, iso(day, 12 + Math.floor(rnd() * 8), Math.floor(rnd() * 60)), 'payment', { amount: amt, channel: 'mobile', payment_type: 'p2p', recipient_id: `P-${slug(f)}`, recipient_name: f, recipient_category: 'friends_family', status: 'sent' }));
    }
    if (rnd() < 0.08) {
      push(base(m.member_id, iso(day, 10, Math.floor(rnd() * 60)), 'payment', { amount: Math.round(50 + rnd() * 150), channel: 'mobile', payment_type: 'internal', recipient_id: `SAV-${short}`, recipient_name: 'Own savings', recipient_category: 'own', status: 'sent' }));
    }
    if (day % 3 === mi % 3) {
      push(base(m.member_id, iso(day, 8 + (mi % 5), 5 + mi), 'login', { channel: 'mobile' }));
    }
  }
});

// ---------- scripted key events ----------
const K = (id, member_id, timestamp, type, extra) => push({ ...base(member_id, timestamp, type, extra), event_id: id });

// Anchor A — "safe account" bank-impersonation scam (Live demo: Scam)
K('E-A-LOGIN', 'ANCHOR-A', at('2026-10-18', 10, 31), 'login', { channel: 'mobile' });
K('E-A-PAYEE', 'ANCHOR-A', at('2026-10-18', 10, 38), 'payee_added', { channel: 'mobile', recipient_id: 'R-SAFE-RESERVE', recipient_name: 'Secure Reserve Holdings (example)', recipient_category: 'unknown' });
K('E-A-9800', 'ANCHOR-A', at('2026-10-18', 10, 42), 'payment', { amount: 9800, channel: 'mobile', payment_type: 'wire', recipient_id: 'R-SAFE-RESERVE', recipient_name: 'Secure Reserve Holdings (example)', recipient_category: 'unknown', new_recipient: true, status: 'pending' });

// Anchor B — takeover at 2 am (Live demo: Takeover)
K('E-B-RESET', 'ANCHOR-B', at('2026-10-18', 2, 3), 'password_reset', { channel: 'online', detail: 'Password reset by text code' });
K('E-B-PHONE', 'ANCHOR-B', at('2026-10-18', 2, 5), 'phone_change', { channel: 'online', detail: 'Phone on file changed from (253) 555-0161 to (253) 555-0199' });
K('E-B-PAYEE', 'ANCHOR-B', at('2026-10-18', 2, 7), 'payee_added', { channel: 'online', recipient_id: 'R-DFOX', recipient_name: 'D. Fox (example)', recipient_category: 'unknown' });
K('E-B-4000', 'ANCHOR-B', at('2026-10-18', 2, 8), 'payment', { amount: 4000, channel: 'online', payment_type: 'p2p', recipient_id: 'R-DFOX', recipient_name: 'D. Fox (example)', recipient_category: 'unknown', new_recipient: true, status: 'pending' });

// Anchor C — slow-growing weekly ACH to an "investment platform" (Live demo: Missed scam)
K('E-C-PAYEE', 'ANCHOR-C', at('2026-05-20', 19, 12), 'payee_added', { channel: 'mobile', recipient_id: 'R-BRIGHTHARBOR', recipient_name: 'BrightHarbor Trading (example)', recipient_category: 'investment' });
K('E-C-FIRST', 'ANCHOR-C', at('2026-06-05', 19, 30), 'payment', { amount: 50, channel: 'mobile', payment_type: 'ach', recipient_id: 'R-BRIGHTHARBOR', recipient_name: 'BrightHarbor Trading (example)', recipient_category: 'investment', new_recipient: true, status: 'sent' });
const growth = [100, 125, 150, 175, 200, 225, 250, 275, 300, 300, 300, 300, 300];
growth.forEach((amt, i) => {
  const d = new Date(Date.UTC(2026, 6, 24 + i * 7));
  const date = `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
  K(`E-C-W${pad(i + 1)}`, 'ANCHOR-C', at(date, 19, 30), 'payment', { amount: amt, channel: 'mobile', payment_type: 'ach', recipient_id: 'R-BRIGHTHARBOR', recipient_name: 'BrightHarbor Trading (example)', recipient_category: 'investment', status: 'sent' });
});

// Anchor D — fake job check, then P2P to "supplier", then a retry after the hold
K('E-D-CHECK', 'ANCHOR-D', at('2026-10-14', 9, 12), 'deposit', { amount: 2450, channel: 'mobile', recipient_id: 'SRC-NOVA-STAFFING', recipient_name: 'Mobile check: Nova Staffing (example)', status: 'sent' });
K('E-D-PAYEE', 'ANCHOR-D', at('2026-10-15', 13, 40), 'payee_added', { channel: 'mobile', recipient_id: 'R-SUPPLY', recipient_name: 'Office Supply Partner (example)', recipient_category: 'unknown' });
K('E-D-1900', 'ANCHOR-D', at('2026-10-15', 13, 44), 'payment', { amount: 1900, channel: 'mobile', payment_type: 'p2p', recipient_id: 'R-SUPPLY', recipient_name: 'Office Supply Partner (example)', recipient_category: 'unknown', new_recipient: true, status: 'held', hold_count: 1 });
K('E-D-0950', 'ANCHOR-D', at('2026-10-15', 13, 58), 'payment', { amount: 950, channel: 'mobile', payment_type: 'p2p', recipient_id: 'R-SUPPLY', recipient_name: 'Office Supply Partner (example)', recipient_category: 'unknown', new_recipient: true, status: 'held', hold_count: 1, retry_of: 'E-D-1900' });

// Look-alikes
K('E-L1-PAYEE', 'L2001', at('2026-10-18', 13, 28), 'payee_added', { channel: 'mobile', recipient_id: 'R-RIDGELINE', recipient_name: 'Ridgeline Roofing (example)', recipient_category: 'contractor' });
K('E-L1-5000', 'L2001', at('2026-10-18', 13, 30), 'payment', { amount: 5000, channel: 'mobile', payment_type: 'ach', recipient_id: 'R-RIDGELINE', recipient_name: 'Ridgeline Roofing (example)', recipient_category: 'contractor', new_recipient: true, status: 'pending' });
K('E-L2-PAYEE', 'L2002', at('2026-10-16', 8, 5), 'payee_added', { channel: 'mobile', recipient_id: 'R-SPROUTS', recipient_name: 'Little Sprouts Daycare (example)', recipient_category: 'childcare' });
K('E-L2-1800', 'L2002', at('2026-10-16', 8, 10), 'payment', { amount: 1800, channel: 'mobile', payment_type: 'ach', recipient_id: 'R-SPROUTS', recipient_name: 'Little Sprouts Daycare (example)', recipient_category: 'childcare', new_recipient: true, status: 'held', hold_count: 1 });
K('E-L3-PAYEE', 'L2003', at('2026-10-12', 18, 1), 'payee_added', { channel: 'online', recipient_id: 'R-CASCADE-CC', recipient_name: 'Cascade Community College (example)', recipient_category: 'education' });
K('E-L3-4200', 'L2003', at('2026-10-12', 18, 4), 'payment', { amount: 4200, channel: 'online', payment_type: 'ach', recipient_id: 'R-CASCADE-CC', recipient_name: 'Cascade Community College (example)', recipient_category: 'education', new_recipient: true, status: 'sent', hold_count: 1 });
K('E-L4-PAYEE', 'L2004', at('2026-10-17', 14, 52), 'payee_added', { channel: 'branch', recipient_id: 'R-EVERGREEN-AUTO', recipient_name: 'Evergreen Auto Sales (example)', recipient_category: 'auto' });
K('E-L4-12000', 'L2004', at('2026-10-17', 15, 0), 'payment', { amount: 12000, channel: 'online', payment_type: 'wire', recipient_id: 'R-EVERGREEN-AUTO', recipient_name: 'Evergreen Auto Sales (example)', recipient_category: 'auto', new_recipient: true, status: 'sent', hold_count: 1 });
K('E-L5-600', 'L2005', at('2026-10-13', 11, 20), 'payment', { amount: 600, channel: 'mobile', payment_type: 'p2p', recipient_id: 'P-GRANDSON-THEO', recipient_name: 'Grandson Theo (example)', recipient_category: 'friends_family', status: 'sent' });
K('E-L6-PAYEE', 'L2006', at('2026-10-01', 16, 40), 'payee_added', { channel: 'mobile', recipient_id: 'R-HILLTOP', recipient_name: 'Hilltop Apartments (example)', recipient_category: 'rent' });
K('E-L6-950', 'L2006', at('2026-10-01', 16, 45), 'payment', { amount: 950, channel: 'mobile', payment_type: 'ach', recipient_id: 'R-HILLTOP', recipient_name: 'Hilltop Apartments (example)', recipient_category: 'rent', new_recipient: true, status: 'sent', hold_count: 1 });

// ---------- ids + running balances ----------
events.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
const counters = {};
for (const e of events) {
  if (!e.event_id) {
    const short = e.member_id.replace('ANCHOR-', 'A');
    counters[short] = (counters[short] ?? 0) + 1;
    e.event_id = `E-${short}-${String(counters[short]).padStart(4, '0')}`;
  }
}
// Key moment per member: the balance shown in the app equals member.balance at that moment.
const keyEvent = { 'ANCHOR-A': 'E-A-9800', 'ANCHOR-B': 'E-B-4000', 'ANCHOR-D': 'E-D-1900', L2001: 'E-L1-5000', L2002: 'E-L2-1800', L2003: 'E-L3-4200', L2004: 'E-L4-12000', L2005: 'E-L5-600', L2006: 'E-L6-950' };

function simulate(m) {
  const mine = events
    .filter((e) => e.member_id === m.member_id && ['payment', 'deposit'].includes(e.type))
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  let bal = 0;
  let atKey = null;
  for (const e of mine) {
    if (e.type === 'payment') {
      e.balance_before = bal;
      if (e.event_id === keyEvent[m.member_id]) atKey = bal;
      if (e.status === 'sent') bal -= e.amount;
    } else {
      bal += e.amount;
    }
  }
  return { mine, ref: atKey ?? bal };
}

let sweepCount = 0;
for (const m of members) {
  // Pass 1: how much does checking grow before the key moment?
  const first = simulate(m);
  const growthBeforeKey = first.ref; // started at 0
  const allowed = m.balance * 0.6; // start the window with ~40% of today's balance
  const excess = growthBeforeKey - allowed;
  if (excess > 0) {
    const keyTs = events.find((e) => e.event_id === keyEvent[m.member_id])?.timestamp ?? '9999';
    const paydays = first.mine.filter((e) => e.type === 'deposit' && e.channel === 'direct_deposit' && e.timestamp < keyTs);
    const per = Math.round(excess / Math.max(1, paydays.length) / 10) * 10;
    for (const d of paydays) {
      const ts = d.timestamp.replace('T06:00', 'T06:30');
      sweepCount++;
      events.push({ ...base(m.member_id, ts, 'payment', { amount: per, channel: 'online', payment_type: 'internal', recipient_id: `SAV-${m.member_id}`, recipient_name: 'Own savings (auto-save)', recipient_category: 'own', status: 'sent' }), event_id: `E-SWP-${String(sweepCount).padStart(4, '0')}` });
    }
  }
  // Pass 2: anchor balances to the member's balance at the key moment.
  const { mine, ref } = simulate(m);
  const offset = m.balance - ref;
  for (const e of mine) if (e.type === 'payment') e.balance_before = Math.round((e.balance_before + offset) * 100) / 100;
  const min = Math.min(...mine.filter((e) => e.type === 'payment').map((e) => e.balance_before));
  if (min < 0) console.warn(`warning: ${m.member_id} dips below zero (${min})`);
}
events.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

// ---------- seed cases (reasons + lane are recomputed by the engine at load) ----------
const SYS = 'System · Otterly Safe rules';
const cases = [
  {
    case_id: 'CASE-2031', member_id: 'L2006', event_id: 'E-L6-950', kind: 'pause', decision: 'release', created_at: at('2026-10-01', 16, 45), source: 'seed',
    answers: [{ question: 'What’s this payment for?', answer: 'Rent' }],
    audit: [
      { at: at('2026-10-01', 16, 45), who: SYS, action: 'Paused (look-alike)', why: 'R1 + R2. One question shown; send time 4:10 pm.' },
      { at: at('2026-10-01', 16, 46), who: 'Member (in app)', action: 'Answered: Rent', why: 'Purpose matches payee type.' },
      { at: at('2026-10-02', 16, 10), who: 'Auto-release at cutoff', action: 'Released', why: 'No scam signs; sent at the stated time (4:10 pm).' },
    ],
  },
  {
    case_id: 'CASE-2035', member_id: 'L2003', event_id: 'E-L3-4200', kind: 'pause', decision: 'release', created_at: at('2026-10-12', 18, 4), source: 'seed',
    answers: [{ question: 'What’s this payment for?', answer: 'Something else: tuition' }],
    audit: [
      { at: at('2026-10-12', 18, 4), who: SYS, action: 'Paused (look-alike)', why: 'R1 + R2.' },
      { at: at('2026-10-13', 9, 2), who: 'T. Alvarez · Member care', action: 'Released', why: 'Member called; payee is a known college.' },
    ],
  },
  {
    case_id: 'CASE-2038', member_id: 'L2004', event_id: 'E-L4-12000', kind: 'pause', decision: 'release', created_at: at('2026-10-17', 15, 0), source: 'seed',
    answers: [
      { question: 'Did someone call or text and ask you to send this?', answer: 'No' },
      { question: 'Did they say to act fast or keep it secret?', answer: 'No' },
      { question: 'Did they say your money is in danger?', answer: 'No' },
    ],
    audit: [
      { at: at('2026-10-17', 15, 0), who: SYS, action: 'Paused (scam signs)', why: 'R1 + R2 + R4 on a wire.' },
      { at: at('2026-10-17', 15, 3), who: 'Member (in app)', action: 'Chose: Talk to Sound', why: 'Ollie check complete; all answers No.' },
      { at: at('2026-10-17', 15, 21), who: 'J. Nguyen · Member care', action: 'Released', why: 'Called number on file; car purchase confirmed with dealer invoice.' },
    ],
  },
  {
    case_id: 'CASE-2039', member_id: 'L2002', event_id: 'E-L2-1800', kind: 'pause', decision: 'pending', created_at: at('2026-10-16', 8, 10), source: 'seed',
    answers: [{ question: 'What’s this payment for?', answer: 'Family' }],
    audit: [{ at: at('2026-10-16', 8, 10), who: SYS, action: 'Paused (look-alike)', why: 'R1 + R2. Sends at cutoff unless member calls.' }],
  },
  {
    case_id: 'CASE-2040', member_id: 'ANCHOR-D', event_id: 'E-D-1900', kind: 'pause', decision: 'keep_holding', created_at: at('2026-10-15', 13, 44), source: 'seed',
    answers: [
      { question: 'Did someone call or text and ask you to send this?', answer: 'Yes' },
      { question: 'Did they say to act fast or keep it secret?', answer: 'Yes' },
    ],
    audit: [
      { at: at('2026-10-15', 13, 44), who: SYS, action: 'Paused (scam signs)', why: 'R6: new check deposit, then a new payee.' },
      { at: at('2026-10-15', 14, 30), who: 'T. Alvarez · Member care', action: 'Keep holding', why: 'Fake-check job pattern; check not yet cleared.' },
    ],
  },
  {
    case_id: 'CASE-2041', member_id: 'ANCHOR-D', event_id: 'E-D-0950', kind: 'pause', decision: 'pending', created_at: at('2026-10-15', 13, 58), source: 'seed',
    answers: [],
    flags: ['Retry after hold'],
    audit: [{ at: at('2026-10-15', 13, 58), who: SYS, action: 'Paused (scam signs)', why: 'R7: smaller retry to the same payee after a hold.' }],
  },
];

const member_key = [
  { member_id: 'ANCHOR-A', expected: 'scam', note: 'placeholder key' },
  { member_id: 'ANCHOR-B', expected: 'takeover', note: 'placeholder key' },
  { member_id: 'ANCHOR-C', expected: 'scam', note: 'placeholder key' },
  { member_id: 'ANCHOR-D', expected: 'scam', note: 'placeholder key' },
  ...['L2001', 'L2002', 'L2003', 'L2004', 'L2005', 'L2006'].map((id) => ({ member_id: id, expected: 'legit', note: 'seed key' })),
];

const out = {
  source: 'seed',
  generated_for: 'Otterly Safe prototype · synthetic data · not real members or fraud rates',
  members,
  events,
  cases,
  member_key,
};
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log(`wrote ${OUT}: ${members.length} members, ${events.length} events, ${cases.length} cases`);
