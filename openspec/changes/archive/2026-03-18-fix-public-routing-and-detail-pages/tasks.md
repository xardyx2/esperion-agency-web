## 1. Route Ownership and Locale Strategy

- [x] 1.1 Audit `frontend/app/pages/` and `frontend/pages/` and remove public route-definition drift by establishing one authoritative page tree for the Nuxt app.
- [x] 1.2 Update `frontend/nuxt.config.ts`, `frontend/app/components/Navigation/MainNav.vue`, and `frontend/app/components/Footer/SiteFooter.vue` so public internal links and route rules follow one locale-aware prefix strategy.

## 2. Detail Page Correctness

- [x] 2.1 Define and implement the authoritative source-of-truth data path for `frontend/app/pages/articles/[slug].vue` so article detail matches the requested slug and the defined not-found behavior.
- [x] 2.2 Define and implement the authoritative source-of-truth data path for `frontend/app/pages/our-services/[slug].vue` so service detail matches the requested slug and the defined not-found behavior.

## 3. Cross-Surface Slug Integrity

- [x] 3.1 Align homepage featured works in `frontend/app/pages/index.vue` with the same slug contract used by `frontend/app/pages/our-works.vue` and `frontend/app/pages/our-works/[slug].vue`.
- [x] 3.2 Review the full `home -> listing -> detail` flow for articles, services, and works so generated destinations and resolved records use one consistent slug/data contract.

## 4. Verification

- [x] 4.1 Add or update route/detail-page tests for locale-aware navigation, slug-specific rendering, and mismatched/missing records using existing frontend test infrastructure.
- [x] 4.2 Run public frontend verification (`lsp_diagnostics`, relevant unit/e2e tests, and build/type checks) to confirm detail pages, internal links, and route rules behave consistently.
