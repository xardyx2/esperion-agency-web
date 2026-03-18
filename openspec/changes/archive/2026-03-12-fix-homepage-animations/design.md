# Fix Homepage Animations Design

## Context

**Current State (from code analysis):**
- **Banner Slider**: Uses `transition-opacity duration-1000` (1 second), but user reports instant feel due to `v-show` behavior with opacity
- **Client Logos**: Step-by-step transform slide with 3-second interval, not continuous marquee
- **Featured Works Carousel**: Transform slide with 5-second interval, similar step-by-step animation
- **Navigation**: Arrow buttons exist for banner and works, but marquee scroll needed for logos

**User Requirements:**
1. Banner slider: Smooth fade like Vue.js (0.5-1s transition, no instant jump)
2. Client logos: Continuous marquee scroll with arrow navigation
3. Featured works: Smoother animations with hover effects

## Goals / Non-Goals

**Goals:**
- Banner: Smooth 0.5s opacity fade with proper CSS transition (not CSS animation)
- Client logos: Endless CSS marquee scroll (no pauses) with pause-on-hover
- Featured works: Enhanced hover effects and smoother slide transitions
- All carousels: Arrow navigation for manual control
- Mobile: Touch/swipe support and responsive adjustments

**Non-Goals:**
- No structural changes to component layout
- No content addition/removal
- No color/style changes (use existing Esperion design tokens)
- No new dependencies (stick to Vue 3 + CSS transitions)

## Decisions

### Decision 1: Banner Slider - Fix CSS Transition Issue

**Current Problem:**
```vue
<!-- Current implementation -->
<div 
  v-for="(slide, index) in bannerSlides" 
  :key="slide.id"
  v-show="currentSlide === index"
  class="absolute inset-0 transition-opacity duration-1000"
  :class="{ 'opacity-100': currentSlide === index, 'opacity-0': currentSlide !== index }"
>
```

**Issue:** `v-show` toggles `display: none/block`, which overrides opacity transition. The element is immediately hidden/shown regardless of opacity value.

**Chosen Solution:** Use CSS classes with proper transition hook
```vue
<!-- Fixed implementation -->
<div 
  v-for="(slide, index) in bannerSlides" 
  :key="slide.id"
  class="absolute inset-0 transition-opacity duration-500 ease-in-out"
  :class="{ 
    'opacity-100 active-slide': currentSlide === index, 
    'opacity-0 inactive-slide': currentSlide !== index 
  }"
>
```

```css
/* Add to component <style> or global CSS */
.active-slide {
  opacity: 1;
  transition: opacity 500ms ease-in-out;
}

.inactive-slide {
  opacity: 0;
  transition: opacity 500ms ease-in-out;
}
```

**Rationale:**
- Matches Vue.js smooth fade behavior
- 500ms interval is industry standard (Nuxt.com uses 300-500ms)
- CSS classes ensure transition hook fires properly
- `ease-in-out` creates natural acceleration/deceleration

---

### Decision 2: Client Logos - CSS Marquee Scroll

**Current Problem:**
```vue
<!-- Current implementation -->
<div 
  class="flex transition-transform duration-500 ease-in-out"
  :style="{ transform: `translateX(-${currentLogoSlide * (100 / logosVisible)}%)` }"
>
```

**Issue:** Uses JavaScript-controlled transform with `currentLogoSlide` ref, causing step-by-step jumps every 3 seconds.

**Chosen Solution:** Pure CSS infinite marquee with parallax speed
```vue
<!-- Fixed implementation -->
<div class="marquee-container overflow-hidden">
  <div class="marquee-track">
    <div 
      v-for="client in [...clients, ...clients]" 
      :key="client.id"
      class="marquee-item"
    >
      <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-lg p-6 h-24 flex items-center justify-center hover:shadow-lg transition-shadow">
        <img :src="client.logo" :alt="client.name" class="max-h-16 w-auto object-contain" />
      </div>
    </div>
  </div>
</div>
```

```css
/* CSS Marquee Styles */
.marquee-container {
  overflow: hidden;
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}

.marquee-track {
  display: flex;
  animation: marquee 30s linear infinite;
  will-change: transform;
}

.marquee-item {
  flex-shrink: 0;
  width: 16.666%; /* 100% / 6 items per visible set */
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* Pause on hover */
.marquee-container:hover .marquee-track {
  animation-play-state: paused;
}
```

