## Context

The frontend currently installs and configures several Nuxt modules with mixed utilization:

**Underutilized (installed but not properly used):**
- `@nuxt/image`: Installed and configured, but no `<NuxtImg>` components found in codebase
- `@nuxt/fonts`: Not installed, missing font optimization opportunities  
- `@nuxt/icon`: Available via `@nuxt/ui`, but icon system usage not optimized

**Zero usage (candidates for removal):**
- `@nuxt/content`: No content querying, no `<Content>` components
- `@formkit/auto-animate/nuxt`: No animation directives found

This change implements the valuable modules properly (WebP compression, font optimization) while removing truly unused modules to reduce dependency overhead.

## Goals / Non-Goals

**Goals:**
- **Implement** `@nuxt/image` with WebP compression for better performance.
- **Implement** `@nuxt/fonts` for optimized font loading.
- **Verify** `@nuxt/icon` is properly utilized via `@nuxt/ui`.
- **Remove** modules with zero verified runtime value.
- Preserve public and dashboard behavior after changes.
- Document implementation patterns and governance rules.

**Non-Goals:**
- Major framework migration.
- Replacing every low-usage module with a new tool.
- Unnecessary refactors to the component system.

## Decisions

### 1. Implement @nuxt/image with WebP as primary format
Use `@nuxt/image` to serve WebP images with quality optimization, falling back to original format for unsupported browsers.

**Configuration:**
```typescript
image: {
  format: ['webp', 'avif', 'png'],
  quality: 80,
  screens: { xs: 320, sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1536 }
}
```

**Alternatives considered:**
- Use original `<img>` tags. Rejected - misses WebP compression benefits.
- Manual WebP conversion. Rejected - `@nuxt/image` handles this automatically.

### 2. Add @nuxt/fonts for font optimization
Install and configure `@nuxt/fonts` to optimize Google Fonts or local font loading with preload and font-display strategies.

**Alternatives considered:**
- Keep manual font imports. Rejected - `@nuxt/fonts` provides better optimization.
- Self-host fonts manually. Rejected - module handles self-hosting automatically.

### 3. Evidence-based removal for zero-usage modules
Remove `@nuxt/content` and `@formkit/auto-animate/nuxt` only after confirming zero usage via code search.

**Alternatives considered:**
- Keep all modules "just in case". Rejected - increases maintenance burden.

### 4. Create reusable image component wrapper
Build `EsImage.vue` component that wraps `<NuxtImg>` with Esperion Design System styling and default WebP configuration.

**Pattern:**
```vue
<EsImage 
  src="/images/hero.jpg"
  alt="Hero"
  :width="1200"
  :height="600"
  sizes="sm:100vw md:50vw lg:800px"
/>
```

## Risks / Trade-offs

- **[Risk] WebP images may not render in older browsers** -> **Mitigation:** `@nuxt/image` provides automatic fallback to original format.
- **[Risk] Font optimization may cause FOUT (Flash of Unstyled Text)** -> **Mitigation:** Use `font-display: swap` and preload critical fonts.
- **[Risk] False positive on "unused" module detection** -> **Mitigation:** verify with code search before removal.
- **[Risk] Build time increases with image processing** -> **Mitigation:** Use `ipx` provider (on-demand) rather than build-time processing.

## Migration Plan

### Phase 1: Implement @nuxt/image (WebP)
1. Configure image module in `nuxt.config.ts`
2. Create `EsImage.vue` wrapper component
3. Replace `<img>` tags in key components (Article cards, Work thumbnails, Service images)
4. Test WebP generation and quality

### Phase 2: Implement @nuxt/fonts
1. Install `@nuxt/fonts` package
2. Configure font families and loading strategy
3. Replace manual font imports
4. Verify font loading performance

### Phase 3: Remove Zero-Usage Modules
1. Remove `@nuxt/content` from config and package.json
2. Remove `@formkit/auto-animate/nuxt` from config and package.json
3. Run build/type checks
4. Test public pages and dashboard

### Phase 4: Documentation
1. Create MODULE_GOVERNANCE.md
2. Document image usage patterns
3. Document font configuration

Rollback: Restore package.json and nuxt.config.ts from git if regressions occur.

## Open Questions

- What image quality setting (80? 85?) provides best balance of size vs quality?
- Should we use local fonts or Google Fonts via `@nuxt/fonts`?
- Which icon library (Heroicons, Phosphor) is preferred with `@nuxt/ui`?
