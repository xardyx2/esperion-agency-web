## Why

Several public routes technically open but do not represent the selected content, because article and service detail pages still render static placeholder data even when the slug changes. This change is needed now because public navigation, locale routing, and detail-page correctness are core website behaviors, and the current implementation breaks expected SEO and user trust.

### Problem Summary
- Article detail is static even though `route.params.slug` changes.
- Service detail stays on a default service even though the slug changes.
- Featured works on the home page use slugs that do not match the works listing dataset.
- Public links ignore the configured i18n prefix strategy in multiple components.
- There is route-source drift risk because both `frontend/app/pages` and `frontend/pages` exist.

### End Goal
- Every public route resolves to the correct page tree and locale-aware URL.
- Detail pages render the content that matches the requested slug and its intended data source.
- Home, listing, and detail surfaces use one consistent slug/navigation contract.

## What Changes

- Standardize the authoritative public page tree and eliminate route-definition drift.
- Define the source of truth for public detail-page data so article and service detail behavior depends on slug-resolved content instead of static placeholders.
- Align the full relation `home -> listing -> detail` for works, services, and articles so slugs and destinations stay consistent across surfaces.
- Make public navigation and footer links consistent with the configured i18n prefix routing strategy.
- Define how ISR route rules, locale prefixes, detail routes, and slug-based content resolution must align.

### Scope
- Public routing structure and route ownership.
- Source-of-truth data resolution for public detail pages.
- Public detail-page correctness for articles, services, and work links from the homepage.
- Locale-aware internal links and route rules for public pages.
- Slug integrity across home, listing, and detail surfaces.

### Not Included
- Theme token cleanup.
- Brand copy rewrite.
- Asset sourcing or image replacement.
- New backend content features beyond what existing public detail pages need to resolve the right record.

### Risks / Dependencies
- Depends on confirming whether `frontend/app/pages` or `frontend/pages` is the intended source of truth.
- May require coordinated backend/API validation if current slug payloads differ from placeholder assumptions.
- Can affect sitemap, ISR, and locale behavior together, so route changes must stay aligned.

### Recommended Implementation Order
1. `fix-theme-system-and-color-tokens` - establish stable shared theme vocabulary before broad public-page touchpoints move.
2. `fix-public-routing-and-detail-pages` - repair route ownership, slug resolution, and the home/list/detail data flow.
3. `restore-missing-public-assets` - restore visuals after route/detail flows point to the correct records and paths.
4. `align-brand-guideline-and-design-system` - finish visible copy, trust presentation, and final design-system vocabulary alignment on top of the stabilized technical baseline.

## Capabilities

### New Capabilities
- `public-route-integrity`: define correct public route ownership, locale-aware navigation, and slug-resolved detail-page behavior.

### Modified Capabilities
- None.

## Impact

- Affected code: `frontend/nuxt.config.ts`, `frontend/app/components/Navigation/MainNav.vue`, `frontend/app/components/Footer/SiteFooter.vue`, `frontend/app/pages/index.vue`, `frontend/app/pages/articles.vue`, `frontend/app/pages/articles/[slug].vue`, `frontend/app/pages/our-services.vue`, `frontend/app/pages/our-services/[slug].vue`, `frontend/app/pages/our-works.vue`, `frontend/app/pages/our-works/[slug].vue`, and any duplicate files under `frontend/pages/`.
- Affected systems: i18n prefix routing, ISR route rules, public internal linking, slug-based content loading, source-of-truth detail-page data, SEO consistency.
- This work clears blockers for reliable public QA and future content correctness.
