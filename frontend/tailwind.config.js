/** @type {import('tailwindcss').Config} */
export default {
  content: [
     "./index.html",
     "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: '#5a189a',
        secondary: '#a446ff',
        light: '#debcff',
        dark: '#1e0834',
      }
    },
  },
  plugins: [],
}