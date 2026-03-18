## 1. Audit module usage and classify

- [x] 1.1 Audit configured modules in `frontend/nuxt.config.ts` and dependencies in `frontend/package.json` against actual usage.
- [x] 1.2 Classify modules:
  - **IMPLEMENT**: `@nuxt/image` (WebP), `@nuxt/fonts` (font optimization), `@nuxt/icon` (via @nuxt/ui)
  - **REMOVE**: `@nuxt/content`, `@formkit/auto-animate/nuxt` (zero usage)
  - **KEEP**: Already actively used modules

## 2. Implement @nuxt/image with WebP compression

- [x] 2.1 Configure `@nuxt/image` in `nuxt.config.ts` with WebP format and quality settings.
- [x] 2.2 Create `<NuxtImg>` component wrapper `EsImage.vue` with WebP conversion.
- [x] 2.3 Replace existing `<img>` tags with `<EsImage>` in key components (Article cards, Work thumbnails).
- [x] 2.4 Add responsive image sizes for different breakpoints.
- [x] 2.5 Test WebP generation and quality on sample images.

## 3. Implement @nuxt/fonts optimization

- [x] 3.1 Install `@nuxt/fonts` if not already in package.json.
- [x] 3.2 Configure font loading strategy in `nuxt.config.ts` (preload, display: swap).
- [x] 3.3 Define font families for Esperion Design System.
- [x] 3.4 Replace existing font imports with `@nuxt/fonts` configuration.
- [x] 3.5 Verify font loading performance improvement.

## 4. Verify @nuxt/icon usage via @nuxt/ui

- [x] 4.1 Confirm `@nuxt/ui` provides icon system access.
- [x] 4.2 Audit current icon usage in components.
- [x] 4.3 Ensure icon components are properly imported and tree-shaken.
- [x] 4.4 Document icon usage pattern in component guidelines.

## 5. Remove verified zero-usage modules

- [x] 5.1 Remove `@nuxt/content` from `package.json` and `nuxt.config.ts`.
- [x] 5.2 Remove `@formkit/auto-animate/nuxt` from `package.json` and `nuxt.config.ts`.
- [x] 5.3 Clean up any related configuration or imports.
- [x] 5.4 Run `bun install` to update lockfile.

## 6. Validate implementations and removals

- [x] 6.1 Run type checking: `bun run type-check`
- [x] 6.2 Run build: `bun run build`
- [x] 6.3 Test public pages render correctly with new image/font setup.
- [x] 6.4 Test dashboard functionality remains intact.
- [x] 6.5 Run E2E tests to catch regressions.

## 7. Document module governance and usage

- [x] 7.1 Create `frontend/docs/MODULE_GOVERNANCE.md` with audit results.
- [x] 7.2 Document `@nuxt/image` usage patterns and WebP configuration.
- [x] 7.3 Document `@nuxt/fonts` configuration and font loading strategy.
- [x] 7.4 Document removed modules and rationale.
