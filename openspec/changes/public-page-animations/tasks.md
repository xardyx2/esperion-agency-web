## 1. Setup & Global Styles

- [ ] 1.1 Create `frontend/app/composables/useScrollReveal.ts` composable for intersection observer
- [ ] 1.2 Add global animation utilities to `frontend/app/assets/css/animations.css`
- [ ] 1.3 Add `prefers-reduced-motion` media query support in global styles
- [ ] 1.4 Define CSS custom properties for animation timing in Tailwind config

## 2. Hover Lift Effects

- [ ] 2.1 Add hover-lift class to service cards in `frontend/app/pages/our-services/index.vue`
- [ ] 2.2 Add hover-lift class to work cards in `frontend/app/pages/our-works/index.vue`
- [ ] 2.3 Add hover-lift class to article cards in `frontend/app/pages/articles/index.vue`
- [ ] 2.4 Create `frontend/app/components/ui/CardHover.vue` reusable component
- [ ] 2.5 Test hover effects on mobile touch devices

## 3. Scroll Fade-in Reveal

- [ ] 3.1 Implement `useScrollReveal` composable with IntersectionObserver
- [ ] 3.2 Add scroll reveal to hero sections on all pages
- [ ] 3.3 Add scroll reveal to feature sections
- [ ] 3.4 Add scroll reveal to content blocks
- [ ] 3.5 Ensure animations trigger only once per element

## 4. Stagger List Animations

- [ ] 4.1 Create `frontend/app/components/StaggerList.vue` component
- [ ] 4.2 Apply stagger animation to services list
- [ ] 4.3 Apply stagger animation to works list
- [ ] 4.4 Apply stagger animation to articles list
- [ ] 4.5 Cap stagger delay at 500ms for large lists

## 5. Micro-interactions

- [ ] 5.1 Add button scale effect on hover/active
- [ ] 5.2 Add icon rotation on hover (arrows, chevrons)
- [ ] 5.3 Add underline slide-in effect for text links
- [ ] 5.4 Create `frontend/app/components/ui/AnimatedButton.vue`
- [ ] 5.5 Create `frontend/app/components/ui/AnimatedLink.vue`

## 6. Count Up Statistics Animation

- [ ] 6.1 Create `frontend/app/components/ui/CountUp.vue` component with number animation
- [ ] 6.2 Implement counting logic from 0 to target value over 2 seconds
- [ ] 6.3 Add easing function (ease-out quad) for natural deceleration
- [ ] 6.4 Support suffix (e.g., "+", "%", "x") that remains static during animation
- [ ] 6.5 Integrate with IntersectionObserver to trigger on scroll (20% threshold)
- [ ] 6.6 Add stagger delay (200ms) between multiple statistics
- [ ] 6.7 Add CountUp to homepage hero: **150+** Projects Completed
- [ ] 6.8 Add CountUp to homepage hero: **50+** Happy Clients
- [ ] 6.9 Add CountUp to homepage hero: **10+** Years Experience
- [ ] 6.10 Add CountUp to homepage hero: **25** Team Members
- [ ] 6.11 Add CountUp to services page: **98%** Client Satisfaction
- [ ] 6.12 Add CountUp to services page: **85%** Average ROI
- [ ] 6.13 Add CountUp to services page: **3x** Faster Delivery
- [ ] 6.14 Ensure pricing numbers ($5,000, etc.) remain STATIC (no animation)
- [ ] 6.15 Ensure years (2024, etc.) remain STATIC (no animation)
- [ ] 6.16 Support reduced motion preference (show final value immediately)

## 7. Skeleton Loading

- [ ] 7.1 Create `frontend/app/components/ui/SkeletonCard.vue`
- [ ] 7.2 Create `frontend/app/components/ui/SkeletonText.vue`
- [ ] 7.3 Add skeleton states to service cards during loading
- [ ] 7.4 Add skeleton states to works cards during loading
- [ ] 7.5 Add skeleton states to article cards during loading
- [ ] 7.6 Implement shimmer animation with CSS keyframes

## 8. Performance Optimization

- [ ] 8.1 Audit all animations with Chrome DevTools Performance panel
- [ ] 8.2 Add `will-change` hints sparingly to animated elements
- [ ] 8.3 Ensure only `transform` and `opacity` are animated
- [ ] 8.4 Test on Moto G4 or similar mid-tier device
- [ ] 8.5 Verify 60fps on all animations

## 9. Accessibility

- [ ] 9.1 Test with `prefers-reduced-motion: reduce` enabled
- [ ] 9.2 Ensure all content is accessible without animations
- [ ] 9.3 Verify no seizures/triggers from motion
- [ ] 9.4 Add ARIA labels to animated elements if needed

## 10. Testing & Verification

- [ ] 10.1 Test all 6 animation types on desktop Chrome
- [ ] 10.2 Test on mobile Safari (iOS)
- [ ] 10.3 Test on mobile Chrome (Android)
- [ ] 10.4 Test on Firefox
- [ ] 10.5 Run `npm run type-check` for TypeScript compliance
- [ ] 10.6 Measure Core Web Vitals impact
