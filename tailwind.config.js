/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base: 'rgb(var(--color-base) / <alpha-value>)',
        panel: 'rgb(var(--color-panel) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        accent: '#6366f1',
        fg: {
          100: 'rgb(var(--fg-100) / <alpha-value>)',
          200: 'rgb(var(--fg-200) / <alpha-value>)',
          300: 'rgb(var(--fg-300) / <alpha-value>)',
          400: 'rgb(var(--fg-400) / <alpha-value>)',
          500: 'rgb(var(--fg-500) / <alpha-value>)',
          600: 'rgb(var(--fg-600) / <alpha-value>)',
        },
      },
    },
  },
  plugins: [],
}
