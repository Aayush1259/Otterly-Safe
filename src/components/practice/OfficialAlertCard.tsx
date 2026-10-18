import React from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import type { Lang } from '../../types';
import type { OfficialAlert } from '../../data/practiceExtra';

interface OfficialAlertCardProps {
  alert: OfficialAlert;
  lang: Lang;
}

/**
 * OfficialAlertCard:
 * Ends practice games with an official educational summary labelled:
 * "Source: FTC consumer alerts (example)."
 * Always links to example.com.
 */
export const OfficialAlertCard: React.FC<OfficialAlertCardProps> = ({ alert, lang }) => {
  return (
    <div className="bg-sand-50 border-2 border-kelp-700/20 rounded-2xl p-4 shadow-sm text-navy-900 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1.5 text-kelp-700 font-heading font-extrabold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>{lang === 'es' ? 'Alerta Oficial de Protección' : 'Official Consumer Advisory'}</span>
        </div>
        <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
          Source: {alert.source}
        </span>
      </div>

      <h4 className="text-xs font-heading font-extrabold text-navy-900 leading-snug">
        {alert.title[lang]}
      </h4>

      <p className="text-xs text-slate-700 font-body leading-relaxed">
        {alert.summary[lang]}
      </p>

      <div className="pt-1 flex items-center justify-between text-[11px]">
        <span className="text-slate-500 font-mono">Published {alert.date}</span>
        <a
          href={alert.referenceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1 text-kelp-700 font-bold hover:underline"
        >
          <span>Read bulletin (example.com)</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
