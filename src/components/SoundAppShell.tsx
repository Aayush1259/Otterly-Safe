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
      {/* Brand Header: Hamburger Menu (Top Left), Brand (Center-Left), Bell with Red Dot (Top Right) */}
      <header className="bg-white border-b border-slate-200/80 px-3 py-2.5 shrink-0 flex items-center justify-between shadow-2xs">
        {/* Top Left: Hamburger Menu */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onOpenMenu}
            aria-label="Open resources menu"
            className="p-2 -ml-1 rounded-xl text-navy-900 hover:bg-sand-100 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center active:scale-95"
          >
            <Menu className="w-5 h-5 text-navy-900" />
          </button>

          {/* Sound Credit Union Brand */}
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-kelp-700 inline-block shrink-0 shadow-2xs" />
            <h1 className="font-heading font-black text-sm tracking-tight text-navy-900 leading-none">
              Sound Credit Union
            </h1>
          </div>
        </div>

        {/* Top Right: Notification Bell with Red Dot */}
        <button
          type="button"
          onClick={onOpenNotifications}
          aria-label={`View notifications. ${notificationCount > 0 ? `${notificationCount} unread` : 'No unread'}`}
          className="relative p-2 rounded-xl text-navy-900 hover:bg-sand-100 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center active:scale-95"
        >
          <Bell className="w-5 h-5 text-slate-700" />
          {notificationCount > 0 && (
            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
          )}
        </button>
      </header>



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
