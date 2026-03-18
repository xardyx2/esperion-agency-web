# frontend-ux-cleanup Proposal

## Problem Statement

Several UX issues affect user experience and conversion:

1. **Language & Theme toggles in wrong location** - Currently in navbar, should be in footer for better UX
2. **Language switcher not functional** - Import/initialization issue with useI18n
3. **Theme toggle not responding** - May be module or cache issue
4. **Social media icons/links incorrect** - Need verification and update

## Proposed Solution

### 1. Move Toggles to Footer

**Current:** Language switcher + theme toggle in navigation bar (MainNav.vue)

**Target:** Move to footer (SiteFooter.vue) for:
- Cleaner navigation
- Better footer utility
- Consistent with modern web patterns

**Implementation:**
- Add LanguageSwitcher component to SiteFooter.vue
- Add theme toggle button to SiteFooter.vue
- Remove from MainNav.vue (cleaner navbar)

### 2. Fix Language Switcher

**Issue:** Missing import for useI18n

**Fix:**
```typescript
import { useI18n } from '#i18n'
// OR use localePath from Nuxt i18n module
```

### 3. Fix Theme Toggle

**Issue:** Toggle button not responding

**Fix:**
- Verify @nuxtjs/color-mode module loaded
- Check toggle click handler
- Clear browser/build cache

### 4. Update Social Media Links

**Current handles need verification:**
- Instagram: @esperion_id
- Facebook: esperiondigital
- LinkedIn: /company/esperiondigital
- TikTok: @esperion_id
- Twitter/X: @esperion_id

**Action:** Confirm correct handles with client, update if needed.

## Scope

### In Scope (Change 4)
- ✅ Fix LanguageSwitcher import/initialization
- ✅ Move language switcher to footer
- ✅ Move theme toggle to footer
- ✅ Remove toggles from navbar
- ✅ Verify language toggle works
- ✅ Verify theme toggle works
- ✅ Update social media handles (pending correct info from client)
- ✅ Force Docker rebuild + browser cache clear

### Out of Scope
- ❌ Change language mixing pattern (already done)
- ❌ Modify banner slider functionality (separate change)
- ❌ Add new social platforms
- ❌ Redesign footer layout

## Success Criteria

1. **Language switcher in footer** - Functional dropdown/buttons
2. **Theme toggle in footer** - Switches light/dark mode
3. **Navbar cleaner** - No toggle buttons in navbar
4. **No console errors** - i18n and colorMode working
5. **Social media links correct** - Verified with client
6. **Docker rebuild successful** - Latest code served

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| i18n module config issue | Medium | High | Check nuxt.config.ts, verify module loaded |
| Toggle placement looks odd | Low | Medium | Test design, adjust spacing/padding |
| Social handles change | Medium | Low | Use placeholders until confirmed |
| Cache prevents testing | High | Medium | Force Docker rebuild + hard refresh |

## Timeline Estimate

- **Language switcher fix**: 30 min
- **Move toggles to footer**: 1 hour
- **Theme toggle verification**: 30 min
- **Social media update**: 15 min (once handles confirmed)
- **Testing + cache clear**: 30 min
- **Total**: ~2.5 hours

## Files to Modify

1. `frontend/app/components/ui/LanguageSwitcher.vue` - Fix import
2. `frontend/app/components/Footer/SiteFooter.vue` - Add toggles
3. `frontend/app/components/Navigation/MainNav.vue` - Remove toggles
4. `frontend/nuxt.config.ts` - Verify i18n + colorMode modules
