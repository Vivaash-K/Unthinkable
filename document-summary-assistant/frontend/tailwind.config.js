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
        // Warm Beige & Sand palette
        sand: {
          50: '#fbf9f5',
          100: '#f5efe6',
          200: '#ebdfd0',
          300: '#ddc9b2',
          400: '#caad8e',
          500: '#b58f6b',
          600: '#9b734e',
          700: '#7c593c',
          800: '#63452f',
          900: '#483121',
          950: '#281a11',
        },
        // Brand: Toasted Caramel, Almond & Roasted Chestnut
        brand: {
          50: '#faf6f0',
          100: '#f3eae0',
          200: '#e6d3be',
          300: '#d6b797',
          400: '#c2966c',
          500: '#ab7847',
          600: '#906034',
          700: '#734a28',
          800: '#5a381f',
          900: '#432917',
          950: '#23140a',
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
