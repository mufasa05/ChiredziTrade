/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        lowveld: {
          50: '#f2f9f3',
          100: '#e1f2e5',
          200: '#c4e5ce',
          300: '#97d1a9',
          400: '#62b57d',
          500: '#3e995c', // Sugar cane lush green
          600: '#2e7c48',
          700: '#25633b',
          800: '#204f31',
          900: '#1a412a',
          950: '#0c2416',
        },
        savanna: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // Savanna amber/gold
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        earth: {
          50: '#faf6f3',
          100: '#f3ebe4',
          200: '#e7d6c8',
          300: '#d6bba6',
          400: '#c09880',
          500: '#ac7a5f',
          600: '#9b644d',
          700: '#81503f',
          800: '#6b4337',
          900: '#593930',
        },
        darkbg: '#0a0f0d',
        darkcard: '#121a15',
        darkborder: '#1f2e25',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
};
