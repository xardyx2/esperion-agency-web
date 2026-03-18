# Capability: eslint-config

**Capability ID:** `eslint-config`  
**Version:** 2.0.0  
**Status:** MODIFIED  
**Date:** 2026-03-14

---

## Summary

Migrate ESLint configuration from legacy `.eslintrc` format to ESLint v9+ flat config format (`eslint.config.ts`) with updated dependencies.

---

## Change Type

**MODIFIED** - This capability modifies existing ESLint configuration and dependencies.

---

## Current State

- **ESLint Version:** v9.39.4
- **@nuxt/eslint Version:** v0.7.6
- **Config Format:** Legacy `.eslintrc` (via `@nuxt/eslint` v0.7.x default)
- **Config File:** `frontend/eslint.config.mjs` (minimal wrapper)
- **Type Support:** Basic

---

## Target State

- **ESLint Version:** v9.39.4+ (unchanged, already compatible)
- **@nuxt/eslint Version:** v1.15.2
- **Config Format:** Flat config (`eslint.config.ts`)
- **Config File:** `frontend/eslint.config.ts` (TypeScript flat config)
- **Type Support:** Full type-aware linting with `eslint-typegen`

---

## Requirements

### MODIFIED Requirements

| ID | Requirement | Priority | Verification |
|----|-------------|----------|--------------|
| REQ-001 | ESLint SHALL use flat config format (`eslint.config.ts` or `eslint.config.mjs`) | MUST | Config file exists with flat config syntax |
| REQ-002 | Legacy `.eslintrc` files SHALL be removed from codebase | MUST | No `.eslintrc*` files found via glob search |
| REQ-003 | All existing ESLint rules SHALL be preserved after migration | MUST | `npm run lint` produces same errors/warnings as before |
| REQ-004 | ESLint SHALL produce zero errors across codebase after migration | MUST | `npm run lint` exits with code 0 |
| REQ-005 | `@nuxt/eslint` SHALL be upgraded to v1.15.2 | MUST | `package.json` shows `@nuxt/eslint@^1.15.2` |
| REQ-006 | Flat config SHALL use `withNuxt()` wrapper for Nuxt integration | MUST | Config imports and calls `withNuxt()` |
| REQ-007 | TypeScript type checking SHALL be enabled via `eslint-typegen` | MUST | `eslint-typegen.d.ts` generated and referenced |
| REQ-008 | Existing lint script SHALL continue working without modification | SHOULD | `npm run lint` executes successfully |

---

## Scenarios

### Scenario 1: ESLint runs with flat config

**Given** the flat config is properly configured  
**When** running `npm run lint`  
**Then** ESLint SHALL process all `.vue`, `.ts`, `.js`, `.tsx`, `.jsx` files  
**And** exit with code 0 (no errors)

### Scenario 2: No .eslintrc files exist

**Given** the migration is complete  
**When** searching for `.eslintrc*` files  
**Then** NO legacy config files SHALL be found  
**And** only `eslint.config.*` flat config files SHALL exist

### Scenario 3: Existing rules still enforced

**Given** the flat config preserves all rules  
**When** introducing a code violation (e.g., missing semicolon, unused var)  
**Then** ESLint SHALL report the violation  
**And** the rule ID SHALL match the pre-migration configuration

### Scenario 4: CI/CD pipeline passes lint check

**Given** the flat config migration is complete  
**When** CI/CD pipeline executes `npm run lint`  
**Then** the lint step SHALL pass  
**And** no configuration errors SHALL occur

---

## Technical Specification

### Dependencies

```json
{
  "devDependencies": {
    "@nuxt/eslint": "^1.15.2",
    "eslint": "^9.39.4"
  }
}
```

### Config File Structure

```typescript
// eslint.config.ts
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    // Custom rules overrides (if any)
    rules: {
      // Preserve existing custom rules
    }
  }
)
```

### Migration Steps

1. Update `@nuxt/eslint` to v1.15.2
2. Replace `eslint.config.mjs` with `eslint.config.ts`
3. Ensure `.nuxt/eslint.config.mjs` is regenerated via `nuxt prepare`
4. Verify `eslint-typegen.d.ts` is generated
5. Run `npm run lint` to validate zero errors
6. Remove any legacy `.eslintrc*` files if present
7. Update lockfile

---

## Acceptance Criteria

- [ ] `frontend/package.json` has `@nuxt/eslint@^1.15.2`
- [ ] `frontend/eslint.config.ts` exists with flat config syntax
- [ ] No `.eslintrc*` files exist in codebase
- [ ] `npm run lint` exits with code 0
- [ ] `frontend/.nuxt/eslint-typegen.d.ts` is generated
- [ ] CI/CD lint step passes

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Rule behavior changes in flat config | Medium | Test with `npm run lint` before/after comparison |
| Missing type definitions | Low | Ensure `nuxt prepare` runs to generate typegen |
| Custom rules lost | Medium | Document all custom rules before migration |

---

## References

- [ESLint Flat Config Documentation](https://eslint.org/docs/latest/use/configure/configuration-files-new)
- [@nuxt/eslint v1.x Migration Guide](https://eslint.nuxtjs.org/packages/eslint)
- [Nuxt 3 ESLint Module](https://nuxt.com/modules/eslint)

---

**Author:** OpenSpec  
**Reviewed:** Pending  
**Approved:** Pending
