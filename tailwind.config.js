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
          // Emerald palette
          'em-cream':  '#F8F4ED',
          'em-forest': '#1B4332',
          'em-gold':   '#C9A961',
          'em-gold-dk':'#8A6F2F',
          'em-sage':   '#6B8E7F',
          'em-body':   '#2A2520',
          'em-muted':  '#6B6356',
          'em-terra':  '#B8694D',
          'em-flame':  '#D85A30',
          'em-dark':   '#0F2E22',
          // Bright palette
          'teal':       '#22A39A',
          'teal-dark':  '#1A8C82',
          'teal-deep':  '#0F4C5C',
          'teal-soft':  '#DCF3EF',
          'teal-pale':  '#7FD8CE',
          'br-gold':    '#F0B429',
          'gold-edge':  '#C8901A',
          'gold-soft':  '#FCEFCF',
          'gold-text':  '#5A3E00',
          'coral':      '#EF6F53',
          'coral-soft': '#FBE5DE',
          'blue':       '#2E6E8E',
          'blue-soft':  '#E0EDF7',
          'canvas':     '#FBFAF6',
          'hero-wash':  '#EAF7F5',
          'surface':    '#FFFFFF',
          'text':       '#173A4A',
          'text-deep':  '#0F4C5C',
          'text-muted': '#5E7480',
          'text-faint': '#94A3AA',
        },
      },
      fontFamily: {
        sans: ['"Source Sans 3"', '"Noto Naskh Arabic"', 'system-ui', '-apple-system', 'sans-serif'],
        arabic: ['"Noto Naskh Arabic"', '"Traditional Arabic"', 'serif'],
      },
      boxShadow: {
        card:        '0 1px 2px rgba(26,35,50,.05), 0 8px 24px rgba(26,35,50,.08)',
        'card-raised': '0 4px 8px rgba(26,35,50,.08), 0 18px 44px rgba(26,35,50,.14)',
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
