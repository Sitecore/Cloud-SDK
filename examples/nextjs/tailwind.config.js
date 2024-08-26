/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {},
    container: {
      center: true,
      padding: '1rem',
      screens: {
        'sm': '600px',
        'md': '728px',
        'lg': '984px',
        'xl': '1240px',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        '2xl': '1350px'
      }
    }
  },
  plugins: []
};
