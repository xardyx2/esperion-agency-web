# Frontend Module Governance

This document tracks the audit and governance decisions for Nuxt modules in the Esperion frontend.

## Module Audit Results (2025-03-14)

### Removed Modules

| Module | Reason | Date Removed |
|--------|--------|--------------|
| `@nuxt/content` | Zero runtime usage - no content querying or `<Content>` components found | 2025-03-14 |
| `@formkit/auto-animate/nuxt` | Zero runtime usage - no `v-auto-animate` directives found | 2025-03-14 |

### Implemented Modules

| Module | Implementation | Configuration |
|--------|---------------|---------------|
| `@nuxt/image` | Enhanced WebP compression with quality 80 | `nuxt.config.ts` - sharp provider with webp/avif optimization |
| `@nuxt/fonts` | Inter font family with weights 400-700 | `nuxt.config.ts` - Google Fonts with preload |

### Active Modules (Kept)

| Module | Purpose |
|--------|---------|
| `@nuxt/ui` | UI component library |
| `@nuxt/image` | Image optimization |
| `@nuxt/fonts` | Font loading optimization |
| `@nuxtjs/sitemap` | Sitemap generation |
| `@nuxtjs/robots` | robots.txt generation |
| `nuxt-schema-org` | Structured data |
| `@nuxt/eslint` | ESLint integration |
| `@nuxtjs/color-mode` | Dark/light mode |
| `@nuxtjs/i18n` | Internationalization |
| `@pinia/nuxt` | State management |
| `pinia-plugin-persistedstate/nuxt` | Persistence |
| `nuxt-security` | Security headers |

## Image Module Usage

### EsImage Component

Wraps `<NuxtImg>` with Esperion Design System defaults:

```vue
<EsImage
  src="/images/hero.jpg"
  alt="Hero image"
  :width="1200"
  :height="600"
  sizes="sm:100vw md:50vw lg:800px"
/>
```

### Configuration

- **Format**: webp, avif, png
- **Quality**: 80
- **Provider**: ipx with sharp optimization
- **Densities**: 1x, 2x
- **Screens**: xs:320, sm:640, md:768, lg:1024, xl:1280, xxl:1536

## Font Module Usage

### Configuration

- **Font Family**: Inter (Google Fonts)
- **Weights**: 400, 500, 600, 700
- **Strategy**: Preload critical fonts with font-display: swap

## Governance Rules

1. **Evidence-based decisions**: Only install modules with clear usage justification
2. **Audit annually**: Review modules before major upgrades
3. **Document rationale**: Keep this file updated with decisions
4. **Zero-usage removal**: Remove modules with no runtime usage after verification
5. **Bundle impact**: Consider bundle size impact before adding new modules

## Future Considerations

- Monitor @nuxt/fonts for additional font families if needed
- Consider @nuxt/image enhancements (blur placeholder, art direction)
- Evaluate new modules against these governance rules
