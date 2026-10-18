import React from 'react';
import { Sparkles, Calendar, CheckCircle } from 'lucide-react';
import type { Card, Lang } from '../../types';

interface RememberThisCardProps {
  card: Card;
  dateStr?: string;
  lang: Lang;
}

/**
 * RememberThisCard:
 * Connects the live payment intervention to a practice drill the member completed earlier.
 * "You practiced this one on Oct 3."
 */
export const RememberThisCard: React.FC<RememberThisCardProps> = ({
  card,
  dateStr = 'Oct 3',
  lang,
}) => {
  return (
    <div className="bg-sand-50 border-2 border-otter-400/40 rounded-2xl p-3.5 shadow-sm text-navy-900 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1.5 text-otter-700 font-heading font-extrabold text-xs uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{lang === 'es' ? 'Recuerda esta práctica' : 'Remember this drill?'}</span>
        </div>
        <div className="flex items-center space-x-1 text-[11px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
          <Calendar className="w-3 h-3 text-otter-700" />
          <span>{lang === 'es' ? `Practicado el ${dateStr}` : `Practiced on ${dateStr}`}</span>
        </div>
      </div>

      <div className="bg-white border border-sand-200 rounded-xl p-2.5 text-xs">
        <div className="text-[10px] uppercase font-bold text-slate-500 mb-0.5">
          {card.sender[lang]}
        </div>
        <p className="font-body text-slate-800 italic text-[11px] leading-relaxed">
          "{card.content[lang]}"
        </p>
      </div>

      <div className="flex items-center space-x-1 text-[11px] text-kelp-800 font-semibold">
        <CheckCircle className="w-3.5 h-3.5 text-safe-700 shrink-0" />
        <span>
          {lang === 'es'
            ? 'Usted identificó la falsa urgencia y las cuentas fraudulentas en este simulacro.'
            : 'You correctly spotted the fake urgency and safe-account trick in this drill.'}
        </span>
      </div>
    </div>
  );
};
