/**
 * Test utilities for Vue/Nuxt component testing
 */
import type { Component } from 'vue'
import { mount, type MountingOptions, type VueWrapper } from '@vue/test-utils'
import { vi } from 'vitest'

/**
 * Create a mock for Nuxt composables
 */
export function createNuxtMock(composables: Record<string, unknown>) {
  return {
    $t: (key: string) => key,
    useI18n: vi.fn(() => ({
      t: (key: string) => key,
      locale: composables.locale || { value: 'en' },
      setLocale: vi.fn()
    })),
    useRoute: vi.fn(() => ({
      fullPath: '/',
      path: '/',
      query: {},
      params: {}
    })),
    useRouter: vi.fn(() => ({
      push: vi.fn(),
      replace: vi.fn(),
      back: vi.fn()
    })),
    useNuxtApp: vi.fn(() => ({
      $t: (key: string) => key
    })),
    useSeoMeta: vi.fn(),
    useHead: vi.fn(),
    navigateTo: vi.fn(),
    ...composables
  }
}

/**
 * Create a mock for useI18n composable
 */
export function createI18nMock(options?: { locale?: string }) {
  const locale = options?.locale || 'en'
  return {
    t: (key: string) => key,
    locale: { value: locale },
    setLocale: vi.fn().mockResolvedValue(undefined)
  }
}

/**
 * Create a mock for useRoute
 */
export function createRouteMock(overrides = {}) {
  return {
    fullPath: '/',
    path: '/',
    query: {},
    params: {},
    ...overrides
  }
}

/**
 * Create a mock for useRouter
 */
export function createRouterMock() {
  return {
    push: vi.fn().mockResolvedValue(undefined),
    replace: vi.fn().mockResolvedValue(undefined),
    back: vi.fn()
  }
}

/**
 * Mount a Vue component with common Nuxt stubs
 */
export function mountComponent(
  component: Component,
  options?: MountingOptions<Record<string, unknown>>
) {
  return mount(component, {
    global: {
      stubs: {
        NuxtLink: {
          template: '<a :href="to"><slot /></a>',
          props: ['to']
        },
        NuxtPage: {
          template: '<div><slot /></div>'
        }
      }
    },
    ...options
  })
}

/**
 * Create a mock for a composable
 */
export function createComposableMock<T>(implementation: T) {
  return vi.fn(() => implementation)
}

/**
 * Mock all Nuxt imports for a component test
 */
export function mockNuxtImports(imports: Record<string, unknown>) {
  // This can be expanded as needed
  return imports
}

/**
 * Helper to find element by text content
 */
export function findByText(wrapper: VueWrapper<unknown>, text: string) {
  return wrapper.findAll('*').find(node => node.text().includes(text))
}
