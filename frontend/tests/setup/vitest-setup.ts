/**
 * Vitest setup file for component testing
 */
import { vi } from 'vitest'
import { config } from '@vue/test-utils'

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() { return [] }
} as unknown as typeof IntersectionObserver

// Mock IndexedDB
global.indexedDB = {
  open: () => ({ result: {}, error: {}, onsuccess: null, onerror: null }),
  deleteDatabase: () => ({})
} as unknown as IDBFactory

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
})

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn()

// Mock getBoundingClientRect
Element.prototype.getBoundingClientRect = vi.fn(() => ({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  toJSON: () => ({})
}))

// Global Vue config
config.global.stubs = {
  // Common Nuxt components to stub
  NuxtLink: {
    template: '<a :href="to"><slot /></a>',
    props: ['to']
  },
  NuxtPage: {
    template: '<div><slot /></div>'
  }
}

// Silence Vue warnings in tests
config.global.config = {
  warnHandler: () => {}
}
