import React from 'react';
import { ShieldCheck, Home, ArrowLeftRight, Gamepad2, HelpCircle, Bell, Menu } from 'lucide-react';
import type { Lang, Member } from '../types';

interface SoundAppShellProps {
  children: React.ReactNode;
  member: Member;
  lang: Lang;
  onToggleLang: () => void;
  activeNav?: 'accounts' | 'pay' | 'practice' | 'support';
  onNavSelect?: (tab: 'accounts' | 'pay' | 'practice' | 'support') => void;
  notificationCount?: number;
  onOpenNotifications?: () => void;
  onOpenMenu?: () => void;
}

/**
 * Standard Sound Credit Union mobile app shell.
 * Clean member brand with Notification Bell (unread trivia & reminders)
 * and Hamburger Menu for quick resource navigation.
 */
export const SoundAppShell: React.FC<SoundAppShellProps> = ({
  children,
  member,
  lang,
  onToggleLang,
  activeNav = 'pay',
  onNavSelect,
  notificationCount = 0,
  onOpenNotifications,
  onOpenMenu,
}) => {
  return (
    <div className="flex-1 flex flex-col h-full bg-sand-50 select-none relative">
      {/* Brand Header with Notification Bell & Hamburger Menu */}
      <header className="bg-white border-b border-slate-200/80 px-4 py-2.5 shrink-0 flex items-center justify-between shadow-2xs">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-kelp-700 inline-block shrink-0 shadow-2xs" />
          <h1 className="font-heading font-extrabold text-sm tracking-tight text-navy-900 leading-none">
            Sound Credit Union
          </h1>
        </div>

        <div className="flex items-center space-x-1">
          {/* Unread Trivia & Reminders Bell */}
          <button
            type="button"
            onClick={onOpenNotifications}
            aria-label={`View notifications. ${notificationCount} unread`}
            className="relative p-2 rounded-xl text-slate-700 hover:text-navy-900 hover:bg-sand-100 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            <Bell className="w-4 h-4 text-slate-600" />
            {notificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Resources Hamburger Menu */}
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Open resources and navigation menu"
            className="p-2 rounded-xl text-slate-700 hover:text-navy-900 hover:bg-sand-100 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            <Menu className="w-4 h-4 text-slate-700" />
          </button>
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
