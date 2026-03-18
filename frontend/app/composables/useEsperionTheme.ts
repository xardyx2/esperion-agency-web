/**
 * Esperion Design System Theme Composable
 * Provides access to Esperion design tokens and theme configuration
 *
 * @usage
 * ```ts
 * const theme = useEsperionTheme()
 *
 * // Get colors
 * const colors = theme.colors
 *
 * // Get spacing
 * const spacing = theme.spacing
 *
 * // Get typography
 * const typography = theme.typography
 * ```
 */
export function useEsperionTheme() {
  /**
   * Esperion Color Palette
   * Following 60-30-10 rule: 60% background, 30% surface/secondary, 10% accent
   */
  const colors = {
    // Light Mode
    light: {
      bg: '#FAFCFF',
      surface: '#FFFFFF',
      textPrimary: '#102B4E',
      textSecondary: '#475569',
      border: '#E2E8F0'
    },
    // Dark Mode
    dark: {
      bg: '#0B1120',
      surface: '#151E32',
      textPrimary: '#F8FAFC',
      textSecondary: '#94A3B8',
      border: '#1E293B'
    },
    // Primary/Accent (both modes)
    primary: '#2B9EDB'
  }

  /**
   * Esperion Spacing Scale
   */
  const spacing = {
    'xs': '0.25rem',
    'sm': '0.5rem',
    'md': '1rem',
    'lg': '1.5rem',
    'xl': '2rem',
    '2xl': '3rem'
  }

  /**
   * Esperion Typography
   */
  const typography = {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif']
    },
    fontSize: {
      'xs': '0.75rem',
      'sm': '0.875rem',
      'base': '1rem',
      'lg': '1.125rem',
      'xl': '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    }
  }

  /**
   * Get Tailwind class for Esperion background color
   */
  const getBgClass = (mode: 'light' | 'dark' = 'light') => {
    return mode === 'dark'
      ? 'bg-es-bg-primary-dark'
      : 'bg-es-bg-primary'
  }

  /**
   * Get Tailwind class for Esperion text color
   */
  const getTextClass = (mode: 'light' | 'dark' = 'light', variant: 'primary' | 'secondary' = 'primary') => {
    if (mode === 'dark') {
      return variant === 'primary'
        ? 'text-es-text-primary-dark'
        : 'text-es-text-secondary-dark'
    }
    return variant === 'primary'
      ? 'text-es-text-primary'
      : 'text-es-text-secondary'
  }

  return {
    colors,
    spacing,
    typography,
    getBgClass,
    getTextClass
  }
}
