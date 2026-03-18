## Context

Frontend experiencing critical issues affecting user experience:

1. **Scroll completely blocked** - Users cannot scroll any page
2. **Theme toggle unresponsive** after repeated use
3. **Theme transition too slow** (500ms vs industry standard 100-300ms)
4. **Gradient sweep animation over-engineered** - complex z-index 9999 overlay causing issues

Current implementation uses `@nuxtjs/color-mode` module correctly, but CSS implementation has side effects:
- `html { overflow: hidden; }` blocks all scrolling
- 500ms gradient sweep animation is too dramatic
- No industry-standard fallback for smooth color transitions

## Goals / Non-Goals

**Goals:**
- ✅ Restore scroll functionality immediately (remove overflow: hidden)
- ✅ Implement industry-standard theme transition (100-300ms CSS fade)
- ✅ Maintain @nuxtjs/color-mode module integration
- ✅ Ensure theme toggle works consistently across all pages
- ✅ Use CSS custom properties (CSS variables) for smooth color transitions
- ✅ Keep implementation simple and performant

**Non-Goals:**
- ❌ Gradient sweep animation (removed - too dramatic, causes scroll issues)
- ❌ Complex overlay effects (z-index 9999)
- ❌ Custom theme toggle logic (keep using @nuxtjs/color-mode)
- ❌ Carousel auto-slide (separate feature, not a bug fix)

## Decisions

### Decision 1: Remove `overflow: hidden` from HTML

**Chosen:** Remove `overflow: hidden` from html element entirely

**Rationale:**
- `overflow: hidden` completely blocks scrolling - CRITICAL bug
- Was added for gradient sweep animation overlay - not worth the side effect
- Alternative: Use `overflow-x: hidden` only if horizontal scroll needed

**Alternatives Considered:**
- Conditional overflow (hidden only during animation) - Too complex, race conditions
- Body overflow instead - Doesn't work with html pseudo-element overlay
- Keep overlay but make it not block scroll - Defeats the purpose

---

### Decision 2: Use Industry-Standard 100ms CSS Transition

**Chosen:** `transition: background-color 100ms ease, color 100ms ease`

**Rationale:**
- User requested 0.1s (100ms) - snappy, instant feel
- Industry benchmark: Nuxt.com uses instant (0ms) or 200-300ms
- 100ms is fast enough to feel instant, slow enough to see transition
- Better UX than 500ms "dramatic" animation

**Alternatives Considered:**
- 300ms standard fade - Too slow for user preference
- 0ms instant switch - Feels jarring, no visual feedback
- 500ms gradient sweep - Way too slow, causes scroll blocking

**CSS Implementation:**
```css
/* Apply transitions to html element for theme switch */
html {
  transition: background-color 100ms ease, color 100ms ease;
}

/* Apply to body and key elements for complete coverage */
body, * {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-duration: 100ms;
  transition-timing-function: ease-in-out;
}

/* Exclude performance-sensitive elements */
img, video, canvas, svg, iframe {
  transition: none;
}
```

---

### Decision 3: Simplify Theme Transition Approach

**Chosen:** Simple CSS color fade, NO overlay animation

**Rationale:**
- Industry standard (Nuxt.com, Nuxt UI, Vercel) uses simple fade
- No z-index overlays, no pseudo-elements, no complex animations
- Better performance (no layout thrashing)
- No scroll side effects
- Easier to maintain and debug

**Implementation:**
```css
/* Enable transitions on theme switch */
@media (prefers-reduced-motion: no-preference) {
  html {
    transition: background-color 100ms ease, color 100ms ease;
  }
  
  body, .dark body, .light body {
    transition-property: background-color, color;
    transition-duration: 100ms;
    transition-timing-function: ease;
  }
}
```

**Alternatives Considered:**
- Keep gradient sweep but fix scroll - Still over-engineered
- Temporary transition class approach - Good but adds JS complexity
- Nuxt UI's built-in transitions - Requires @nuxt/ui v3 components migration

---

### Decision 4: Keep @nuxtjs/color-mode Module Configuration

**Chosen:** Maintain current module setup, enable transitions

**Rationale:**
- Module already correctly configured
- `useColorMode()` composable works as expected
- No need to reinvent the wheel

**nuxt.config.ts (no changes needed):**
```typescript
colorMode: {
  classSuffix: '',  // Already correct - uses .dark not .dark-mode
  // disableTransition: false, // Not needed - we handle in CSS
}
```

---

### Decision 5: Add Selective Transition Targeting

**Chosen:** Apply transitions to semantic CSS custom properties only

