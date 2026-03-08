import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf4f6',
          100: '#fce7eb',
          200: '#f9d0da',
          300: '#f4a9bb',
          400: '#ec7694',
          500: '#e04d72',
          600: '#cb2d5a',
          700: '#ab2249',
          800: '#8f1f42',
          900: '#7b1d3c',
          950: '#450b1c',
        },
        accent: {
          gold: '#c9a962',
          rose: '#e8b4b8',
          mauve: '#b794b4',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
