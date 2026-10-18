import React from 'react';

export type OllieMood = 'wave' | 'think' | 'concerned' | 'cheer' | 'sleep';

interface OllieProps {
  mood?: OllieMood;
  size?: number | string;
  className?: string;
  animated?: boolean;
}

/**
 * Ollie the sea otter mascot.
 * Built entirely from clean, original SVG geometric shapes.
 * Tagline: "Otterly safe, every wave of life."
 * 5 distinct emotional states for high-empathy communication.
 */
export const Ollie: React.FC<OllieProps> = ({
  mood = 'wave',
  size = 96,
  className = '',
  animated = true,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={`Ollie the otter (${mood} mood)`}
      className={`inline-block select-none overflow-visible ${className}`}
    >
      <defs>
        {/* Soft radial shadow under Ollie */}
        <radialGradient id="otterShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0B2545" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#0B2545" stopOpacity="0" />
        </radialGradient>

        {/* Sea kelp leaf gradient */}
        <linearGradient id="kelpGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2DD4BF" />
          <stop offset="100%" stopColor="#0F766E" />
        </linearGradient>
      </defs>

      {/* Ground drop shadow */}
      <ellipse cx="60" cy="112" rx="42" ry="7" fill="url(#otterShadow)" />

      {/* Sleep mood kelp raft */}
      {mood === 'sleep' && (
        <g opacity="0.9">
          <path
            d="M 15 106 C 30 96, 50 114, 75 102 C 95 92, 110 108, 115 106"
            stroke="url(#kelpGrad)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <circle cx="28" cy="98" r="4" fill="#14B8A6" />
          <circle cx="98" cy="99" r="4.5" fill="#0D9488" />
        </g>
      )}

      {/* Body */}
      <ellipse
        cx="60"
        cy={mood === 'sleep' ? 76 : 78}
        rx="36"
        ry={mood === 'sleep' ? '28' : '33'}
        fill="#7C4A2D"
      />

      {/* Tummy (soft warm cream fur patch) */}
      <ellipse
        cx="60"
        cy={mood === 'sleep' ? 77 : 80}
        rx="23"
        ry={mood === 'sleep' ? '18' : '23'}
        fill="#F3E3D3"
      />

      {/* Floating shell / pebble held on chest for cheer/think */}
      {(mood === 'cheer' || mood === 'wave') && (
        <ellipse cx="60" cy="88" rx="8" ry="6" fill="#F87171" opacity="0.85" />
      )}

      {/* Ears */}
      {/* Left ear */}
      <circle cx="34" cy="38" r="10" fill="#7C4A2D" />
      <circle cx="34" cy="38" r="6" fill="#E2C3A4" />
      {/* Right ear */}
      <circle cx="86" cy="38" r="10" fill="#7C4A2D" />
      <circle cx="86" cy="38" r="6" fill="#E2C3A4" />

      {/* Head */}
      <ellipse
        cx="60"
        cy={mood === 'think' ? 47 : 46}
        rx="32"
        ry="28"
        fill="#7C4A2D"
        transform={mood === 'think' ? 'rotate(-4 60 47)' : undefined}
      />

      {/* Muzzle (snout) */}
      <ellipse
        cx="60"
        cy={mood === 'think' ? 53 : 52}
        rx="18"
        ry="13"
        fill="#F3E3D3"
      />

      {/* Nose */}
      <path
        d={
          mood === 'think'
            ? 'M 54 48 C 54 48, 60 46, 66 48 C 65 53, 55 53, 54 48 Z'
            : 'M 54 47 C 54 47, 60 45, 66 47 C 65 52, 55 52, 54 47 Z'
        }
        fill="#0B2545"
      />

      {/* Whiskers */}
      <path
        d="M 46 53 L 32 51 M 46 56 L 31 57 M 46 59 L 33 63"
        stroke="#7C4A2D"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path
        d="M 74 53 L 88 51 M 74 56 L 89 57 M 74 59 L 87 63"
        stroke="#7C4A2D"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.75"
      />

      {/* Mouth & Expressions */}
      {mood === 'cheer' && (
        <path
          d="M 52 54 Q 60 63 68 54"
          stroke="#0B2545"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="#B91C1C"
        />
      )}
      {mood === 'wave' && (
        <path
          d="M 54 54 Q 60 60 66 54"
          stroke="#0B2545"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
      )}
      {mood === 'concerned' && (
        <path
          d="M 54 57 Q 60 52 66 57"
          stroke="#0B2545"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      )}
      {mood === 'think' && (
        <path
          d="M 55 56 Q 60 58 65 55"
          stroke="#0B2545"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
      )}
      {mood === 'sleep' && (
        <path
          d="M 56 55 Q 60 57 64 55"
          stroke="#0B2545"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
      )}

      {/* Eyes */}
      {mood === 'sleep' ? (
        // Gentle sleeping curved lines
        <g stroke="#0B2545" strokeWidth="2.5" strokeLinecap="round">
          <path d="M 44 42 Q 50 46 53 42" />
          <path d="M 67 42 Q 70 46 76 42" />
        </g>
      ) : mood === 'concerned' ? (
        // Wide alert concerned eyes with catchlight
        <g>
          {/* Eyebrows angled with worry */}
          <path d="M 42 34 Q 48 37 53 36" stroke="#0B2545" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M 78 34 Q 72 37 67 36" stroke="#0B2545" strokeWidth="2" strokeLinecap="round" fill="none" />
          <circle cx="48" cy="40" r="5" fill="#0B2545" />
          <circle cx="72" cy="40" r="5" fill="#0B2545" />
          <circle cx="46.5" cy="38.5" r="1.8" fill="#FFFFFF" />
          <circle cx="70.5" cy="38.5" r="1.8" fill="#FFFFFF" />
        </g>
      ) : mood === 'think' ? (
        // Thinking eyes glancing up
        <g>
          <path d="M 43 35 Q 49 33 54 36" stroke="#0B2545" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M 66 37 Q 71 34 77 35" stroke="#0B2545" strokeWidth="2" strokeLinecap="round" fill="none" />
          <circle cx="49" cy="39" r="4.5" fill="#0B2545" />
          <circle cx="71" cy="39" r="4.5" fill="#0B2545" />
          <circle cx="48" cy="37.5" r="1.6" fill="#FFFFFF" />
          <circle cx="70" cy="37.5" r="1.6" fill="#FFFFFF" />
        </g>
      ) : (
        // Bright friendly eyes (wave & cheer)
        <g>
          <circle cx="48" cy="40" r="4.5" fill="#0B2545" />
          <circle cx="72" cy="40" r="4.5" fill="#0B2545" />
          <circle cx="46.5" cy="38.5" r="1.8" fill="#FFFFFF" />
          <circle cx="70.5" cy="38.5" r="1.8" fill="#FFFFFF" />
          {/* Soft rosy cheeks */}
          <circle cx="39" cy="48" r="4" fill="#F87171" opacity="0.35" />
          <circle cx="81" cy="48" r="4" fill="#F87171" opacity="0.35" />
        </g>
      )}

      {/* Arms & Paws */}
      {mood === 'wave' && (
        <g>
          {/* Left resting paw */}
          <ellipse cx="44" cy="74" rx="7" ry="10" fill="#9A6440" transform="rotate(20 44 74)" />
          {/* Right waving paw */}
          <g className={animated ? 'origin-[78px_74px] animate-bounce' : ''}>
            <ellipse cx="86" cy="62" rx="7.5" ry="11" fill="#9A6440" transform="rotate(-35 86 62)" />
            {/* Paw pads */}
            <circle cx="88" cy="58" r="2.5" fill="#F3E3D3" />
            <circle cx="84" cy="56" r="1.3" fill="#F3E3D3" />
            <circle cx="89" cy="54" r="1.3" fill="#F3E3D3" />
            <circle cx="92" cy="58" r="1.3" fill="#F3E3D3" />
          </g>
        </g>
      )}

      {mood === 'cheer' && (
        <g>
          {/* Both paws raised high in celebration */}
          <ellipse cx="32" cy="52" rx="7.5" ry="12" fill="#9A6440" transform="rotate(-30 32 52)" />
          <ellipse cx="88" cy="52" rx="7.5" ry="12" fill="#9A6440" transform="rotate(30 88 52)" />
          {/* Paw pads */}
          <circle cx="30" cy="47" r="2.2" fill="#F3E3D3" />
          <circle cx="90" cy="47" r="2.2" fill="#F3E3D3" />
        </g>
      )}

      {mood === 'concerned' && (
        <g>
          {/* Both paws clasped warmly over heart / safe money */}
          <ellipse cx="52" cy="76" rx="8" ry="10" fill="#9A6440" transform="rotate(25 52 76)" />
          <ellipse cx="68" cy="76" rx="8" ry="10" fill="#9A6440" transform="rotate(-25 68 76)" />
          {/* Tiny protective shield badge on paw */}
          <path
            d="M 60 70 L 64 72 L 64 77 Q 60 81 60 81 Q 56 77 56 72 Z"
            fill="#0F766E"
          />
        </g>
      )}

      {mood === 'think' && (
        <g>
          {/* Left resting paw */}
          <ellipse cx="42" cy="76" rx="7" ry="10" fill="#9A6440" transform="rotate(20 42 76)" />
          {/* Right paw tapped on chin in thoughtful deduction */}
          <ellipse cx="70" cy="62" rx="7" ry="9" fill="#9A6440" transform="rotate(-40 70 62)" />
        </g>
      )}

      {mood === 'sleep' && (
        <g>
          {/* Paws curled peacefully on belly holding a clam */}
          <ellipse cx="53" cy="78" rx="6" ry="8" fill="#9A6440" transform="rotate(40 53 78)" />
          <ellipse cx="67" cy="78" rx="6" ry="8" fill="#9A6440" transform="rotate(-40 67 78)" />
          <path
            d="M 88 28 L 94 28 L 88 34 L 94 34"
            stroke="#0F766E"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.8"
          />
          <path
            d="M 98 18 L 103 18 L 98 23 L 103 23"
            stroke="#0F766E"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.6"
          />
        </g>
      )}
    </svg>
  );
};
