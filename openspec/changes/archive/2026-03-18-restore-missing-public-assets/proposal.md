## Why

The public website references many local images for hero sections, works, articles, founders, and logos, but the repository currently does not contain the underlying files in `frontend/public/`. This change is needed now because missing assets damage first impressions, break social/SEO previews, and make other public-page fixes impossible to validate visually.

### Problem Summary
- Public pages reference local image paths that do not exist in the repo.
- SEO and schema fields also point to images that are missing locally or not verified remotely.
- The project needs a clear policy for which assets may be replaced by stock and which must remain first-party.

### End Goal
- All required public assets exist and resolve predictably from local hosting.
- Missing-image recovery follows a documented sourcing policy.
- Stock imagery is only used where it does not create brand or trust problems.

## What Changes

- Inventory and restore all required public-facing image assets referenced by pages, SEO metadata, and banner content.
- Group assets by replacement policy: stock-eligible versus first-party-only.
- Define acceptable source recommendations across Unsplash, Pexels, and Pixabay by asset category.
- Require download-and-host-local workflow for any approved stock replacement.
- Define licensing, file naming, file-size optimization, source logging, directory, and verification expectations for public assets.

### Scope
- Public images referenced by homepage, about, services, works, articles, SEO previews, schema images, and content templates.
- Asset governance for stock usage and local hosting.
- Verification that public image references resolve after restoration.

### Not Included
- Rewriting page layouts or theme logic.
- Replacing client logos with fabricated stock logos.
- Inventing fake founder or team identity assets to represent real people.
- CDN or remote-hosting redesign.

### Risks / Dependencies
- Depends on deciding which missing assets are placeholders versus true first-party business content.
- Some schema/SEO assets may need product or stakeholder confirmation if the current remote URLs are inaccurate.
- Legal/commercial safety depends on using stock only in approved categories and hosting locally.

### Recommended Implementation Order
1. `fix-theme-system-and-color-tokens` - stabilize public visual primitives first.
2. `fix-public-routing-and-detail-pages` - ensure asset-bearing routes and detail pages point to the correct destinations and records.
3. `restore-missing-public-assets` - restore the actual images and metadata assets against the stabilized route/theme baseline.
4. `align-brand-guideline-and-design-system` - complete final visible trust/content polish once the right assets are present.

## Capabilities

### New Capabilities
- `public-asset-availability`: define required public asset coverage, replacement rules, and local-hosting expectations.

### Modified Capabilities
- None.

## Impact

- Affected code/content: `frontend/public/`, `frontend/app/pages/index.vue`, `frontend/app/pages/about.vue`, `frontend/app/pages/contact-us.vue`, `frontend/app/pages/articles.vue`, `frontend/app/pages/articles/[slug].vue`, `frontend/app/pages/our-services.vue`, `frontend/app/pages/our-services/[slug].vue`, `frontend/app/pages/our-works.vue`, `frontend/app/pages/our-works/[slug].vue`, `frontend/app/content/banner-templates.ts`, and `frontend/app/composables/useLocalBusinessSchema.ts`.
- Affected systems: public rendering, SEO/social images, schema validation, asset governance.
- This change creates a stable baseline for visual QA and public launch readiness.
