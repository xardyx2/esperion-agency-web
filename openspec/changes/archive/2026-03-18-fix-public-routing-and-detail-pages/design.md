## Context

The public site has dynamic route files for article, service, and work details, but the current behavior is still largely placeholder-driven. The audit found that `articles/[slug].vue` and `our-services/[slug].vue` read the slug from the route while still rendering static default content, homepage featured works use slugs that do not match the works listing dataset, public navigation ignores the configured i18n prefix strategy, and both `frontend/app/pages` and `frontend/pages` exist.

This is a cross-cutting routing problem because route ownership, locale behavior, slug contracts, and public detail rendering all need to agree before implementation can be trusted.

## Goals / Non-Goals

**Goals:**
- Choose the authoritative public page tree and eliminate public route-definition drift.
- Make article and service detail rendering depend on the requested slug instead of static defaults.
- Align homepage featured-work links with the same slug contract used by works listing/detail routes.
- Define the source of truth for detail-page content so route transitions and record resolution use the same data contract.
- Make public internal navigation consistent with the configured i18n prefix strategy.
- Keep ISR route rules and actual route paths aligned.

**Non-Goals:**
- Reworking theme tokens or color mode.
- Rewriting public brand copy.
- Restoring missing assets.
- Redesigning backend content models beyond what is required for correct slug resolution.

## Decisions

### Decision: `frontend/app/pages` is the intended public source of truth
- The design will treat `frontend/app/pages` as the authoritative public page tree because the Nuxt app already centers component/layout structure under `app/`.
- Any duplicate public page tree under `frontend/pages` is considered drift and must not remain as a competing route source.
- Alternative considered: support both trees temporarily. Rejected because it preserves ambiguity in route generation and QA.

### Decision: Public detail pages must be slug-resolved, not placeholder-resolved
- Article detail must resolve the record represented by the current slug rather than showing one default article for every slug.
- Service detail must resolve the service represented by the current slug rather than defaulting to one canned service.
- Work links from the homepage must use the same slug contract as works listing and work detail pages.
- Rationale: navigation correctness is not satisfied by route transition alone; the rendered record must match the requested slug.

### Decision: Detail pages need one data source of truth per domain
- Each public detail page must have one authoritative data source for resolving the requested slug.
- Placeholder inline datasets may exist only as a temporary development fallback if they preserve the same slug contract and not-found semantics as the intended real source.
- The design treats source-of-truth data and route correctness as inseparable, because route success without correct record resolution is still broken public behavior.

### Decision: Home, listing, and detail must share one navigation graph
- Homepage featured content is not allowed to invent a separate slug identity from listing/detail pages.
- For each public content domain, the navigation graph must stay consistent:
  - home teaser/featured item -> listing item -> detail page
  - each hop must identify the same record with the same slug contract
- Rationale: the audit already showed that a route can exist while the user journey is still broken due to cross-surface mismatch.

### Decision: Public internal links must follow the configured locale strategy
- Because the frontend config uses i18n prefix routing, internal public links must be generated in a locale-aware way rather than hardcoding non-prefixed paths.
- The design treats route rules, sitemap entries, and rendered internal links as one contract.
- Alternative considered: add fallback support for mixed prefixed and unprefixed public links. Rejected as the long-term direction because it institutionalizes inconsistency.

### Decision: Slug integrity is a shared contract across listing, detail, and featured surfaces
- Home featured works, works listing, and work detail pages must all reference the same slug values for the same work.
- The same rule applies to article listing/detail and service listing/detail.
- Rationale: slug drift between surfaces creates broken journeys even when each route file exists.

## Risks / Trade-offs

- [Removing route drift may surface hidden references to `frontend/pages`] -> Search and re-point route ownership before cleanup.
- [Locale-aware path changes may alter currently indexed URLs] -> Keep route rules and redirects explicit during rollout.
- [Detail pages may expose backend/data inconsistencies once placeholders are removed] -> Treat slug-resolution verification as part of the change contract.
- [Homepage featured content may depend on handcrafted mock data] -> Normalize slug contracts before replacing placeholder datasets and explicitly verify the `home -> listing -> detail` flow.

## Migration Plan

1. Declare and verify the authoritative public page tree.
2. Audit every public internal link against i18n prefix expectations.
3. Normalize slug contracts across home/list/detail surfaces for works, services, and articles.
4. Replace placeholder detail rendering assumptions with slug-resolved content behavior.
5. Reconcile route rules, sitemap expectations, and actual navigable URLs.

## Open Questions

- Does any runtime behavior still intentionally depend on `frontend/pages`, or is it fully redundant drift?
- Should non-prefixed public URLs redirect to prefixed routes during migration, or should the app simply stop generating them?
- Are work/article/service detail pages expected to tolerate missing records with custom empty-state UX, or only strict not-found behavior?
