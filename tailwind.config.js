/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        deany: {
          white:       '#FFFFFF',
          cream:       '#FAF8F5',
          ivory:       '#F5F1EC',
          navy:        '#1A2332',
          steel:       '#4A5568',
          muted:       '#94a0b0',
          gold:        '#C9A84C',
          'gold-light':'#F5EDD4',
          sage:        '#7C9A82',
          'sage-light':'#EEF3EF',
          border:      '#E8E4DF',
          error:       '#C53030',
          'error-light':'#FEF2F2',
          'gold-tint': '#FFF8E7',
        },
      },
      fontFamily: {
        sans: ['"Source Sans 3"', 'system-ui', '-apple-system', 'sans-serif'],
        arabic: ['"Noto Naskh Arabic"', '"Traditional Arabic"', 'serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'fade-in':   'fadeIn 300ms ease-out',
        'slide-up':  'slideUp 300ms ease-out',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(201, 168, 76, 0.4)' },
          '50%':      { boxShadow: '0 0 0 12px rgba(201, 168, 76, 0)' },
        },
      },
    },
  },
  plugins: [],
};
