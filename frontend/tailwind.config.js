/** @type {import('tailwindcss').Config} */

/**
 * Tailwind CSS – BTS SIO
 * Thème "Tech Store" : fond sombre, accents cyan/bleu, cartes épurées.
 */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palette Tech Store : fond sombre + accent néon
        tech: {
          dark: '#0f172a',
          card: '#1e293b',
          border: '#334155',
          accent: '#06b6d4',
          'accent-hover': '#22d3ee',
          muted: '#64748b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -2px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(6, 182, 212, 0.25)',
      },
    },
  },
  plugins: [],
}
