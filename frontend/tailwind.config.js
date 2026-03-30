/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // SK AGROVET Nature & Trust Theme
        primary: {
          50: '#f0f4ed',
          100: '#e1e9da',
          200: '#c3d2b5',
          300: '#a5bc91',
          400: '#87a56c',
          500: '#2D5A27', // Primary Forest Green
          600: '#284d20',
          700: '#1e3918',
          800: '#152511',
          900: '#0b120a',
        },
        secondary: {
          50: '#fef9f3',
          100: '#fef3e6',
          200: '#fce7cd',
          300: '#fadbb4',
          400: '#f8cf9b',
          500: '#D4AF37', // Golden Yellow
          600: '#c49d2a',
          700: '#a87e1f',
          800: '#8c6a1a',
          900: '#705614',
        },
        accent: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0066CC', // Clinical Blue
        },
        neutral: {
          50: '#f9f9f9',
          100: '#f5f5f5',
          200: '#eeeeee',
          300: '#e0e0e0',
          400: '#bdbdbd',
          500: '#9e9e9e',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
      },
      borderRadius: {
        sm: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
      },
    },
  },
  plugins: [],
}
