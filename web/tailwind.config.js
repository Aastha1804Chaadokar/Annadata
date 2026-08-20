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
          bg: '#F8FAF3', // Soft natural off-white
          leaf: '#EEF5E8', // Very light leaf green
          cream: '#FFF8E8', // Soft warm cream
          skybg: '#EAF5F5', // Soft weather/sky light blue
          aibg: '#F3F7ED', // Organic light green
          green: '#3F7D3A', // Natural agricultural green
          darkgreen: '#285C32', // Dark green for headings & wordmark
          lightgreen: '#DCECCF', // Soft highlights
          earth: '#9A7048', // Soil earth brown
          yellow: '#E8B94A', // Warm sunlight yellow
          sky: '#DCEFF5', // Soft sky
          skyblue: '#6FA8B8', // Weather blue
          rainblue: '#7BAFC1', // Rain indicator blue
          text: '#243126', // Main body text
          muted: '#667267', // Secondary text
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
