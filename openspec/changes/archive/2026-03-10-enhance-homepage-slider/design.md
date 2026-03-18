# enhance-homepage-slider Design

## Context

**Current state:**
- 3 banner slides with auto-rotate (5s interval)
- Dot navigation only
- Opacity fade transitions (1000ms)
- No pause-on-hover functionality
- No manual arrow navigation

**Limitations:**
- Limited content showcase (3 slides)
- Auto-slide continues during user interaction
- No quick manual navigation between non-adjacent slides
- No keyboard accessibility

## Goals / Non-Goals

**Goals:**
- 5 total slides with diverse content (services, trust)
- Pause-on-hover like works carousel
- Arrow navigation for manual control
- Keyboard navigation (← →)
- Responsive (hide arrows on mobile < 768px)

**Non-Goals:**
- No change to transition effects (keep opacity fade)
- No change to auto-slide interval (keep 5s)
- No modification to other homepage sections
- No dot navigation changes (auto-expands to 5)

## Decisions

### Decision 1: Pause-on-Hover Implementation
**Chosen:** Match existing works carousel pattern

- Use `@mouseenter`/`@mouseleave` events on banner section
- Clear interval on enter, restart on leave
- Reset interval on manual navigation (arrow/dot click)

```typescript
const pauseCarousel = () => clearInterval(bannerInterval);
const resumeCarousel = () => {
  clearInterval(bannerInterval);
  bannerInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % bannerSlides.length;
  }, 5000);
};
```

### Decision 2: Arrow Navigation
**Chosen:** Absolute positioned SVG arrows

- Left arrow: 20px from left, centered vertically
- Right arrow: 20px from right, centered vertically
- Hide on mobile (< 768px)
- Semi-transparent background on hover
- SVG chevron-left/chevron-right icons
- Pointer cursor, z-index above slides

### Decision 3: Keyboard Navigation
**Chosen:** Global event listener when banner in viewport

- Listen for ArrowLeft and ArrowRight keys
- Navigate slides accordingly (prev/next)
- Clean up on unmount (use onUnmounted)
- Debounce to prevent rapid firing (100ms)
- Only capture when banner section is visible

### Decision 4: Slide Content

**Slide 4 (Services):**
- Title: "Comprehensive Digital Services"
- Description: "Dari website design hingga digital marketing, kami sediakan solusi end-to-end untuk kebutuhan bisnis Anda."
- Image: /images/banner-4.jpg
- CTA: "Lihat Layanan" → /our-services

**Slide 5 (Trust):**
- Title: "Trusted by Growing Businesses"
- Description: "150+ proyek berhasil dirilis untuk klien di Indonesia dan Asia Tenggara. Siap menjadi partner digital Anda berikutnya."
- Image: /images/banner-5.jpg
- CTA: "Lihat Portofolio" → /our-works

## Risks / Trade-offs

### Risk 1: Interval conflicts
**Mitigation:** Always clear interval before creating new one. Use single interval variable.

### Risk 2: Arrow buttons overlap content on small screens
**Mitigation:** Hide arrows < 768px via CSS media query. Use safe margins (20px).

### Risk 3: Keyboard navigation conflicts with page scroll
**Mitigation:** Only capture when banner in viewport. Add event.preventDefault() on key capture.

### Risk 4: Image assets missing
**Mitigation:** Use placeholder images initially. Update later via CMS.

## Migration Plan

1. Add 2 new slide objects to `bannerSlides` array in `index.vue`
2. Add `pauseCarousel` and `resumeCarousel` functions
3. Add `@mouseenter`/`@mouseleave` handlers to banner `<section>`
4. Create arrow button components (left/right SVG buttons)
5. Add keyboard event listener in `onMounted`, cleanup in `onUnmounted`
6. Add responsive CSS for arrow buttons (hide < 768px)
7. Test all functionality (auto-rotate, pause, arrows, keyboard)

## Success Metrics

- [ ] 5 slides total in banner array
- [ ] Auto-rotate through all 5 slides (5s interval)
- [ ] Pause on hover (verified with console.log)
- [ ] Arrow buttons visible on desktop, hidden on mobile
- [ ] Arrows navigate slides correctly (prev/next)
- [ ] Keyboard ← → navigates slides
- [ ] Responsive behavior (test at 375px, 768px, 1024px)
- [ ] No console errors in dev tools
- [ ] Loop correctly from slide 5 → slide 1
