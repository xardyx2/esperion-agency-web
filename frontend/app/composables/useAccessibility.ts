/**
 * Accessibility Composable for Esperion Agency Web
 *
 * Provides accessibility utilities for keyboard navigation,
 * screen reader support, and high contrast mode
 */

export function useAccessibility() {
  /**
   * Skip to main content - keyboard accessible
   */
  function skipToContent() {
    const mainContent = document.getElementById('main-content')
    if (mainContent) {
      mainContent.focus()
      mainContent.scrollIntoView({ behavior: 'smooth' })
    }
  }

  /**
   * Announce message to screen readers via aria-live
   */
  function announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    let announcer = document.getElementById('aria-live-announcer')

    if (!announcer) {
      announcer = document.createElement('div')
      announcer.id = 'aria-live-announcer'
      announcer.setAttribute('aria-live', priority)
      announcer.setAttribute('aria-atomic', 'true')
      announcer.style.position = 'absolute'
      announcer.style.width = '1px'
      announcer.style.height = '1px'
      announcer.style.padding = '0'
      announcer.style.margin = '-1px'
      announcer.style.overflow = 'hidden'
      announcer.style.clip = 'rect(0, 0, 0, 0)'
      announcer.style.whiteSpace = 'nowrap'
      announcer.style.border = '0'
      document.body.appendChild(announcer)
    }

    announcer.setAttribute('aria-live', priority)
    announcer.textContent = ''

    // Small delay to ensure screen reader catches the announcement
    setTimeout(() => {
      if (announcer) {
        announcer.textContent = message
      }
    }, 100)
  }

  /**
   * Toggle high contrast mode for accessibility
   */
  function toggleHighContrast() {
    const html = document.documentElement
    const isHighContrast = html.classList.contains('high-contrast')

    if (isHighContrast) {
      html.classList.remove('high-contrast')
      localStorage.setItem('high-contrast', 'false')
      announce('High contrast mode disabled')
    } else {
      html.classList.add('high-contrast')
      localStorage.setItem('high-contrast', 'true')
      announce('High contrast mode enabled')
    }
  }

  /**
   * Adjust font size for better readability
   */
  function adjustFontSize(delta: number) {
    const html = document.documentElement
    const currentSize = parseFloat(getComputedStyle(html).fontSize) || 16
    const newSize = Math.min(24, Math.max(12, currentSize + delta))

    html.style.fontSize = `${newSize}px`
    localStorage.setItem('font-size', String(newSize))
    announce(`Font size changed to ${newSize}px`)
  }

  /**
   * Restore accessibility preferences from localStorage
   */
  function restorePreferences() {
    // Restore high contrast
    const highContrast = localStorage.getItem('high-contrast')
    if (highContrast === 'true') {
      document.documentElement.classList.add('high-contrast')
    }

    // Restore font size
    const fontSize = localStorage.getItem('font-size')
    if (fontSize) {
      document.documentElement.style.fontSize = `${fontSize}px`
    }
  }

  /**
   * Handle keyboard navigation for accessibility
   */
  function handleKeyboardNavigation(event: KeyboardEvent, actions: Record<string, () => void>) {
    const key = event.key.toLowerCase()
    const ctrl = event.ctrlKey
    const shift = event.shiftKey
    const alt = event.altKey

    let shortcut = ''
    if (ctrl) shortcut += 'ctrl+'
    if (shift) shortcut += 'shift+'
    if (alt) shortcut += 'alt+'
    shortcut += key

    const action = actions[shortcut]
    if (action) {
      event.preventDefault()
      action()
    }
  }

  /**
   * Initialize keyboard shortcuts
   */
  function initKeyboardShortcuts() {
    const defaultActions: Record<string, () => void> = {
      'ctrl+s': () => skipToContent(),
      'ctrl+h': () => toggleHighContrast(),
      'ctrl++': () => adjustFontSize(2),
      'ctrl+-': () => adjustFontSize(-2)
    }

    document.addEventListener('keydown', (e) => {
      handleKeyboardNavigation(e, defaultActions)
    })
  }

  return {
    skipToContent,
    announce,
    toggleHighContrast,
    adjustFontSize,
    restorePreferences,
    handleKeyboardNavigation,
    initKeyboardShortcuts
  }
}
