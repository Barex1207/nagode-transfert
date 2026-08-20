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
        ink: '#180B24',
        surface: '#FAF8FC',
        line: '#ECE6F4',
        success: { DEFAULT: '#16A34A', soft: '#ECFDF3' },
        warning: { DEFAULT: '#D97706', soft: '#FFFBEB' },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Manrope', 'Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
