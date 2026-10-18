import React, { useState } from 'react';
import { Send, DollarSign, User, ShieldCheck } from 'lucide-react';
import type { Lang, Member, PaymentType } from '../../types';
import { money } from '../../lib/format';

interface PayAnyoneFormProps {
  member: Member;
  lang: Lang;
  initialAmount?: number;
  initialRecipient?: string;
  initialType?: PaymentType;
  onSubmit: (data: { recipientName: string; amount: number; paymentType: PaymentType; note: string }) => void;
}

/**
 * Clean member transfer creation form in Sound Credit Union style.
 */
export const PayAnyoneForm: React.FC<PayAnyoneFormProps> = ({
  member,
  lang,
  initialAmount = 9800,
  initialRecipient = 'Secure Reserve Holdings (example)',
  initialType = 'wire',
  onSubmit,
}) => {
  const [recipientName, setRecipientName] = useState(initialRecipient);
  const [amount, setAmount] = useState(String(initialAmount));
  const [paymentType, setPaymentType] = useState<PaymentType>(initialType);
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!recipientName.trim() || isNaN(num) || num <= 0) return;
    onSubmit({ recipientName, amount: num, paymentType, note });
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-between space-y-4">
      <div className="space-y-4">
        {/* Available Balance Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              {lang === 'es' ? 'Saldo Disponible' : 'Available Checking'}
            </span>
            <span className="text-2xl font-heading font-extrabold text-navy-900">
              {money(member.balance)}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-kelp-50 border border-kelp-200 flex items-center justify-center text-kelp-700">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Recipient */}
        <div>
          <label className="block text-xs font-heading font-bold uppercase tracking-wider text-slate-700 mb-1">
            {lang === 'es' ? 'Destinatario' : 'Send To'}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Name, business, or phone"
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold text-navy-900 focus:ring-2 focus:ring-kelp-700 focus:outline-none"
            />
          </div>
          <span className="text-[11px] text-otter-700 mt-1 block font-medium">
            * First time paying this recipient
          </span>
        </div>

        {/* Amount */}
        <div>
          <label className="block text-xs font-heading font-bold uppercase tracking-wider text-slate-700 mb-1">
            {lang === 'es' ? 'Monto' : 'Amount'}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 font-bold">
              $
            </div>
            <input
              type="number"
              step="any"
              required
              min="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-lg font-heading font-extrabold text-navy-900 focus:ring-2 focus:ring-kelp-700 focus:outline-none"
            />
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {lang === 'es'
              ? `Pago habitual de este miembro: ${money(member.usual_payment)}`
              : `Member’s usual payment: ${money(member.usual_payment)}`}
          </span>
        </div>

        {/* Payment Type */}
        <div>
          <label className="block text-xs font-heading font-bold uppercase tracking-wider text-slate-700 mb-1">
            {lang === 'es' ? 'Método de Envío' : 'Transfer Channel'}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'p2p', label: 'Instant P2P' },
              { id: 'wire', label: 'Wire Transfer' },
              { id: 'ach', label: 'Standard ACH' },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setPaymentType(m.id as PaymentType)}
                className={`py-2 px-2 rounded-xl text-xs font-bold font-heading border text-center transition-all min-h-[44px] ${
                  paymentType === m.id
                    ? 'bg-kelp-700 text-white border-kelp-700 shadow-sm'
                    : 'bg-white text-navy-900 border-slate-300 hover:bg-slate-50'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div>
          <label className="block text-xs font-heading font-bold uppercase tracking-wider text-slate-700 mb-1">
            {lang === 'es' ? 'Nota o Referencia (opcional)' : 'Memo (optional)'}
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Invoice #9024 or Safe account"
            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-navy-900 focus:ring-2 focus:ring-kelp-700 focus:outline-none"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          className="w-full min-h-[48px] bg-kelp-700 hover:bg-kelp-800 text-white font-heading font-extrabold text-base rounded-full shadow-sm flex items-center justify-center space-x-2 transition-transform active:scale-[0.98] focus:ring-4 focus:ring-kelp-700/30"
        >
          <Send className="w-4 h-4" />
          <span>{lang === 'es' ? 'Revisar Pago' : 'Review Payment'}</span>
        </button>
        <div className="flex items-center justify-center space-x-1 mt-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-kelp-700" />
          <span>Protected by Sound Otterly Safe rules</span>
        </div>
      </div>
    </form>
  );
};
