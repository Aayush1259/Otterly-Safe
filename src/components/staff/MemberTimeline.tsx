import React from 'react';
import {
  LogIn,
  KeyRound,
  Phone,
  Mail,
  UserPlus,
  Send,
  ArrowDownLeft,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import type { BankEvent } from '../../types';
import { stamp, money } from '../../lib/format';

interface MemberTimelineProps {
  events: BankEvent[];
  highlightEventId?: string;
  isDarkMode?: boolean;
}

/**
 * MemberTimeline:
 * Dense, chronological audit of member account activities:
 * logins, profile changes, new payees, payments, and retries.
 */
export const MemberTimeline: React.FC<MemberTimelineProps> = ({
  events,
  highlightEventId,
  isDarkMode = false,
}) => {
  const getIcon = (type: BankEvent['type'], isRetry?: boolean) => {
    if (isRetry) return <RotateCcw className="w-3.5 h-3.5 text-amber-500" />;
    switch (type) {
      case 'login':
        return <LogIn className="w-3.5 h-3.5 text-slate-400" />;
      case 'password_reset':
        return <KeyRound className="w-3.5 h-3.5 text-stop-700" />;
      case 'phone_change':
        return <Phone className="w-3.5 h-3.5 text-stop-700" />;
      case 'email_change':
        return <Mail className="w-3.5 h-3.5 text-stop-700" />;
      case 'payee_added':
        return <UserPlus className="w-3.5 h-3.5 text-otter-700" />;
      case 'payment':
        return <Send className="w-3.5 h-3.5 text-kelp-700" />;
      case 'deposit':
        return <ArrowDownLeft className="w-3.5 h-3.5 text-safe-700" />;
      default:
        return <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getLabel = (e: BankEvent) => {
    if (e.retry_of) return `Payment Retry (${e.payment_type?.toUpperCase()})`;
    switch (e.type) {
      case 'login':
        return `Login · ${e.channel || 'mobile'}`;
      case 'password_reset':
        return 'Password Reset by SMS code';
      case 'phone_change':
        return 'Phone Number Updated';
      case 'email_change':
        return 'Email Address Updated';
      case 'payee_added':
        return `New Payee Added: ${e.recipient_name || e.recipient_id}`;
      case 'payment':
        return `Payment: ${money(e.amount || 0)} (${e.payment_type?.toUpperCase()}) to ${e.recipient_name || e.recipient_id}`;
      case 'deposit':
        return `Deposit: ${money(e.amount || 0)} (${e.recipient_name || 'Direct Deposit'})`;
      default:
        return e.type;
    }
  };

  return (
    <div className="space-y-1.5 font-staff max-h-[300px] overflow-y-auto pr-1">
      {events.map((e) => {
        const isTarget = e.event_id === highlightEventId;
        return (
          <div
            key={e.event_id}
            className={`p-2 rounded-lg text-xs flex items-start justify-between border transition-colors ${
              isTarget
                ? isDarkMode
                  ? 'bg-amber-950/40 border-amber-500/60 text-amber-200'
                  : 'bg-check-50 border-check-700/50 text-navy-900 font-semibold'
                : isDarkMode
                  ? 'bg-slate-800/40 border-slate-700/60 text-slate-300'
                  : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-start space-x-2 min-w-0 flex-1">
              <span className="mt-0.5 shrink-0">{getIcon(e.type, !!e.retry_of)}</span>
              <div className="min-w-0">
                <span className="block truncate">{getLabel(e)}</span>
                {e.detail && (
                  <span className={`text-[11px] block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {e.detail}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right shrink-0 pl-2">
              <span className="font-mono text-[11px] opacity-75 block">{stamp(e.timestamp)}</span>
              {e.status && (
                <span
                  className={`text-[10px] font-mono uppercase px-1.5 py-0.2 rounded font-bold ${
                    e.status === 'held'
                      ? 'bg-check-200 text-check-800'
                      : e.status === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-safe-50 text-safe-700'
                  }`}
                >
                  {e.status}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
