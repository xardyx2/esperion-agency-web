## 1. Asset Inventory and Policy Mapping

- [x] 1.1 Build a unique inventory of all public asset references from `frontend/app/pages/`, `frontend/app/content/banner-templates.ts`, and `frontend/app/composables/useLocalBusinessSchema.ts`, grouped by expected local path.
- [x] 1.2 Classify each missing asset as stock-eligible or first-party-only, documenting why client logos, founder identities, official brand marks, and other truth-claim assets cannot be replaced with stock.
- [x] 1.3 Define the asset source-log format and file naming rules to be used for every approved stock-derived asset.

## 2. Source Selection and Local Hosting

- [x] 2.1 Choose approved replacement sources per stock-eligible category, using Unsplash for premium hero/editorial needs, Pexels for business/team-style generic imagery, and Pixabay for low-risk illustrative placeholders.
- [x] 2.2 Download approved stock replacements and place them under the final local public asset structure in `frontend/public/` without hotlinking third-party URLs.
- [x] 2.3 Optimize approved local assets for intended usage size/format and record source/licensing trace details before marking them complete.

## 3. Reference Reconciliation

- [x] 3.1 Update public page, SEO, and schema references so every asset path points to a verified locally hosted file or an explicitly approved first-party source.
- [x] 3.2 Reconcile any unresolved first-party-only gaps by marking them for stakeholder-provided originals instead of silently substituting stock.

## 4. Verification

- [x] 4.1 Add or update verification coverage for public asset resolution on representative public pages and metadata paths.
- [x] 4.2 Run public frontend verification (`lsp_diagnostics`, relevant tests, and build checks) and confirm that required public, SEO, and schema image references resolve locally.
