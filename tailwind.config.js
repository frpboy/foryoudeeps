/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      colors: {
        matcha: {
          950: '#07150F',
          900: '#0B2117',
          800: '#123324',
          700: '#1A4531',
          600: '#255B40',
          500: '#347554',
        },
        deepred: {
          900: '#5C1119',
          800: '#751722',
          700: '#9B2430',
          500: '#C94A55',
          300: '#E07A84',
        },
        cream: {
          50: '#FFFDF5',
          100: '#F8F0DD',
          200: '#EBDDBF',
          300: '#D8C8A6',
        },
        ink: '#1B1A16',
        muted: '#6F6A5F',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        handwritten: ['"Caveat"', 'cursive'],
      },
      borderRadius: {
        '4xl': '32px',
      },
      boxShadow: {
        'soft': '0 4px 24px -12px rgba(7, 21, 15, 0.25)',
        'card': '0 8px 40px -16px rgba(7, 21, 15, 0.35)',
        'modal': '0 24px 80px -24px rgba(0, 0, 0, 0.5)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 500ms ease-out forwards',
        'fade-up': 'fade-up 600ms ease-out forwards',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
