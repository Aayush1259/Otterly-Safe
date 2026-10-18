import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, XCircle, ArrowRight, RotateCcw, Award, Sliders } from 'lucide-react';
import type { Card, Lang, Member } from '../../types';
import { ClueSpotlight } from './ClueSpotlight';
import { OllieBubble } from '../OllieBubble';
import { OfficialAlertCard } from './OfficialAlertCard';
import { OFFICIAL_ALERTS } from '../../data/practiceExtra';

interface ScamOrLegitDeckProps {
  cards: Card[];
  member: Member;
  lang: Lang;
  onSetRule?: (amount: number) => void;
  onCardFinished?: (cardId: string, correct: boolean) => void;
}

export const ScamOrLegitDeck: React.FC<ScamOrLegitDeckProps> = ({
  cards,
  member,
  lang,
  onSetRule,
  onCardFinished,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userGuess, setUserGuess] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [ruleApplied, setRuleApplied] = useState(false);

  const card = cards[currentIndex] || cards[0];
  const isAnswered = userGuess !== null;
  const isCorrect = isAnswered && userGuess === card.is_scam;

  const handleGuess = (guessScam: boolean) => {
    if (isAnswered) return;
    setUserGuess(guessScam);
    const correct = guessScam === card.is_scam;
    if (correct) setScore((s) => s + 1);
    onCardFinished?.(card.card_id, correct);
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((i) => i + 1);
      setUserGuess(null);
    } else {
      // Finished deck
      setCurrentIndex(0);
      setUserGuess(null);
    }
  };

  const handleApplyProtectAction = () => {
    onSetRule?.(1000);
    setRuleApplied(true);
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto select-none">
      {/* Top Deck Progress & Score */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-2.5 sm:px-4 sm:py-3 shadow-2xs space-y-2">
        <div className="flex items-center justify-between gap-2">
          {/* Activity title & card count */}
          <div className="flex items-center space-x-2 min-w-0">
            <span className="font-heading font-extrabold text-xs text-navy-900 tracking-tight whitespace-nowrap">
              {lang === 'es' ? '¿Estafa o Legítimo?' : 'Scam or Legit?'}
            </span>
            <span className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-600 bg-sand-100 border border-sand-200 px-2 py-0.5 rounded-full shrink-0 whitespace-nowrap">
              Card {currentIndex + 1} of {cards.length}
            </span>
          </div>

          {/* Clean, Non-wrapping Score Pill */}
          <div className="flex items-center space-x-1.5 font-heading font-extrabold text-xs text-amber-900 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-full shadow-2xs shrink-0 whitespace-nowrap">
            <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Score: {score}</span>
          </div>
        </div>

        {/* Visual Progress Bar (Shows 1 of 8 progress cleanly) */}
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-kelp-600 to-emerald-500 transition-all duration-300 rounded-full"
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Interactive Card */}
      <div className="bg-white border-2 border-slate-200 rounded-3xl p-5 shadow-sm space-y-4">
        {/* Card Header & Sender info */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <span className="text-xs font-heading font-extrabold text-slate-600 uppercase tracking-wide">
            {card.sender[lang]}
          </span>
          <span className="text-[10px] font-mono uppercase bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
            Format: {card.format}
          </span>
        </div>

        {/* Card Content or Clue Spotlight if answered */}
        {!isAnswered ? (
          <div className="bg-sand-50 border border-sand-200 rounded-2xl p-4 min-h-[110px] flex items-center justify-center text-center">
            <p className="font-body text-sm font-semibold text-navy-900 leading-relaxed">
              "{card.content[lang]}"
            </p>
          </div>
        ) : (
          <ClueSpotlight content={card.content[lang]} clues={card.clues} lang={lang} />
        )}

        {/* Answer Decision Buttons (before answer) */}
        {!isAnswered ? (
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => handleGuess(true)}
              className="min-h-[50px] bg-check-50 hover:bg-check-200 text-check-800 border-2 border-check-700 font-heading font-extrabold text-sm rounded-full flex items-center justify-center space-x-2 transition-transform active:scale-95 shadow-xs"
            >
              <ShieldAlert className="w-4 h-4 text-check-700" />
              <span>{lang === 'es' ? '¡Es una Estafa!' : 'This is a Scam'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleGuess(false)}
              className="min-h-[50px] bg-foam-50 hover:bg-foam-200 text-safe-700 border-2 border-safe-700 font-heading font-extrabold text-sm rounded-full flex items-center justify-center space-x-2 transition-transform active:scale-95 shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4 text-safe-700" />
              <span>{lang === 'es' ? 'Es Legítimo' : 'This is Legit'}</span>
            </button>
          </div>
        ) : (
          // Feedback State with Ollie speech
          <div className="space-y-3 pt-1">
            <OllieBubble
              mood={isCorrect ? 'cheer' : 'concerned'}
              message={
                isCorrect
                  ? lang === 'es'
                    ? '¡Excelente vista! Identificó la táctica con precisión.'
                    : 'Spot on! That’s how we protect our savings.'
                  : lang === 'es'
                    ? '¡Difícil! Esta es la pista que la delató.'
                    : 'Tricky one! Here’s the clue that gave it away.'
              }
              subtext={
                card.is_scam
                  ? 'This message contains manipulation markers designed to cause panic or haste.'
                  : 'This message is harmless account maintenance with zero external payment pressure.'
              }
            />

            {/* ProtectAction card offer */}
            <div className="bg-sand-50 border border-kelp-700/30 rounded-2xl p-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-kelp-700 shrink-0" />
                <span className="text-xs font-heading font-bold text-navy-900">
                  {card.protect_action[lang]}
                </span>
              </div>

              {ruleApplied ? (
                <span className="text-[11px] font-mono text-safe-700 font-bold bg-foam-50 px-2 py-1 rounded">
                  Rule Active
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleApplyProtectAction}
                  className="px-3 py-1.5 bg-kelp-700 hover:bg-kelp-800 text-white text-xs font-heading font-bold rounded-full shadow-xs transition-transform active:scale-95 shrink-0"
                >
                  Set Rule
                </button>
              )}
            </div>

            {/* Next card button */}
            <button
              type="button"
              onClick={handleNext}
              className="w-full min-h-[48px] bg-navy-900 hover:bg-slate-800 text-white font-heading font-extrabold text-xs rounded-full flex items-center justify-center space-x-2 transition-transform active:scale-98 shadow-sm"
            >
              <span>{currentIndex < cards.length - 1 ? 'Next Practice Card' : 'Finish Deck & Replay'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Official Advisory footer card */}
      <OfficialAlertCard alert={OFFICIAL_ALERTS[0]} lang={lang} />
    </div>
  );
};
