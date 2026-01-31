/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'nature-brown': '#331100',
        'nature-tan': '#f5f0e6',
        'nature-dark': '#660000',
      },
      fontFamily: {
        'old-standard': ['"Old Standard TT"', 'serif'],
        'special-elite': ['"Special Elite"', 'cursive'],
        'tinos': ['Tinos', 'serif'],
        'dancing': ['"Dancing Script"', 'cursive'],
        'parisienne': ['Parisienne', 'cursive'],
      },
    },
  },
  plugins: [],
};
