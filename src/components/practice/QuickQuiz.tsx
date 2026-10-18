import React, { useState } from 'react';
import { HelpCircle, CheckCircle2, XCircle, Award, RotateCcw, ArrowRight } from 'lucide-react';
import { QUICK_QUIZ } from '../../data/practiceExtra';
import { OllieBubble } from '../OllieBubble';
import type { Lang } from '../../types';

interface QuickQuizProps {
  lang: Lang;
  onComplete?: (score: number) => void;
}

export const QuickQuiz: React.FC<QuickQuizProps> = ({ lang, onComplete }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOptIndex, setSelectedOptIndex] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const question = QUICK_QUIZ[currentQIndex];
  const isAnswered = selectedOptIndex !== null;

  const handleSelect = (idx: number, isCorrect: boolean) => {
    if (isAnswered) return;
    setSelectedOptIndex(idx);
    if (isCorrect) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (currentQIndex < QUICK_QUIZ.length - 1) {
      setCurrentQIndex((i) => i + 1);
      setSelectedOptIndex(null);
    } else {
      setIsDone(true);
      onComplete?.(score);
    }
  };

  const handleReset = () => {
    setCurrentQIndex(0);
    setSelectedOptIndex(null);
    setScore(0);
    setIsDone(false);
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto select-none">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-2xs">
        <div className="flex items-center space-x-2">
          <HelpCircle className="w-4 h-4 text-kelp-700" />
          <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-navy-900">
            {lang === 'es' ? 'Cuestionario de Protección' : 'Quick Protection Quiz'}
          </span>
        </div>
        <span className="text-xs font-mono font-bold text-slate-500">
          {!isDone ? `Q ${currentQIndex + 1} of ${QUICK_QUIZ.length}` : 'Completed'}
        </span>
      </div>

      {!isDone ? (
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
          <h3 className="font-heading font-extrabold text-sm text-navy-900 leading-snug">
            {question.question[lang]}
          </h3>

          {/* Options */}
          <div className="space-y-2">
            {question.options.map((opt, idx) => {
              const isSelected = selectedOptIndex === idx;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(idx, opt.isCorrect)}
                  disabled={isAnswered}
                  className={`w-full p-3 rounded-2xl border text-left text-xs font-body transition-all flex items-start space-x-2.5 min-h-[48px] ${
                    isAnswered
                      ? opt.isCorrect
                        ? 'bg-foam-50 border-safe-700 font-bold text-safe-700'
                        : isSelected
                          ? 'bg-stop-50 border-stop-700 text-stop-700 font-bold'
                          : 'opacity-50 border-slate-200'
                      : 'bg-sand-50/60 border-slate-200 hover:bg-sand-50 text-navy-900'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-navy-900 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1">{opt.text[lang]}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation when answered */}
          {isAnswered && (
            <div className="space-y-3 pt-2">
              <div className="bg-sand-50 border border-sand-200 rounded-xl p-3 text-xs text-navy-900">
                <span className="font-heading font-extrabold text-[11px] uppercase tracking-wider text-kelp-700 block mb-1">
                  Why this is true:
                </span>
                <p className="font-body text-slate-700">{question.explanation[lang]}</p>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="w-full min-h-[46px] bg-navy-900 hover:bg-slate-800 text-white font-heading font-extrabold text-xs rounded-full flex items-center justify-center space-x-2 transition-transform active:scale-98 shadow-sm"
              >
                <span>{currentQIndex < QUICK_QUIZ.length - 1 ? 'Next Question' : 'View Quiz Score'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Complete */
        <div className="bg-white border-2 border-slate-200 rounded-3xl p-6 shadow-sm text-center space-y-4">
          <OllieBubble
            mood="cheer"
            message={
              score >= 4
                ? 'Mastery achieved! You know exactly how Sound keeps your money safe.'
                : 'Good effort! Replay to achieve a perfect 5/5 score.'
            }
          />

          <div className="bg-sand-50 border border-sand-200 rounded-2xl p-4">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Final Quiz Score
            </span>
            <span className="text-3xl font-heading font-black text-kelp-700 block mt-1">
              {score} / {QUICK_QUIZ.length} Correct
            </span>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="w-full min-h-[46px] bg-kelp-700 hover:bg-kelp-800 text-white font-heading font-extrabold text-xs rounded-full flex items-center justify-center space-x-2 transition-transform active:scale-98"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake Quiz</span>
          </button>
        </div>
      )}
    </div>
  );
};
