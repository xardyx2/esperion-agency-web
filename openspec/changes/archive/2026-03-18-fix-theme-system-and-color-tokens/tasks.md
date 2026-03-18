## 1. Canonical Theme Inventory

- [x] 1.1 Audit every active public theme token/class in `frontend/app/assets/css/main.css`, `frontend/tailwind.config.ts`, `frontend/app/composables/useEsperionTheme.ts`, and public templates; produce an explicit retain/deprecate/create-or-remove migration map for `es-*`, `esperion-*`, and currently undefined tokens.
- [x] 1.2 Confirm the final canonical light and dark token set in `frontend/app/assets/css/main.css` and document any missing semantic tokens that must be explicitly added or replaced.

## 2. Legacy Usage Migration

- [x] 2.1 Inventory and migrate public templates/components that still use `esperion-*`, including `frontend/app/pages/[...all].vue`, `frontend/app/pages/privacy-policy.vue`, `frontend/app/pages/terms-of-service.vue`, `frontend/app/components/ui/LanguageSwitcher.vue`, `frontend/app/components/ui/LanguagePrompt.vue`, `frontend/app/components/ui/EsButton.vue`, and `frontend/app/components/ui/EsCard.vue`.
- [x] 2.2 Resolve undefined public semantic tokens such as `bg-es-bg-inverse` / `dark:bg-es-bg-inverse-dark` by formally defining them or replacing them with canonical retained tokens.

## 3. Theme Source-of-Truth Refactor

- [x] 3.1 Refactor public theme state so `frontend/app/components/Navigation/MainNav.vue`, `frontend/app/layouts/`, and shared public theme entry points use one authoritative `useColorMode()` flow.
- [x] 3.2 Remove or rewire the public theme ownership in `frontend/app/stores/ui.ts` so it no longer acts as an independent theme controller.

## 4. Token Generation and Template Migration

- [x] 4.1 Update the frontend token-generation path in `frontend/tailwind.config.ts` and related CSS/theme files so public `bg-es-*`, `text-es-*`, `border-es-*`, and `dark:*` classes resolve from the canonical semantic palette.
- [x] 4.2 Migrate public/shared components that still use `esperion-*` or undefined semantic tokens to the final public token vocabulary, including `frontend/app/components/ui/*.vue`, `frontend/app/components/Navigation/MainNav.vue`, and affected public pages.

## 5. Verification

- [x] 5.1 Add or update theme-focused verification for public surfaces, including unit or component coverage where feasible and manual/Playwright validation of visible dark/light changes.
- [x] 5.2 Run public frontend verification (`lsp_diagnostics`, relevant tests, and build/type checks) and confirm theme persistence plus visible palette changes on representative public pages.
