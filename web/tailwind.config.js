/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        annadata: {
          primary: '#173F2A', // Deep forest green
          secondary: '#3F7D3A', // Natural leaf green
          accent: '#D8B45A', // Warm wheat / harvest gold
          bg: '#F7F6F0', // Warm off-white canvas
          card: '#FFFFFF', // Crisp card surface
          text: '#17201A', // Deep charcoal
          muted: '#5F6F62', // Natural gray-green
          leaf: '#EEF5E8', // Soft leaf highlight
          cream: '#FAF7EE', // Soft wheat cream
          border: 'rgba(23, 63, 42, 0.12)',
          darkgreen: '#173F2A',
          green: '#3F7D3A',
          yellow: '#D8B45A',
          earth: '#8C6239',
          sky: '#EBF4F6',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};

