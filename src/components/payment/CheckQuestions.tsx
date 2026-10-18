import React from 'react';
import { AlertCircle, HelpCircle } from 'lucide-react';
import type { Lang } from '../../types';

export interface CheckAnswerState {
  q1: boolean | null;
  q2: boolean | null;
  q3: boolean | null;
}

interface CheckQuestionsProps {
  answers: CheckAnswerState;
  onChange: (answers: CheckAnswerState) => void;
  lang: Lang;
}

/**
 * 2–3 targeted yes/no questions matched to the scam type.
 * If any answer is yes, reveals the golden truth:
 * "Real banks don't ask you to move money to keep it safe."
 */
export const CheckQuestions: React.FC<CheckQuestionsProps> = ({
  answers,
  onChange,
  lang,
}) => {
  const hasAnyYes = answers.q1 === true || answers.q2 === true || answers.q3 === true;

  const questions = [
    {
      id: 'q1' as const,
      en: 'Did someone call or text and ask you to send this?',
      es: '¿Alguien le llamó o envió un mensaje pidiéndole que envíe esto?',
    },
    {
      id: 'q2' as const,
      en: 'Did they say to act fast or keep it secret?',
      es: '¿Le dijeron que actúe rápido o que lo mantenga en secreto?',
    },
    {
      id: 'q3' as const,
      en: 'Did they say your money is in danger?',
      es: '¿Le dijeron que su dinero está en peligro?',
    },
  ];

  const handleSelect = (qId: 'q1' | 'q2' | 'q3', val: boolean) => {
    onChange({
      ...answers,
      [qId]: val,
    });
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center space-x-1.5 text-navy-900 font-heading font-extrabold text-xs uppercase tracking-wider">
        <HelpCircle className="w-4 h-4 text-kelp-700" />
        <span>{lang === 'es' ? 'Preguntas rápidas de seguridad' : '30-Second Security Check'}</span>
      </div>

      <div className="space-y-2">
        {questions.map((q, idx) => {
          const currentVal = answers[q.id];
          return (
            <div
              key={q.id}
              className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-2xs flex flex-col space-y-2"
            >
              <div className="flex items-start space-x-2">
                <span className="w-5 h-5 rounded-full bg-sand-100 text-kelp-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs font-semibold text-navy-900 leading-snug">
                  {lang === 'es' ? q.es : q.en}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pl-7">
                <button
                  type="button"
                  onClick={() => handleSelect(q.id, true)}
                  aria-pressed={currentVal === true}
                  className={`min-h-[40px] rounded-lg text-xs font-heading font-bold border transition-all ${
                    currentVal === true
                      ? 'bg-check-700 text-white border-check-700 shadow-xs'
                      : 'bg-sand-50 text-navy-900 border-slate-300 hover:bg-white'
                  }`}
                >
                  {lang === 'es' ? 'Sí' : 'Yes'}
                </button>

                <button
                  type="button"
                  onClick={() => handleSelect(q.id, false)}
                  aria-pressed={currentVal === false}
                  className={`min-h-[40px] rounded-lg text-xs font-heading font-bold border transition-all ${
                    currentVal === false
                      ? 'bg-slate-700 text-white border-slate-700 shadow-xs'
                      : 'bg-sand-50 text-navy-900 border-slate-300 hover:bg-white'
                  }`}
                >
                  {lang === 'es' ? 'No' : 'No'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Critical Revelation Warning if any Yes is triggered */}
      {hasAnyYes && (
        <div
          className="bg-check-50 border-2 border-check-700/60 rounded-xl p-3 shadow-sm flex items-start space-x-2.5 text-navy-900 animate-fadeIn"
          role="alert"
        >
          <AlertCircle className="w-5 h-5 text-check-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-check-800 block">
              {lang === 'es' ? 'Regla fundamental de Sound' : 'Key Sound Protection Rule'}
            </span>
            <p className="font-body text-xs font-bold text-navy-900 leading-snug mt-0.5">
              {lang === 'es'
                ? 'Los bancos reales nunca le piden mover dinero para mantenerlo seguro.'
                : 'Real banks don’t ask you to move money to keep it safe.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
