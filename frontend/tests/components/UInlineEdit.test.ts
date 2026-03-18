import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import UInlineEdit from '../../app/components/dashboard/UInlineEdit.vue'

describe('UInlineEdit', () => {
  const mountComponent = (props = {}) => {
    return mount(UInlineEdit, {
      props: {
        modelValue: 'Test Value',
        type: 'text',
        ...props
      },
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          'UIcon': true,
          'USwitch': true
        }
      }
    })
  }

  it('renders value in view mode', () => {
    const wrapper = mountComponent()
    expect(wrapper.text()).toContain('Test Value')
  })

  it('enters edit mode on click', async () => {
    const wrapper = mountComponent()
    await wrapper.find('.group').trigger('click')
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('emits save event on blur', async () => {
    const wrapper = mountComponent()
    await wrapper.find('.group').trigger('click')
    const input = wrapper.find('input')
    await input.setValue('New Value')
    await input.trigger('blur')
    // Wait for the setTimeout in handleBlur
    await new Promise(resolve => setTimeout(resolve, 300))
    expect(wrapper.emitted('save')).toBeTruthy()
  })

  it('emits cancel event on escape key', async () => {
    const wrapper = mountComponent()
    await wrapper.find('.group').trigger('click')
    const input = wrapper.find('input')
    await input.trigger('keydown', { key: 'Escape' })
    expect(wrapper.emitted('cancel')).toBeTruthy()
  })

  it('renders toggle for boolean type', () => {
    const wrapper = mountComponent({
      type: 'toggle',
      modelValue: true
    })
    expect(wrapper.findComponent({ name: 'USwitch' }).exists()).toBe(true)
  })

  it('shows placeholder when value is empty', () => {
    const wrapper = mountComponent({
      modelValue: '',
      placeholder: 'Enter value'
    })
    expect(wrapper.text()).toContain('Enter value')
  })

  it('validates input when validate prop is provided', async () => {
    const validate = vi.fn(() => 'Error message')
    const wrapper = mountComponent({
      validate
    })
    await wrapper.find('.group').trigger('click')
    const input = wrapper.find('input')
    await input.setValue('invalid')
    // Trigger save
    await input.trigger('keydown', { key: 'Enter' })
    expect(validate).toHaveBeenCalled()
    expect(wrapper.text()).toContain('Error message')
  })
})
