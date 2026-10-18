import React, { useState } from 'react';
import { PhoneCall, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react';
import { ROLE_PLAY_TURNS } from '../../data/practiceExtra';
import { OllieBubble } from '../OllieBubble';
import type { Lang } from '../../types';

interface RolePlayChatProps {
  lang: Lang;
  onComplete?: (score: number) => void;
  onReturnToDashboard?: () => void;
}

export const RolePlayChat: React.FC<RolePlayChatProps> = ({ lang, onComplete, onReturnToDashboard }) => {
  const [currentTurnIdx, setCurrentTurnIdx] = useState(0);
  const [selectedChoices, setSelectedChoices] = useState<Record<number, string>>({});
  const [scores, setScores] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const turn = ROLE_PLAY_TURNS[currentTurnIdx];
  const choiceMadeId = selectedChoices[turn?.turn_id];
  const choiceObj = turn?.options.find((o) => o.id === choiceMadeId);

  const handleSelectOption = (optId: string, isSafe: boolean) => {
    if (choiceMadeId) return;
    setSelectedChoices((prev) => ({ ...prev, [turn.turn_id]: optId }));
    setScores((prev) => [...prev, isSafe ? 1 : 0]);
  };

  const handleNextTurn = () => {
    if (currentTurnIdx < ROLE_PLAY_TURNS.length - 1) {
      setCurrentTurnIdx((i) => i + 1);
    } else {
      setIsFinished(true);
      const totalScore = scores.reduce((a, b) => a + b, 0);
      onComplete?.(totalScore);
    }
  };

  const handleReset = () => {
    setCurrentTurnIdx(0);
    setSelectedChoices({});
    setScores([]);
    setIsFinished(false);
  };

  const totalSafePicks = scores.filter((s) => s === 1).length;

  return (
    <div className="space-y-4 max-w-xl mx-auto select-none">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-3 sm:px-4 py-2 sm:py-2.5 shadow-2xs gap-2">
        <div className="flex items-center space-x-1.5 min-w-0">
          <PhoneCall className="w-4 h-4 text-stop-700 shrink-0" />
          <span className="font-heading font-extrabold text-xs text-navy-900 truncate">
            {lang === 'es' ? 'Simulación de Llamada' : 'Security Call Role-Play'}
          </span>
        </div>
        <span className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-600 bg-sand-100 border border-sand-200 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
          Turn {!isFinished ? `${currentTurnIdx + 1} of ${ROLE_PLAY_TURNS.length}` : 'Done'}
        </span>
      </div>

      {!isFinished ? (
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
          {/* Simulated Inbound Caller */}
          <div className="bg-stop-50 border border-stop-200 rounded-2xl p-4 text-xs space-y-1.5">
            <div className="flex items-center space-x-1.5 text-stop-700 font-heading font-extrabold text-xs uppercase">
              <span className="w-2 h-2 rounded-full bg-stop-700 animate-ping" />
              <span>Incoming Call: "Fraud Department Specialist"</span>
            </div>
            <p className="font-body text-navy-900 font-semibold leading-relaxed">
              "{turn.caller[lang]}"
            </p>
          </div>

          {/* Reply Choices */}
          <div className="space-y-2">
            <span className="text-xs font-heading font-extrabold uppercase tracking-wider text-slate-500 block">
              {lang === 'es' ? 'Elija su respuesta:' : 'Choose your response:'}
            </span>

            {turn.options.map((opt) => {
              const isSelected = choiceMadeId === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOption(opt.id, opt.is_safe)}
                  disabled={!!choiceMadeId}
                  className={`w-full p-3 rounded-2xl border text-left text-xs font-body transition-all flex items-start space-x-2.5 min-h-[48px] ${
                    isSelected
                      ? opt.is_safe
                        ? 'bg-foam-50 border-safe-700 font-bold text-safe-700 shadow-xs'
                        : 'bg-check-50 border-check-700 font-bold text-check-800 shadow-xs'
                      : choiceMadeId
                        ? 'opacity-50 border-slate-200 bg-slate-50'
                        : 'bg-sand-50/60 border-slate-200 hover:bg-sand-50 text-navy-900'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-navy-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {opt.id[1].toUpperCase()}
                  </span>
                  <span className="flex-1">{opt.text[lang]}</span>
                </button>
              );
            })}
          </div>

          {/* Feedback on choice */}
          {choiceObj && (
            <div className="space-y-3 pt-2">
              <OllieBubble
                mood={choiceObj.is_safe ? 'cheer' : 'concerned'}
                message={choiceObj.feedback[lang]}
              />

              <button
                type="button"
                onClick={handleNextTurn}
                className="w-full min-h-[46px] bg-navy-900 hover:bg-slate-800 text-white font-heading font-extrabold text-xs rounded-full flex items-center justify-center space-x-2 transition-transform active:scale-98 shadow-sm"
              >
                <span>{currentTurnIdx < ROLE_PLAY_TURNS.length - 1 ? 'Next Turn' : 'See Role-Play Results'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Results screen */
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm text-center space-y-4">
          <OllieBubble
            mood="cheer"
            message={
              totalSafePicks >= 3
                ? 'Outstanding defense! You dismantled the caller’s deception at every turn.'
                : 'Good practice! Recognizing pressure tactics takes rehearsal.'
            }
          />

          <div className="bg-sand-50 border border-sand-200 rounded-2xl p-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Defensive Safety Score
            </span>
            <span className="text-3xl font-heading font-black text-kelp-700 block mt-1">
              {totalSafePicks} / {ROLE_PLAY_TURNS.length} Safe Choices
            </span>
          </div>

          <div className="bg-foam-50 border border-foam-200 rounded-xl p-3 text-xs text-navy-900 text-left space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-safe-700">
              <CheckCircle2 className="w-4 h-4" />
              <span>Key Takeaway: The Number on Your Card</span>
            </div>
            <p className="text-[11px] text-slate-700">
              Never follow verbal instructions from unexpected incoming callers. Always hang up and dial the customer service number printed on your debit card.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 min-h-[46px] border border-slate-200 bg-sand-50 hover:bg-white text-navy-900 font-heading font-extrabold text-xs rounded-full flex items-center justify-center space-x-2 transition-transform active:scale-98"
            >
              <RotateCcw className="w-4 h-4 text-kelp-700" />
              <span>Replay Drill</span>
            </button>
            {onReturnToDashboard && (
              <button
                type="button"
                onClick={onReturnToDashboard}
                className="flex-1 min-h-[46px] bg-kelp-700 hover:bg-kelp-800 text-white font-heading font-extrabold text-xs rounded-full flex items-center justify-center space-x-2 transition-transform active:scale-98 shadow-sm"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
