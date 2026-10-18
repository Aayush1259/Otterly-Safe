import React from 'react';
import { User, Users, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import type { Member } from '../../types';
import { money } from '../../lib/format';

interface PersonaRailProps {
  members: Member[];
  selectedMemberId: string;
  onSelectMember: (memberId: string) => void;
  activeScenario: string;
}

/**
 * PersonaRail (left, 240px):
 * Displays anchor personas M1001–M1004 (or Anchor A–D),
 * legitimate look-alikes, and shows trusted contact status and usual payment.
 */
export const PersonaRail: React.FC<PersonaRailProps> = ({
  members,
  selectedMemberId,
  onSelectMember,
  activeScenario,
}) => {
  return (
    <aside
      className="w-60 bg-white border border-slate-200 rounded-3xl p-3 shadow-sm flex flex-col shrink-0 select-none overflow-hidden"
      aria-label="Persona Rail"
    >
      <div className="px-2 py-1.5 border-b border-slate-100 flex items-center justify-between mb-2">
        <h3 className="font-heading font-extrabold text-xs uppercase tracking-wider text-slate-500">
          Personas
        </h3>
        <span className="text-[10px] font-mono text-slate-400">{members.length} Loaded</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {members.map((m) => {
          const isSelected = m.member_id === selectedMemberId;
          const hasTrustedContact = !!m.trusted_contact;

          return (
            <div
              key={m.member_id}
              onClick={() => onSelectMember(m.member_id)}
              className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all ${
                isSelected
                  ? 'bg-sand-50 border-kelp-700 shadow-xs'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-heading font-extrabold text-navy-900 truncate">
                  {m.display_name}
                </span>
                <span
                  className={`text-[9px] font-mono uppercase px-1.5 py-0.2 rounded font-bold ${
                    m.role === 'anchor'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {m.role}
                </span>
              </div>

              <div className="space-y-0.5 text-[11px] text-slate-600 font-body">
                <div className="flex justify-between">
                  <span>Age:</span>
                  <span className="font-bold text-navy-900">{m.age_band}</span>
                </div>
                <div className="flex justify-between">
                  <span>Checking:</span>
                  <span className="font-bold font-mono text-navy-900">{money(m.balance)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Usual pay:</span>
                  <span className="font-mono text-slate-700">{money(m.usual_payment)}</span>
                </div>
              </div>

              <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
                <span
                  className={`inline-flex items-center space-x-1 ${
                    hasTrustedContact ? 'text-safe-700 font-bold' : 'text-slate-400'
                  }`}
                >
                  <Users className="w-3 h-3" />
                  <span>{hasTrustedContact ? m.trusted_contact?.name : 'No trusted contact'}</span>
                </span>

                {m.own_rules.length > 0 && (
                  <span className="text-otter-700 font-mono font-bold bg-sand-100 px-1 py-0.2 rounded">
                    {m.own_rules.length} rule
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
