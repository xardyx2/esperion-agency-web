import { z } from 'zod'

export default defineMcpPrompt({
  name: 'code-review-guide',
  title: 'Esperion Code Review Guide',
  description: 'Returns guidelines for reviewing Esperion code, including best practices and conventions',
  inputSchema: {
    fileType: z.enum(['vue', 'typescript', 'test', 'config']).optional().describe('Optional filter for specific file type guidelines')
  },
  handler: async ({ fileType }) => {
    const guidelines = {
      general: {
        title: 'General Code Review Guidelines',
        principles: [
          'Use TypeScript strict mode - avoid `any` types',
          'Follow semantic design tokens (e.g., `bg-esperion-light-bg`) instead of hex values',
          'Use `<script setup>` syntax with TypeScript for Vue components',
          'Keep components focused and single-purpose',
          'Add proper error handling for async operations',
          'Use composables for reusable logic'
        ],
        namingConventions: {
          components: 'PascalCase (e.g., `EsButton.vue`, `SeoScoreDisplay.vue`)',
          composables: 'camelCase with `use` prefix (e.g., `useApi.ts`, `useValidation.ts`)',
          stores: 'camelCase matching domain (e.g., `auth.ts`, `user.ts`, `ui.ts`)',
          testFiles: '`.test.ts` for Vitest, `.spec.ts` for Playwright'
        }
      },
      vue: {
        title: 'Vue Component Guidelines',
        rules: [
          'Use `<script setup lang="ts">` for all components',
          'Always use `t()` from useI18n for text - never hardcode strings',
          'Use `localePath()` for navigation links to ensure correct locale prefix',
          'Use semantic design tokens from Tailwind config',
          'Add proper TypeScript types for props and emits',
          'Use Pinia stores for state management instead of local state when sharing across components'
        ],
        example: `
<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

interface Props {
  title: string
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false
})
</script>

<template>
  <h1>{{ t(props.title) }}</h1>
  <NuxtLink :to="localePath('/contact-us')">
    {{ t('common.contact') }}
  </NuxtLink>
</template>
        `.trim()
      },
      typescript: {
        title: 'TypeScript Guidelines',
        rules: [
          'Enable strict mode in tsconfig.json',
          'Avoid `any` type - use proper interfaces or `unknown`',
          'Use Zod for runtime validation of external data',
          'Define interfaces for API responses and request bodies',
          'Use template literal types for route paths when appropriate',
          'Export types from dedicated types/ directory or co-locate with implementation'
        ],
        example: `
interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

interface Article {
  id: string
  slug: string
  title: string
  content: string
  publishedAt: string
  authorId: string
}

type ArticleListResponse = ApiResponse<Article[]>
        `.trim()
      },
      test: {
        title: 'Testing Guidelines',
        vitest: [
          'Use `happy-dom` environment (not jsdom)',
          'Mock Pinia stores using `setup.ts` pattern or `vi.mock()`',
          'Aim for 70% code coverage threshold',
          'Test both unit logic and component rendering'
        ],
        playwright: [
          'Use `test.extend()` pattern for fixtures, not `extendPage()`',
          'Run tests with `npm run test:e2e` for all browsers',
          'Use `npm run test:e2e:ui` for interactive debugging',
          'Cover authentication, CRUD operations, and public pages'
        ],
        example: `
// Vitest unit test
import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '~/app/stores/auth'

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('updates authentication state on login', async () => {
    const auth = useAuthStore()
    await auth.login('test@example.com', 'password123')
    expect(auth.isAuthenticated).toBe(true)
  })
})
        `.trim()
      },
      config: {
        title: 'Configuration Guidelines',
        rules: [
          'Keep `nuxt.config.ts` organized with comments for each section',
          'Use `isDev` constant for environment-specific configuration',
          'Configure ISR routeRules for public pages (60s-86400s revalidation)',
          'Use CSR (`ssr: false`) for dashboard pages',
          'Security headers disabled in development for DevTools compatibility'
        ]
      },
      antiPatterns: {
        title: 'Anti-Patterns to Avoid',
        items: [
          'Never assume README route descriptions match current code - verify in `nuxt.config.ts`',
          'Never rely on generated `.nuxt/` files for source understanding',
          'Never use `frontend/pages/` - use `frontend/app/pages/` (active tree with `srcDir: \'.\'`)',
          'Never layer `vi.mock()` on top of `setup.ts` mocks - pick one pattern',
          'Never hardcode strings in templates - always use i18n `t()` function',
          'Never use hex colors directly - use semantic design tokens'
        ]
      },
      projectStructure: {
        title: 'Project Structure',
        paths: {
          appPages: 'frontend/app/pages/ - Active page tree',
          appComponents: 'frontend/app/components/ - Vue components',
          stores: 'frontend/app/stores/ - Pinia stores (auth, user, ui)',
          composables: 'frontend/app/composables/ - Composable functions',
          unitTests: 'frontend/tests/ - Vitest tests',
          e2eTests: 'frontend/e2e/ - Playwright tests',
          i18n: 'frontend/i18n/locales/ - id.json (Indonesian), en.json (English)'
        }
      },
      i18n: {
        title: 'Multi-Language (i18n) Guidelines',
        strategy: 'Full localization per locale - /id/ prefix (default), /en/ prefix',
        rules: [
          'Every translation key in id.json must exist in en.json',
          'Use hierarchical key structure: `namespace.section.element`',
          'SEO meta tags must use `t()` for localization',
          'Navigation, CTAs, and service names often remain in English (Tier 1)',
          'Descriptions and form labels are in Indonesian (Tier 2)'
        ]
      }
    }

    // Filter by fileType if provided
    const result = fileType
      ? { [fileType]: guidelines[fileType as keyof typeof guidelines] }
      : guidelines

    const content = `# Esperion Code Review Guide

This guide provides code review guidelines for the Esperion project.

\`\`\`json
${JSON.stringify(result, null, 2)}
\`\`\`

## Quick Reference

| Area | Location | Key Points |
|------|----------|------------|
| Pages | \`frontend/app/pages/\` | Use script setup, i18n, ISR |
| Components | \`frontend/app/components/\` | Semantic tokens, TypeScript |
| State | \`frontend/app/stores/\` | Pinia with persistence |
| Tests | \`frontend/tests/\`, \`frontend/e2e/\` | Vitest (happy-dom), Playwright |
| i18n | \`frontend/i18n/locales/\` | id.json default, en.json secondary |

## Commands

\`\`\`bash
# Development
npm run dev

# Unit tests
npm run test:unit
npm run test:coverage  # 70% threshold

# E2E tests
npm run test:e2e
npm run test:e2e:ui    # Interactive

# Type check
npm run type-check
\`\`\`
`

    return {
      messages: [{
        role: 'user',
        content: {
          type: 'text',
          text: content
        }
      }]
    }
  }
})
