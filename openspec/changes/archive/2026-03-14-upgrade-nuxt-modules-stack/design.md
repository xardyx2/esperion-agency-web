## Context

The Esperion project currently has version drift between root and frontend package.json files, with frontend dependencies significantly behind the latest Nuxt module releases. This creates maintenance overhead and blocks access to security patches and new features. The project uses Bun v1.1+ as the package manager and must preserve the Esperion Design System throughout all upgrades. Key modules requiring updates include @nuxt/image (1→2), @nuxt/ui (3→4), @nuxt/eslint (0→1), @nuxtjs/i18n (9→10), and @nuxtjs/color-mode (3→4), each with documented breaking changes affecting configuration files.

## Goals / Non-Goals

**Goals:**
1. Upgrade all Nuxt modules to latest stable versions
2. Synchronize root and frontend package.json dependencies
3. Migrate all deprecated configurations to modern equivalents
4. Maintain full functionality of existing features
5. Achieve zero ESLint errors with new flat config
6. Preserve Esperion Design System colors and styling

**Non-Goals:**
1. Major refactoring of application logic or components
2. Adding new features beyond module upgrades
3. Backend/Rust changes
4. Database schema modifications
5. UI design changes or new pages

## Decisions

### Decision: Upgrade All Modules in Single Pass
**Rationale:** Upgrading modules incrementally would require multiple bun.lockb regenerations and repeated testing cycles. A single coordinated upgrade ensures all modules are compatible and reduces total testing time.

### Decision: Use @nuxt/eslint Auto-Migration with Manual Review
**Rationale:** @nuxt/eslint v1 includes migration utilities that automatically convert .eslintrc to flat config format. However, manual review is required to ensure custom rules and the Esperion project structure are preserved correctly.

### Decision: Root package.json Contains Workspace Scripts Only
**Rationale:** The root package.json currently has duplicate dependencies that cause confusion. Removing all dependencies from root and keeping only workspace scripts (test, dev, build, etc.) establishes frontend/package.json as the single source of truth for dependencies.

### Decision: Create Feature Branch with Backup Strategy
**Rationale:** Each module upgrade step will be committed to a feature branch. The working bun.lockb will be backed up before changes, enabling quick rollback if critical issues arise during testing.

### Decision: Test Each Module Configuration Immediately After Changes
**Rationale:** Rather than waiting for all upgrades to complete, testing each module immediately after its configuration changes allows for faster identification and isolation of issues specific to that module.

## Risks / Trade-offs

**[Build failures after package upgrade]** → Run `bun install` and `bun run build` in Docker before committing changes to catch environment-specific issues

**[Image rendering breaks due to removed xs/xxl screen sizes]** → Audit all `<NuxtImg>` usages beforehand, grep for "sizes.*xs:" and "sizes.*xxl:" patterns

**[i18n language switching stops working]** → Test language switching immediately after i18n config changes, verify /id/ and /en/ routes

**[ESLint rules change causes many errors]** → Run lint before upgrade to establish baseline, then fix incrementally; disable new rules temporarily if blocking

**[Color mode toggle breaks]** → Test dark/light mode transitions after color-mode config changes

**[bun.lockb merge conflicts]** → Delete bun.lockb and regenerate with `bun install` rather than attempting manual conflict resolution

**[Docker cache issues]** → Use `--no-cache` flag for Docker builds after major dependency changes

## Migration Plan

### Phase 1: Preparation
1. Create git branch: `git checkout -b upgrade/nuxt-modules`
2. Backup current bun.lockb: `cp bun.lockb bun.lockb.backup`
3. Audit image component usages: `grep -r "sizes.*xs:" frontend/app --include="*.vue"`
4. Document current ESLint error count: `cd frontend && bun run lint 2>&1 | wc -l`

### Phase 2: Package.json Updates
1. Update frontend/package.json with new module versions
2. Clean root/package.json (remove all deps, keep scripts only)
3. Run `bun install` to regenerate bun.lockb
4. Verify no peer dependency conflicts

### Phase 3: Configuration Migrations (Order Matters)
1. **@nuxt/image**: Update nuxt.config.ts screen sizes, migrate custom providers
2. **@nuxt/ui**: Update app.config.ts (uiPro → ui key)
3. **@nuxtjs/color-mode**: Update nuxt.config.ts (remove hid, classSuffix)
4. **@nuxtjs/i18n**: Update nuxt.config.ts (remove lazy, bundle.optimizeTranslationDirective)
5. **@nuxt/eslint**: Migrate .eslintrc to eslint.config.ts

### Phase 4: Testing
1. Run `bun run dev` and verify no startup errors
2. Test each page for visual regressions
3. Test i18n language switching
4. Test dark/light mode
5. Run full test suite: `bun run test:unit && bun run test:e2e`
6. Run ESLint: `bun run lint` and fix any errors

### Phase 5: Validation
1. Build for production: `bun run build`
2. Test Docker build: `docker-compose build frontend`
3. Verify no console warnings in browser

### Rollback Strategy
If critical issues discovered:
```bash
git checkout main
rm bun.lockb
mv bun.lockb.backup bun.lockb
bun install
```

## Open Questions

1. Are there custom image providers that need migration to defineProvider?
2. Does the current ESLint config have custom rules that need manual porting?
3. Are there any pages using xs/xxl breakpoints that will break?
4. Does CI/CD need updates for the new ESLint flat config?
