import React, { useState } from 'react';
import { HeartHandshake, ShieldCheck, FileText, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { OllieBubble } from '../OllieBubble';
import type { Lang, Member } from '../../types';

interface RecoveryPathProps {
  member: Member;
  lang: Lang;
  onActivateTighterSettings: () => void;
  isSettingsApplied?: boolean;
}

/**
 * RecoveryPath:
 * High-empathy, zero-blame restorative recovery path when a manipulation scam bypasses initial rules.
 * "This isn't your fault. Scammers are skilled. Here's what we can do right now."
 */
export const RecoveryPath: React.FC<RecoveryPathProps> = ({
  member,
  lang,
  onActivateTighterSettings,
  isSettingsApplied = false,
}) => {
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({
    step1: true,
  });

  const toggleStep = (id: string) => {
    setCompletedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const ollieMessage =
    lang === 'es'
      ? 'Esto no es su culpa. Los estafadores son expertos. Esto es lo que podemos hacer ahora mismo.'
      : 'This isn’t your fault. Scammers are skilled. Here’s what we can do right now.';

  return (
    <div className="space-y-3.5 select-none animate-fadeIn">
      <OllieBubble
        mood="wave"
        message={ollieMessage}
        subtext={
          lang === 'es'
            ? 'Sound Credit Union le respalda en cada etapa.'
            : 'Sound Credit Union stands with you. No blame, only solutions.'
        }
      />

      {/* Reassurance Banner */}
      <div className="bg-sand-50 border-2 border-otter-400/40 rounded-2xl p-3.5 shadow-sm text-navy-900 space-y-1.5">
        <div className="flex items-center space-x-1.5 text-otter-700 font-heading font-extrabold text-xs uppercase tracking-wider">
          <HeartHandshake className="w-4 h-4" />
          <span>{lang === 'es' ? 'Recuperación sin culpa' : 'No-Blame Member Recovery'}</span>
        </div>
        <p className="text-xs text-navy-900 leading-snug font-medium">
          {lang === 'es'
            ? 'Los esquemas de manipulación sofisticada evolucionan constantemente. Hemos pausado transferencias adicionales hacia este destinatario.'
            : 'Deceptive investment platforms manipulate legitimate accounts over months. We have halted future transfers to this payee.'}
        </p>
      </div>

      {/* 4-Step Recovery Checklist */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm space-y-2.5">
        <h3 className="text-xs font-heading font-extrabold text-navy-900 uppercase tracking-wider flex items-center justify-between">
          <span>{lang === 'es' ? 'Plan de Acción Inmediato' : 'Immediate Action Plan'}</span>
          <span className="text-[10px] font-mono text-slate-500 font-normal">Sound Case #REC-9012</span>
        </h3>

        {/* Step 1: Recall Attempt */}
        <div
          onClick={() => toggleStep('step1')}
          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
            completedSteps.step1 ? 'bg-foam-50 border-safe-700/30' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-navy-900 flex items-center space-x-1.5">
              <CheckCircle2
                className={`w-4 h-4 ${completedSteps.step1 ? 'text-safe-700' : 'text-slate-400'}`}
              />
              <span>1. ACH & Wire Recall Initiation</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-safe-700">SUBMITTED</span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1 pl-5.5">
            Most recent $300 transfer is within the 48-hour federal ACH return window. Recall request transmitted to receiving bank.
          </p>
        </div>

        {/* Step 2: 90 Days Tighter Settings */}
        <div
          onClick={() => toggleStep('step2')}
          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
            isSettingsApplied || completedSteps.step2
              ? 'bg-foam-50 border-safe-700/30'
              : 'bg-sand-50/70 border-sand-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-navy-900 flex items-center space-x-1.5">
              <ShieldCheck
                className={`w-4 h-4 ${
                  isSettingsApplied || completedSteps.step2 ? 'text-safe-700' : 'text-otter-700'
                }`}
              />
              <span>2. 90 Days Tighter Account Settings</span>
            </span>
            <span className="text-[10px] font-mono text-kelp-700">
              {isSettingsApplied ? 'ACTIVE' : 'READY'}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1 pl-5.5">
            Automatic 24-hour review on all transfers over $200 and mandatory phone verification for new payees for the next 90 days.
          </p>
        </div>

        {/* Step 3: Official Reporting */}
        <div
          onClick={() => toggleStep('step3')}
          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
            completedSteps.step3 ? 'bg-foam-50 border-safe-700/30' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-bold text-navy-900 flex items-center space-x-1.5">
              <FileText
                className={`w-4 h-4 ${completedSteps.step3 ? 'text-safe-700' : 'text-slate-400'}`}
              />
              <span>3. Official Fraud Reporting Package</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-600 mt-1 pl-5.5">
            We generated your one-click documentation packet ready for ReportFraud.ftc.gov and IC3.gov.
          </p>
        </div>
      </div>

      {/* Button to engage tighter settings */}
      <div className="pt-1">
        {isSettingsApplied ? (
          <div className="w-full min-h-[46px] bg-foam-50 border border-safe-700/30 text-safe-700 rounded-full text-xs font-heading font-extrabold flex items-center justify-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>90-Day Protection Shield Engaged</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={onActivateTighterSettings}
            className="w-full min-h-[48px] bg-kelp-700 hover:bg-kelp-800 text-white font-heading font-extrabold text-sm rounded-full shadow-sm flex items-center justify-center space-x-2 transition-transform active:scale-[0.98]"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{lang === 'es' ? 'Activar 90 días de protección extra' : 'Turn on 90 Days of Tighter Settings'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
