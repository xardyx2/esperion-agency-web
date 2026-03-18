## Why

Several Nuxt modules are configured or installed without clear evidence of active use in the application. Some modules like `@nuxt/image`, `@nuxt/fonts`, and `@nuxt/icon` are installed but not properly utilized - missing opportunities for WebP compression, font optimization, and icon system benefits. Meanwhile, modules like `@nuxt/content` and `@formkit/auto-animate` have zero usage but still add to dependency overhead. This change audits all modules, implements the valuable ones properly, and removes truly unused modules.

## What Changes

### Goals
- **Audit** all configured Nuxt modules against actual usage and potential value.
- **Implement** valuable modules that are installed but underutilized:
  - `@nuxt/image`: Add WebP compression with quality settings
  - `@nuxt/fonts`: Add font optimization and loading strategy
  - `@nuxt/icon`: Leverage icon system through `@nuxt/ui`
- **Remove** verified unused modules without changing public or dashboard behavior.
- **Document** the decision criteria for keep/implement/remove decisions.

### Non-Goals
- No Nuxt 4 migration.
- No re-architecture of the frontend component library.
- No speculative module additions beyond what's already installed.

### Planned Changes
- **Implement `@nuxt/image`**: Add WebP conversion with configurable quality to image handling
- **Implement `@nuxt/fonts`**: Add font optimization with preload and display strategies
- **Leverage `@nuxt/icon`**: Ensure icon system is properly utilized via `@nuxt/ui`
- **Remove `@nuxt/content`**: Zero usage in current codebase
- **Remove `@formkit/auto-animate`**: Zero usage in current codebase
- Add regression checks to ensure public pages and dashboard remain functional

## Capabilities

### New Capabilities
- `frontend-module-governance`: Defines how Nuxt modules are audited, implemented when valuable, or removed.
- `image-optimization`: WebP compression with quality control via `@nuxt/image`
- `font-optimization`: Font loading optimization via `@nuxt/fonts`

### Modified Capabilities
- `public-website`: Enhanced with WebP image delivery and optimized font loading.

## Impact

- **Affected code:** `frontend/nuxt.config.ts`, `frontend/package.json`, image components, font loading.
- **Affected systems:** Image delivery performance, font loading performance, dependency surface area.
- **Dependencies:** Add `@nuxt/fonts` if not present, implement `@nuxt/image` features, remove `@nuxt/content`, `@formkit/auto-animate`.