**Arrow Navigation Integration:**
```vue
<!-- Previous/Next buttons override animation -->
<button
  @click="pauseMarquee; scrollLogos(-1); resumeMarquee"
  class="marquee-arrow-left"
>
  ←
</button>
<button
  @click="pauseMarquee; scrollLogos(1); resumeMarquee"
  class="marquee-arrow-right"
>
  →
</button>
```

**Rationale:**
- CSS marquee is smoother than JS-controlled transform
- Infinite seamless scroll (parallax effect)
- Pause on hover for better UX
- Arrow buttons temporarily override auto-scroll
- No JavaScript animation frame overhead

---

### Decision 3: Featured Works Carousel - Enhanced Transitions

**Current Implementation:**
```vue
<div 
  class="flex transition-transform duration-500 ease-in-out"
  :style="{ transform: `translateX(-${currentWorkSlide * (100 / worksVisible)}%)` }"
>
```

**Chosen Solution:** Add hover effects and smoother slide transitions
```vue
<div class="relative works-carousel">
  <div class="works-track">
    <NuxtLink
      v-for="work in featuredWorks"
      :key="work.id"
      :to="localePath(`/our-works/${work.slug}`)"
      class="works-card"
    >
      <!-- Card content -->
    </NuxtLink>
  </div>
  
  <!-- Navigation arrows -->
  <button @click="prevWork" class="works-arrow-left">←</button>
  <button @click="nextWork" class="works-arrow-right">→</button>
</div>
```

```css
/* Enhanced Works Carousel Styles */
.works-carousel {
  position: relative;
}

.works-track {
  display: flex;
  transition: transform 500ms cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}

.works-card {
  flex-shrink: 0;
  transition: transform 200ms ease;
}

.works-card:hover {
  transform: translateY(-8px);
}

.works-card img {
  transition: transform 400ms ease;
}

.works-card:hover img {
  transform: scale(1.05);
}

/* Arrow buttons */
.works-arrow-left,
.works-arrow-right {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 200ms ease;
}

.works-arrow-left:hover,
.works-arrow-right:hover {
  background: var(--es-accent-primary);
  color: var(--es-text-inverse);
  transform: translateY(-50%) scale(1.1);
}

.works-arrow-left {
  left: -24px;
}

.works-arrow-right {
  right: -24px;
}

.works-arrow-left:disabled,
.works-arrow-right:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  transform: translateY(-50%);
}
```

**Rationale:**
- `cubic-bezier(0.4, 0, 0.2, 1)` matches Vue.js easing (material design)
- Hover lift effect (`translateY(-8px)`) adds interactivity
- Image zoom on hover creates depth
- Arrow buttons have hover effects and disabled states
- Smooth 200ms transitions for subtle interactions

---

### Decision 4: Pause/Resume Logic

**Chosen Implementation:**
```typescript
// Banner (Slide-based)
const pauseAutoPlay = () => { isPaused.value = true; clearInterval(bannerInterval); }
const resumeAutoPlay = () => {
  isPaused.value = false;
  clearInterval(bannerInterval);
  bannerInterval = setInterval(nextSlide, 5000);
}

// Works Carousel (Slide-based)
const pauseCarousel = () => { clearInterval(worksInterval); }
const resumeCarousel = () => {
  clearInterval(worksInterval);
  worksInterval = setInterval(nextWorkAuto, 5000);
}

// Marquee (CSS-based)
const pauseMarquee = () => {
  marqueeRef.value.style.animationPlayState = 'paused';
}
const resumeMarquee = () => {
  marqueeRef.value.style.animationPlayState = 'running';
}
```

**Rationale:**
- Banner/Works:JavaScript interval control needed for step-by-step navigation
- Marquee: CSS `animation-play-state` property allows pause/resume without resetting position
- User interaction RESETS intervals (as per current code)

---

### Decision 5: Mobile Considerations

**Responsive Adjustments:**
```typescript
const updateResponsive = () => {
  if (window.innerWidth < 768) {
    // Mobile: Hide arrows
    worksArrowLeft.value.style.display = 'none';
    worksArrowRight.value.style.display = 'none';
    logosVisible.value = 2; // Show 2 logos on mobile
  } else if (window.innerWidth < 1024) {
    // Tablet
    worksArrowLeft.value.style.display = 'flex';
    worksArrowRight.value.style.display = 'flex';
    worksVisible.value = 2;
    logosVisible.value = 4;
  } else {
    // Desktop
    worksArrowLeft.value.style.display = 'flex';
    worksArrowRight.value.style.display = 'flex';
    worksVisible.value = 3;
    logosVisible.value = 6;
  }
}
```

