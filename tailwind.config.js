/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#0066cc',
          dark: '#3b82f6',
        },
        background: {
          light: '#f5f5f5',
          dark: '#1a1a1a',
        },
        card: {
          light: '#ffffff',
          dark: '#2a2a2a',
        },
      },
    },
  },
  plugins: [],
};
