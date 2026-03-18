/**
 * Tests for useAccessibility composable
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAccessibility } from '../../composables/useAccessibility'

describe('useAccessibility', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = ''
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('skipToContent', () => {
    it('should focus and scroll to main content', () => {
      // Setup
      const mainContent = document.createElement('div')
      mainContent.id = 'main-content'
      mainContent.tabIndex = -1
      document.body.appendChild(mainContent)

      const focusSpy = vi.spyOn(mainContent, 'focus')
      const scrollSpy = vi.spyOn(mainContent, 'scrollIntoView')

      // Execute
      const { skipToContent } = useAccessibility()
      skipToContent()

      // Assert
      expect(focusSpy).toHaveBeenCalled()
      expect(scrollSpy).toHaveBeenCalledWith({ behavior: 'smooth' })
    })

    it('should handle missing main content gracefully', () => {
      const { skipToContent } = useAccessibility()

      // Should not throw
      expect(() => skipToContent()).not.toThrow()
    })
  })

  describe('announce', () => {
    it('should announce message to screen readers', () => {
      // Setup
      const announcer = document.createElement('div')
      announcer.id = 'aria-live-announcer'
      document.body.appendChild(announcer)

      const { announce } = useAccessibility()

      // Execute
      announce('Test message', 'polite')

      // Wait for setTimeout
      vi.advanceTimersByTime(150)

      // Assert
      expect(announcer.getAttribute('aria-live')).toBe('polite')
      expect(announcer.textContent).toBe('Test message')
    })

    it('should use assertive priority when specified', () => {
      const announcer = document.createElement('div')
      announcer.id = 'aria-live-announcer'
      document.body.appendChild(announcer)

      const { announce } = useAccessibility()
      announce('Urgent message', 'assertive')

      vi.advanceTimersByTime(150)

      expect(announcer.getAttribute('aria-live')).toBe('assertive')
    })
  })

  describe('toggleHighContrast', () => {
    it('should toggle high contrast mode', () => {
      const { toggleHighContrast } = useAccessibility()

      // Initial state
      expect(document.documentElement.classList.contains('high-contrast')).toBe(false)

      // Enable
      toggleHighContrast()
      expect(document.documentElement.classList.contains('high-contrast')).toBe(true)
      expect(localStorage.getItem('high-contrast')).toBe('true')

      // Disable
      toggleHighContrast()
      expect(document.documentElement.classList.contains('high-contrast')).toBe(false)
      expect(localStorage.getItem('high-contrast')).toBe('false')
    })

    it('should announce the change', () => {
      const announcer = document.createElement('div')
      announcer.id = 'aria-live-announcer'
      document.body.appendChild(announcer)

      const { toggleHighContrast } = useAccessibility()
      toggleHighContrast()

      vi.advanceTimersByTime(150)

      expect(announcer.textContent).toContain('High contrast mode')
    })
  })

  describe('adjustFontSize', () => {
    it('should increase font size', () => {
      document.documentElement.style.fontSize = '16px'

      const { adjustFontSize } = useAccessibility()
      adjustFontSize(2)

      expect(document.documentElement.style.fontSize).toBe('18px')
      expect(localStorage.getItem('font-size')).toBe('18')
    })

    it('should decrease font size', () => {
      document.documentElement.style.fontSize = '16px'

      const { adjustFontSize } = useAccessibility()
      adjustFontSize(-2)

      expect(document.documentElement.style.fontSize).toBe('14px')
    })

    it('should respect minimum font size of 12px', () => {
      document.documentElement.style.fontSize = '14px'

      const { adjustFontSize } = useAccessibility()
      adjustFontSize(-4)

      expect(parseFloat(document.documentElement.style.fontSize)).toBeGreaterThanOrEqual(12)
    })

    it('should respect maximum font size of 24px', () => {
      document.documentElement.style.fontSize = '22px'

      const { adjustFontSize } = useAccessibility()
      adjustFontSize(4)

      expect(parseFloat(document.documentElement.style.fontSize)).toBeLessThanOrEqual(24)
    })
  })

  describe('restorePreferences', () => {
    it('should restore high contrast preference', () => {
      localStorage.setItem('high-contrast', 'true')

      const { restorePreferences } = useAccessibility()
      restorePreferences()

      expect(document.documentElement.classList.contains('high-contrast')).toBe(true)
    })

    it('should restore font size preference', () => {
      localStorage.setItem('font-size', '18')
      document.documentElement.style.fontSize = '16px'

      const { restorePreferences } = useAccessibility()
      restorePreferences()

      expect(document.documentElement.style.fontSize).toBe('18px')
    })
  })

  describe('handleKeyboardNavigation', () => {
    it('should trigger skipToContent on Ctrl+S', () => {
      const mainContent = document.createElement('div')
      mainContent.id = 'main-content'
      document.body.appendChild(mainContent)

      const { handleKeyboardNavigation } = useAccessibility()

      const event = new KeyboardEvent('keydown', {
        key: 's',
        ctrlKey: true
      })

      const preventDefaultSpy = vi.spyOn(event, 'preventDefault')

      handleKeyboardNavigation(event, {})

      expect(preventDefaultSpy).toHaveBeenCalled()
    })

    it('should execute registered actions', () => {
      const actionSpy = vi.fn()

      const { handleKeyboardNavigation } = useAccessibility()

      const event = new KeyboardEvent('keydown', {
        key: 't',
        ctrlKey: true
      })

      handleKeyboardNavigation(event, {
        'ctrl+t': actionSpy
      })

      expect(actionSpy).toHaveBeenCalled()
    })
  })
})
