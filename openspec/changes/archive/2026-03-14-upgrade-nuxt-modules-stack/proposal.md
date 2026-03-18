## Why

The project's Nuxt module stack has significant version drift between root and frontend package.json files, with multiple major versions behind latest releases. This creates maintenance overhead, missing security patches, and prevents access to new features like full TypeScript support in @nuxt/image v2 and unified UI components in @nuxt/ui v4. Upgrading now ensures compatibility with the latest Nuxt 4 ecosystem and establishes a consistent dependency management approach using Bun.

## What Changes

### Package Upgrades (Breaking Changes Marked)

**@nuxt/image: 1.11.0 → 2.0.0** [BREAKING]
- Remove deprecated screen sizes: `xs` (320px) and `xxl` (1536px)
- Migrate custom providers to use `defineProvider` helper
- IPX v3 upgrade with improved sharp binary handling
- Server-side image utilities now available in Nitro endpoints

**@nuxt/ui: 3.3.7 → 4.5.1** [BREAKING]
- Nuxt UI Pro merged into @nuxt/ui (single package)
- Configuration key change: `uiPro` → `ui` in app.config.ts
- 125+ unified components with Reka UI + Tailwind Variants
- Enhanced TypeScript support across all components

**@nuxt/eslint: 0.7.6 → 1.15.2** [BREAKING]
- Migration to ESLint flat config format only
- Remove `.eslintrc` files, create `eslint.config.ts`
- ESLint v9+ compatibility required

**@nuxtjs/i18n: 9.5.6 → 10.2.3** [BREAKING]
- Vue I18n v11 upgrade
- Remove `lazy: true` option (now default behavior)
- Remove `bundle.optimizeTranslationDirective` (option removed)
- `experimental.hmr` → `hmr` (renamed)

**@nuxtjs/color-mode: 3.5.2 → 4.0.0** [BREAKING]
- Remove `hid` option from configuration
- Remove `classSuffix` default value
- Nuxt 2/Bridge support dropped (Nuxt 3+ only)

### Package.json Synchronization
- Sync versions between root package.json and frontend/package.json
- Remove duplicate dependencies from root (only keep workspace scripts)
- Update all @nuxt/* and @nuxtjs/* packages to latest compatible versions

### Lock File Updates
- Regenerate bun.lockb with updated resolutions
- Verify Bun v1.1+ compatibility

## Capabilities

### New Capabilities
- `nuxt-image-v2`: Full TypeScript support for image operations with typed modifiers and providers
- `nuxt-ui-v4`: Access to 125+ unified UI components with improved accessibility via Reka UI

### Modified Capabilities
- `i18n-config`: Update i18n configuration structure to remove deprecated options (lazy, bundle.optimizeTranslationDirective)
- `eslint-config`: Migrate from legacy .eslintrc to flat config format
- `color-mode-config`: Simplified color mode configuration without hid/classSuffix options

## Impact

### Files Modified
- `frontend/package.json` - Update all @nuxt module versions
- `package.json` (root) - Remove duplicate deps, keep workspace scripts only
- `bun.lockb` - Regenerated with Bun
- `nuxt.config.ts` - Update i18n and colorMode configuration
- `app.config.ts` - Change `uiPro` key to `ui`
- `eslint.config.ts` - Create new flat config (replaces .eslintrc)

### Files Removed
- `.eslintrc` or `.eslintrc.cjs` - Legacy ESLint configuration

### Dependencies Affected
- Bun package manager (v1.1+ required for best compatibility)
- All @nuxt/* and @nuxtjs/* modules
- ESLint v9+ ecosystem
- Vue I18n v11

### Build & Development
- Nuxt dev server (HMR continues to work)
- Build pipeline (output may differ slightly due to IPX v3)
- Docker builds (may need cache invalidation)
- CI/CD pipelines (ESLint step configuration update needed)

### Testing Requirements
- Full regression test of all pages
- Verify image rendering and optimization
- Test i18n language switching
- Verify dark/light mode transitions
- Run ESLint across entire codebase with new rules

## Goals

1. Establish consistent package versions across root and frontend
2. Migrate all deprecated configurations to modern equivalents
3. Maintain full functionality of existing features
4. Achieve zero ESLint errors with new flat config
5. Ensure Docker builds work with updated lock file

## Non-Goals

1. Major refactoring of application logic
2. Adding new features beyond module upgrades
3. Backend/Rust changes
4. Database schema modifications
5. UI design changes (preserve existing Esperion Design System)
