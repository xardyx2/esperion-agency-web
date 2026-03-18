## 1. Fix Banner Slider Transitions

- [x] 1.1 Update banner slide rendering to use CSS classes instead of `v-show` + opacity class binding
- [x] 1.2 Change transition duration from `duration-1000` (1s) to `duration-500` (0.5s)
- [x] 1.3 Add CSS classes `.active-slide` and `.inactive-slide` with proper transition hooks
- [x] 1.4 Verify fade animation matches Vue.js smooth feel (no instant jump)
- [x] 1.5 Test pause-on-hover works correctly with new transition

**Estimated time:** 45 minutes  
**File:** `frontend/app/pages/index.vue`  
**Acceptance criteria:**
- Banner slides fade in/out smoothly over 500ms
- No instant jump between slides
- Pause on hover stops auto-rotation
- Resume continues from current slide

---

## 2. Implement Client Logos Marquee Scroll

- [x] 2.1 Replace current transform-based scroll with CSS marquee animation
- [x] 2.2 Add `marquee-container` class with `overflow: hidden` and gradient mask
- [x] 2.3 Add `marquee-track` class with 30s linear infinite animation
- [x] 2.4 Implement pause-on-hover using `animation-play-state: paused`
- [x] 2.5 Add arrow navigation buttons (previous/next) with Heroicons
- [x] 2.6 Implement `scrollLogos(direction)` function to override marquee on arrow click
- [x] 2.7 Add responsive logic: 2 logos visible on mobile, 4 on tablet, 6 on desktop

**Estimated time:** 1 hour  
**File:** `frontend/app/pages/index.vue`  
**Acceptance criteria:**
- Logos scroll seamlessly without pauses
- Marquee loops infinitely (no jump at end)
- Pause on hover stops scroll
- Arrow buttons allow manual navigation
- Responsive item counts work at all breakpoints

---

## 3. Enhance Featured Works Carousel

- [x] 3.1 Add hover effects: card lift (`translateY(-8px)`) and image zoom (`scale(1.05)`)
- [x] 3.2 Update Works track transition to use `cubic-bezier(0.4, 0, 0.2, 1)` easing
- [x] 3.3 Enhance arrow button styling with hover effects and disabled states
- [x] 3.4 Add accessibility labels to arrow buttons (`aria-label`)
- [x] 3.5 Update disabled state logic: left arrow disabled when `currentWorkSlide === 0`
- [x] 3.6 Verify 3D transform performance (60fps on hover)

**Estimated time:** 45 minutes  
**File:** `frontend/app/pages/index.vue`  
**Acceptance criteria:**
- Card hover effect lifts card smoothly
- Image zoom adds depth on hover
- Arrow buttons have visual hover feedback
- Disabled arrows show 30% opacity
- Slide transitions are smooth with material easing

---

## 4. Add Mobile Touch Gestures

- [x] 4.1 Implement touch start/end handlers for swipe detection
- [x] 4.2 Add swipe threshold logic (50px horizontal, 100px vertical)
- [x] 4.3 Map swipe left → next slide, swipe right → previous slide
- [x] 4.4 Prevent swipe from interfering with page scrolling
- [x] 4.5 Hide arrow buttons on mobile (< 768px)
- [x] 4.6 Test on real mobile device or browser.devtools mobile emulation

**Estimated time:** 30 minutes  
**File:** `frontend/app/pages/index.vue`  
**Acceptance criteria:**
- Swipe gestures work on mobile only
- Horizontal swipes navigate slides correctly
- Vertical swipes don't interfere with page scroll
- Arrows hidden on mobile (only use swipe)
- No console errors on touch events

---

## 5. Keyboard Navigation Enhancement

- [x] 5.1 Verify existing keyboard navigation (ArrowLeft/ArrowRight) still works
- [x] 5.2 Add keyboard support for client logos marquee
- [x] 5.3 Add focus management for arrow buttons (tab order)
- [x] 5.4 Ensure arrow buttons are reachable via keyboard navigation
- [x] 5.5 Test with screen reader (NVDA/JAWS/VoiceOver)

**Estimated time:** 20 minutes  
**File:** `frontend/app/pages/index.vue`  
**Acceptance criteria:**
- All arrow buttons accessible via Tab key
- Arrow keys navigate banner and works carousel
- Logo marquee can be controlled via keyboard
- Screen readers announce button purposes

---

## 6. CSS Style Cleanup

- [x] 6.1 Remove any duplicate transition definitions from global CSS
- [x] 6.2 Add semantic class names (`.active-slide`, `.inactive-slide`, etc.)
- [x] 6.3 Ensure dark mode support for all new styles
- [x] 6.4 Verify no hardcoded hex colors (use design tokens)
- [x] 6.5 Add CSS variables for animation timings ( easier tweaking)

**Estimated time:** 15 minutes  
**File:** `frontend/app/pages/index.vue` (inline `<style>`)  
**Acceptance criteria:**
- No duplicate CSS rules
- All colors use semantic tokens (bg-es-bg-primary, etc.)
- Animation timings defined as CSS variables
- Dark mode styles complete
- No syntax errors

---

## 7. Testing & Verification

- [x] 7.1 Test banner slider: auto-rotate, pause, resume, arrows, keyboard, swipe
- [x] 7.2 Test client logos: continuous scroll, pause, arrows, keyboard, swipe
- [x] 7.3 Test featured works: hover effects, slide transitions, arrows, keyboard
- [x] 7.4 Test on desktop (1920px): all features work
- [x] 7.5 Test on tablet (768px): responsive items, arrows visible
- [x] 7.6 Test on mobile (375px): swipe only, arrows hidden, fewer items
- [x] 7.7 Verify no console errors in browser DevTools
- [x] 7.8 Run `npm run type-check` - no TypeScript errors
- [x] 7.9 Verify Lighthouse performance score > 90
- [x] 7.10 Test dark mode: all animations work in dark mode

**Estimated time:** 45 minutes  
**Files:** All `frontend/app/pages/index.vue` changes  
**Acceptance criteria:**
- All features work correctly at all breakpoints
- No console errors
- TypeScript compiles without errors
- Performance score maintained
- Dark mode fully supported

---

## 8. Commit

- [x] 8.1 Commit changes with message: `refactor: improve homepage animations (banner slider, marquee, works carousel)`
- [x] 8.2 Include breaking changes note if any (if any API changes)

**Estimated time:** 5 minutes  
**Files:** `frontend/app/pages/index.vue`  
**Acceptance criteria:**
- Clean commit message
- No uncommitted changes
- Git history readable

---

## Total Estimated Time: 4 hours

| Phase | Time |
|-------|------|
| 1. Banner Slider | 45 min |
| 2. Client Logos Marquee | 1 hour |
| 3. Featured Works Enhancement | 45 min |
| 4. Mobile Touch Gestures | 30 min |
| 5. Keyboard Navigation | 20 min |
| 6. CSS Cleanup | 15 min |
| 7. Testing & Verification | 45 min |
| 8. Commit | 5 min |
| **Total** | **4 hours** |
