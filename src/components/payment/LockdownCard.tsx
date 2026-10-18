import React from 'react';
import { ShieldAlert, Lock, PhoneCall, AlertOctagon } from 'lucide-react';
import { OllieBubble } from '../OllieBubble';
import type { Lang, Member } from '../../types';

interface LockdownCardProps {
  member: Member;
  lang: Lang;
  onCallSound: () => void;
}

/**
 * LockdownCard:
 * Displayed when Account Takeover signals are detected (password reset + phone change + new payee + large payment).
 * CRITICAL DESIGN RULE:
 * No Ollie check sheet is offered here, because the person holding the phone may be the criminal.
 * New payees are locked until Sound confirms through the contact info on file BEFORE the change.
 */
export const LockdownCard: React.FC<LockdownCardProps> = ({
  member,
  lang,
  onCallSound,
}) => {
  const ollieMessage =
    lang === 'es'
      ? 'Su número de teléfono acaba de cambiar. Los nuevos destinatarios están bloqueados hasta que hablemos.'
      : 'Your phone number just changed. New payees are locked until we hear from you.';

  return (
    <div className="space-y-3.5 select-none animate-fadeIn">
      <OllieBubble
        mood="concerned"
        message={ollieMessage}
        subtext={
          lang === 'es'
            ? 'Protección preventiva de cuenta activada.'
            : 'Preventative account lockdown engaged.'
        }
      />

      {/* High-visibility Lockdown Banner */}
      <div className="bg-stop-50 border-2 border-stop-700/60 rounded-2xl p-4 shadow-sm text-navy-900 space-y-3">
        <div className="flex items-center space-x-2 text-stop-700">
          <AlertOctagon className="w-5 h-5 shrink-0" />
          <h2 className="font-heading font-extrabold text-sm uppercase tracking-wide">
            {lang === 'es' ? 'Nuevos Destinatarios Bloqueados' : 'New Payees Locked'}
          </h2>
        </div>

        <p className="text-xs font-body font-semibold text-navy-900 leading-relaxed">
          {lang === 'es' ? (
            <>
              Detectamos un cambio de contraseña y de teléfono móvil a las 2:05 am. Por seguridad de sus fondos, las transferencias a nuevos destinatarios están retenidas.
            </>
          ) : (
            <>
              We detected a password reset and phone number update at 2:05 am. To protect your money, all transfers to unverified payees are frozen.
            </>
          )}
        </p>

        <div className="bg-white border border-stop-200 rounded-xl p-3 text-xs space-y-1.5">
          <div className="flex items-center space-x-1.5 text-stop-700 font-bold">
            <Lock className="w-3.5 h-3.5" />
            <span>Verification in Progress</span>
          </div>
          <p className="text-[11px] text-slate-600">
            A confirmation notice was transmitted to your primary email on file (<strong>{member.email_on_file}</strong>) registered prior to today’s update.
          </p>
        </div>
      </div>

      {/* Member Action */}
      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={onCallSound}
          className="w-full min-h-[48px] bg-stop-700 hover:bg-red-800 text-white font-heading font-extrabold text-sm rounded-full shadow-md flex items-center justify-center space-x-2 transition-transform active:scale-[0.98]"
        >
          <PhoneCall className="w-4 h-4" />
          <span>{lang === 'es' ? 'Llamar a Sound para desbloquear' : 'Call Sound to Verify (253) 555-0100'}</span>
        </button>

        <div className="text-center">
          <span className="text-[11px] text-slate-500 font-medium">
            Available 24/7 · Priority Identity Verification Team
          </span>
        </div>
      </div>
    </div>
  );
};
