# Public Remediation PR Notes

## Summary
- Canonicalized the public theme system around the `es-*` token family and a single `useColorMode()` control path so dark/light mode now updates real UI surfaces consistently.
- Rebuilt public routing and detail-page flows around shared slug-backed content data, with locale-aware links and explicit 404 behavior for missing records.
- Restored missing public assets into local hosting with governance artifacts, source logs, and explicit first-party placeholders instead of fake founder, logo, or brand materials.
- Aligned the public-facing brand shell with an Indonesian-first visible copy strategy and removed placeholder trust content that looked like validated Esperion identity data.

## Verification
- `npm run test:unit -- tests/public-brand-compliance.test.ts tests/public-assets-resolution.test.ts tests/public-content.test.ts tests/stores/ui.test.ts`
- `npm run type-check`
- `npm run build`

## Key Files
- `frontend/app/assets/css/main.css`
- `frontend/app/data/public-content.ts`
- `frontend/app/components/Navigation/MainNav.vue`
- `frontend/app/components/Footer/SiteFooter.vue`
- `frontend/app/pages/index.vue`
- `frontend/app/pages/about.vue`
- `frontend/app/pages/contact-us.vue`
- `frontend/app/pages/articles/[slug].vue`
- `frontend/app/pages/our-services/[slug].vue`
- `frontend/app/pages/our-works/[slug].vue`
- `frontend/public/asset-governance/`
- `openspec/changes/`

## Honest Follow-Up Notes
- Founder photos, client logos, and the official brand mark remain first-party-only assets and are intentionally represented with explicit placeholders until approved originals are provided.
- Full Playwright suite execution is still blocked by the pre-existing global setup issue, so the final verification signal remains the passing unit checks, type-check, and production build.
