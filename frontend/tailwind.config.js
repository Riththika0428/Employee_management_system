/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/layouts/**/*.{js,ts,jsx,tsx}',
    './src/styles/**/*.{css,scss}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    'bg-gray-100',
    'text-gray-800',
  ],
};
