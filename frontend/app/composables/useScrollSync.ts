/**
 * useScrollSync - Composable for synchronized scrolling between two elements
 * 
 * Synchronizes scroll position between two elements based on percentage,
 * so when one scrolls to 50%, the other also scrolls to 50%.
 * 
 * @usage
 * ```vue
 * <script setup>
 * const { syncScroll, disconnect } = useScrollSync({
 *   primary: primaryRef,
 *   secondary: secondaryRef,
 *   enabled: () => viewMode.value === 'split'
 * })
 * </script>
 * 
 * <template>
 *   <div ref="primaryRef" @scroll="syncScroll">Content 1</div>
 *   <div ref="secondaryRef" @scroll="syncScroll">Content 2</div>
 * </template>
 * ```
 */

interface ScrollSyncOptions {
  primary: Ref<HTMLElement | null>
  secondary: Ref<HTMLElement | null>
  enabled?: () => boolean
  direction?: 'vertical' | 'horizontal' | 'both'
}

interface CursorPosition {
  top: number
  left: number
}

export const useScrollSync = (options: ScrollSyncOptions) => {
  const {
    primary,
    secondary,
    enabled = () => true,
    direction = 'vertical'
  } = options

  const isSyncing = ref(false)
  const cursorPositions = ref<Record<string, CursorPosition>>({ id: { top: 0, left: 0 }, en: { top: 0, left: 0 } })

  // Calculate scroll percentage
  const getScrollPercent = (element: HTMLElement): { vertical: number; horizontal: number } => {
    const vertical = element.scrollHeight > element.clientHeight
      ? element.scrollTop / (element.scrollHeight - element.clientHeight)
      : 0
    const horizontal = element.scrollWidth > element.clientWidth
      ? element.scrollLeft / (element.scrollWidth - element.clientWidth)
      : 0
    return { vertical, horizontal }
  }

  // Set scroll position by percentage
  const setScrollPercent = (
    element: HTMLElement,
    percent: { vertical: number; horizontal: number }
  ) => {
    const maxScrollTop = element.scrollHeight - element.clientHeight
    const maxScrollLeft = element.scrollWidth - element.clientWidth

    if (direction === 'vertical' || direction === 'both') {
      element.scrollTop = percent.vertical * maxScrollTop
    }
    if (direction === 'horizontal' || direction === 'both') {
      element.scrollLeft = percent.horizontal * maxScrollLeft
    }
  }

  // Sync primary to secondary
  const syncPrimaryToSecondary = () => {
    if (!enabled() || isSyncing.value) return
    const primaryEl = primary.value
    const secondaryEl = secondary.value
    if (!primaryEl || !secondaryEl) return

    isSyncing.value = true
    const percent = getScrollPercent(primaryEl)
    setScrollPercent(secondaryEl, percent)
    requestAnimationFrame(() => {
      isSyncing.value = false
    })
  }

  // Sync secondary to primary
  const syncSecondaryToPrimary = () => {
    if (!enabled() || isSyncing.value) return
    const primaryEl = primary.value
    const secondaryEl = secondary.value
    if (!primaryEl || !secondaryEl) return

    isSyncing.value = true
    const percent = getScrollPercent(secondaryEl)
    setScrollPercent(primaryEl, percent)
    requestAnimationFrame(() => {
      isSyncing.value = false
    })
  }

  // Generic sync handler (can be used on either element)
  const syncScroll = (source: 'primary' | 'secondary') => {
    if (source === 'primary') {
      syncPrimaryToSecondary()
    } else {
      syncSecondaryToPrimary()
    }
  }

  // Save cursor position for a specific language
  const saveCursorPosition = (language: 'id' | 'en', position: CursorPosition) => {
    cursorPositions.value[language] = position
  }

  // Get saved cursor position
  const getCursorPosition = (language: 'id' | 'en'): CursorPosition => {
    return cursorPositions.value[language] || { top: 0, left: 0 }
  }

  // Disconnect scroll sync
  const disconnect = () => {
    isSyncing.value = false
  }

  return {
    syncScroll,
    syncPrimaryToSecondary,
    syncSecondaryToPrimary,
    saveCursorPosition,
    getCursorPosition,
    disconnect,
    isSyncing: readonly(isSyncing)
  }
}

export default useScrollSync
