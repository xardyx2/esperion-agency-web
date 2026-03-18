# Change: fix-frontend-bugs

## Overview
Fix critical frontend UX issues blocking optimal user experience.

## Tasks

### Phase 1: Investigation
- [ ] Reproduce dark mode stuck issue via browser testing
- [ ] Check console errors during theme toggle
- [ ] Verify localStorage colorMode state
- [ ] Document exact reproduction steps

### Phase 2: Implementation
- [ ] Add smooth CSS transitions (300ms) for theme switching
- [ ] Add auto-slide to Works carousel (5s, 1 card, loop 5)
- [ ] Fix dark mode stuck issue (root cause TBD)
- [ ] Ensure carousel pauses on hover
- [ ] Keep manual navigation functional

### Phase 3: Verification
- [ ] Test theme toggle 20+ times while navigating
- [ ] Verify smooth transitions work
- [ ] Test carousel auto-slide + manual nav
- [ ] Zero console errors
- [ ] Existing tests pass

## Timeline
Estimate: 4-7 hours total

## Files to Modify
1. `frontend/app/assets/css/main.css` - Theme transitions
2. `frontend/app/pages/index.vue` - Works auto-slide
3. `frontend/app/components/Navigation/MainNav.vue` - Dark mode fix (if needed)
4. `frontend/nuxt.config.ts` - colorMode config (if needed)

## Success Criteria
- [ ] Dark mode never gets stuck
- [ ] Smooth 300ms theme transitions
- [ ] Works auto-slides every 5s
- [ ] Manual carousel nav still works
- [ ] Zero console errors
