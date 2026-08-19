/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#8A2BE2',
          dark: '#6F1AAE',
          light: '#F7F7F7',
          black: '#000000',
        },
      },
    },
  },
  plugins: [],
};
