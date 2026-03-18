# FRONTEND GUIDE

## OVERVIEW

Nuxt 4.4.2 application with Vitest unit testing, Playwright E2E, and dual page tree structure.

## STRUCTURE

```text
frontend/
├── app/               Active source directory (srcDir: '.')
│   ├── pages/         Page components (27 files)
│   ├── components/    Vue components
│   ├── stores/        Pinia stores (auth, user, ui)
│   ├── composables/   Composable functions
│   ├── layouts/       Layout components
│   └── locales/       i18n translations
├── pages/             Legacy page tree (avoid)
├── nuxt.config.ts     ISR rules, i18n, modules
├── vitest.config.mjs  Unit test config (happy-dom)
└── playwright.config.ts E2E test config
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| App pages and layouts | `frontend/app/` | Main source tree |
| State | `frontend/app/stores/` | Auth, user, UI |
| API usage | `frontend/app/composables/useApi.ts` | Shared backend access |
| Unit tests | `frontend/tests/` | Vitest (happy-dom, not jsdom) |
| E2E tests | `frontend/e2e/` | Playwright (4 browser projects) |
| Runtime config | `frontend/nuxt.config.ts` | Route rules, i18n, public env |
| i18n translations | `frontend/i18n/locales/` | `id.json` (Indonesian), `en.json` (English) |
| Translation guidelines | `frontend/docs/TRANSLATION_GUIDELINES.md` | Tier 1/2/3 classification, rules |

## CONVENTIONS

- Prefer `frontend/package.json` and `frontend/nuxt.config.ts` over README prose
- Use `script setup` with TypeScript, strict mode enabled
- Avoid `any` type
- Use semantic design tokens (`bg-esperion-light-bg`), never hex in templates
- Test files: `*.test.ts` (Vitest), `*.spec.ts` (Playwright)
- 70% coverage threshold enforced

## ANTI-PATTERNS (THIS PROJECT)

- Never assume README route descriptions match current code
- Never rely on generated `.nuxt/` files for source understanding
- Never assume dashboard route rules align with page tree — verify in `nuxt.config.ts` first
- Never use `frontend/pages/` — use `frontend/app/pages/` (active tree)
- Never layer `vi.mock()` on top of `setup.ts` mocks — pick one
- Never use `extendPage()` — use Playwright's `test.extend()` pattern

## UNIQUE STYLES

- **Bilingual Content Strategy (2026-03-14)**: Hybrid approach with strategic English retention
  - **Tier 1 (Always English)**: Service names, navigation, CTAs, platform names, acronyms
  - **Tier 2 (Always Indonesian)**: Descriptions, form labels, validation messages, blog content
  - **Tier 3 (Hybrid)**: English terms with Indonesian context (e.g., "Jasa Web Development Profesional")
  - See `docs/TRANSLATION_GUIDELINES.md` for complete guidelines
- Indonesian-first i18n: `id` default, `en` secondary, prefix strategy
- Non-uniform ISR: 60s (home) to 86400s (legal pages)
- Dual path aliases: `~/*` and `@/*` both → `./app/*`
- Happy-DOM for unit tests (not jsdom or vitest-environment-nuxt)
- 13 test scripts with overlapping purposes — use `test:unit` and `test:e2e`

## COMMANDS

```bash
# Development (Docker only)
docker-compose up -d frontend

# Unit tests
npm run test:unit              # Vitest run
npm run test:coverage          # With coverage (70% threshold)
npm run test:ui                # Vitest UI

# E2E tests
npm run test:e2e               # Playwright (all browsers)
npm run test:e2e:chromium      # Chromium only
npm run test:e2e:ui            # Playwright UI
npm run test:e2e:debug         # Debug mode

# Type check
npm run type-check
```

## NOTES

- Root `app.vue` and `app/app.vue` are duplicates — Nuxt uses `app/app.vue` with `srcDir: '.'`
- Vitest config split: `package.json` declares `environment: "nuxt"` but `.mjs` uses `happy-dom`
- Playwright `global-setup.ts` is empty — auth handled per-spec
- k6 load tests in root `tests/load/` have thresholds but no CI enforcement
