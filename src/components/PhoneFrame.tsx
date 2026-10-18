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
      className={`relative mx-auto w-[393px] max-w-full h-[852px] bg-slate-950 rounded-[56px] p-3 shadow-2xl border-[4px] border-slate-800 ring-1 ring-white/15 flex flex-col select-none shrink-0 overflow-hidden ${className}`}
      role="region"
      aria-label={title}
    >
      {/* Outer titanium rim sheen */}
      <div className="absolute inset-0 rounded-[52px] pointer-events-none border border-white/10" />

      {/* Screen container */}
      <div className="relative w-full h-full bg-sand-50 rounded-[44px] overflow-hidden flex flex-col text-navy-900 shadow-inner">
        {/* iPhone 17 Pro Dynamic Island */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-full z-50 flex items-center justify-between px-3.5 shadow-md pointer-events-none">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900/90 border border-slate-800" />
          <div className="w-3.5 h-3.5 rounded-full bg-slate-950 border border-slate-800/90 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-950/90 ring-1 ring-indigo-500/20" />
          </div>
        </div>

        {/* Status Bar */}
        <div
          className="relative z-40 w-full h-11 px-7 flex items-center justify-between text-xs font-semibold text-navy-900 shrink-0 pt-1"
          aria-hidden="true"
        >
          <span className="font-heading font-black text-xs tracking-tight">{time}</span>
          <div className="flex items-center space-x-1.5">
            <Signal className="w-3.5 h-3.5 text-navy-900" />
            <span className="text-[10px] font-heading font-extrabold text-navy-900">5G</span>
            <Wifi className="w-3.5 h-3.5 text-navy-900" />
            <div className="flex items-center space-x-0.5">
              <span className="text-[10px] font-mono font-bold">100%</span>
              <Battery className="w-4 h-4 text-safe-700 fill-safe-700" />
            </div>
          </div>
        </div>

        {/* Screen Content */}
        <div className="relative flex-1 flex flex-col overflow-y-auto overflow-x-hidden">
          {children}
        </div>

        {/* iPhone Swipe Home Indicator */}
        <div className="w-full h-5 flex items-center justify-center shrink-0 pb-1" aria-hidden="true">
          <div className="w-36 h-1 bg-slate-400/90 rounded-full" />
        </div>
      </div>
    </div>
  );
};
