import React from 'react';
import { ArrowLeft, Send, ShieldAlert, CheckCircle } from 'lucide-react';
import type { Lang, Member, PaymentType } from '../../types';
import { money } from '../../lib/format';

interface ReviewScreenProps {
  member: Member;
  recipientName: string;
  amount: number;
  paymentType: PaymentType;
  lang: Lang;
  onSend: () => void;
  onBack: () => void;
}

/**
 * Review screen right before sending.
 * Shows transaction details with calm, kind confirmation before payment moves.
 */
export const ReviewScreen: React.FC<ReviewScreenProps> = ({
  member,
  recipientName,
  amount,
  paymentType,
  lang,
  onSend,
  onBack,
}) => {
  const typeLabels = {
    p2p: 'Instant P2P Transfer',
    wire: 'Wire Transfer',
    ach: 'Standard ACH Transfer',
    internal: 'Internal Transfer',
  };

  return (
    <div className="flex-1 flex flex-col justify-between space-y-4">
      <div className="space-y-4">
        {/* Back button */}
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center space-x-1.5 text-xs font-heading font-bold text-slate-600 hover:text-navy-900 min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'es' ? 'Volver a editar' : 'Back to edit'}</span>
        </button>

        {/* Big Amount Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block mb-1">
            {lang === 'es' ? 'Total a Enviar' : 'Transfer Total'}
          </span>
          <span className="text-3xl font-heading font-extrabold text-navy-900 block">
            {money(amount, true)}
          </span>
          <span className="inline-block mt-2 text-xs font-semibold text-kelp-700 bg-kelp-50 px-2.5 py-0.5 rounded-full border border-kelp-200">
            {typeLabels[paymentType]}
          </span>
        </div>

        {/* Transaction Summary List */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">
              {lang === 'es' ? 'Para' : 'Recipient'}
            </span>
            <span className="font-bold text-navy-900 text-right">{recipientName}</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">
              {lang === 'es' ? 'Desde' : 'From Account'}
            </span>
            <span className="font-bold text-navy-900">Sound Checking (*4812)</span>
          </div>

          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">
              {lang === 'es' ? 'Saldo restante' : 'Balance After'}
            </span>
            <span className="font-bold text-navy-900">
              {money(Math.max(0, member.balance - amount))}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">
              {lang === 'es' ? 'Comisión' : 'Transfer Fee'}
            </span>
            <span className="font-bold text-safe-700 flex items-center space-x-1">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>$0.00 Free</span>
            </span>
          </div>
        </div>

        {/* Reassurance Notice */}
        <div className="bg-foam-50 border border-foam-200 rounded-xl p-3 flex items-start space-x-2 text-xs text-navy-900">
          <ShieldAlert className="w-4 h-4 text-kelp-700 shrink-0 mt-0.5" />
          <p className="leading-snug">
            {lang === 'es'
              ? 'Sound evalúa cada pago para proteger su cuenta. Si algo parece inusual, pausaremos para verificar con usted.'
              : 'Sound checks every outgoing transfer. If anything matches a known scam pattern, we pause before money moves.'}
          </p>
        </div>
      </div>

      {/* Action CTA */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onSend}
          className="w-full min-h-[50px] bg-kelp-700 hover:bg-kelp-800 text-white font-heading font-extrabold text-base rounded-full shadow-sm flex items-center justify-center space-x-2 transition-transform active:scale-[0.98] focus:ring-4 focus:ring-kelp-700/30"
        >
          <Send className="w-4 h-4" />
          <span>{lang === 'es' ? 'Autorizar y Enviar' : 'Authorize and Send'}</span>
        </button>
      </div>
    </div>
  );
};
