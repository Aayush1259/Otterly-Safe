import React from 'react';
import { PhoneCall, XCircle, Clock, ShieldCheck } from 'lucide-react';
import type { Lang } from '../../types';

interface ChoiceBarProps {
  lang: Lang;
  onCancel: () => void;
  onWait24: () => void;
  onTalkToSound: () => void;
  isCompleted?: boolean;
}

/**
 * ChoiceBar:
 * Offers exactly: Cancel · Wait 24 hours · Talk to Sound.
 * "Talk to Sound" is prominently highlighted as the recommended action.
 * CRITICAL RULE: There is NO "send anyway" button in the scam lane.
 */
export const ChoiceBar: React.FC<ChoiceBarProps> = ({
  lang,
  onCancel,
  onWait24,
  onTalkToSound,
  isCompleted = false,
}) => {
  return (
    <div className="space-y-2 pt-2">
      <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
        <span>{lang === 'es' ? 'Acción recomendada:' : 'Recommended action:'}</span>
        <span className="font-semibold text-kelp-700">No pressure, take your time</span>
      </div>

      <div className="space-y-2">
        {/* Recommended Primary: Talk to Sound */}
        <button
          type="button"
          onClick={onTalkToSound}
          className="w-full min-h-[48px] bg-kelp-700 hover:bg-kelp-800 text-white font-heading font-extrabold text-sm rounded-full shadow-md flex items-center justify-center space-x-2 transition-transform active:scale-[0.98] focus:ring-4 focus:ring-kelp-700/30"
        >
          <PhoneCall className="w-4 h-4" />
          <span>
            {lang === 'es' ? 'Hablar con Sound (Recomendado)' : 'Talk to Sound (Recommended)'}
          </span>
        </button>

        {/* Secondary Choices: Wait 24 hours & Cancel */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onWait24}
            className="min-h-[44px] bg-white hover:bg-sand-100 text-navy-900 border border-slate-300 font-heading font-bold text-xs rounded-full flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Clock className="w-3.5 h-3.5 text-otter-700" />
            <span>{lang === 'es' ? 'Esperar 24 h' : 'Wait 24 hours'}</span>
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="min-h-[44px] bg-white hover:bg-stop-50 text-stop-700 border border-stop-200 font-heading font-bold text-xs rounded-full flex items-center justify-center space-x-1.5 transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>{lang === 'es' ? 'Cancelar pago' : 'Cancel payment'}</span>
          </button>
        </div>
      </div>

      <div className="text-center pt-1">
        <span className="text-[10px] text-slate-500 flex items-center justify-center space-x-1">
          <ShieldCheck className="w-3 h-3 text-safe-700" />
          <span>
            {lang === 'es'
              ? 'En esta categoría no existe botón de "enviar de todos modos"'
              : 'Zero-pressure safety: No "send anyway" bypass in this lane'}
          </span>
        </span>
      </div>
    </div>
  );
};
