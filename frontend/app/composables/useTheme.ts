/**
 * Theme Management Composable
 * 
 * Manages dark/light mode with system preference detection and localStorage persistence.
 * Follows Nuxt Color Mode pattern for smooth transitions.
 */

export const useTheme = () => {
  const colorMode = useColorMode()
  const isDark = computed(() => colorMode.value === 'dark')

  // Detect system preference on first load
  const getSystemPreference = (): 'dark' | 'light' => {
    if (import.meta.client) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light' // SSR default
  }

  // Get current theme (respects system preference if no explicit choice)
  const theme = computed(() => {
    if (colorMode.preference === 'system') {
      return getSystemPreference()
    }
    return colorMode.preference as 'dark' | 'light'
  })

  // Toggle between dark and light modes
  const toggleTheme = () => {
    colorMode.preference = isDark.value ? 'light' : 'dark'
  }

  // Set explicit theme (overrides system preference)
  const setTheme = (newTheme: 'dark' | 'light') => {
    colorMode.preference = newTheme
  }

  return {
    theme,
    isDark,
    toggleTheme,
    setTheme
  }
}
