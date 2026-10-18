import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';
import type { Lang } from '../../types';

interface MoneyIsSafeCardProps {
  amount?: number;
  lang: Lang;
}

/**
 * MoneyIsSafeCard ("Your money is still in your account").
 * High-contrast, reassuring panel adhering to Kelp UI foam-50 palette.
 */
export const MoneyIsSafeCard: React.FC<MoneyIsSafeCardProps> = ({ amount, lang }) => {
  return (
    <div
      className="bg-foam-50 border-2 border-safe-700/30 rounded-2xl p-3.5 shadow-sm flex items-start space-x-3 text-navy-900"
      role="status"
    >
      <div className="w-9 h-9 rounded-full bg-safe-700 text-white flex items-center justify-center shrink-0 shadow-xs">
        <ShieldCheck className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-1.5">
          <span className="font-heading font-extrabold text-sm text-safe-700 uppercase tracking-wider">
            {lang === 'es' ? 'Su dinero está seguro' : 'Your money is safe'}
          </span>
          <Lock className="w-3.5 h-3.5 text-safe-700" />
        </div>

        <p className="font-body text-xs font-semibold text-navy-900 mt-0.5 leading-snug">
          {lang === 'es'
            ? amount
              ? `Sus $${amount.toLocaleString()} continúan en su cuenta de Sound. No han salido.`
              : 'Sus fondos continúan intactos en su cuenta de Sound. No han salido.'
            : amount
              ? `Your $${amount.toLocaleString()} is still in your account. No money has moved.`
              : 'Your funds are still in your Sound account. No money has moved.'}
        </p>
      </div>
    </div>
  );
};
