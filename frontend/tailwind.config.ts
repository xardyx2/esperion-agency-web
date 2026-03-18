import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,vue}',
    './components/**/*.{js,ts,jsx,tsx,vue}'
  ],
  theme: {
    extend: {
      // Canonical Esperion public theme aliases
      colors: {
        'es-bg-primary': 'var(--es-bg-primary)',
        'es-bg-secondary': 'var(--es-bg-secondary)',
        'es-bg-tertiary': 'var(--es-bg-tertiary)',
        'es-bg-inverse': 'var(--es-bg-inverse)',
        'es-bg-primary-dark': 'var(--es-bg-primary-dark)',
        'es-bg-secondary-dark': 'var(--es-bg-secondary-dark)',
        'es-bg-tertiary-dark': 'var(--es-bg-tertiary-dark)',
        'es-bg-inverse-dark': 'var(--es-bg-inverse-dark)',
        'es-text-primary': 'var(--es-text-primary)',
        'es-text-secondary': 'var(--es-text-secondary)',
        'es-text-tertiary': 'var(--es-text-tertiary)',
        'es-text-inverse': 'var(--es-text-inverse)',
        'es-text-primary-dark': 'var(--es-text-primary-dark)',
        'es-text-secondary-dark': 'var(--es-text-secondary-dark)',
        'es-text-tertiary-dark': 'var(--es-text-tertiary-dark)',
        'es-text-inverse-dark': 'var(--es-text-inverse-dark)',
        'es-border': 'var(--es-border)',
        'es-border-dark': 'var(--es-border-dark)',
        'es-accent-primary': 'var(--es-accent-primary)',
        'es-accent-primary-hover': 'var(--es-accent-primary-hover)',
        'es-accent-secondary': 'var(--es-accent-secondary)',
        'es-accent-primary-dark': 'var(--es-accent-primary-dark)',
        'es-accent-primary-hover-dark': 'var(--es-accent-primary-hover-dark)',
        'es-accent-secondary-dark': 'var(--es-accent-secondary-dark)'
      },
      // Font family (optional customization)
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
} satisfies Config
