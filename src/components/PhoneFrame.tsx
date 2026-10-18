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
      className={`relative mx-auto w-full max-w-md sm:max-w-[390px] h-[calc(100dvh-115px)] sm:h-[min(844px,calc(100dvh-125px))] min-h-[560px] bg-transparent sm:bg-slate-900 rounded-2xl sm:rounded-[48px] p-0 sm:p-3 sm:shadow-phone sm:border-[4px] sm:border-slate-800 flex flex-col select-none shrink-0 overflow-hidden ${className}`}
      role="region"
      aria-label={title}
    >
      {/* Outer rim glare simulation (desktop chassis only) */}
      <div className="hidden sm:block absolute inset-0 rounded-[44px] pointer-events-none border border-white/10" />

      {/* Screen container */}
      <div className="relative w-full h-full bg-sand-50 rounded-2xl sm:rounded-[36px] overflow-hidden flex flex-col text-navy-900 shadow-sm sm:shadow-none border border-slate-200 sm:border-0">
        {/* Dynamic Island / Speaker Pill (desktop chassis only) */}
        <div className="hidden sm:flex absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-950 rounded-full z-50 items-center justify-between px-3 pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
          <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-sky-950/80" />
          </div>
        </div>

        {/* Status Bar (Desktop chassis only; mobile uses the user's native device bar) */}
        <div
          className="hidden sm:flex relative z-40 w-full h-10 px-7 items-center justify-between text-xs font-semibold text-navy-900 shrink-0 pt-1"
          aria-hidden="true"
        >
          <span className="font-heading font-bold text-xs tracking-tight">{time}</span>
          <div className="flex items-center space-x-1.5">
            <Signal className="w-3.5 h-3.5" />
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center space-x-0.5">
              <span className="text-[10px] font-mono">100%</span>
              <Battery className="w-4 h-4 text-safe-700 fill-safe-700" />
            </div>
          </div>
        </div>

        {/* Screen Content */}
        <div className="relative flex-1 flex flex-col overflow-y-auto overflow-x-hidden">
          {children}
        </div>

        {/* Bottom Home Indicator (Desktop chassis only) */}
        <div className="hidden sm:flex w-full h-4 items-center justify-center shrink-0 pb-1" aria-hidden="true">
          <div className="w-32 h-1 bg-slate-400/80 rounded-full" />
        </div>
      </div>
    </div>
  );
};
