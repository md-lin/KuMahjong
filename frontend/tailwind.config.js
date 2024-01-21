/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      primary: '#244556',
      red: '#AA4245',
      yellow: '#DCB551',
      blue: '#558EAB',
      purple: '#7C70C4',
      white: '#eef0e9',
      black: '#081721',
    },
    extend: {
      dropShadow: {
        '1': '-4px 4px 0px 0px rgb(20, 46, 61)'
      },
      boxShadow: {
        '1': '-4px 4px 0px 0px rgb(20, 46, 61)',
        '2': '-6px 6px 0px 0px rgb(20, 46, 61)',
      }
    },
  },
  plugins: [],
}

