/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        uplift: {
          50: '#eef9f4',
          100: '#d7f1e3',
          200: '#b1e3c9',
          300: '#7fceaa',
          400: '#4fb489',
          500: '#2e9b70',
          600: '#1f7d5a',
          700: '#1a6349',
          800: '#184f3c',
          900: '#154232',
        },
        sky: {
          500: '#3b82f6',
        },
      },
      fontFamily: {
        sans: ['"Inter"', '"Noto Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.35)',
        'glass-lg': '0 20px 60px rgba(0, 0, 0, 0.55)',
        glow: '0 0 24px rgba(79, 180, 137, 0.35)',
        'glow-lg': '0 0 48px rgba(79, 180, 137, 0.45)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'fade-in': {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'fade-in': 'fade-in 0.4s ease-out',
      },
    },
  },
  plugins: [],
};
