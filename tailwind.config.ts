import type { Config } from 'tailwindcss';

/**
 * Kelp UI — "calm, kind, clear".
 * Every text colour here passes WCAG AA (≥ 4.5:1) on its intended background.
 * Placeholder palette: swap in Sound's official brand colours if Sound provides them.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        kelp: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          600: '#0D9488',
          700: '#0F766E', // primary buttons, links, Ollie highlights (5.5:1 on white)
          800: '#115E59',
          900: '#134E4A',
        },
        navy: {
          900: '#0B2545', // headings + body text (15.4:1 on white)
        },
        otter: {
          100: '#F3E3D3',
          200: '#E2C3A4',
          400: '#B07A52',
          500: '#9A6440',
          700: '#7C4A2D', // mascot details + badges (7.3:1 on white)
        },
        sand: {
          50: '#FFF8EE', // warm page background
          100: '#FBEEDB',
          200: '#F3DFC3',
        },
        foam: {
          50: '#ECFDF5', // "your money is safe" panels
          200: '#A7F3D0',
        },
        safe: {
          50: '#F0FDF4',
          700: '#15803D', // sent, done
        },
        check: {
          50: '#FEF3C7', // background for "paused, let's check"
          200: '#FCD34D',
          700: '#B45309', // bold or 18px+ only
          800: '#92400E',
        },
        stop: {
          50: '#FEE2E2', // takeover lock only
          200: '#FCA5A5',
          700: '#B91C1C',
        },
        info: {
          300: '#93C5FD', // staff links on dark mode
          700: '#1D4ED8', // staff console links
        },
        ink: {
          100: '#E2E8F0', // staff dark-mode text
          800: '#1E293B',
          900: '#0F172A', // staff dark-mode background
        },
      },
      fontFamily: {
        heading: ['Nunito', 'ui-rounded', 'system-ui', 'sans-serif'],
        body: ['"Atkinson Hyperlegible"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        member: ['18px', '1.5'],
        staff: ['16px', '1.45'],
      },
      borderRadius: {
        card: '16px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(11,37,69,0.06), 0 4px 16px rgba(11,37,69,0.08)',
        lift: '0 2px 4px rgba(11,37,69,0.08), 0 12px 32px rgba(11,37,69,0.12)',
        phone: '0 0 0 2px #1f3352, 0 24px 60px rgba(11,37,69,0.28)',
      },
      transitionDuration: {
        DEFAULT: '250ms',
        calm: '250ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config;
