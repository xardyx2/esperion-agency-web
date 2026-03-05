/**
 * Accessibility Composable
 * 
 * Provides WCAG 2.1 AA compliance utilities
 */

export const useAccessibility = () => {
  // Skip link functionality
  const skipToContent = () => {
    const mainContent = document.getElementById('main-content')
    if (mainContent) {
      mainContent.focus()
      mainContent.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Focus trap for modals
  const trapFocus = (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstFocusable = focusableElements[0] as HTMLElement
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus()
          e.preventDefault()
        }
      }
    }

    element.addEventListener('keydown', handleTabKey)
    firstFocusable.focus()

    return () => {
      element.removeEventListener('keydown', handleTabKey)
    }
  }

  // Announce changes to screen readers
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcer = document.getElementById('aria-live-announcer')
    if (announcer) {
      announcer.setAttribute('aria-live', priority)
      announcer.textContent = ''
      setTimeout(() => {
        announcer.textContent = message
      }, 100)
    }
  }

  // High contrast mode toggle
  const toggleHighContrast = () => {
    document.documentElement.classList.toggle('high-contrast')
    const isHighContrast = document.documentElement.classList.contains('high-contrast')
    localStorage.setItem('high-contrast', String(isHighContrast))
    announce(`High contrast mode ${isHighContrast ? 'enabled' : 'disabled'}`)
  }

  // Font size adjustment
  const adjustFontSize = (delta: number) => {
    const root = document.documentElement
    const currentSize = parseFloat(getComputedStyle(root).fontSize)
    const newSize = Math.max(12, Math.min(24, currentSize + delta))
    root.style.fontSize = `${newSize}px`
    localStorage.setItem('font-size', String(newSize))
    announce(`Font size set to ${newSize} pixels`)
  }

  // Restore saved preferences
  const restorePreferences = () => {
    // High contrast
    const highContrast = localStorage.getItem('high-contrast') === 'true'
    if (highContrast) {
      document.documentElement.classList.add('high-contrast')
    }

    // Font size
    const fontSize = localStorage.getItem('font-size')
    if (fontSize) {
      document.documentElement.style.fontSize = `${fontSize}px`
    }
  }

  // Keyboard navigation helper
  const handleKeyboardNavigation = (event: KeyboardEvent, actions: Record<string, () => void>) => {
    const { key, ctrlKey, altKey, shiftKey } = event

    // Skip links
    if (key === 's' && ctrlKey) {
      event.preventDefault()
      skipToContent()
    }

    // Execute registered actions
    const actionKey = `${ctrlKey ? 'ctrl+' : ''}${altKey ? 'alt+' : ''}${shiftKey ? 'shift+' : ''}${key.toLowerCase()}`
    if (actions[actionKey]) {
      event.preventDefault()
      actions[actionKey]()
    }
  }

  return {
    skipToContent,
    trapFocus,
    announce,
    toggleHighContrast,
    adjustFontSize,
    restorePreferences,
    handleKeyboardNavigation,
  }
}