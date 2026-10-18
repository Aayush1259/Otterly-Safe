import React from 'react';
import { Ollie, type OllieMood } from './Ollie';

interface OllieBubbleProps {
  mood?: OllieMood;
  message: string;
  subtext?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'row' | 'column';
}

/**
 * Ollie's speech bubble.
 * Announced dynamically to screen readers via aria-live="polite".
 * Follows Kelp UI voice rules: calm, kind, clear, 15 words or fewer per core message.
 */
export const OllieBubble: React.FC<OllieBubbleProps> = ({
  mood = 'wave',
  message,
  subtext,
  className = '',
  size = 'md',
  layout = 'row',
}) => {
  const otterSizes = {
    sm: 56,
    md: 72,
    lg: 88,
  };

  return (
    <div
      className={`flex ${layout === 'column' ? 'flex-col items-center text-center' : 'items-start space-x-3.5'} ${className}`}
      role="region"
      aria-label="Ollie the otter guidance"
    >
      <div className="shrink-0 flex items-center justify-center">
        <Ollie mood={mood} size={otterSizes[size]} />
      </div>

      <div className="relative flex-1">
        <div
          className="bg-white border-2 border-kelp-700/25 rounded-2xl p-3.5 sm:p-4 shadow-soft text-navy-900"
          aria-live="polite"
          aria-atomic="true"
        >
          {/* Subtle speech pointer triangle */}
          {layout === 'row' && (
            <div
              className="absolute -left-2 top-5 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white drop-shadow-[-2px_0_1px_rgba(15,118,110,0.15)]"
              aria-hidden="true"
            />
          )}

          <div className="flex items-center space-x-2 mb-1">
            <span className="font-heading font-extrabold text-sm text-kelp-700 uppercase tracking-wider">
              Ollie
            </span>
            <span className="text-xs bg-kelp-50 text-kelp-700 font-semibold px-2 py-0.5 rounded-full border border-kelp-200">
              Sound Safety Guide
            </span>
          </div>

          <p className="font-body text-member font-semibold text-navy-900 leading-snug">
            {message}
          </p>

          {subtext && (
            <p className="font-body text-sm text-slate-600 mt-1 leading-normal">
              {subtext}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
