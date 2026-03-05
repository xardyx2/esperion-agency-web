import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  cssVariables: true,
  content: [
    './app/**/*.{js,ts,jsx,tsx,vue}',
    './components/**/*.{js,ts,jsx,tsx,vue}',
  ],
  theme: {
    extend: {
      // Esperion Design System Colors
      colors: {
        // Light Mode
        'esperion-light-bg': '#FAFCFF',
        'esperion-light-surface': '#FFFFFF',
        'esperion-light-text-primary': '#102B4E',
        'esperion-light-text-secondary': '#475569',
        'esperion-light-border': '#E2E8F0',

        // Dark Mode
        'esperion-dark-bg': '#0B1120',
        'esperion-dark-surface': '#151E32',
        'esperion-dark-text-primary': '#F8FAFC',
        'esperion-dark-text-secondary': '#94A3B8',
        'esperion-dark-border': '#1E293B',

        // Primary/Accent (both modes)
        'esperion-primary': '#2B9EDB',
      },
      // Font family (optional customization)
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config