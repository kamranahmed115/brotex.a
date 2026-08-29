/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        // Surfaces — deep, sophisticated dark system
        ink: {
          950: '#0A0B0E',
          900: '#0F1115',
          850: '#14161C',
          800: '#1A1D25',
          750: '#212530',
          700: '#272C38',
          600: '#333A48',
          500: '#424B5C',
          400: '#5C6678',
          300: '#7C8699',
          200: '#A8B1C0',
          100: '#D0D6E0',
        },
        // Primary — steel blue (restrained, professional)
        steel: {
          50: '#EEF3F9',
          100: '#D5E2F0',
          200: '#AFC5E2',
          300: '#7FA3D0',
          400: '#5283BF',
          500: '#3A68A8',
          600: '#2C5489',
          700: '#23426C',
          800: '#1C3556',
          900: '#152740',
        },
        // Accent — cyan-teal for highlights
        accent: {
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
        },
        // Semantic
        danger: {
          50: '#FCE8E8',
          100: '#F9CFD0',
          200: '#F0A3A5',
          300: '#E56C70',
          400: '#D63B40',
          500: '#BE1E23',
          600: '#9B1519',
          700: '#7A1013',
        },
        warning: {
          50: '#FDF3E3',
          100: '#FADFB3',
          200: '#F5C678',
          300: '#EFAA3C',
          400: '#E08B1C',
          500: '#C26E0E',
          600: '#9A560A',
        },
        success: {
          50: '#E5F6EC',
          100: '#C4E8D3',
          200: '#90D3AE',
          300: '#58BA85',
          400: '#2FA063',
          500: '#1A824C',
          600: '#136639',
          700: '#0E4D2C',
        },
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0,0,0,0.4), 0 1px 2px -1px rgba(0,0,0,0.3)',
        'card-lg': '0 10px 30px -12px rgba(0,0,0,0.6)',
        'glow-danger': '0 0 0 1px rgba(190,30,35,0.3), 0 0 20px -4px rgba(190,30,35,0.4)',
        'glow-success': '0 0 0 1px rgba(26,130,76,0.3), 0 0 16px -6px rgba(26,130,76,0.4)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.35' },
        },
        'scan': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-up': 'slide-up 0.25s ease-out',
        'slide-in-right': 'slide-in-right 0.25s ease-out',
        'pulse-dot': 'pulse-dot 1.6s ease-in-out infinite',
        'scale-in': 'scale-in 0.15s ease-out',
      },
    },
  },
  plugins: [],
};
