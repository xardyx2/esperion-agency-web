# Verification Report: remove-unused-nuxt-modules

## Summary

| Dimension    | Status                                      |
|--------------|---------------------------------------------|
| Completeness | 0/8 tasks complete, 2/3 specs not verified  |
| Correctness  | 0/6 requirements verified as implemented    |
| Coherence    | No implementation found - design not followed|

---

## Critical Issues (Must Fix Before Archive)

### 1. No Task Completion Evidence
**Issue:** All 8 tasks in tasks.md remain incomplete (`- [ ]`).

**Tasks Not Completed:**
- [ ] 1.1 Audit configured modules in `frontend/nuxt.config.ts` and dependencies
- [ ] 1.2 Classify candidate modules as remove, keep, or defer
- [ ] 2.1 Remove package entries and Nuxt module registrations for unused modules
- [ ] 2.2 Clean up any related config, imports, or generated assumptions
- [ ] 3.1 Verify public routes still render correctly
- [ ] 3.2 Verify dashboard shell behavior still works
- [ ] 4.1 Run install, type, and build checks after removal
- [ ] 4.2 Document the final keep/remove/defer decisions

**Current State:**
- `frontend/nuxt.config.ts` still contains all original modules:
  - `@nuxt/content` - No usage found in code (verified via grep)
  - `@nuxt/image` - No usage found in code (verified via grep)
  - `@formkit/auto-animate/nuxt` - No usage found in code (verified via grep)
  - `nuxt-security` - Has config but no direct code usage
- `frontend/package.json` still contains all original dependencies

**Recommendation:** 
Complete the audit and removal tasks. Based on grep searches, these modules have zero verified usage:
- `@nuxt/content` - **REMOVE** (no queryContent, no content directory usage)
- `@nuxt/image` - **REMOVE** (no `<NuxtImg>` components found)
- `@formkit/auto-animate/nuxt` - **REMOVE** (no `v-auto-animate` directives found)

---

### 2. Module Governance Documentation Missing
**Issue:** Task 4.2 requires documenting keep/remove/defer decisions, but no governance file exists.

**Expected Location:** `frontend/docs/MODULE_GOVERNANCE.md` or similar

**Recommendation:**
Create documentation file with the following format:
```markdown
# Frontend Module Governance

## Module Audit Results (YYYY-MM-DD)

### Removed Modules
| Module | Reason | Date Removed |
|--------|--------|--------------|
| @nuxt/content | Zero runtime usage | - |
| @nuxt/image | Zero runtime usage | - |
| @formkit/auto-animate/nuxt | Zero runtime usage | - |

### Retained Modules
| Module | Justification |
|--------|---------------|
| @nuxt/ui | Active UI component library usage |
| @nuxtjs/i18n | Critical for multi-language support |
| ... | ... |

### Governance Rules
1. Module must have verified usage before installation
2. Audit annually or before major upgrades
3. Prefer native solutions over modules when feasible
```

---

## Warning Issues (Should Fix)

### 3. Spec Requirements Not Implemented
**Issue:** Spec requirements from delta specs are not reflected in the codebase.

**From `frontend-module-governance/spec.md`:**
- Requirement: "Nuxt Module Usage Must Be Verifiable" - Not implemented
- Requirement: "Verified Unused Modules Can Be Removed Safely" - Not implemented
- Requirement: "Retained Modules Require Documented Justification" - Not implemented

**From `public-website/spec.md`:**
- Requirement: "Public Website Behavior Survives Module Cleanup" - Cannot verify, cleanup not done

**Recommendation:**
After completing the module removal, update tasks.md to mark completion and verify public pages still work.

---

### 4. Design Decision Not Followed
**Issue:** Design specifies evidence-based removal, but no audit has been performed.

**Design States:**
> "Modules will only be removed if config registration, imports, and runtime usage checks all indicate they are not contributing to current behavior."

**Current State:**
- Config registration: EXISTS (all modules still in nuxt.config.ts)
- Imports/Usage checks: NOT PERFORMED as official audit
- Runtime checks: NOT PERFORMED

**Recommendation:**
Follow the design's evidence-based approach:
1. Document evidence for each candidate module
2. Categorize based on findings
3. Remove only verified zero-usage modules

---

## Suggestion Issues (Nice to Fix)

### 5. Unused Module Detection Could Be Automated
**Suggestion:** Consider adding a pre-commit hook or CI check to detect unused Nuxt modules.

**Example Approach:**
```bash
# Script to check module usage
# Search for common module-specific imports/patterns
# Report modules with zero usage
```

---

## Verification Details

### Module Usage Audit Results

| Module | Config | Package | Code Usage | Decision |
|--------|--------|---------|------------|----------|
| `@nuxt/content` | ✓ | ✓ | ❌ None | **REMOVE** |
| `@nuxt/image` | ✓ | ✓ | ❌ None | **REMOVE** |
| `@formkit/auto-animate/nuxt` | ✓ | ✓ | ❌ None | **REMOVE** |
| `nuxt-security` | ✓ (config) | ✓ | ⚠️ Config only | **EVALUATE** |

**Code Search Performed:**
```bash
# Content module
grep -r "NuxtContent\|queryContent\|<Content" frontend/app/ # No results

# Image module  
grep -r "NuxtImg\|nuxt-img" frontend/app/ # No results

# Auto-animate module
grep -r "auto-animate\|v-auto-animate" frontend/app/ # No results
```

---

## Final Assessment

**❌ NOT READY FOR ARCHIVE**

**8 critical issues found:**
1. Zero tasks marked complete in tasks.md
2. No module removal performed
3. No governance documentation created
4. Spec requirements not implemented
5. Design evidence-based approach not followed

**Required Actions:**
1. Perform module audit and update tasks.md
2. Remove verified unused modules from package.json and nuxt.config.ts
3. Run build/type checks to verify no regressions
4. Create MODULE_GOVERNANCE.md documentation
5. Mark tasks complete in tasks.md
6. Re-run verification

**Estimated Effort to Complete:** 2-4 hours

---

## Files Requiring Changes

| File | Changes Needed |
|------|----------------|
| `frontend/package.json` | Remove: @nuxt/content, @nuxt/image, @formkit/auto-animate |
| `frontend/nuxt.config.ts` | Remove module registrations for above |
| `openspec/changes/remove-unused-nuxt-modules/tasks.md` | Mark tasks complete |
| `frontend/docs/MODULE_GOVERNANCE.md` | Create new documentation |

---

*Verification performed: Based on artifact comparison with current codebase state*
