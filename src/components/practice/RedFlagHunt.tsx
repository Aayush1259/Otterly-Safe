import React, { useState } from 'react';
import { Target, CheckCircle2, RotateCcw, AlertTriangle } from 'lucide-react';
import { RED_FLAG_HUNT } from '../../data/practiceExtra';
import { OllieBubble } from '../OllieBubble';
import type { Lang } from '../../types';

interface RedFlagHuntProps {
  lang: Lang;
  onComplete?: () => void;
}

export const RedFlagHunt: React.FC<RedFlagHuntProps> = ({ lang, onComplete }) => {
  const [foundIds, setFoundIds] = useState<string[]>([]);

  const handleToggle = (id: string) => {
    if (foundIds.includes(id)) return;
    const next = [...foundIds, id];
    setFoundIds(next);
    if (next.length === RED_FLAG_HUNT.targets.length) {
      onComplete?.();
    }
  };

  const handleReset = () => {
    setFoundIds([]);
  };

  const isAllFound = foundIds.length === RED_FLAG_HUNT.targets.length;

  return (
    <div className="space-y-4 max-w-xl mx-auto select-none">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 shadow-2xs gap-2">
        <div className="flex items-center space-x-1.5 min-w-0">
          <Target className="w-4 h-4 text-check-700 shrink-0" />
          <span className="font-heading font-extrabold text-xs text-navy-900 truncate">
            {RED_FLAG_HUNT.title[lang]}
          </span>
        </div>
        <span className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-600 bg-sand-100 border border-sand-200 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
          {foundIds.length} / {RED_FLAG_HUNT.targets.length} Spotted
        </span>
      </div>

      <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
        <p className="text-xs text-slate-600 font-body">
          {RED_FLAG_HUNT.scenarioDescription[lang]}
        </p>

        {/* Interactive message card with tappable targets */}
        <div className="bg-sand-50 border-2 border-sand-200 rounded-2xl p-4 text-xs font-body leading-relaxed text-navy-900 space-y-2">
          <div className="space-y-2">
            {RED_FLAG_HUNT.targets.map((target, idx) => {
              const isFound = foundIds.includes(target.id);
              const targetText = lang === 'es' ? target.textEs : target.textEn;

              return (
                <button
                  key={target.id}
                  type="button"
                  onClick={() => handleToggle(target.id)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start justify-between ${
                    isFound
                      ? 'bg-check-50 border-check-700 text-check-800 font-bold shadow-xs'
                      : 'bg-white border-slate-300 hover:border-kelp-700 text-navy-900'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    <span
                      className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold mt-0.5 shrink-0 ${
                        isFound ? 'bg-check-700 text-white' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div>
                      <span className="block italic">"{targetText}"</span>
                      {isFound && (
                        <span className="text-[11px] font-normal text-navy-900 block mt-1">
                          ↳ {target.explanation[lang]}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="shrink-0 ml-2">
                    {isFound ? (
                      <CheckCircle2 className="w-4 h-4 text-safe-700" />
                    ) : (
                      <span className="text-[10px] uppercase font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        Tap to check
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback / Completion state */}
        {isAllFound ? (
          <div className="space-y-3 pt-2">
            <OllieBubble
              mood="cheer"
              message={
                lang === 'es'
                  ? '¡Excelente ojo! Encontró todas las señales de alerta ocultas.'
                  : 'Sharp eyes! You uncovered all 4 deception tactics in the message.'
              }
            />

            <button
              type="button"
              onClick={handleReset}
              className="w-full min-h-[44px] bg-navy-900 hover:bg-slate-800 text-white font-heading font-extrabold text-xs rounded-full flex items-center justify-center space-x-2 transition-transform active:scale-98"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset & Practice Again</span>
            </button>
          </div>
        ) : (
          <OllieBubble
            mood="think"
            message={
              lang === 'es'
                ? 'Busque urgencia artificial, enlaces dudosos y amenazas falsas.'
                : 'Look for fake urgency, suspicious links, and demands to bypass Sound staff.'
            }
          />
        )}
      </div>
    </div>
  );
};
