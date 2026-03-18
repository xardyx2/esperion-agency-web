# Design: Fix Banner Slider Animation

## Current State

### Architecture
```
┌─────────────────────────────────────────┐
│         Banner Section (500px)          │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────┐   │
│  │      Slide Container            │   │
│  │  ┌──────────┐ ┌──────────┐     │   │
│  │  │  Slide 1 │ │  Slide 2 │ ... │   │
│  │  │ (active) │ │          │     │   │
│  │  └──────────┘ └──────────┘     │   │
│  │     opacity: 1    opacity: 0    │   │
│  │     z-index: 2    z-index: 1    │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### Current Implementation
- **File**: `frontend/app/pages/index.vue`
- **Lines**: 4-106 (template), 935-962 (styles)
- **Animation Type**: Fade (opacity transition)
- **Transition Group**: Vue `<TransitionGroup name="banner">`
- **Visibility Control**: `v-show="currentSlide === index"`

### Current CSS (Problematic)
```css
.banner-enter-active,
.banner-leave-active {
  transition: opacity 500ms ease-in-out; /* PROBLEM: Only fade */
}

.banner-enter-from,
.banner-leave-to {
  opacity: 0;
}
```

### Issues Identified
1. `v-show` dengan `TransitionGroup` tidak trigger enter/leave transitions dengan baik
2. Opacity-only transition = instant appearance (fade)
3. Tidak ada directional slide animation

---

## Target State

### Architecture
```
┌─────────────────────────────────────────┐
│         Banner Section (500px)          │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────┐   │
│  │      Slide Container            │   │
│  │  ┌──────────┐ ┌──────────┐     │   │
│  │  │  Slide 2 │ │  Slide 1 │     │   │
│  │  │ ← enters │ │ exits  → │     │   │
│  │  │ 100%→0%  │ │ 0%→-100% │     │   │
│  │  └──────────┘ └──────────┘     │   │
│  │  transform-based animation      │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### New CSS (Solution)
```css
/* Transform-based slide animation */
.banner-enter-active,
.banner-leave-active {
  transition: transform 500ms cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}

/* Next slide: enter from right */
.banner-enter-from {
  transform: translateX(100%);
}
.banner-enter-to {
  transform: translateX(0);
}

/* Current slide: leave to left */
.banner-leave-from {
  transform: translateX(0);
}
.banner-leave-to {
  transform: translateX(-100%);
}

.banner-slide {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.banner-slide.active {
  z-index: 2;
}
```

### Animation Flow

**Next Slide Animation:**
```
Start State:
┌────────────┐┌────────────┐
│  Current   ││   Next     │ (off-screen right)
│  x: 0%     ││  x: 100%   │
└────────────┘└────────────┘

Mid Animation (250ms):
┌────────────┐┌────────────┐
│  Current   ││   Next     │
│  x: -50%   ││  x: 50%    │
└────────────┘└────────────┘

End State:
             ┌────────────┐
             │   Next     │
             │  x: 0%     │
             └────────────┘
```

**Previous Slide Animation:**
Reverse direction (slide from left)

---

## Component Structure

### Template (No Changes)
```vue
<section class="relative h-[500px] md:h-[600px] overflow-hidden"
  @mouseenter="pauseAutoPlay"
  @mouseleave="resumeAutoPlay"
  @touchstart="handleTouchStart"
  @touchend="handleTouchEnd"
>
  <TransitionGroup name="banner" mode="out-in">
    <div
      v-for="(slide, index) in bannerSlides"
      :key="slide.id"
      v-show="currentSlide === index"
      class="banner-slide absolute inset-0"
    >
      <!-- Slide content: gradient, img, text, CTA -->
    </div>
  </TransitionGroup>
  
  <!-- Dot Navigation -->
  <!-- Arrow Navigation -->
</section>
```

### JavaScript (No Changes)
- `currentSlide = ref(0)` - Active slide index
- `startAutoPlay()` - 5000ms interval
- `pauseAutoPlay()` - On hover
- `resumeAutoPlay()` - On mouseleave
- `prevSlide()` / `nextSlide()` - Manual nav
- `handleTouchStart()` / `handleTouchEnd()` - Swipe
- Keyboard handlers - Arrow keys

### CSS (Modified)
Only the `.banner-*` transition classes change.

---

## Technical Decisions

### Decision 1: Keep `v-show` vs Switch to `v-if`
**Decision**: Keep `v-show`
**Rationale**: 
- `v-show` lebih performa untuk frequent toggles
- Dapat dicapai dengan CSS transform positioning
- Tidak perlu DOM re-create

### Decision 2: Use `mode="out-in"` on TransitionGroup
**Decision**: Add `mode="out-in"` (optional)
**Rationale**: 
- Ensures old slide leaves before new enters
- Prevents z-fighting during transition
- Slightly longer transition but cleaner

### Decision 3: Direction-Aware Animation
**Decision**: Bidirectional (slide direction based on prev/next)
**Rationale**: 
- Natural UX - matches navigation direction
- Requires tracking direction in state
- Can be added as enhancement later

**Implementation**: Keep simple unidirectional for now (always slide left)

### Decision 4: CSS Variable Timing
**Decision**: Use existing `--es-transition-duration`
**Rationale**: 
- Consistent dengan design system
- Already defined in `:root`
- Easy to customize

---

## Files to Modify

| File | Lines | Changes |
|------|-------|---------|
| `frontend/app/pages/index.vue` | 935-962 | Replace `.banner-*` CSS classes |
| `frontend/app/pages/index.vue` | 14 | Add `:class="{ 'active': currentSlide === index }"` (optional) |

---

## Testing Strategy

### Visual QA
1. Auto-rotate animation (5 detik)
2. Manual navigation (dots)
3. Manual navigation (arrows)
4. Touch swipe (mobile viewport)
5. Keyboard navigation (arrow keys)
6. Pause on hover

### Regression Testing
Verify all existing features still work:
- Auto-rotate timing
- Pause/resume behavior
- Touch threshold (50px)
- Keyboard shortcuts
- Dot active state

### Performance Checks
- No layout thrashing
- `will-change` used appropriately
- 60fps animation

---

## Rollback Plan

If issues arise:
1. Revert CSS changes to original opacity-based transitions
2. Git: `git checkout HEAD -- frontend/app/pages/index.vue`
3. Redeploy

**Rollback Time**: < 5 minutes

---

## Accessibility Considerations

### Preserved
- Keyboard navigation (arrow keys)
- Screen reader announcements (aria-labels)
- Focus indicators on buttons
- Touch gestures

### Enhanced
- Reduced motion support (add `@media (prefers-reduced-motion)`)
```css
@media (prefers-reduced-motion: reduce) {
  .banner-enter-active,
  .banner-leave-active {
    transition: opacity 500ms;
    transform: none;
  }
}
```

**Decision**: Add reduced motion support as enhancement.
