## Why

Public pages already expose a dark/light toggle, but the visual theme does not change reliably because the repo currently mixes three token systems: CSS variables in `main.css`, legacy `esperion-*` Tailwind tokens, and newer `es-*` utility classes used in templates. This change is needed now because the public website cannot meet the existing dark-mode requirement in `esperion-agency-web`, and future page cleanup will stay unstable until the theme source of truth is unified.

### Problem Summary
- Theme state changes, but public colors do not consistently respond.
- Light and dark tokens are defined in multiple places with different naming schemes.
- There are two theme controllers (`useColorMode()` and `useUiStore`) with no clear ownership.
- Some classes currently used by public pages appear undefined or not generated.

### End Goal
- Public pages use one verified theme system.
- Light and dark palettes are expressed through one durable token family.
- Toggle behavior visibly changes the UI and persists predictably.

## What Changes

- Define a single source of truth for Esperion public theme tokens and mode switching.
- Keep valid `--es-*` semantic palette values from `frontend/app/assets/css/main.css` as the canonical public color set.
- Remove or migrate legacy `esperion-*` token usage in frontend theme infrastructure.
- Standardize which layer owns mode state, class application, and persistence.
- Document an explicit migration map covering: retained tokens, deprecated tokens, undefined tokens that must be created or removed, and current templates/components that still rely on `esperion-*`.

### Scope
- Public-page theme state, token generation, and CSS/Tailwind wiring.
- Shared UI primitives that participate in public theme rendering.
- Theme-specific token documentation needed by follow-up design-system work.

### Not Included
- Brand copy rewrite or localization cleanup.
- Routing and detail-page data loading fixes.
- Image/asset acquisition work.
- Broad dashboard redesign beyond shared theme infrastructure.

### Risks / Dependencies
- Depends on confirming how Tailwind v4 is expected to consume semantic tokens in this repo.
- May require coordinated migration in shared components before other public-page fixes can land cleanly.
- Can expose additional regressions in pages that still rely on legacy `esperion-*` classes.

### Recommended Implementation Order
1. `fix-theme-system-and-color-tokens` - first, because it defines the final public token vocabulary and theme ownership used by the other public changes.
2. `fix-public-routing-and-detail-pages` - second, once shared public template behavior is not also shifting under theme drift.
3. `restore-missing-public-assets` - third, after route/detail flows and token paths are stable enough for visual verification.
4. `align-brand-guideline-and-design-system` - last, to finalize visible content and design vocabulary on top of stabilized theme, routing, and assets.

## Capabilities

### New Capabilities
- `public-theme-system`: define the canonical light/dark token model, the final theme source of truth, and the expected public-mode switching behavior.

### Modified Capabilities
- None.

## Impact

- Affected code: `frontend/app/assets/css/main.css`, `frontend/tailwind.config.ts`, `frontend/app/components/Navigation/MainNav.vue`, `frontend/app/stores/ui.ts`, `frontend/app/composables/useEsperionTheme.ts`, shared UI components, and public page templates using `es-*` / `esperion-*` theme classes.
- Affected systems: Nuxt color mode configuration, Tailwind token generation, persistent theme state, public rendering consistency.
- Success depends on preserving Esperion semantic colors while eliminating duplicate or dead theme layers.
