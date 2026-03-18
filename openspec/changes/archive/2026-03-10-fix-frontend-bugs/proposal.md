# fix-frontend-bugs Proposal

## Problem Statement

Users experience several frontend issues blocking optimal user experience:

1. **Dark mode becomes unresponsive** after multiple clicks and navigation between pages
2. **Theme transitions are abrupt** - no smooth color animation when switching modes
3. **Works carousel lacks auto-slide** - requires manual navigation only

## Proposed Solution

### 1. Fix Dark Mode Toggle Consistency
**Root Cause Investigation Required**
- Test toggle 10+ times while navigating between pages
- Check for SSR/hydration mismatches
- Verify localStorage persistence
- Check console for colorMode errors

**Expected Fix:**
- Theme toggle works consistently across all pages
- No stuck states after repeated interactions
- Proper persistence after page refresh

### 2. Add Smooth Theme Transitions
**Implementation:**
```css
html {
  transition: background-color 300ms ease, color 300ms ease;
}

* {
  transition-property: background-color, border-color, color;
  transition-duration: 300ms;
  transition-timing-function: ease-in-out;
}
```

### 3. Add Auto-Slide to Works Carousel
**Requirements:**
- Display 1 card on mobile, 3 cards on desktop
- Auto-slide every 5 seconds
- Loop through max 5 featured works
- Keep manual navigation arrows functional
- Pause animation on hover

**Implementation:**
```javascript
let worksInterval: NodeJS.Timeout;
onMounted(() => {
  worksInterval = setInterval(() => {
    currentWorkSlide.value = (currentWorkSlide.value + 1) % (featuredWorks.value.length - worksVisible.value + 1);
  }, 5000);
});
```

## Scope

### In Scope (Change 1)
- ✅ Fix dark mode stuck issue
- ✅ Add smooth theme transitions (300ms)
- ✅ Add auto-slide to Works carousel
- ✅ Test and verify all fixes

### Out of Scope (Change 2)
- ❌ Add Threads social icon (user said skip)
- ❌ Replace client logo placeholders
- ❌ Language switcher deep fixes (already functional)
- ❌ Detail page fixes (already working)

## Success Criteria

1. **Dark mode toggle**: Can click 20+ times while navigating without getting stuck
2. **Theme transitions**: Smooth 300ms color fade when switching
3. **Works carousel**: Auto-advances every 5s, loops 5 works, manual nav still works
4. **Zero console errors** related to colorMode or carousel
5. **All tests pass**: Existing Playwright + Vitest tests

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Dark mode issue hard to reproduce | Medium | High | Extended browser testing, console monitoring |
| CSS transitions affect performance | Low | Medium | Test on low-end devices, adjust duration if needed |
| Auto-slide conflicts with manual nav | Low | Medium | Pause on hover, reset timer on manual nav |
| SSR hydration mismatch | Medium | High | Ensure colorMode preference loaded client-side only |

## Timeline Estimate

- **Investigation**: 1-2 hours
- **Implementation**: 2-3 hours
- **Testing**: 1-2 hours
- **Total**: 4-7 hours

## Files to Modify

1. `frontend/app/assets/css/main.css` - Add transitions
2. `frontend/app/pages/index.vue` - Add auto-slide to works carousel
3. `frontend/app/components/Navigation/MainNav.vue` - Potential dark mode fix
4. `frontend/nuxt.config.ts` - Potential colorMode config adjustment
