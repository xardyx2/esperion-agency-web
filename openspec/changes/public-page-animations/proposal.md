## Why

Adding purposeful micro-interactions and animations to the Esperion public website will enhance user engagement, provide visual feedback, and create a modern, professional feel that aligns with our digital agency brand. Carefully selected animations (with performance in mind) improve perceived performance and guide user attention without sacrificing speed.

## What Changes

Implement 6 high-impact, performance-optimized animations across public pages:

1. **Hover Lift Cards** - Cards lift with shadow on hover (0.5ms cost)
2. **Scroll Fade-in Reveal** - Elements fade in as user scrolls (1ms cost)
3. **Stagger List Items** - List items appear with cascading delay (1ms cost)
4. **Micro-interactions** - Buttons scale, icons rotate on interaction (0.1ms cost)
5. **Skeleton Loading States** - Shimmer effect during content load (2ms cost)
6. **Count Up Statistics** - Numbers animate from 0 to target value (2ms cost):
   - **Homepage:** 150+ Projects, 50+ Clients, 10+ Years, 25 Team Members
   - **Services:** 98% Satisfaction, 85% ROI, 3x Faster Delivery
   - **Static:** Pricing ($5,000), Years (2024), Dates - NO animation

**Non-Goals:**
- No heavy particle effects or WebGL (high performance cost)
- No continuous background animations (battery drain)
- No 3D transforms or complex physics

## Capabilities

### New Capabilities
- `scroll-reveal` - Intersection Observer-based scroll animations
- `hover-effects` - CSS transform hover states
- `skeleton-loading` - Loading placeholder animations
- `stagger-animations` - Cascading entrance animations
- `micro-interactions` - Button/icon interaction feedback
- `count-up` - Number counting animation for statistics

### Modified Capabilities
- None (purely additive UI enhancements)

## Impact

- Frontend: Updates to Vue components with CSS animations and Nuxt transitions
- Dependencies: @vueuse/motion (optional) or native CSS
- Performance: Total <7ms frame budget impact (12% @ 60fps)
- Accessibility: Respects `prefers-reduced-motion` media query
