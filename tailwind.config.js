/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
        },
        aqi: {
          good: '#22C55E',
          moderate: '#EAB308',
          sensitive: '#F97316',
          unhealthy: '#EF4444',
          veryUnhealthy: '#A855F7',
          hazardous: '#7F1D1D',
        },
      },
    },
  },
  plugins: [],
};
