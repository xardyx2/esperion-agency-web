/**
 * Theme Management Composable
 *
 * Manages dark/light mode with system preference detection, time-based fallback,
 * and localStorage persistence.
 *
 * Features:
 * - System preference detection (prefers-color-scheme)
 * - Time-based fallback: 7PM-7AM = dark mode
 * - Smooth 0.3s CSS transitions (Vue.js style)
 */

export const useTheme = () => {
  const colorMode = useColorMode()
  const isDark = computed(() => colorMode.value === 'dark')

  /**
   * Detect system preference with time-based fallback
   * Priority: OS preference → Time-based (7PM-7AM = dark) → Light default
   */
  const getSystemPreference = (): 'dark' | 'light' => {
    if (import.meta.client) {
      // 1. Check OS preference first
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)')
      if (prefersDark.matches !== undefined) {
        return prefersDark.matches ? 'dark' : 'light'
      }

      // 2. Fallback: Time-based (7PM-7AM = dark)
      const hour = new Date().getHours()
      const isNightTime = hour >= 19 || hour < 7
      return isNightTime ? 'dark' : 'light'
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
  const setTheme = (newTheme: 'dark' | 'light' | 'system') => {
    colorMode.preference = newTheme
  }

  // Get current preference ('system' | 'light' | 'dark')
  const preference = computed(() => colorMode.preference)

  return {
    theme,
    isDark,
    preference,
    toggleTheme,
    setTheme,
    getSystemPreference
  }
}
