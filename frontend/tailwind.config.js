/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        mono: ['Space Grotesk', 'monospace'],
      },
      colors: {
        'ai-primary': '#4f46e5',
        'ai-secondary': '#818cf8',
        'ai-accent': '#c7d2fe',
        'ai-surface': '#f5f7ff',
      },
    },
  },
  plugins: [],
}
