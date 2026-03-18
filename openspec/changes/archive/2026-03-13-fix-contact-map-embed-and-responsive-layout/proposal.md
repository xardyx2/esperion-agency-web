## Why

The contact page currently displays a static image instead of an interactive Google Maps embed, limiting user experience. Additionally, desktop views are constrained by max-width limits that waste screen real estate, and banner text has insufficient contrast making it unreadable on certain backgrounds.

## What Changes

- Embed interactive Google Maps iframe on the contact page, replacing the static map image
- Remove max-width constraints from content containers to utilize full desktop viewport width
- Improve banner text readability with stronger gradients and text shadows for better contrast
- Apply responsive layout fixes across multiple page components (contact, about, articles, services, works)

## Capabilities

### New Capabilities

### Modified Capabilities

- `public-website`: Enhanced contact page with interactive map embed and improved responsive layout across all public-facing pages

## Impact

**Affected Files:**
- `frontend/app/pages/contact-us.vue` - Google Maps embed, max-width removal, banner improvements
- `frontend/app/pages/about.vue` - max-width removal, banner improvements
- `frontend/app/pages/articles/[slug].vue` - max-width removal, banner improvements
- `frontend/app/pages/our-services/[slug].vue` - max-width removal, banner improvements
- `frontend/app/pages/our-works/[slug].vue` - max-width removal, banner improvements

**Dependencies:**
- Google Maps API (existing reCAPTCHA integration already configured)
- No backend changes required
- ISR caching remains unchanged (60s for contact page)

**Rendering Strategy:**
- All affected pages use ISR (Incremental Static Regeneration)
- No changes to routeRules in nuxt.config.ts required