**Touch/Swipe Support:**
```typescript
// Add swipe gestures for mobile
const touchStartX = ref(0);
const touchEndX = ref(0);

const handleTouchStart = (event: TouchEvent) => {
  touchStartX.value = event.changedTouches[0].screenX;
}

const handleTouchEnd = (event: TouchEvent) => {
  touchEndX.value = event.changedTouches[0].screenX;
  handleSwipe();
}

const handleSwipe = () => {
  const swipeThreshold = 50; // px
  if (touchEndX.value < touchStartX.value - swipeThreshold) {
    nextSlide(); // Swipe left → next
  }
  if (touchEndX.value > touchStartX.value + swipeThreshold) {
    prevSlide(); // Swipe right → prev
  }
}
```

**Rationale:**
- Mobile users prefer swipe over arrow buttons
- Hide arrows on mobile to save space
- Show fewer items on smaller screens
- Swipe threshold of 50px prevents accidental navigation

## Risks / Trade-offs

### Risk 1: CSS Marquee Performance
**Mitigation:** Use `will-change: transform` and `transform` instead of `margin-left`
**Impact:** Low - CSS animations are hardware accelerated

### Risk 2: Arrow Buttons Overlap Content on Small Screens
**Mitigation:** Use responsive CSS to show/hide arrows based on screen size
**Impact:** Low - Absolute positioning with z-index ensures proper layering

### Risk 3: Transition Conflicts with opacity/flex display
**Mitigation:** Use CSS classes with proper transition hooks instead of v-show
**Impact:** Low - Standard Vue transition pattern

## Component Structure Changes

### Banner Slider (frontend/app/pages/index.vue)
```
Section: Banner Slider (lines 4-76)
- Update v-for loop to use CSS classes for opacity transitions
- Keep arrow navigation (already exists)
- Keep dot navigation (already exists)
- Add pause/resume on mouseenter/mouseleave
- Add keyboard navigation (already exists)
```

### Client Logos (frontend/app/pages/index.vue)
```
Section: Client Stats & Logos (lines 151-194)
- Replace transform-based scroll with CSS marquee
- Add pause-on-hover via CSS animation-play-state
- Add arrow navigation buttons
- Keep responsive logic for visible items
```

### Featured Works (frontend/app/pages/index.vue)
```
Section: Featured Works (lines 196-278)
- Enhance hover effects with translateY and image zoom
- Update arrow button styling
- Add disabled states for arrows
- Keep current slide logic
```

## CSS Animation Specifications

### Banner Slider Transition
```css
.slide-transition {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 500ms ease-in-out;
  z-index: 1;
}

.slide-transition.active-slide {
  opacity: 1;
  z-index: 2;
}
```

**Timing:** 500ms (0.5 seconds)  
**Easing:** `ease-in-out` (natural acceleration/deceleration)  
**Property:** `opacity` only (no transform for performance)

---

### CSS Marquee for Client Logos
```css
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.marquee-track {
  display: flex;
  animation: marquee 30s linear infinite;
  will-change: transform;
}
```

**Timing:** 30 seconds for full loop (adjustable via CSS variable)  
**Easing:** `linear` (constant speed for seamless scroll)  
**Property:** `transform: translateX` (hardware accelerated)

---

### Featured Works Slide Transition
```css
.works-track {
  display: flex;
  transition: transform 500ms cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}

.works-card {
  transition: transform 200ms ease;
}

.works-card:hover {
  transform: translateY(-8px);
}
```

**Slide Transition Timing:** 500ms  
**Slide Transition Easing:** `cubic-bezier(0.4, 0, 0.2, 1)` (material design)  
**Hover Transition Timing:** 200ms  
**Hover Transition Easing:** `ease` (simple linear)

## Arrow Navigation Implementation

### Client Logos Arrows
```vue
<div class="client-logos-section">
  <!-- Marquee container -->
  <div ref="marqueeRef" class="marquee-container">
    <div class="marquee-track">
      <!-- Clients -->
    </div>
  </div>
  
  <!-- Arrow Navigation -->
  <button
    @click="scrollLogos(-1)"
    class="logos-arrow-left"
    aria-label="Previous client logos"
  >
    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  </button>
  <button
    @click="scrollLogos(1)"
    class="logos-arrow-right"
    aria-label="Next client logos"
  >
    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  </button>
</div>
```

