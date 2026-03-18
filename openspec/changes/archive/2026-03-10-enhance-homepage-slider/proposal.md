# enhance-homepage-slider Proposal

## Problem Statement

Homepage banner slider currently has limitations affecting user engagement and content presentation:

1. **Only 3 slides** - Limited content showcase, should have 5 slides for better variety
2. **No pause-on-hover** - Auto-slide continues even when user is interacting with banner
3. **No arrow navigation** - Users can only navigate via dots, no left/right arrow buttons

## Proposed Solution

### 1. Add 2 More Banner Slides

**Current:** 3 slides
**Target:** 5 slides

New slides to add:
- **Slide 4:** Service-focused (highlighting core services)
- **Slide 5:** Social proof/trust (client success or expertise showcase)

### 2. Add Pause-on-Hover Feature

**Implementation:**
```typescript
const pauseCarousel = () => {
  clearInterval(bannerInterval);
};

const resumeCarousel = () => {
  clearInterval(bannerInterval);
  bannerInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % bannerSlides.length;
  }, 5000);
};
```

**Template:**
```vue
<section @mouseenter="pauseCarousel" @mouseleave="resumeCarousel">
  <!-- banner content -->
</section>
```

### 3. Add Arrow Navigation (Optional Enhancement)

**Left/Right arrow buttons** for easier manual navigation:
- Previous arrow (left side)
- Next arrow (right side)
- Keyboard navigation support (← → arrows)

## Scope

### In Scope (Change 2)
- ✅ Add 2 new banner slides with content
- ✅ Add pause-on-hover functionality
- ✅ Add arrow navigation buttons
- ✅ Add keyboard navigation (← →)
- ✅ Ensure responsive behavior (hide arrows on mobile)
- ✅ Test all 5 slides auto-rotation

### Out of Scope
- ❌ Change slide transition effects (keep opacity fade)
- ❌ Change auto-slide interval (keep 5 seconds)
- ❌ Modify other homepage sections
- ❌ Language mixing changes (separate change)

## Success Criteria

1. **5 slides total** - All 5 slides display correctly
2. **Auto-slide works** - Rotates every 5 seconds through all 5 slides
3. **Pause on hover** - Auto-slide pauses when mouse over banner
4. **Arrows functional** - Left/right arrows navigate slides manually
5. **Keyboard works** - ← → arrow keys navigate slides
6. **Responsive** - Arrows hidden on mobile (< 768px), dots still visible
7. **Loop correctly** - Slides loop from 5 → 1 seamlessly
8. **No console errors** - No JavaScript or TypeScript errors

## Content for New Slides

### Slide 4: Services Focus
```typescript
{
  id: 4,
  title: 'Comprehensive Digital Services',
  description: 'Dari website design hingga digital marketing, kami sediakan solusi end-to-end untuk kebutuhan bisnis Anda.',
  image: '/images/banner-4.jpg',
  ctaText: 'Lihat Layanan',
  ctaLink: '/our-services',
}
```

### Slide 5: Trust/Social Proof
```typescript
{
  id: 5,
  title: 'Trusted by Growing Businesses',
  description: '150+ proyek berhasil dirilis untuk klien di Indonesia dan Asia Tenggara. Siap menjadi partner digital Anda berikutnya.',
  image: '/images/banner-5.jpg',
  ctaText: 'Lihat Portofolio',
  ctaLink: '/our-works',
}
```

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Missing banner images | High | Medium | Use placeholder images, update later |
| Pause/resume logic conflict | Low | Low | Clear interval before creating new one |
| Arrow buttons overlap content | Medium | Low | Position absolutely with safe margins |
| Keyboard navigation conflicts | Low | Medium | Only capture when banner in viewport |
| Performance impact | Low | Low | Use CSS transitions, optimize images |

## Timeline Estimate

- **Content preparation**: 30 min (finalize slide content)
- **Implementation**: 1-1.5 hours
- **Testing**: 30 min
- **Total**: ~2-2.5 hours

## Files to Modify

1. `frontend/app/pages/index.vue` - Add slides, pause logic, arrow buttons
2. `frontend/app/assets/css/main.css` - Arrow button styling (if needed)
3. `public/images/` - Add `banner-4.jpg` and `banner-5.jpg`

## Dependencies

- None - purely frontend enhancement
- Images can be placeholders initially

## Technical Notes

- Use same transition effect (opacity fade, 1000ms)
- Maintain current dot navigation (add 2 more dots automatically)
- Arrow buttons: Use SVG icons or Unicode arrows
- Pause-on-hover: Match existing works carousel pattern
- Keyboard nav: Add event listener, remove on unmount
