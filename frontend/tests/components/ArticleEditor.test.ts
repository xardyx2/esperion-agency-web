/**
 * Tests for Article Editor page (New Article)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ArticleEditor from '~/pages/dashboard/articles/new.vue'

describe('Article Editor (New)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Page Rendering', () => {
    it('should render page title', () => {
      const wrapper = mount(ArticleEditor, {
        global: {
          stubs: {
            NuxtLink: true
          }
        }
      })

      expect(wrapper.text()).toContain('New Article')
      expect(wrapper.text()).toContain('Create a new blog article')
    })

    it('should render form fields', () => {
      const wrapper = mount(ArticleEditor, {
        global: {
          stubs: {
            NuxtLink: true
          }
        }
      })

      // Title input
      const titleInput = wrapper.find('input[type="text"]')
      expect(titleInput.exists()).toBe(true)
      expect(titleInput.attributes('placeholder')).toBe('Enter article title')

      // Content textarea
      const contentTextarea = wrapper.find('textarea')
      expect(contentTextarea.exists()).toBe(true)
    })

    it('should render action buttons', () => {
      const wrapper = mount(ArticleEditor, {
        global: {
          stubs: {
            NuxtLink: true
          }
        }
      })

      // Publish button - there are two buttons
      const buttons = wrapper.findAll('button')
      expect(buttons.length).toBeGreaterThanOrEqual(1)
      // One of them should have "Publish" text
      const publishText = buttons.some(b => b.text().includes('Publish'))
      expect(publishText).toBe(true)
    })
  })

  describe('Form Fields', () => {
    it('should render category dropdown with options', () => {
      const wrapper = mount(ArticleEditor, {
        global: {
          stubs: {
            NuxtLink: true
          }
        }
      })

      const categorySelect = wrapper.find('select')
      expect(categorySelect.exists()).toBe(true)

      const options = wrapper.findAll('option')
      // Should have at least the category options
      expect(options.length).toBeGreaterThanOrEqual(5)
    })

    it('should render status dropdown', () => {
      const wrapper = mount(ArticleEditor, {
        global: {
          stubs: {
            NuxtLink: true
          }
        }
      })

      const statusOptions = wrapper.findAll('select option')
      const statuses = statusOptions.map(o => o.text())
      expect(statuses).toContain('Draft')
      expect(statuses).toContain('Published')
    })

    it('should render SEO meta description field', () => {
      const wrapper = mount(ArticleEditor, {
        global: {
          stubs: {
            NuxtLink: true
          }
        }
      })

      expect(wrapper.text()).toContain('SEO Settings')
      expect(wrapper.text()).toContain('Meta Description')
    })
  })

  describe('Form Interaction', () => {
    it('should bind title input to form data', async () => {
      const wrapper = mount(ArticleEditor, {
        global: {
          stubs: {
            NuxtLink: true
          }
        }
      })

      const titleInput = wrapper.find('input[type="text"]')
      await titleInput.setValue('My New Article')

      expect((titleInput.element as HTMLInputElement).value).toBe('My New Article')
    })

    it('should bind content textarea to form data', async () => {
      const wrapper = mount(ArticleEditor, {
        global: {
          stubs: {
            NuxtLink: true
          }
        }
      })

      const contentTextarea = wrapper.find('textarea')
      await contentTextarea.setValue('This is my article content.')

      expect((contentTextarea.element as HTMLTextAreaElement).value).toBe('This is my article content.')
    })
  })
})
