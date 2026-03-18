# Draft: Public Pages Brand Theme Audit

## Requirements (confirmed)
- check all public pages whether they match Esperion brand guideline
- investigate why dark and light mode colors do not change
- ensure images exist for public pages
- image sources may come from Pexels, Unsplash, and Pixabay

## Technical Decisions
- change selection is pending because `/opsx-continue` requires explicit user choice from available OpenSpec changes
- treat this as a frontend public-surface audit and remediation plan, not immediate implementation
- use existing Nuxt 3 public pages under `frontend/app/pages/` as source of truth for scope discovery

## Research Findings
- `frontend/app/pages/` contains the public routes to audit: home, about, contact, articles, works, services, legal pages, auth pages, offline, and catch-all
- `frontend/app/components/Navigation/MainNav.vue` toggles theme with `useColorMode()`, while `frontend/app/stores/ui.ts` maintains a separate persisted theme state and manually edits the `html` class
- `frontend/nuxt.config.ts` enables `@nuxtjs/color-mode` with `classSuffix: ''`, so the active class should be `dark`
- frontend tests already exist via Vitest and Playwright, including `frontend/tests/stores/ui.test.ts` and `frontend/e2e/public-pages.spec.ts`
- public asset references appear broader than current `frontend/public/` contents, so multiple image links are likely unresolved

## Open Questions
- which OpenSpec change should receive the next artifact

## Scope Boundaries
- INCLUDE: public-page brand consistency, theme-switch behavior on public surfaces, public image coverage, verification strategy
- EXCLUDE: direct code edits in this planning session, backend work unless needed for public-page content loading, implementation outside the selected OpenSpec change