**Scroll Function:**
```typescript
const scrollLogos = (direction: number) => {
  pauseMarquee();
  // Scroll by one item width
  const container = document.querySelector('.marquee-container');
  const item = document.querySelector('.marquee-item');
  if (container && item) {
    const itemWidth = item.offsetWidth;
    container.scrollBy({ left: direction * itemWidth, behavior: 'smooth' });
  }
  setTimeout(resumeMarquee, 500); // Resume after scroll completes
}
```

### Featured Works Arrows (Enhance Existing)
```vue
<!-- Already exists, just enhance styling -->
<button
  @click="prevWork"
  class="works-arrow-left"
  :disabled="currentWorkSlide === 0"
>
  ←
</button>
<button
  @click="nextWork"
  class="works-arrow-right"
  :disabled="currentWorkSlide >= featuredWorks.length - worksVisible"
>
  →
</button>
```

**Arrow Styling:**
- 48x48px circular buttons
- White/transparent background
- Hover: accent color
- Disabled: 30% opacity
- Show on desktop, hide on mobile (< 768px)

## Mobile Considerations

### Responsive Breakpoints
```
Mobile (375px-767px):
- Works visible: 1 card
- Logos visible: 2 items
- Arrow buttons: Hidden
- Swipe gesture: Enabled

Tablet (768px-1023px):
- Works visible: 2 cards
- Logos visible: 4 items
- Arrow buttons: Visible
- Swipe gesture: Optional

Desktop (1024px+):
- Works visible: 3 cards
- Logos visible: 6 items
- Arrow buttons: Visible
- Swipe gesture: Disabled
```

### Touch Gestures
```typescript
//Swipe detection
const touchStartX = ref(0);
const touchStartY = ref(0);
const swipeThreshold = 50; // px
const verticalSwipeThreshold = 100; // px (prevent scrolling interference)

const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0].screenX;
  touchStartY.value = e.touches[0].screenY;
}

const handleTouchEnd = (e: TouchEvent) => {
  const touchEndX = e.changedTouches[0].screenX;
  const touchEndY = e.changedTouches[0].screenY;
  const diffX = touchEndX - touchStartX.value;
  const diffY = touchEndY - touchStartY.value;
  
  // Horizontal swipe detection
  if (Math.abs(diffX) > swipeThreshold && Math.abs(diffY) < verticalSwipeThreshold) {
    if (diffX > 0) {
      prevSlide(); // Swipe right → previous
    } else {
      nextSlide(); // Swipe left → next
    }
  }
}
```

**Rationale:**
- 50px horizontal threshold prevents accidental navigation
- 100px vertical threshold prevents interference with page scrolling
- Swipe direction: left swipe = next slide (natural for RTL readers)
- Vertical swipe detection prevents scrolling conflicts

## Animation Keyframes Reference

### Banner Fade Effect
```css
/* Already handled by opacity transition, no keyframes needed */
/* But for reference: */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}
```

### Marquee Infinite Scroll
```css
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
```

### Card Hover Lift
```css
@keyframes cardLift {
  0% { transform: translateY(0); }
  100% { transform: translateY(-8px); }
}
```

### Image Zoom
```css
@keyframes imageZoom {
  0% { transform: scale(1); }
  100% { transform: scale(1.05); }
}
```

## Success Metrics

### Functional Requirements
- [ ] Banner slider transitions are smooth and don't feel "instant"
- [ ] Client logos scroll seamlessly without pauses
- [ ] Arrow navigation works for all carousels
- [ ] Pause-on-hover functions correctly
- [ ] Swipe gestures work on mobile (375px-767px)
- [ ] No jank or performance issues (60fps animations)

### Visual Quality
- [ ] Transition timing matches Vue.js smooth feel
- [ ] Hover effects are subtle but noticeable
- [ ] Arrow buttons have hover states and disabled states
- [ ] Mobile responsive design maintains usability
- [ ] No layout shifts during transitions

### Technical Quality
- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] Lighthouse performance score maintained (>90)
- [ ] Accessibility labels on arrow buttons
- [ ] Keyboard navigation still works after changes
