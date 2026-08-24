/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Khaki & Warm Beige palette (Base #F0E68C)
        sand: {
          50: '#F0E68C', // Khaki light background
          100: '#e8dc7e',
          200: '#ddce6e',
          300: '#cbb95c',
          400: '#b29d47',
          500: '#968134',
          600: '#7a6625',
          700: '#5e4e1a',
          800: '#453811',
          900: '#2e240a',
          950: '#1a1405',
        },
        // Brand: Roasted Chestnut, Toasted Walnut & Deep Amber Bronze
        brand: {
          50: '#faf5ee',
          100: '#f2e7d7',
          200: '#e4ceb4',
          300: '#d2af8c',
          400: '#bc8e63',
          500: '#a5713f',
          600: '#89562c',
          700: '#6e4121',
          800: '#553118',
          900: '#3f2310',
          950: '#221107',
        },
        // Deep Espresso & Obsidian for Dark Mode
        espresso: {
          700: '#342a21',
          800: '#251e17',
          850: '#1c1611',
          900: '#14100c',
          950: '#0c0907',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Playfair Display', 'Merriweather', 'serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.35s ease-out forwards',
        'slide-up': 'slideUp 0.35s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
