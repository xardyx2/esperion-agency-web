## Context

The audit found that the public site references many local assets under `/images`, `/works`, `/articles`, `/logos`, and `/founders`, but `frontend/public/` currently contains no image files. Missing assets affect not only visible page content but also SEO/social previews and schema metadata. The repo also needs a rule for when stock imagery is acceptable and when first-party assets are mandatory.

## Goals / Non-Goals

**Goals:**
- Create one inventory of required public assets and their expected local hosting paths.
- Classify every missing public asset as stock-eligible or first-party-only.
- Define sourcing guidance by category across Unsplash, Pexels, and Pixabay.
- Require download-and-host-local as the only acceptable stock replacement workflow.
- Ensure public, SEO, and schema image references can be validated against actual local assets.

**Non-Goals:**
- Rebuilding theme tokens.
- Fixing route/data behavior.
- Rewriting public brand copy.
- Replacing real business identities with fabricated stock substitutes.

## Decisions

### Decision: Public assets must be hosted locally
- Final rule: approved replacement assets must be downloaded, committed into the local public asset structure, and referenced from local paths.
- Hotlinking to Unsplash, Pexels, Pixabay, or any other stock CDN is not allowed.
- Rationale: local hosting is required for predictable performance, deploy stability, and license traceability.

### Decision: Every approved stock asset must keep a source record and license trace
- Each stock-derived asset must preserve a source log entry containing at least source platform, creator/source URL, original asset URL or page URL, download date, and intended usage category.
- The repo should store this in a lightweight asset-source manifest adjacent to the asset workflow documentation.
- Rationale: attribution may not be mandatory, but source traceability is required for audits and future replacements.

### Decision: Asset replacement is policy-driven by category
- Stock-eligible categories:
  - generic hero banners;
  - non-client-specific service/support visuals;
  - article thumbnails;
  - generic workplace/technology/environment imagery;
  - abstract or illustrative placeholders for works when the asset is clearly demonstrative rather than a claimed real deliverable.
- First-party-only categories:
  - client logos;
  - real founder portraits;
  - real team identity photos presented as actual staff;
  - company logo and official brand marks;
  - any asset that claims to represent an actual client result or proprietary office/brand reality.

### Decision: Source recommendations by asset type
- Unsplash: preferred for premium hero banners, mood-driven backgrounds, and article thumbnails that need strong editorial quality.
- Pexels: preferred for business, team-collaboration, office, and people-centric generic imagery.
- Pixabay: preferred for abstract illustrations, vectors, and lower-risk placeholder graphics where logos/brands must be avoided.
- Rationale: each source has different strengths, and the replacement workflow should be deliberate rather than random.

### Decision: Naming and optimization rules are part of the asset contract
- Public asset filenames should be descriptive, kebab-case, and domain-aligned, for example `hero-digital-consulting.jpg` or `article-seo-basics.jpg`.
- Public raster assets should be optimized before commit and sized to their intended usage class instead of storing oversized originals blindly.
- The workflow should prefer modern formats and compression settings that keep acceptable quality for page visuals and metadata previews.
- Rationale: missing assets should not be replaced with inconsistent or bloated files that create a second cleanup project.

### Decision: License rules apply at category selection time
- Stock selections must avoid trademark-heavy, endorsement-implying, or identity-sensitive imagery for commercial public use.
- Client logos, real founders, and other first-party truth claims remain excluded from stock replacement regardless of convenience.
- Rationale: the sourcing decision is not only aesthetic; it is also a compliance filter.

### Decision: SEO/schema assets are part of the same inventory
- Open Graph, Twitter, and schema image references are treated as required public assets, not optional extras.
- Missing SEO/schema images must be restored or re-pointed as part of the same asset audit.

## Risks / Trade-offs

- [Stock imagery can weaken trust if used for actual identity claims] -> Restrict stock use for founders, client logos, and other first-party truth claims.
- [Local hosting increases repo asset volume] -> Use a clear folder structure and only add assets that are actively referenced.
- [Current remote schema URLs may not match actual deploy reality] -> Verify or replace them using the same asset inventory workflow.
- [Portfolio placeholders can be mistaken for real case-study proof] -> Visually distinguish generic placeholders from validated first-party work assets.
- [Untracked stock downloads create future licensing ambiguity] -> Require source logging for every approved stock asset before the task is considered done.

## Migration Plan

1. Build a unique inventory of all referenced public assets and their current paths.
2. Mark each asset as stock-eligible or first-party-only.
3. Select appropriate source families per category and download approved replacements.
4. Host replacements locally under the public asset structure.
5. Reconcile page, SEO, and schema references against the final local inventory.

## Open Questions

- Which currently referenced work images are intended as real case-study media versus temporary placeholders?
- Do any stakeholder-owned originals already exist for founders, office imagery, or logos outside the repo?
- Should placeholder work visuals be visibly labeled until real client-approved imagery is available?
