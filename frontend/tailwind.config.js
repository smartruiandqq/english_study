/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6C5CE7',
        secondary: '#00CEC9',
        accent: '#FDCB6E',
        island: '#00B894',
        sky: '#74B9FF',
      },
      fontFamily: {
        sans: ['"Nunito"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}