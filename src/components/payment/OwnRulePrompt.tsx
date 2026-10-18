import React from 'react';
import { Sliders, ShieldCheck, Check } from 'lucide-react';
import { OllieBubble } from '../OllieBubble';
import type { Lang } from '../../types';

interface OwnRulePromptProps {
  category: string;
  maxAmount?: number;
  lang: Lang;
  onAcceptRule: () => void;
  onDismiss: () => void;
  isApplied?: boolean;
}

/**
 * OwnRulePrompt:
 * Empowers members to set their own custom rules so verified recurring look-alikes don't pause.
 * "Contractor payments up to $6,000 won't pause."
 */
export const OwnRulePrompt: React.FC<OwnRulePromptProps> = ({
  category,
  maxAmount = 6000,
  lang,
  onAcceptRule,
  onDismiss,
  isApplied = false,
}) => {
  const ruleText =
    lang === 'es'
      ? `Pagos a contratistas de hasta $${maxAmount.toLocaleString()} no se pausarán.`
      : `Contractor payments up to $${maxAmount.toLocaleString()} won't pause.`;

  return (
    <div className="bg-sand-50 border-2 border-kelp-700/40 rounded-2xl p-4 shadow-sm space-y-3 select-none animate-fadeIn">
      <OllieBubble
        mood="cheer"
        message={
          lang === 'es'
            ? '¡Excelente! Ahora puede crear su propia regla para evitar pausas futuras.'
            : 'Payment released! Want to set a rule so contractor payments like this don’t pause again?'
        }
      />

      <div className="bg-white border border-sand-200 rounded-xl p-3 flex items-start space-x-2.5">
        <Sliders className="w-5 h-5 text-kelp-700 shrink-0 mt-0.5" />
        <div>
          <span className="text-xs font-heading font-extrabold text-navy-900 block">
            {lang === 'es' ? 'Regla personalizada sugerida' : 'Recommended Custom Rule'}
          </span>
          <p className="font-body text-xs font-semibold text-kelp-800 mt-0.5">
            "{ruleText}"
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {isApplied ? (
          <div className="w-full min-h-[44px] bg-foam-50 text-safe-700 border border-safe-700/30 rounded-full font-heading font-bold text-xs flex items-center justify-center space-x-1.5 shadow-2xs">
            <Check className="w-4 h-4 text-safe-700" />
            <span>{lang === 'es' ? 'Regla activa guardada' : 'Rule active on your account'}</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={onAcceptRule}
            className="w-full min-h-[46px] bg-kelp-700 hover:bg-kelp-800 text-white font-heading font-extrabold text-xs rounded-full shadow-sm flex items-center justify-center space-x-2 transition-transform active:scale-[0.98]"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{lang === 'es' ? 'Activar esta regla en mi cuenta' : 'Add rule to my account'}</span>
          </button>
        )}

        {!isApplied && (
          <button
            type="button"
            onClick={onDismiss}
            className="w-full min-h-[38px] text-xs font-heading font-semibold text-slate-500 hover:text-navy-900 text-center"
          >
            {lang === 'es' ? 'No por ahora' : 'Not now'}
          </button>
        )}
      </div>
    </div>
  );
};
