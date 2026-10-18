import React, { useState } from 'react';
import { OllieBubble } from '../OllieBubble';
import { MoneyIsSafeCard } from './MoneyIsSafeCard';
import { RememberThisCard } from './RememberThisCard';
import { CheckQuestions, type CheckAnswerState } from './CheckQuestions';
import { ChoiceBar } from './ChoiceBar';
import type { Card, Lang } from '../../types';

interface OllieCheckSheetProps {
  amount: number;
  recipientName: string;
  practiceCard: Card;
  lang: Lang;
  onChoice: (choice: 'cancel' | 'wait24' | 'talk_to_sound', answers: CheckAnswerState) => void;
}

/**
 * OllieCheckSheet:
 * The signature 30-second scam intervention sheet.
 * Ollie is concerned, reaffirms that money remains in the account,
 * recalls the matching practice card, runs the 3 questions, and offers safe exits.
 */
export const OllieCheckSheet: React.FC<OllieCheckSheetProps> = ({
  amount,
  recipientName,
  practiceCard,
  lang,
  onChoice,
}) => {
  const [answers, setAnswers] = useState<CheckAnswerState>({
    q1: null,
    q2: null,
    q3: null,
  });

  const ollieText =
    lang === 'es'
      ? 'Un momento. Su dinero aún está en su cuenta. Esto se parece a un truco que practicamos.'
      : 'Hold on. Your money is still in your account. This looks like a trick we practiced.';

  return (
    <div
      className="bg-sand-50 rounded-t-3xl border-t-2 border-slate-300 p-4 shadow-lift space-y-3.5 flex flex-col max-h-full overflow-y-auto animate-slideUp select-none"
      role="dialog"
      aria-modal="true"
      aria-label="Otterly Safe payment check"
    >
      {/* Top Grab Handle */}
      <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto shrink-0 mb-1" />

      {/* Ollie's voice bubble */}
      <OllieBubble
        mood="concerned"
        message={ollieText}
        subtext={
          lang === 'es'
            ? `Revisión previa para el pago de $${amount.toLocaleString()} a ${recipientName}.`
            : `Safety check for $${amount.toLocaleString()} payment to ${recipientName}.`
        }
      />

      {/* Money is Safe Banner */}
      <MoneyIsSafeCard amount={amount} lang={lang} />

      {/* Practice recall card */}
      <RememberThisCard card={practiceCard} dateStr="Oct 3" lang={lang} />

      {/* 3 Questions */}
      <CheckQuestions answers={answers} onChange={setAnswers} lang={lang} />

      {/* Safe Choice Bar */}
      <ChoiceBar
        lang={lang}
        onCancel={() => onChoice('cancel', answers)}
        onWait24={() => onChoice('wait24', answers)}
        onTalkToSound={() => onChoice('talk_to_sound', answers)}
      />
    </div>
  );
};
