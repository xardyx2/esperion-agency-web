import { useColorMode as useNuxtColorMode } from '#imports'

/**
 * Esperion Color Mode Composable
 * Wrapper around Nuxt's useColorMode with additional functionality
 * 
 * @usage
 * ```ts
 * const colorMode = useColorMode()
 * 
 * // Get current mode
 * const current = colorMode.value // 'light' | 'dark'
 * 
 * // Set mode
 * colorMode.value = 'dark'
 * 
 * // Toggle mode
 * colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
 * ```
 */
export function useColorMode() {
  const colorMode = useNuxtColorMode()

  /**
   * Toggle between light and dark mode
   */
  const toggle = () => {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }

  /**
   * Check if current mode is dark
   */
  const isDark = computed(() => colorMode.value === 'dark')

  /**
   * Check if current mode is light
   */
  const isLight = computed(() => colorMode.value === 'light')

  /**
   * Set specific color mode
   */
  const setMode = (mode: 'light' | 'dark' | 'system') => {
    colorMode.preference = mode
  }

  return {
    ...colorMode,
    toggle,
    isDark,
    isLight,
    setMode,
  }
}