/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#7B2FF2',
          magenta: '#C846E3',
          dark: '#1A1A2E',
          light: '#F8F6FF',
          gray: '#6B7280'
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
};
