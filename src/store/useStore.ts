import { create } from 'zustand';
import type { BankEvent, Card, Case, Dataset, Decision, Lang, Lane, Member, MemberKeyRow } from '../types';
import seedDataRaw from '../data/seed.json';
import cardsRaw from '../data/cards.json';

interface AppState {
  members: Member[];
  events: BankEvent[];
  cards: Card[];
  cases: Case[];
  memberKey: MemberKeyRow[];
  activeTab: 'demo' | 'practice' | 'staff' | 'rules' | 'pilot' | 'privacy';
  lang: Lang;
  setActiveTab: (tab: 'demo' | 'practice' | 'staff' | 'rules' | 'pilot' | 'privacy') => void;
  toggleLang: () => void;
  setLang: (lang: Lang) => void;
  addMemberRule: (memberId: string, amount: number, category?: string) => void;
  updateStaffDecision: (caseId: string, decision: Decision) => void;
  initDataset: (dataset: Dataset) => void;
}

function normalizeCases(rawCases: any[]): Case[] {
  if (!Array.isArray(rawCases)) return [];
  const normalized: Case[] = rawCases.map((c, idx) => {
    const lane: Lane =
      c.lane ||
      (c.audit?.[0]?.why?.toLowerCase().includes('look-alike')
        ? 'lookalike'
        : c.audit?.[0]?.why?.toLowerCase().includes('takeover')
        ? 'takeover'
        : 'scam');

    const reasons =
      Array.isArray(c.reasons) && c.reasons.length > 0
        ? c.reasons
        : c.audit?.[0]?.why
        ? [{ id: 'RULE', plainText: c.audit[0].why }]
        : [{ id: 'R1', plainText: 'First payment to this recipient' }];

    return {
      case_id: c.case_id || `CASE-${2030 + idx}`,
      member_id: c.member_id || 'M1001',
      event_id: c.event_id || `E-CASE-${idx}`,
      lane,
      kind: c.kind || 'pause',
      reasons,
      answers: Array.isArray(c.answers) ? c.answers : [],
      decision: c.decision || 'pending',
      audit: Array.isArray(c.audit) ? c.audit : [],
      created_at: c.created_at || new Date().toISOString(),
      source: c.source || 'seed',
      scenario: c.scenario,
      flags: c.flags || [],
    };
  });

  // Ensure CASE-DEMO-SCAM exists for live demo
  if (!normalized.some((c) => c.case_id === 'CASE-DEMO-SCAM')) {
    normalized.unshift({
      case_id: 'CASE-DEMO-SCAM',
      member_id: 'ANCHOR-A',
      event_id: 'E-DEMO-001',
      lane: 'scam',
      kind: 'pause',
      reasons: [
        { id: 'R1', plainText: 'First payment to Federal Reserve Safe Escrow (example)' },
        { id: 'R2', plainText: '12x usual payment ($9,800 vs $800 avg)' },
        { id: 'R3', plainText: '69% of checking balance' },
        { id: 'R4', plainText: 'Irreversible wire transfer' },
      ],
      answers: [
        { question: 'Did someone call or text and ask you to send this?', answer: 'Yes' },
        { question: 'Did they say to act fast or keep it secret?', answer: 'Yes' },
        { question: 'Did they say your money is in danger?', answer: 'Yes' },
      ],
      decision: 'pending',
      created_at: '2026-10-18T10:14:00-07:00',
      source: 'demo',
      audit: [
        {
          at: '2026-10-18T10:14:00-07:00',
          who: 'System · Otterly Safe rules',
          action: 'Paused (scam signs)',
          why: 'R1 + R2 + R3 + R4 fired on $9,800 wire.',
        },
      ],
    });
  }

  return normalized;
}

function normalizeMembers(rawMembers: any[]): Member[] {
  if (!Array.isArray(rawMembers)) return [];
  return rawMembers.map((m) => ({
    ...m,
    own_rules: Array.isArray(m.own_rules) ? m.own_rules : [],
    practice_history: Array.isArray(m.practice_history) ? m.practice_history : [],
  }));
}

const seed = seedDataRaw as unknown as {
  members: Member[];
  events: BankEvent[];
  cases: Case[];
  member_key: MemberKeyRow[];
};

export const useStore = create<AppState>((set) => ({
  members: normalizeMembers(seed.members),
  events: seed.events,
  cards: cardsRaw as unknown as Card[],
  cases: normalizeCases(seed.cases),
  memberKey: seed.member_key,
  activeTab: 'demo',
  lang: 'en',

  setActiveTab: (tab) => set({ activeTab: tab }),

  toggleLang: () => set((state) => ({ lang: state.lang === 'en' ? 'es' : 'en' })),

  setLang: (lang) => set({ lang }),

  addMemberRule: (memberId, amount, category) =>
    set((state) => ({
      members: state.members.map((m) => {
        if (m.member_id === memberId) {
          const newRule = {
            rule_id: `RULE-USER-${Date.now()}`,
            kind: (category ? 'allow_category_up_to' : 'hold_new_payees_over') as any,
            amount,
            category,
            label: {
              en: category
                ? `Contractor payments up to $${amount.toLocaleString()} won't pause`
                : `Hold new payees over $${amount.toLocaleString()}`,
              es: category
                ? `Pagos a contratistas de hasta $${amount.toLocaleString()} no se pausarán`
                : `Retener nuevos destinatarios de más de $${amount.toLocaleString()}`,
            },
            created_at: new Date().toISOString(),
            source: 'practice' as const,
          };
          return {
            ...m,
            own_rules: [...m.own_rules, newRule],
          };
        }
        return m;
      }),
    })),

  updateStaffDecision: (caseId, decision) =>
    set((state) => ({
      cases: state.cases.map((c) => {
        if (c.case_id === caseId) {
          return {
            ...c,
            decision,
            audit: [
              ...c.audit,
              {
                at: new Date().toISOString(),
                who: 'Staff Member · Sound Care',
                action: decision.toUpperCase(),
                why: 'Actioned via Staff Intervention Console',
              },
            ],
          };
        }
        return c;
      }),
    })),

  initDataset: (dataset) =>
    set({
      members: dataset.members,
      events: dataset.events,
      cards: dataset.cards,
      cases: dataset.cases,
      memberKey: dataset.member_key,
    }),
}));
