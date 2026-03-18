## Context

The Esperion website currently has minimal animations. Adding subtle, performance-optimized animations will enhance user experience without impacting Core Web Vitals or draining mobile batteries. All animations must respect `prefers-reduced-motion` for accessibility.

## Goals / Non-Goals

**Goals:**
- Implement 5 animation types with <5ms total performance cost
- Use GPU-accelerated properties (transform, opacity) only
- Support reduced motion preferences
- Maintain 60fps on mid-tier mobile devices

**Non-Goals:**
- No heavy particle systems or WebGL
- No continuous background animations
- No physics-based animations

## Decisions

### 1. Native CSS vs Animation Library
**Decision:** Use native CSS transitions + @vueuse/core (useIntersectionObserver)
**Rationale:** 
- Zero bundle size increase for CSS
- @vueuse already in project
- Better performance than GSAP/Framer Motion for simple effects
- **Alternative considered:** GSAP (overkill for our needs)

### 2. Intersection Observer Threshold
**Decision:** Trigger at 20% visibility with 0px root margin
**Rationale:** 
- Elements start animating before fully in view (feels snappy)
- 0px margin prevents premature triggers on mobile
- **Alternative:** 10% felt too early, 50% felt sluggish

### 3. Easing Functions
**Decision:** Use `cubic-bezier(0.4, 0, 0.2, 1)` for enter, `cubic-bezier(0.4, 0, 1, 1)` for exit
**Rationale:** 
- Standard Material Design easing
- Fast start, gentle deceleration feels natural
- **Alternative:** spring physics (too complex for CSS-only)

### 4. Stagger Delay Pattern
**Decision:** 100ms base delay + 50ms per item index
**Rationale:** 
- 100ms feels intentional but not slow
- 50ms gap creates visible cascade without dragging
- Cap at 500ms total (max 9 items)

## Risks / Trade-offs

- [Risk: Animation jank on low-end devices] → Mitigation: Use `will-change` sparingly, test on Moto G4
- [Risk: Motion sickness for some users] → Mitigation: Respect `prefers-reduced-motion`, offer toggle
- [Risk: SEO impact from CLS] → Mitigation: Reserve space in layout, no layout shifts

## Animation Specifications

### 1. Hover Lift Cards
```css
.card {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.3s ease;
}
.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
}
```
- Apply to: Service cards, work cards, article cards
- Duration: 300ms
- Cost: ~0.5ms

### 2. Scroll Fade-in Reveal
```typescript
// Using @vueuse/core useIntersectionObserver
const { isVisible } = useIntersectionObserver(el, {
  threshold: 0.2,
  rootMargin: '0px'
})
```
- Animation: opacity 0→1, translateY 30px→0
- Duration: 500ms
- Cost: ~1ms per element

### 3. Stagger List Items
- Base delay: 100ms
- Increment: 50ms per item
- Max delay: 500ms (cap at 9 items)
- Cost: ~1ms per item

### 4. Micro-interactions
```css
.btn {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.btn:active {
  transform: scale(0.98);
}
.btn:hover {
  transform: scale(1.02);
}
```
- Buttons: scale on hover/active
- Icons: rotate on hover (e.g., arrow icons)
- Links: underline slide-in effect
- Cost: ~0.1ms

### 5. Skeleton Loading
```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
```
- Apply to: Cards, lists during data fetch
- Duration: 1.5s infinite
- Cost: ~2ms

### 6. Count Up Statistics
```typescript
// Composable approach
export function useCountUp(target: number, duration: number = 2000) {
  const current = ref(0)
  const isAnimating = ref(false)
  
  const start = () => {
    isAnimating.value = true
    const startTime = performance.now()
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Ease-out quad
      const easeOut = 1 - (1 - progress) * (1 - progress)
      current.value = Math.floor(easeOut * target)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        current.value = target
        isAnimating.value = false
      }
    }
    
    requestAnimationFrame(animate)
  }
  
  return { current, isAnimating, start }
}
```
- Apply to: Statistics numbers (150+ Projects, 50+ Clients, etc.)
- Duration: 2000ms (2 seconds)
- Easing: Ease-out quad (fast start, slow deceleration)
- Stagger: 200ms between multiple stats
- Cost: ~2ms

## Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

All animations respect user preferences automatically.
