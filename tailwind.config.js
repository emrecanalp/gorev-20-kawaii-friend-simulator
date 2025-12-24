/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        kawaii: {
          pink: '#FFB6C1',
          lavender: '#E6E6FA',
          mint: '#98FB98',
          peach: '#FFDAB9',
          sky: '#87CEEB',
        },
      },
    },
  },
  plugins: [],
}