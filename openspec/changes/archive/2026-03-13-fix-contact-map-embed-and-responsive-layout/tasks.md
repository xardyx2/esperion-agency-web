## 1. Google Maps Embed Implementation

- [x] 1.1 Replace static map image with Google Maps iframe in `frontend/app/pages/contact-us.vue`
- [x] 1.2 Set iframe attributes: width="100%", height="450", style="border:0", loading="lazy"
- [x] 1.3 Configure Google Maps embed URL with agency coordinates (replace MAP_ID placeholder)
- [x] 1.4 Add aspect-ratio container wrapper to prevent CLS (Cumulative Layout Shift)
- [x] 1.5 Test map interactivity (zoom, pan, directions) in Docker dev environment

## 2. Max-Width Removal

- [x] 2.1 Remove max-width constraint from container in `frontend/app/pages/contact-us.vue`
- [x] 2.2 Remove max-width constraint from container in `frontend/app/pages/about.vue`
- [x] 2.3 Remove max-width constraint from container in `frontend/app/pages/articles/[slug].vue`
- [x] 2.4 Remove max-width constraint from container in `frontend/app/pages/our-services/[slug].vue`
- [x] 2.5 Remove max-width constraint from container in `frontend/app/pages/our-works/[slug].vue`
- [x] 2.6 Verify desktop layout on 1920px+ viewport width

## 3. Banner Text Contrast Improvements

- [x] 3.1 Add gradient overlay to banner sections in all 5 affected .vue files
- [x] 3.2 Apply text-shadow (2px 2px 4px rgba(0,0,0,0.7)) to banner headings
- [x] 3.3 Ensure gradient uses Esperion semantic color names (no hardcoded hex)
- [x] 3.4 Test banner readability in both light and dark modes
- [x] 3.5 Verify 60-30-10 color distribution compliance

## 4. Testing and Verification

- [x] 4.1 Run frontend unit tests: `npm run test:unit`
- [x] 4.2 Test ISR cache invalidation (contact page should refresh within 60s)
- [x] 4.3 Verify responsive layout on mobile (<768px), tablet (768-1279px), desktop (>=1280px)
- [x] 4.4 Check for TypeScript errors with `nuxt typecheck`
- [x] 4.5 Validate no hardcoded hex colors in modified .vue templates
- [x] 4.6 Test Google Maps embed loads without console errors

## 5. Documentation

- [x] 5.1 Update AGENTS.md if any workflow changes are discovered
- [x] 5.2 Note any Google Maps API configuration requirements for team
- [x] 5.3 Mark tasks.md checkboxes as completed
