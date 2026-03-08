/** @type {import('tailwindcss').Config} */

/**
 * Tailwind CSS – BTS SIO
 * Palette identique FoodMart : vert logo, jaune/orange accent #FFC43F, #222, #787878.
 */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        tech: {
          dark: '#0f172a',
          card: '#1e293b',
          border: '#334155',
          accent: '#06b6d4',
          'accent-hover': '#22d3ee',
          muted: '#64748b',
        },
        /* FoodMart : vert logo (comme FOODMART), jaune accent, texte */
        template: {
          primary: '#2d5a27',        /* vert FoodMart logo */
          'primary-hover': '#234a20',
          accent: '#FFC43F',         /* jaune/orange FoodMart */
          'accent-hover': '#f7a422',
          dark: '#222222',
          muted: '#787878',
        },
        /* Fonds bannières FoodMart */
        foodmart: {
          hero: '#e6f3fb',           /* grand bloc hero */
          card1: '#eef5e5',          /* 20% off vert clair */
          card2: '#FFEADA',          /* 15% off pêche */
        },
      },
      fontFamily: {
        sans: ['Open Sans', 'system-ui', 'sans-serif'],
        heading: ['Nunito', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        'template': '1600px',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(255, 196, 63, 0.2)',
        'card-hover-strong': '0 25px 50px -12px rgba(0, 0, 0, 0.35), 0 12px 24px -8px rgba(255, 196, 63, 0.25)',
        'template': '0 5px 22px rgba(0, 0, 0, 0.04)',
        'template-hover': '0 21px 44px rgba(0, 0, 0, 0.08)',
        'template-focus': '0 0 0 2px #FFC43F',
      },
      borderRadius: {
        '4': '1rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
