import { create } from 'zustand';
import type { BankEvent, Card, Case, Dataset, Decision, Lang, Member, MemberKeyRow } from '../types';
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

const seed = seedDataRaw as unknown as {
  members: Member[];
  events: BankEvent[];
  cases: Case[];
  member_key: MemberKeyRow[];
};

export const useStore = create<AppState>((set) => ({
  members: seed.members,
  events: seed.events,
  cards: cardsRaw as unknown as Card[],
  cases: seed.cases,
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
