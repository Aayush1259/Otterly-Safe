import React from 'react';
import { ShieldCheck, Home, ArrowLeftRight, Gamepad2, HelpCircle } from 'lucide-react';
import type { Lang, Member } from '../types';

interface SoundAppShellProps {
  children: React.ReactNode;
  member: Member;
  lang: Lang;
  onToggleLang: () => void;
  activeNav?: 'accounts' | 'pay' | 'practice' | 'support';
  onNavSelect?: (tab: 'accounts' | 'pay' | 'practice' | 'support') => void;
}

/**
 * Standard Sound Credit Union mobile app shell.
 * Includes text wordmark "Sound Credit Union (prototype)",
 * persistent "Prototype · synthetic data" disclaimer badge,
 * and WCAG 2.2 compliant navigation touch targets (≥ 48px).
 */
export const SoundAppShell: React.FC<SoundAppShellProps> = ({
  children,
  member,
  lang,
  onToggleLang,
  activeNav = 'pay',
  onNavSelect,
}) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-sand-50 select-none">
      {/* Brand & Wordmark Header */}
      <header className="bg-white border-b border-slate-200/80 px-4 py-2.5 shrink-0 flex items-center justify-between shadow-sm">
        <div className="flex flex-col">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-kelp-700 inline-block" />
            <h1 className="font-heading font-extrabold text-sm tracking-tight text-navy-900 leading-none">
              Sound Credit Union
            </h1>
          </div>
          <span className="text-[10px] font-mono font-medium text-slate-500 uppercase tracking-wider pl-4">
            (prototype)
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* EN / ES Language Switch */}
          <button
            type="button"
            onClick={onToggleLang}
            aria-label={`Switch language. Current: ${lang === 'en' ? 'English' : 'Español'}`}
            className="inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-bold font-heading bg-sand-100 hover:bg-sand-200 text-kelp-800 border border-kelp-700/20 transition-colors focus:ring-2 focus:ring-kelp-700 focus:outline-none min-h-[32px]"
          >
            <span className={lang === 'en' ? 'underline font-black' : 'opacity-60'}>EN</span>
            <span className="mx-1 opacity-40">|</span>
            <span className={lang === 'es' ? 'underline font-black' : 'opacity-60'}>ES</span>
          </button>

          {/* Member avatar initials */}
          <div
            className="w-8 h-8 rounded-full bg-kelp-700 text-white flex items-center justify-center text-xs font-heading font-bold shadow-sm"
            title={member.display_name}
          >
            {member.display_name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)}
          </div>
        </div>
      </header>

      {/* Safety Banner strip */}
      <div className="bg-foam-50 border-b border-foam-200/80 px-3 py-1 flex items-center justify-between text-[11px] text-kelp-800 font-medium shrink-0">
        <div className="flex items-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-safe-700 shrink-0" />
          <span>Otterly Safe Active</span>
        </div>
        <span className="text-[10px] font-mono text-slate-600 bg-white/70 px-1.5 py-0.5 rounded border border-slate-200">
          Synthetic Data
        </span>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-4 py-3 flex flex-col">
        {children}
      </main>

      {/* Bottom App Navigation */}
      <nav
        className="bg-white border-t border-slate-200 px-2 py-1.5 shrink-0 flex items-center justify-around shadow-sm"
        aria-label="Mobile app navigation"
      >
        <button
          type="button"
          onClick={() => onNavSelect?.('accounts')}
          className={`flex flex-col items-center justify-center min-w-[54px] min-h-[48px] rounded-xl transition-colors ${
            activeNav === 'accounts' ? 'text-kelp-700 font-bold' : 'text-slate-500 hover:text-navy-900'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-body">{lang === 'es' ? 'Cuentas' : 'Accounts'}</span>
        </button>

        <button
          type="button"
          onClick={() => onNavSelect?.('pay')}
          className={`flex flex-col items-center justify-center min-w-[54px] min-h-[48px] rounded-xl transition-colors ${
            activeNav === 'pay' ? 'text-kelp-700 font-bold' : 'text-slate-500 hover:text-navy-900'
          }`}
        >
          <ArrowLeftRight className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-body">{lang === 'es' ? 'Transferir' : 'Transfer'}</span>
        </button>

        <button
          type="button"
          onClick={() => onNavSelect?.('practice')}
          className={`relative flex flex-col items-center justify-center min-w-[54px] min-h-[48px] rounded-xl transition-colors ${
            activeNav === 'practice' ? 'text-kelp-700 font-bold' : 'text-slate-500 hover:text-navy-900'
          }`}
        >
          <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-otter-700 ring-2 ring-white" />
          <Gamepad2 className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-body">{lang === 'es' ? 'Practicar' : 'Practice'}</span>
        </button>

        <button
          type="button"
          onClick={() => onNavSelect?.('support')}
          className={`flex flex-col items-center justify-center min-w-[54px] min-h-[48px] rounded-xl transition-colors ${
            activeNav === 'support' ? 'text-kelp-700 font-bold' : 'text-slate-500 hover:text-navy-900'
          }`}
        >
          <HelpCircle className="w-5 h-5 mb-0.5" />
          <span className="text-[11px] font-body">{lang === 'es' ? 'Ayuda' : 'Support'}</span>
        </button>
      </nav>
    </div>
  );
};
