import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import UDashboardSection from '../../app/components/dashboard/UDashboardSection.vue'

describe('UDashboardSection', () => {
  const mountComponent = (props = {}, slots = {}) => {
    return mount(UDashboardSection, {
      props: {
        title: 'Test Section',
        description: 'Test description',
        ...props
      },
      slots,
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          'UIcon': true,
          'UBadge': true
        }
      }
    })
  }

  it('renders title and description', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('Test Section')
    expect(wrapper.text()).toContain('Test description')
  })

  it('renders icon when provided', () => {
    const wrapper = mountComponent({ icon: 'i-lucide-test' })
    expect(wrapper.findComponent({ name: 'UIcon' }).exists()).toBe(true)
  })

  it('renders badge when provided', () => {
    const wrapper = mountComponent({ badge: '5' })
    expect(wrapper.findComponent({ name: 'UBadge' }).exists()).toBe(true)
  })

  it('renders actions slot content', () => {
    const wrapper = mountComponent({}, {
      actions: '<button class="action-btn">Action</button>'
    })
    expect(wrapper.find('.action-btn').exists()).toBe(true)
  })

  it('renders footer slot when provided', () => {
    const wrapper = mountComponent({}, {
      footer: '<div class="footer-content">Footer</div>'
    })
    expect(wrapper.find('.footer-content').exists()).toBe(true)
  })

  it('applies custom class when provided', () => {
    const wrapper = mountComponent({ class: 'custom-class' })
    expect(wrapper.find('.custom-class').exists()).toBe(true)
  })

  it('uses semantic design tokens', () => {
    const wrapper = mountComponent()
    const section = wrapper.find('section')
    expect(section.classes()).toContain('bg-es-bg-secondary')
    expect(section.classes()).toContain('border-es-border')
  })
})
