/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./components/**/*.html",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'monospace'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        mono: ['Share Tech Mono', 'monospace'],
      },
      colors: {
        cyan: '#00f5ff',
        magenta: '#ff00ff',
        'dark-base': '#050510',
        'card-bg': '#0a0a1a',
      }
    },
  },
  plugins: [],
}