/**
 * Tests for LanguageSwitcher component
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LanguageSwitcher from '../../app/components/ui/LanguageSwitcher.vue'

const setLocale = vi.fn().mockResolvedValue(undefined)

vi.stubGlobal('useI18n', () => ({
  locale: { value: 'en' },
  setLocale,
  isIndonesian: { value: false }
}))

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render button variant with two language actions', () => {
      const wrapper = mount(LanguageSwitcher, {
        props: {
          variant: 'buttons',
          showFlags: false
        }
      })

      const buttons = wrapper.findAll('button')
      expect(buttons).toHaveLength(2)
      expect(buttons[0].text()).toContain('Indonesia')
      expect(buttons[1].text()).toContain('English')
    })

    it('should have proper accessibility attributes on the dropdown trigger', () => {
      const wrapper = mount(LanguageSwitcher)

      const trigger = wrapper.find('button[aria-label="Select language"]')
      expect(trigger.exists()).toBe(true)
    })
  })

  describe('Locale Selection', () => {
    it('should render the current locale text', () => {
      const wrapper = mount(LanguageSwitcher, {
        props: {
          showFlags: false
        }
      })

      expect(wrapper.text()).toContain('English')
    })

    it('should switch locale when another language is clicked', async () => {
      const wrapper = mount(LanguageSwitcher, {
        props: {
          variant: 'buttons',
          showFlags: false
        }
      })

      const buttons = wrapper.findAll('button')
      await buttons[0].trigger('click')

      expect(setLocale).toHaveBeenCalledWith('id')
    })
  })
})
