## 1. Audit dependency baseline

- [x] 1.1 Compare `frontend/package.json`, `frontend/package-lock.json`, and `npm ls --depth=0` output to capture all top-level version drift.
- [x] 1.2 Audit version references in `frontend/AGENTS.md`, `openspec/AGENTS.md`, `openspec/config.yaml`, and related frontend docs.

## 2. Align manifests and lockfile

- [x] 2.1 Update `frontend/package.json` so Nuxt and Nuxt-related packages target the verified Nuxt 3 baseline.
- [x] 2.2 Regenerate or reconcile `frontend/bun.lockb` so the lockfile matches the declared Nuxt 3-compatible dependency policy.

## 3. Apply safe dependency updates

- [x] 3.1 Upgrade only low-risk packages that stay on the supported Nuxt 3 compatibility line.
- [x] 3.2 Re-check `bun pm ls` and verify no invalid top-level drift remains.

## 4. Verify and document dependency health

- [x] 4.1 Run frontend dependency verification commands (`bun install`, `bun pm ls`, `bun run type-check`, and build-relevant checks) and record any remaining exceptions.
  - **Note:** Build fails due to pre-existing missing composable `useArticleContent` (unrelated to dependency changes)
  - Type errors are pre-existing (not caused by dependency updates)
- [x] 4.2 Update documentation/config references so they match the verified frontend dependency baseline.
  - Updated `openspec/config.yaml`: Changed "Nuxt 4" → "Nuxt 3.20.2", "SurrealDB 3.x" → "SurrealDB 1.5.0"
