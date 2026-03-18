## Context

The Esperion website currently has several UI/UX inconsistencies and missing features that need improvement:

1. **Home Page Works Section**: Currently shows works without proper infinite looping carousel
2. **Address**: Needs update to new office location
3. **Contact Page**: Social media icons not displaying properly
4. **Language Consistency**: Indonesian pages should keep Tier 1 content (titles/headlines) in English per translation guidelines
5. **Page Banners**: Missing hero banners on most pages
6. **Naming Inconsistency**: Navigation says "Our Works" but page title shows "Our Portfolio"
7. **Taxonomy**: Tags and categories are not clickable for filtering

## Goals / Non-Goals

**Goals:**
- Implement infinite looping works carousel showing 3 items at a time with 5 total
- Update contact address to new location with Google Maps integration
- Fix social media icon rendering on contact page
- Ensure all page titles/headlines in Indonesian locale remain in English (Tier 1 strategy)
- Add consistent hero banners across all public pages with visible text
- Standardize page names across navigation, titles, and URLs
- Make tags and categories clickable with filter functionality

**Non-Goals:**
- No backend API changes required
- No new database schema changes
- No authentication flow modifications

## Decisions

### Carousel Implementation
- **Decision**: Use native Vue transitions with custom logic instead of external carousel library
- **Rationale**: Already using Vue's `<Transition>` for banner, keeps bundle size small, more control over animations
- **Alternative**: Could use `vue-carousel` or `swiper` but adds dependency overhead

### Clickable Taxonomy
- **Decision**: Client-side filtering using URL query params (`?category=X`, `?tag=Y`)
- **Rationale**: Works with ISR strategy, no backend changes needed, URL is shareable
- **Implementation**: Update list pages to read query params and filter displayed items

### Banner Component
- **Decision**: Reuse existing PageBanner component with modifications for better text visibility
- **Rationale**: DRY principle, consistent design, already implemented
- **Modification**: Add text shadow and ensure high contrast overlay

### English Titles Strategy
- **Decision**: Update i18n translation files to keep Tier 1 (titles, headlines, navigation) in English
- **Rationale**: Per project Translation Guidelines, strategic English retention for brand consistency
- **Files to modify**: `locales/id.json`

## Risks / Trade-offs

- [Risk: Carousel performance with many items] → Mitigation: Limit to 5 featured works, use lazy loading for images
- [Risk: Query param filtering breaks ISR caching] → Mitigation: Use shallow routing, filter client-side after hydration
- [Risk: Address change affects SEO] → Mitigation: Update schema.org structured data, add proper redirects if needed
