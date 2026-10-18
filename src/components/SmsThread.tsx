import React from 'react';
import { ShieldAlert, Mail, MessageSquare, Lock } from 'lucide-react';
import type { Lang, Member } from '../types';

interface SmsThreadProps {
  member: Member;
  mode: 'sms' | 'email';
  lang: Lang;
  time?: string;
  scenario?: string;
}

/**
 * Second phone display:
 * Shows either the trusted contact's inbound SMS notification,
 * or the "email on file before change" alert for Account Takeover.
 * Core privacy rule: trusted contacts NEVER see account balances or payment amounts.
 */
export const SmsThread: React.FC<SmsThreadProps> = ({
  member,
  mode,
  lang,
  time = '10:43 am',
  scenario = '',
}) => {
  const isTakeover = mode === 'email' || scenario === 'takeover';
  const contact = member.trusted_contact;

  return (
    <div className="w-[300px] h-[640px] bg-slate-900 rounded-[38px] p-2.5 shadow-phone border-2 border-slate-700 flex flex-col shrink-0 select-none overflow-hidden">
      {/* Mini Screen Container */}
      <div className="w-full h-full bg-slate-100 rounded-[30px] overflow-hidden flex flex-col text-slate-800">
        {/* Notch & Mini Status Bar */}
        <div className="bg-slate-200 px-4 py-1.5 flex items-center justify-between text-[11px] font-semibold text-slate-700">
          <span>9:42</span>
          <div className="flex items-center space-x-1">
            <span className="text-[10px] uppercase font-mono">{isTakeover ? 'Mail' : 'SMS'}</span>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-3 py-2.5 flex items-center space-x-2.5 shadow-sm">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-white ${
              isTakeover ? 'bg-stop-700' : 'bg-kelp-700'
            }`}
          >
            {isTakeover ? <Mail className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xs font-bold text-navy-900 truncate">
              {isTakeover
                ? member.email_on_file || 'email.on.file@example.com'
                : contact
                  ? `${contact.name} (${contact.relation})`
                  : 'Trusted Contact (SMS)'}
            </h2>
            <p className="text-[10px] text-slate-500 truncate">
              {isTakeover ? 'Alert: Contact on file prior to change' : 'Sound Credit Union verified alert'}
            </p>
          </div>
        </div>

        {/* Privacy badge */}
        <div className="bg-sand-100 border-b border-sand-200 px-2.5 py-1 text-[10px] text-slate-700 flex items-center justify-center space-x-1">
          <Lock className="w-3 h-3 text-otter-700" />
          <span>Privacy guard: No balance or payee shared</span>
        </div>

        {/* Message Thread Body */}
        <div className="flex-1 p-3 overflow-y-auto space-y-3 flex flex-col justify-end">
          <div className="text-center">
            <span className="text-[10px] font-mono text-slate-600 bg-slate-200/60 px-2 py-0.5 rounded-full">
              Today {time}
            </span>
          </div>

          {isTakeover ? (
            // Email on file before change
            <div className="bg-white border border-stop-200 rounded-2xl p-3.5 shadow-sm space-y-2">
              <div className="flex items-center space-x-1.5 text-stop-700 text-xs font-bold font-heading">
                <ShieldAlert className="w-4 h-4" />
                <span>Security Notice: Phone Number Changed</span>
              </div>
              <p className="text-xs text-navy-900 font-body leading-relaxed">
                {lang === 'es' ? (
                  <>
                    Hola <strong>{member.display_name}</strong>: ¿Cambió usted su número de teléfono recientemente? Si <strong>no</strong> lo hizo, llame a Sound Credit Union de inmediato al <strong>(253) 555-0100</strong>. Sus nuevos destinatarios están bloqueados preventivamente.
                  </>
                ) : (
                  <>
                    Hello <strong>{member.display_name}</strong>: Did you change your phone number? If not, call Sound Credit Union immediately at <strong>(253) 555-0100</strong>. New payees are locked until we confirm with you.
                  </>
                )}
              </p>
              <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                Delivered to the verified email registered before today’s request.
              </div>
            </div>
          ) : (
            // Trusted contact SMS
            <div className="bg-white border border-kelp-200 rounded-2xl p-3.5 shadow-sm space-y-2">
              <div className="flex items-center space-x-1.5 text-kelp-700 text-xs font-bold font-heading">
                <ShieldAlert className="w-4 h-4 text-kelp-700" />
                <span>Sound Credit Union Alert</span>
              </div>
              <p className="text-xs text-navy-900 font-body leading-relaxed">
                {lang === 'es' ? (
                  <>
                    Sound pausó un pago para <strong>{member.display_name}</strong>. Por favor llámelos a un número que ya tenga guardado. No haga clic en enlaces.
                  </>
                ) : (
                  <>
                    Sound paused a payment for <strong>{member.display_name}</strong>. Please call them on a number you already have. Don't click links.
                  </>
                )}
              </p>
              <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-100">
                Automated family guardian notification. No funds have left the account.
              </div>
            </div>
          )}
        </div>

        {/* Bottom indicator */}
        <div className="bg-white border-t border-slate-200 p-2 flex items-center justify-center text-[11px] text-slate-400">
          <span>Read-only notification channel</span>
        </div>
      </div>
    </div>
  );
};
