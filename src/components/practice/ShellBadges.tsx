import React from 'react';
import { Award, ShieldCheck, Sparkles, Compass } from 'lucide-react';
import type { Lang } from '../../types';

interface ShellBadgesProps {
  unlockedBadges: string[];
  lang: Lang;
}

export const ShellBadges: React.FC<ShellBadgesProps> = ({ unlockedBadges, lang }) => {
  const badges = [
    {
      id: 'first_catch',
      icon: Sparkles,
      title: { en: 'First Catch', es: 'Primera Captura' },
      desc: { en: 'Spot your first scam card in practice.', es: 'Descubre tu primera tarjeta de estafa.' },
    },
    {
      id: 'clue_spotter',
      icon: Compass,
      title: { en: 'Clue Spotter', es: 'Rastreador de Pistas' },
      desc: { en: 'Find all 4 hidden red flags in a message.', es: 'Encuentra las 4 señales de alerta.' },
    },
    {
      id: 'steady_paws',
      icon: ShieldCheck,
      title: { en: 'Steady Paws', es: 'Garras Firmes' },
      desc: { en: 'Complete a security role-play without caving to urgency.', es: 'Completa un juego de rol sin ceder a la prisa.' },
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
      <div className="flex items-center space-x-1.5">
        <Award className="w-4 h-4 text-otter-700" />
        <h4 className="font-heading font-extrabold text-xs uppercase tracking-wider text-navy-900">
          {lang === 'es' ? 'Insignias de Protección de Ollie' : 'Ollie’s Shell Badges'}
        </h4>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {badges.map((b) => {
          const Icon = b.icon;
          const isUnlocked = unlockedBadges.includes(b.id);

          return (
            <div
              key={b.id}
              className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center space-y-1.5 transition-all ${
                isUnlocked
                  ? 'bg-sand-50 border-otter-700/40 shadow-xs'
                  : 'bg-slate-50 border-slate-200 opacity-50 grayscale'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-white ${
                  isUnlocked ? 'bg-otter-700 shadow-sm' : 'bg-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <span className="font-heading font-bold text-xs text-navy-900 block leading-tight">
                {b.title[lang]}
              </span>

              <span className="text-[10px] text-slate-500 leading-tight block">
                {b.desc[lang]}
              </span>

              {isUnlocked && (
                <span className="text-[9px] font-mono font-bold uppercase text-otter-700 bg-sand-100 px-1.5 py-0.2 rounded-full border border-otter-200">
                  Earned
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
