import React from 'react';
import { Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import type { PaymentType } from '../../types';

interface RecallClockProps {
  paymentType: PaymentType;
  status: 'pending' | 'held' | 'sent';
  elapsedMinutes?: number;
  isDarkMode?: boolean;
}

/**
 * RecallClock:
 * Displays remaining legal recall window in plain written text.
 * WCAG rule: Never rely solely on a graphical countdown ring.
 */
export const RecallClock: React.FC<RecallClockProps> = ({
  paymentType,
  status,
  elapsedMinutes = 15,
  isDarkMode = false,
}) => {
  let statusText = '';
  let subtext = '';
  let urgencyColor = isDarkMode ? 'text-emerald-400' : 'text-safe-700';
  let badgeBg = isDarkMode ? 'bg-emerald-950/80 border-emerald-800' : 'bg-foam-50 border-foam-200';

  if (status === 'pending' || status === 'held') {
    statusText = `${paymentType.toUpperCase()}: Not sent yet · Funds 100% safe in account`;
    subtext = 'Payment is paused at the gateway. Releasing or cancelling requires zero recovery action.';
    urgencyColor = isDarkMode ? 'text-emerald-400' : 'text-safe-700';
  } else if (paymentType === 'wire') {
    statusText = 'Fedwire Recall Window: Closed (Wired funds settle final)';
    subtext = 'Requires manual B2B indemnification request via SWIFT/Fedwire message.';
    urgencyColor = isDarkMode ? 'text-red-400' : 'text-stop-700';
    badgeBg = isDarkMode ? 'bg-red-950/60 border-red-900' : 'bg-stop-50 border-stop-200';
  } else if (paymentType === 'ach') {
    const remHours = Math.max(0, 48 - Math.round(elapsedMinutes / 60));
    statusText = `NACHA ACH Recall: ${remHours} hours remaining`;
    subtext = 'Standard SEC return code R06 / R10 eligible within 48-hour federal window.';
    urgencyColor = isDarkMode ? 'text-amber-300' : 'text-check-700';
    badgeBg = isDarkMode ? 'bg-amber-950/60 border-amber-900' : 'bg-check-50 border-check-200';
  } else {
    // P2P
    statusText = 'Instant P2P: Real-time settlement (Irreversible)';
    subtext = 'Network rules do not support consumer recalls once cleared.';
    urgencyColor = isDarkMode ? 'text-red-400' : 'text-stop-700';
    badgeBg = isDarkMode ? 'bg-red-950/60 border-red-900' : 'bg-stop-50 border-stop-200';
  }

  return (
    <div className={`p-3 rounded-xl border ${badgeBg}`}>
      <div className="flex items-center space-x-2">
        <Clock className={`w-4 h-4 shrink-0 ${urgencyColor}`} />
        <span className={`font-mono text-xs font-bold ${urgencyColor}`}>
          {statusText}
        </span>
      </div>
      <p className={`text-[11px] mt-1 pl-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
        {subtext}
      </p>
    </div>
  );
};
