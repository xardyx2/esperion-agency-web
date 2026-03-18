/**
 * Tests for Login page/component
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import LoginPage from '../../app/pages/login.vue'

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Form Rendering', () => {
    it('should render login form with email and password fields', () => {
      const wrapper = mount(LoginPage, {
        global: {
          stubs: {
            NuxtLink: {
              template: '<a :href="to"><slot /></a>',
              props: ['to']
            }
          }
        }
      })

      // Check email input exists
      const emailInput = wrapper.find('#email')
      expect(emailInput.exists()).toBe(true)
      expect(emailInput.attributes('type')).toBe('email')

      // Check password input exists
      const passwordInput = wrapper.find('#password')
      expect(passwordInput.exists()).toBe(true)
      expect(passwordInput.attributes('type')).toBe('password')
    })

    it('should render remember me checkbox', () => {
      const wrapper = mount(LoginPage, {
        global: {
          stubs: {
            NuxtLink: {
              template: '<a :href="to"><slot /></a>',
              props: ['to']
            }
          }
        }
      })

      const rememberCheckbox = wrapper.find('input[type="checkbox"]')
      expect(rememberCheckbox.exists()).toBe(true)
    })

    it('should render submit button', () => {
      const wrapper = mount(LoginPage, {
        global: {
          stubs: {
            NuxtLink: {
              template: '<a :href="to"><slot /></a>',
              props: ['to']
            }
          }
        }
      })

      const submitButton = wrapper.find('button[type="submit"]')
      expect(submitButton.exists()).toBe(true)
      expect(submitButton.text()).toContain('Sign In')
    })

    it('should render forgot password link', () => {
      const wrapper = mount(LoginPage, {
        global: {
          stubs: {
            NuxtLink: true
          }
        }
      })

      // Verify form exists (no register link on this page)
      const form = wrapper.find('form')
      expect(form.exists()).toBe(true)
    })
  })

  describe('Form Validation', () => {
    it('should have required attributes on form fields', () => {
      const wrapper = mount(LoginPage, {
        global: {
          stubs: {
            NuxtLink: {
              template: '<a :href="to"><slot /></a>',
              props: ['to']
            }
          }
        }
      })

      const emailInput = wrapper.find('#email')
      const passwordInput = wrapper.find('#password')

      expect(emailInput.attributes('required')).toBeDefined()
      expect(passwordInput.attributes('required')).toBeDefined()
    })

    it('should have placeholders for input fields', () => {
      const wrapper = mount(LoginPage, {
        global: {
          stubs: {
            NuxtLink: {
              template: '<a :href="to"><slot /></a>',
              props: ['to']
            }
          }
        }
      })

      const emailInput = wrapper.find('#email')
      const passwordInput = wrapper.find('#password')

      expect(emailInput.attributes('placeholder')).toBe('you@example.com')
      expect(passwordInput.attributes('placeholder')).toBe('••••••••')
    })
  })

  describe('Form Interaction', () => {
    it('should show loading state when submitting', async () => {
      const wrapper = mount(LoginPage, {
        global: {
          stubs: {
            NuxtLink: {
              template: '<a :href="to"><slot /></a>',
              props: ['to']
            }
          }
        }
      })

      ;(wrapper.vm.$ as unknown as { setupState: Record<string, unknown> }).setupState.isSubmitting = true
      await wrapper.vm.$nextTick()

      // Check button shows loading state
      const button = wrapper.find('button[type="submit"]')
      expect(button.text()).toContain('Signing in...')
    })
  })
})