**Rationale:**
- Prevents unwanted transitions on all CSS properties
- Better performance than `transition: all`
- More predictable behavior

**CSS:**
```css
/* Target only theme-related CSS custom properties */
:root, .dark {
  transition-property: 
    background-color, 
    color, 
    border-color,
    box-shadow;
  transition-duration: 100ms;
  transition-timing-function: ease-in-out;
}
```

---

## Risks / Trade-offs

### Risk 1: Some elements may still not transition smoothly

**Likelihood:** Medium  
**Impact:** Low  
**Mitigation:** 
- Test all components after implementation
- Add specific transition rules for problematic elements
- Use DevTools to inspect which properties aren't transitioning

---

### Risk 2: 100ms might be too fast for some users

**Likelihood:** Low  
**Impact:** Low  
**Mitigation:**
- Can adjust to 150ms or 200ms if user feedback warrants
- Provide `prefers-reduced-motion` fallback
- Test with different user groups

---

### Risk 3: Gradient sweep removal might feel like "loss"

**Likelihood:** Low  
**Impact:** Low  
**Mitigation:**
- Explain UX benefits (instant, no scroll lock, industry standard)
- Show side-by-side comparison if needed
- Can be re-added later as optional preference

---

### Trade-off: Simplicity over "wow" effect

**We chose:** Simple, performant, industry-standard approach

**What we lose:** "Dramatic" gradient sweep animation effect

**What we gain:**
- ✅ Scroll works
- ✅ Faster UX (100ms vs 500ms)
- ✅ Better performance
- ✅ Industry alignment
- ✅ Easier maintenance

---

## Migration Plan

### Phase 1: Remove Scroll Blocker (CRITICAL - Do First)

```bash
# Edit frontend/app/assets/css/main.css
# Remove or comment out:
html {
  position: relative;
  overflow: hidden;  /* ← REMOVE THIS LINE */
}
```

**Verification:**
- Test scroll on all pages (public + dashboard)
- No regression in other functionality

---

### Phase 2: Remove Gradient Sweep Animation

```bash
# Edit frontend/app/assets/css/main.css
# Remove entire gradient sweep block:
/* Theme gradient sweep animation */
html::before { ... }
html.theme-transitioning::before { ... }
@keyframes gradientSweep { ... }
```

**Verification:**
- No visual artifacts on theme switch
- No console errors

---

### Phase 3: Add 100ms CSS Transitions

```bash
# Edit frontend/app/assets/css/main.css
# Add at end of file or in theme section:

@media (prefers-reduced-motion: no-preference) {
  html {
    transition: background-color 100ms ease, color 100ms ease;
  }
  
  body, body * {
    transition-property: background-color, border-color, color, fill, stroke;
    transition-duration: 100ms;
    transition-timing-function: ease;
  }
  
  /* Exclude media elements for performance */
  img, video, canvas, svg, iframe {
    transition: none;
  }
}
```

**Verification:**
- Toggle theme - should see smooth 100ms fade
- No jank or performance issues
- Works on mobile and desktop

---

### Phase 4: Simplify Toggle Logic (Optional Cleanup)

```typescript
// Edit frontend/app/components/Navigation/MainNav.vue
// Simplify toggleTheme function (remove class management):

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark';
  // No more setTimeout, no theme-transitioning class
};
```

**Verification:**
- Toggle still works
- No dependency on CSS class timing

---

### Rollback Strategy

If issues arise:
```bash
# 1. Revert main.css changes
git checkout HEAD -- frontend/app/assets/css/main.css

# 2. Revert MainNav.vue changes
git checkout HEAD -- frontend/app/components/Navigation/MainNav.vue

# 3. Restart frontend
docker-compose restart frontend
```

---

## Open Questions

1. **Should we add user preference for transition duration?**
   - Store in localStorage?
   - Add settings toggle: "Fast (100ms)" vs "Smooth (300ms)"?
   
2. **Should we support `prefers-reduced-motion` explicitly?**
   - Accessibility best practice
   - Disable transitions for users who prefer reduced motion

3. **Test on low-end devices?**
   - 100ms might be too fast on very slow devices
   - May need adaptive duration based on device capability

---

## Success Metrics

- [ ] Scroll works on all pages immediately
- [ ] Theme toggle responds on every click (test 20+ times)
- [ ] Theme transition completes in ~100ms (measure with DevTools)
- [ ] No console errors related to colorMode
- [ ] Lighthouse performance score maintained or improved
- [ ] Works on mobile (iOS Safari, Android Chrome)
