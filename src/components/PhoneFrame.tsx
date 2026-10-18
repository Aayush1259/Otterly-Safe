import React from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface PhoneFrameProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  time?: string;
}

/**
 * 390×844 standard mobile device frame.
 * Clean, modern bezel with rounded corners, dynamic island notch,
 * and high-contrast system status bar.
 */
export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  title = 'Sound Credit Union Mobile',
  className = '',
  time = '9:41',
}) => {
  return (
    <div
      className={`relative mx-auto w-full max-w-[390px] h-[min(844px,calc(100dvh-100px))] sm:h-[844px] bg-slate-900 rounded-[38px] sm:rounded-[50px] p-2 sm:p-3 shadow-phone border-[3px] sm:border-[4px] border-slate-700/80 flex flex-col select-none shrink-0 overflow-hidden ${className}`}
      role="region"
      aria-label={title}
    >
      {/* Outer rim glare simulation */}
      <div className="absolute inset-0 rounded-[34px] sm:rounded-[46px] pointer-events-none border border-white/10" />

      {/* Screen container */}
      <div className="relative w-full h-full bg-sand-50 rounded-[30px] sm:rounded-[38px] overflow-hidden flex flex-col text-navy-900">
        {/* Dynamic Island / Speaker Pill */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 sm:w-28 h-5 sm:h-6 bg-slate-950 rounded-full z-50 flex items-center justify-between px-2.5 sm:px-3">
          <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-slate-800" />
          <div className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
            <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-sky-950/80" />
          </div>
        </div>

        {/* Status Bar */}
        <div
          className="relative z-40 w-full h-10 sm:h-11 px-5 sm:px-7 flex items-center justify-between text-xs font-semibold text-navy-900 shrink-0 pt-1"
          aria-hidden="true"
        >
          <span className="font-heading font-bold text-xs sm:text-sm tracking-tight">{time}</span>
          <div className="flex items-center space-x-1 sm:space-x-1.5">
            <Signal className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
            <Wifi className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
            <div className="flex items-center space-x-0.5">
              <span className="text-[9px] sm:text-[10px] font-mono">100%</span>
              <Battery className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-safe-700 fill-safe-700" />
            </div>
          </div>
        </div>

        {/* Screen Content */}
        <div className="relative flex-1 flex flex-col overflow-y-auto overflow-x-hidden">
          {children}
        </div>

        {/* Bottom Home Indicator */}
        <div className="w-full h-4 sm:h-5 flex items-center justify-center shrink-0 pb-1" aria-hidden="true">
          <div className="w-28 sm:w-32 h-1 bg-slate-400/80 rounded-full" />
        </div>
      </div>
    </div>
  );
};
