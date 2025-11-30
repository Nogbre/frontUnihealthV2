/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff0f3',
          100: '#ffe3e8',
          200: '#ffc9d4',
          300: '#ff9fb3',
          400: '#ff6b89',
          500: '#fa3e65',
          600: '#e61e4d',
          700: '#c20e3a',
          800: '#a30f34',
          900: '#8a1132',
        },
      },
    },
  },
  plugins: [],
}

