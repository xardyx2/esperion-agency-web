import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import UDashboardFilterBar from '../../app/components/dashboard/UDashboardFilterBar.vue'

describe('UDashboardFilterBar', () => {
  const mountComponent = (props = {}) => {
    return mount(UDashboardFilterBar, {
      props: {
        searchPlaceholder: 'Search...',
        filterOptions: [],
        ...props
      },
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          'UIcon': true,
          'UButton': true,
          'USelect': true,
          'UBadge': true
        }
      }
    })
  }

  it('renders search input', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
  })

  it('emits search event on input', async () => {
    const wrapper = mountComponent()
    const input = wrapper.find('input[type="text"]')
    await input.setValue('test query')
    await input.trigger('input')
    expect(wrapper.emitted('search')).toBeTruthy()
  })

  it('shows clear button when search has value', async () => {
    const wrapper = mountComponent()
    const input = wrapper.find('input[type="text"]')
    await input.setValue('test')
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('renders filter options when provided', () => {
    const wrapper = mountComponent({
      filterOptions: [
        { key: 'status', label: 'Status', type: 'select', options: [] }
      ]
    })
    expect(wrapper.findComponent({ name: 'UButton' }).exists()).toBe(true)
  })

  it('toggles filter panel on click', async () => {
    const wrapper = mountComponent({
      filterOptions: [
        { key: 'status', label: 'Status', type: 'select', options: [] }
      ]
    })
    const filterBtn = wrapper.findComponent({ name: 'UButton' })
    await filterBtn.trigger('click')
    // Panel should be visible after click
    expect(wrapper.find('.mt-3').exists()).toBe(true)
  })

  it('shows active filter count badge', () => {
    const wrapper = mountComponent({
      filterOptions: [
        { key: 'status', label: 'Status', type: 'select', options: [] }
      ]
    })
    // Simulate active filters
    wrapper.vm.filters = { status: 'active' }
    expect(wrapper.findComponent({ name: 'UBadge' }).exists()).toBe(true)
  })
})
