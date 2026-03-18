/**
 * useKeyboardShortcuts - Composable for keyboard shortcuts
 * 
 * @usage
 * ```vue
 * const { registerShortcut } = useKeyboardShortcuts()
 * 
 * registerShortcut({
 *   key: 's',
 *   ctrl: true,
 *   handler: () => save()
 * })
 * ```
 */

export interface KeyboardShortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  handler: () => void
  preventDefault?: boolean
  description?: string
}

export const useKeyboardShortcuts = () => {
  const shortcuts = ref<KeyboardShortcut[]>([])

  const handleKeydown = (e: KeyboardEvent) => {
    shortcuts.value.forEach(shortcut => {
      const keyMatch = e.key.toLowerCase() === shortcut.key.toLowerCase()
      const ctrlMatch = !!shortcut.ctrl === e.ctrlKey
      const shiftMatch = !!shortcut.shift === e.shiftKey
      const altMatch = !!shortcut.alt === e.altKey
      const metaMatch = !!shortcut.meta === e.metaKey

      if (keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch) {
        if (shortcut.preventDefault) {
          e.preventDefault()
        }
        shortcut.handler()
      }
    })
  }

  const registerShortcut = (shortcut: KeyboardShortcut) => {
    shortcuts.value.push(shortcut)
  }

  const unregisterShortcut = (key: string) => {
    shortcuts.value = shortcuts.value.filter(s => s.key !== key)
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })

  return {
    shortcuts: readonly(shortcuts),
    registerShortcut,
    unregisterShortcut
  }
}

export default useKeyboardShortcuts
