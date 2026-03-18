# Nuxt Modules Stack Upgrade

## Context

AI assistants hallucinate about package versions due to outdated training data, leading to incorrect upgrade guidance. This document establishes a single source of truth for all version information across `package.json`, `Cargo.toml`, and `docker-compose.yml`. Version changes must be updated here immediately after any upgrade to ensure AI provides accurate, project-specific answers. This eliminates version ambiguity and prevents costly debugging from mismatched dependencies.

## Decisions

**Decision: Upgrade all modules at once** - Rationale: Avoids multiple lock file generations and reduces integration complexity. Staggered upgrades would require repeated dependency resolution and increase the risk of intermediate broken states.

**Decision: Use @nuxt/eslint auto-migration with manual review (Option B)** - Rationale: Leverages Nuxt's official migration tooling for baseline configuration while maintaining control through manual review. Purely manual migration risks missing new best practices; fully automated migration risks overlooking project-specific customizations.

**Decision: Root package.json contains workspace scripts only; frontend package.json is single source of truth for all dependencies** - Rationale: Clear separation of concerns. Root workspace manages orchestration, frontend workspace owns application dependencies. Prevents dependency duplication and version conflicts across workspace boundaries.

**Decision: Three-phase testing approach (save working state → test each module after config changes → full regression suite)** - Rationale: Ensures rollback capability before changes, catches issues incrementally during upgrade, and validates complete system integrity afterward. Skipping any phase increases risk of undetected regressions.

**Decision: Maintain dedicated git branch, backup bun.lockb, and document each change for revert** - Rationale: Branch isolation prevents contamination of main development line. bun.lockb backup ensures exact dependency state can be restored. Change documentation enables surgical rollbacks without full branch revert if only specific upgrades fail.

## Risks / Trade-offs

**Risk 1: Build failures after upgrade** → **Mitigation:** Test in Docker before committing

**Risk 2: Image rendering breaks (xs/xxl removed)** → **Mitigation:** Audit all `<NuxtImg>` usages beforehand

**Risk 3: i18n stops working** → **Mitigation:** Test language switching immediately after

**Risk 4: ESLint rules change causes many errors** → **Mitigation:** Run lint before and after, fix incrementally

**Risk 5: Color mode breaks** → **Mitigation:** Test dark/light toggle

**Risk 6: bun.lockb conflicts** → **Mitigation:** Delete and regenerate, not resolve manually
