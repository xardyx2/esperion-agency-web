import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import UDashboardEmptyState from '../../app/components/dashboard/UDashboardEmptyState.vue'

describe('UDashboardEmptyState', () => {
  const mountComponent = (props = {}, slots = {}) => {
    return mount(UDashboardEmptyState, {
      props: {
        title: 'No Items',
        description: 'Start by creating your first item.',
        ...props
      },
      slots,
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          'UIcon': true,
          'UButton': true
        }
      }
    })
  }

  it('renders title and description', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('No Items')
    expect(wrapper.text()).toContain('Start by creating your first item.')
  })

  it('renders illustration icon', () => {
    const wrapper = mountComponent({ illustration: 'folder' })
    expect(wrapper.findComponent({ name: 'UIcon' }).exists()).toBe(true)
  })

  it('renders primary action when provided', () => {
    const wrapper = mountComponent({
      primaryAction: {
        label: 'Create',
        icon: 'i-lucide-plus',
        to: '/create'
      }
    })
    expect(wrapper.findComponent({ name: 'UButton' }).exists()).toBe(true)
  })

  it('renders secondary actions when provided', () => {
    const wrapper = mountComponent({
      secondaryActions: [
        { label: 'Help', icon: 'i-lucide-help' }
      ]
    })
    expect(wrapper.findComponent({ name: 'UButton' }).exists()).toBe(true)
  })

  it('renders tips when provided', () => {
    const wrapper = mountComponent({
      tips: ['Tip 1', 'Tip 2']
    })
    expect(wrapper.text()).toContain('Quick Tips')
    expect(wrapper.text()).toContain('Tip 1')
    expect(wrapper.text()).toContain('Tip 2')
  })

  it('renders slot content', () => {
    const wrapper = mountComponent({}, {
      default: '<div class="custom-content">Custom</div>'
    })
    expect(wrapper.find('.custom-content').exists()).toBe(true)
  })

  it('uses semantic design tokens', () => {
    const wrapper = mountComponent()
    const container = wrapper.find('.flex')
    expect(container.classes()).toContain('text-es-text-primary')
  })
})
