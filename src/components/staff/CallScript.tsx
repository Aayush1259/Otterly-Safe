import React from 'react';
import { PhoneCall, MessageSquareQuote, ShieldCheck } from 'lucide-react';
import { money } from '../../lib/format';

interface CallScriptProps {
  memberName: string;
  amount: number;
  recipientName: string;
  isDarkMode?: boolean;
}

/**
 * CallScript:
 * High-empathy 3-line verified phone script for member care staff.
 * Calms the member, confirms money safety, and debunks the fake caller.
 */
export const CallScript: React.FC<CallScriptProps> = ({
  memberName,
  amount,
  recipientName,
  isDarkMode = false,
}) => {
  return (
    <div
      className={`p-3.5 rounded-2xl border ${
        isDarkMode
          ? 'bg-slate-800/80 border-slate-700 text-slate-200'
          : 'bg-sand-50 border-kelp-700/20 text-navy-900'
      }`}
    >
      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-700/20">
        <div className="flex items-center space-x-1.5">
          <PhoneCall className="w-4 h-4 text-kelp-600 shrink-0" />
          <h4 className="font-heading font-extrabold text-xs uppercase tracking-wider text-kelp-700">
            3-Line Member Verification Script
          </h4>
        </div>
        <span className="text-[10px] font-mono opacity-60">Verified line: (253) 555-0100</span>
      </div>

      <ol className="space-y-2 text-xs font-body leading-relaxed">
        <li className="flex items-start space-x-2">
          <span className="w-4 h-4 rounded-full bg-kelp-700 text-white text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">
            1
          </span>
          <p>
            "Hello <strong>{memberName}</strong>, this is Member Care at Sound Credit Union. I’m reviewing your pending transfer of <strong>{money(amount)}</strong> to <strong>{recipientName}</strong>."
          </p>
        </li>

        <li className="flex items-start space-x-2">
          <span className="w-4 h-4 rounded-full bg-kelp-700 text-white text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">
            2
          </span>
          <p>
            "First, I want to reassure you: <strong>your money is 100% safe in your account</strong> and has not moved. Did someone call or message you asking you to transfer these funds?"
          </p>
        </li>

        <li className="flex items-start space-x-2">
          <span className="w-4 h-4 rounded-full bg-kelp-700 text-white text-[10px] flex items-center justify-center font-bold shrink-0 mt-0.5">
            3
          </span>
          <p>
            "Sound Credit Union will <strong>never ask you to transfer funds to a 'safe account'</strong> or keep secrets from branch staff. We can safely cancel this transfer right now."
          </p>
        </li>
      </ol>
    </div>
  );
};
