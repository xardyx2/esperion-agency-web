import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [vue()],

  test: {
    dir: 'tests',
    include: ['**/*.test.{ts,js}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/.nuxt/**', '**/e2e/**'],

    // Environment - use happy-dom for component tests
    environment: 'happy-dom',

    // Coverage
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/virtual:*',
        '**/__tests__/**',
        '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*'
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70
        }
      }
    },

    // Setup
    setupFiles: ['./tests/setup.ts'],

    // Globals
    globals: true,

    // Restore mocks
    restoreMocks: true,

    // Type checking
    typecheck: {
      enabled: false
    }
  },

  resolve: {
    alias: {
      '~': resolve(__dirname, './app'),
      '@': resolve(__dirname, './app')
    }
  }
})
