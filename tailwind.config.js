/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Aggressive theme colors
        'aggressive': {
          'black': '#000000',
          'white': '#ffffff',
          'gray': '#111111',
          'gray-light': '#f0f0f0',
          'gray-dark': '#333333',
          'gray-text': '#cccccc',
        },
        // Primary colors for buttons and accents
        'primary': {
          50: '#ffffff',
          100: '#f0f0f0',
          200: '#e0e0e0',
          300: '#cccccc',
          400: '#999999',
          500: '#666666',
          600: '#333333',
          700: '#222222',
          800: '#111111',
          900: '#000000',
        },
        // Success colors
        'success': {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Error colors
        'error': {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Warning colors
        'warning': {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Info colors
        'info': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'mono': ['Fira Code', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'aggressive': '0 10px 25px rgba(255, 255, 255, 0.3)',
        'aggressive-dark': '0 10px 25px rgba(0, 0, 0, 0.5)',
        'aggressive-lg': '0 20px 40px rgba(255, 255, 255, 0.4)',
        'aggressive-xl': '0 25px 50px rgba(255, 255, 255, 0.5)',
      },
      animation: {
        'aggressive-pulse': 'aggressive-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'aggressive-bounce': 'aggressive-bounce 1s infinite',
        'aggressive-spin': 'aggressive-spin 1s linear infinite',
        'aggressive-ping': 'aggressive-ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        'aggressive-fade-in': 'aggressive-fade-in 0.5s ease-in-out',
        'aggressive-slide-up': 'aggressive-slide-up 0.5s ease-out',
        'aggressive-scale': 'aggressive-scale 0.3s ease-in-out',
      },
      keyframes: {
        'aggressive-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'aggressive-bounce': {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '40%, 43%': { transform: 'translate3d(0, -10px, 0)' },
          '70%': { transform: 'translate3d(0, -5px, 0)' },
          '90%': { transform: 'translate3d(0, -2px, 0)' },
        },
        'aggressive-spin': {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
        'aggressive-ping': {
          '75%, 100%': { transform: 'scale(2)', opacity: '0' },
        },
        'aggressive-fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'aggressive-slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'aggressive-scale': {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [],
} 