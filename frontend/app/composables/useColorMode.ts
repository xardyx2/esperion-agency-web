import { useColorMode as useNuxtColorMode } from '#imports'

/**
 * Esperion Color Mode Composable
 * 3-state theme mode with system preference detection
 *
 * @usage
 * ```ts
 * const colorMode = useColorMode()
 *
 * // Get current mode
 * const current = colorMode.mode.value // 'auto' | 'light' | 'dark'
 *
 * // Set specific mode
 * colorMode.setMode('dark')
 * colorMode.setLight()
 * colorMode.setDark()
 * colorMode.setAuto()
 *
 * // Check current mode
 * const isAuto = colorMode.isAuto.value
 * const isLight = colorMode.isLight.value
 * const isDark = colorMode.isDark.value
 *
 * // Toggle mode (cycles: auto -> light -> dark -> auto)
 * colorMode.toggle()
 * ```
 */
export function useColorMode() {
  const colorMode = useNuxtColorMode()

  // Use 'auto' as default if system preference
  const mode = ref<'auto' | 'light' | 'dark'>(
    (colorMode.preference as 'auto' | 'light' | 'dark') || 'auto'
  )

  // Detect system preference
  const getSystemPreference = () => {
    if (typeof window === 'undefined') return 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  // Apply mode to Nuxt colorMode
  const applyMode = () => {
    if (mode.value === 'auto') {
      colorMode.preference = getSystemPreference()
    } else {
      colorMode.preference = mode.value
    }
  }

  // Listen to system preference changes when in auto mode
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', () => {
      if (mode.value === 'auto') {
        applyMode()
      }
    })
  }

  // Set mode and persist to localStorage
  const setMode = (newMode: 'auto' | 'light' | 'dark') => {
    mode.value = newMode
    localStorage.setItem('theme-mode', newMode)
    applyMode()
  }

  const setAuto = () => setMode('auto')
  const setLight = () => setMode('light')
  const setDark = () => setMode('dark')

  // Toggle cycles through: auto -> light -> dark -> auto
  const toggle = () => {
    const modeOrder: ('auto' | 'light' | 'dark')[] = ['auto', 'light', 'dark']
    const currentIndex = modeOrder.indexOf(mode.value)
    const nextIndex = (currentIndex + 1) % modeOrder.length
    setMode(modeOrder[nextIndex] || 'auto')
  }

  // Computed properties for checking current mode
  const isAuto = computed(() => mode.value === 'auto')
  const isLight = computed(() => mode.value === 'light')
  const isDark = computed(() => mode.value === 'dark')

  // Initialize from localStorage on mount
  if (typeof window !== 'undefined') {
    const savedMode = localStorage.getItem('theme-mode') as 'auto' | 'light' | 'dark' | null
    if (savedMode && ['auto', 'light', 'dark'].includes(savedMode)) {
      mode.value = savedMode
    }
    applyMode()
  }

  return {
    mode,
    setMode,
    setAuto,
    setLight,
    setDark,
    toggle,
    isAuto,
    isLight,
    isDark
  }
}
