/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /** electric blue — primary glow */
        brand: '#3D81E3',
        /** deep blue → cyan lighting ramp */
        azure: {
          deep: '#0B2551',
          ice: '#A4F4FD',
          cyan: '#00d2ff',
        },
        /** Robinhood Chain inspired secondary accent — used sparingly */
        mint: {
          DEFAULT: '#2F9E75',
          soft: '#6FD3A8',
        },
        /** neutral stack: deep black → dark glass */
        ink: {
          900: '#000000',
          800: '#050505',
          700: '#08090B',
          600: '#111318',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Geist', 'Suisse Intl', 'Neue Montreal', 'Helvetica Neue', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'JetBrains Mono', 'Menlo', 'monospace'],
      },
      maxWidth: {
        shell: '1440px',
      },
      /**
       * Allow any integer opacity modifier (e.g. text-white/45, border-white/12).
       * The default scale only ships 0/5/10/20/25/... so bare values like /45
       * would otherwise silently produce no class.
       */
      opacity: Object.fromEntries(
        Array.from({ length: 101 }, (_, i) => [i, String(i / 100)]),
      ),
    },
  },
  plugins: [],
};
