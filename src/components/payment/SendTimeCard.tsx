import React, { useState } from 'react';
import { Clock, PhoneCall, Hammer, Users, Home, HelpCircle, CheckCircle } from 'lucide-react';
import { OllieBubble } from '../OllieBubble';
import type { Lang } from '../../types';

interface SendTimeCardProps {
  amount: number;
  recipientName: string;
  lang: Lang;
  sendTimeText?: string;
  onCallToSendNow: (category: string) => void;
  onWaitSchedule: (category: string) => void;
}

/**
 * SendTimeCard for Legitimate Look-alikes:
 * Gives clear send time, asks 1 simple question about purpose,
 * and provides "Call us to send now" option.
 */
export const SendTimeCard: React.FC<SendTimeCardProps> = ({
  amount,
  recipientName,
  lang,
  sendTimeText = '4:10 pm today',
  onCallToSendNow,
  onWaitSchedule,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Home repair');

  const categories = [
    { id: 'Home repair', icon: Hammer, en: 'Home repair / contractor', es: 'Reparación / contratista' },
    { id: 'Family', icon: Users, en: 'Family or friend', es: 'Familia o amigo' },
    { id: 'Rent', icon: Home, en: 'Rent or housing deposit', es: 'Renta o depósito de vivienda' },
    { id: 'Something else', icon: HelpCircle, en: 'Something else', es: 'Otro motivo' },
  ];

  const ollieMessage =
    lang === 'es'
      ? `Revisión rápida: ¿Para qué es este pago? Se envía a las ${sendTimeText}, o llámenos para enviarlo ahora.`
      : `Quick check: what’s this payment for? It sends at ${sendTimeText}, or call us to send it now.`;

  return (
    <div className="space-y-3.5 select-none animate-fadeIn">
      <OllieBubble
        mood="think"
        message={ollieMessage}
        subtext={
          lang === 'es'
            ? `Pago de $${amount.toLocaleString()} a ${recipientName}`
            : `$${amount.toLocaleString()} payment to ${recipientName}`
        }
      />

      {/* Send Time Banner */}
      <div className="bg-sand-50 border-2 border-kelp-700/30 rounded-2xl p-3.5 shadow-sm">
        <div className="flex items-center space-x-2 text-kelp-800 font-heading font-extrabold text-xs uppercase tracking-wider mb-1">
          <Clock className="w-4 h-4 text-kelp-700" />
          <span>{lang === 'es' ? 'Horario de envío programado' : 'Scheduled Release Window'}</span>
        </div>
        <p className="text-xs text-navy-900 leading-snug">
          {lang === 'es' ? (
            <>
              Este pago se enviará automáticamente a las <strong>{sendTimeText}</strong>. No necesita hacer nada a menos que desee enviarlo de inmediato.
            </>
          ) : (
            <>
              This payment sends automatically at <strong>{sendTimeText}</strong>. You don’t need to do anything unless you want it sent sooner.
            </>
          )}
        </p>
      </div>

      {/* Purpose Question */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm space-y-2">
        <label className="block text-xs font-heading font-extrabold text-navy-900">
          {lang === 'es' ? '¿Para qué es este pago?' : 'What’s this payment for?'}
        </label>

        <div className="grid grid-cols-1 gap-1.5">
          {categories.map((c) => {
            const Icon = c.icon;
            const isSelected = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedCategory(c.id)}
                className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs font-semibold transition-all min-h-[44px] ${
                  isSelected
                    ? 'bg-kelp-50 border-kelp-700 text-kelp-900 font-bold shadow-xs'
                    : 'bg-sand-50/50 border-slate-200 text-navy-900 hover:bg-sand-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-kelp-700' : 'text-slate-500'}`} />
                  <span>{lang === 'es' ? c.es : c.en}</span>
                </div>
                {isSelected && <CheckCircle className="w-4 h-4 text-kelp-700" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={() => onCallToSendNow(selectedCategory)}
          className="w-full min-h-[48px] bg-kelp-700 hover:bg-kelp-800 text-white font-heading font-extrabold text-sm rounded-full shadow-sm flex items-center justify-center space-x-2 transition-transform active:scale-[0.98]"
        >
          <PhoneCall className="w-4 h-4" />
          <span>{lang === 'es' ? 'Llamar a Sound para enviar ahora' : 'Call us to send it now'}</span>
        </button>

        <button
          type="button"
          onClick={() => onWaitSchedule(selectedCategory)}
          className="w-full min-h-[44px] bg-white hover:bg-sand-100 text-slate-700 font-heading font-bold text-xs rounded-full border border-slate-300 flex items-center justify-center space-x-1.5"
        >
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>
            {lang === 'es'
              ? `Aceptar envío programado (${sendTimeText})`
              : `Accept scheduled send (${sendTimeText})`}
          </span>
        </button>
      </div>
    </div>
  );
};
