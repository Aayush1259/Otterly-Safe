import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

export interface PhoneFrameProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  time?: string;
  autoFit?: boolean;
  scale?: number;
  statusBarBg?: string;
}

/**
 * 350×720 authentic 19.5:9 flagship mobile device chassis.
 * Equipped with responsive auto-fit scaling so the entire device
 * (from Dynamic Island at top to home indicator bar at bottom)
 * fits perfectly on any screen height with zero cutoff.
 */
export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  title = 'Sound Credit Union Mobile',
  className = '',
  time = '9:41',
  autoFit = true,
  scale: explicitScale,
  statusBarBg = 'bg-white',
}) => {
  const [computedScale, setComputedScale] = useState(1);

  useEffect(() => {
    if (!autoFit || typeof window === 'undefined') return;

    const calculateScale = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;

      // Available vertical space: window height minus header (~48px), 
      // compact page padding (~8px), and utility pills/margins (~38px) = ~94px.
      // We reserve 100px so there is comfortable breathing room.
      const availableH = Math.max(340, vh - 100);
      const availableW = Math.max(200, vw - 24);

      const baseH = 720;
      const baseW = 350;

      const scaleH = availableH / baseH;
      const scaleW = availableW / baseW;

      // Keep scale strictly between 0.55 and 1.0 (fitting completely inside viewport)
      const optimalScale = Math.min(1.0, Math.max(0.55, Math.min(scaleH, scaleW)));
      setComputedScale(Number(optimalScale.toFixed(3)));
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, [autoFit]);

  const activeScale = explicitScale !== undefined ? explicitScale : (autoFit ? computedScale : 1);

  return (
    <div
      className="relative mx-auto flex items-center justify-center shrink-0 transition-all duration-200 ease-out isolate"
      style={{
        width: Math.round(350 * activeScale),
        height: Math.round(720 * activeScale),
      }}
    >
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-[350px] h-[720px] bg-slate-950 rounded-[48px] p-2.5 shadow-2xl border-[3.5px] border-slate-800 ring-1 ring-white/15 flex flex-col select-none overflow-hidden origin-top isolate ${className}`}
        style={{
          transform: `scale(${activeScale})`,
          transformOrigin: 'top center',
        }}
        role="region"
        aria-label={title}
      >
        {/* Subtle physical ear speaker slit at top chassis bezel */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-14 h-1 bg-slate-800/90 rounded-full z-10 pointer-events-none" />

        {/* Outer titanium rim sheen */}
        <div className="absolute inset-0 rounded-[44px] pointer-events-none border border-white/10" />

        {/* Screen container */}
        <div className="relative w-full h-full bg-sand-50 rounded-[38px] overflow-hidden flex flex-col text-navy-900 shadow-inner">
          {/* iPhone Dynamic Island */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30 flex items-center justify-between px-3 shadow-md pointer-events-none ring-1 ring-black/40">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900/90 border border-slate-800" />
            <div className="w-3 h-3 rounded-full bg-slate-950 border border-slate-800/90 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-950/90 ring-1 ring-indigo-500/20" />
            </div>
          </div>

          {/* Status Bar */}
          <div
            className={`relative z-20 w-full h-10 px-6 flex items-center justify-between text-xs font-semibold text-navy-900 shrink-0 pt-0.5 ${statusBarBg} border-b border-slate-100/60`}
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
          <div className="w-full h-4 flex items-center justify-center shrink-0 pb-1" aria-hidden="true">
            <div className="w-32 h-1 bg-slate-400/90 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
