/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          200: '#eaddd7',
          500: '#d97706',
          600: '#b45309',
          700: '#92400e',
        },
        sage: {
          50: '#f4f7f4',
          100: '#e5ebe5',
          500: '#4a7c59',
          600: '#3d6749',
          700: '#2e4f37',
        }
      }
    },
  },
  plugins: [],
}

