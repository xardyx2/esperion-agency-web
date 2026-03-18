## Context

**Current State:**
- Theme toggle: 3 separate icon buttons (System/Light/Dark)
- Language switcher: Inline text buttons (Bahasa Indonesia | English)
- Animation: Instant feel due to conflicting CSS transitions
- Default: 'system'
- Icons: Emoji (💻 ☀️ 🌙)

**Vue.js Reference (vuejs.org):**
- Theme toggle: Single pill-shaped toggle switch with sliding indicator
- Language switcher: Dropdown menu with current selection + arrow
- Animation: Smooth 0.3s flowing transition (no instant feel)
- Default: 'light'
- Icons: SVG (sun/moon shapes)

**Root Cause of Animation Issue:**
```css
/* main.css has TWO conflicting transition blocks */

/* Block 1 (lines 109-124): */
body, body * {
  transition-duration: 100ms;  /* ← ALL children get 100ms = instant! */
}

/* Block 2 (lines 409-411): */
body {
  transition: background-color 0.3s;  /* ← Gets overridden by body * above! */
}
```

## Goals / Non-Goals

**Goals:**
- Match Vue.js toggle design exactly (pill switch)
- Match Vue.js language dropdown design
- Fix CSS transition for smooth 0.3s flowing animation
- Change default to 'light'
- Add time-based fallback for System option (7PM-7AM = dark)
- Add clarity icon for System option
- Use SVG icons for professional appearance

**Non-Goals:**
- Not changing supported languages (keep ID/EN only)
- Not affecting SEO (dark mode doesn't impact rankings directly)
- Not removing System option (keep for users who want OS preference)
- Not changing footer placement

## Decisions

### Decision 1: Pill-Shaped Theme Toggle (Vue.js Style)

**Chosen:** Single pill-shaped toggle with 3 zones (System/Light/Dark) and sliding indicator

**Rationale:**
- Matches Vue.js exactly
- More compact than 3 separate buttons
- Sliding indicator provides clear visual feedback
- Professional appearance with SVG icons

**Design:**
```
Light Mode:
┌────────────────────────────────────────┐
│  💻     │  ☀️  │     🌙              │
│         │  ●   │                      │  ← Indicator on Light
└────────────────────────────────────────┘

Dark Mode:
┌────────────────────────────────────────┐
│  💻     │     ☀️     │  🌙  │        │
│         │            │  ●   │        │  ← Indicator on Dark
└────────────────────────────────────────┘

System Mode:
┌────────────────────────────────────────┐
│  💻  ●  │     ☀️     │     🌙        │
│         │            │                │  ← Indicator on System
└────────────────────────────────────────┘
```

**Implementation:**
- Container: `border-radius: 9999px` (pill shape)
- Indicator: Sliding dot with `transition: transform 0.25s`
- Icons: SVG sun/moon/monitor icons
- Selected state: Accent background on indicator

---

### Decision 2: Language Dropdown Menu

**Chosen:** Dropdown menu with current selection and arrow

**Rationale:**
- Matches Vue.js style
- More scalable if more languages added
- Cleaner footer layout
- Uses Nuxt UI UDropdown component

**Design:**
```
Closed:
┌────────────────────────────┐
│ Bahasa Indonesia      ▼    │
└────────────────────────────┘

Open:
┌────────────────────────────┐
│ Bahasa Indonesia      ▼    │
├────────────────────────────┤
│ ● Bahasa Indonesia         │  ← Current selection
│   English                  │
└────────────────────────────┘
```

---

### Decision 3: Fix CSS Transition Conflict

**Chosen:** Remove `body *` override, set consistent 0.3s on html and body

**Rationale:**
- `body *` applies 100ms to ALL children = instant feel
- Vue.js uses single unified transition
- 0.3s creates flowing "ngalir" animation

**CSS Fix:**
```css
/* REMOVE the body * override */
/* OLD (lines 109-124): */
body, body * {  /* ← REMOVE THIS */
  transition-duration: 100ms;
}

/* NEW: Only apply to html and body */
html {
  transition: background-color 0.3s ease, color 0.3s ease;
}

body {
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Keep interactive elements fast */
button, a, input {
  transition: background-color 0.2s, border-color 0.2s, color 0.2s;
}
```

---

### Decision 4: Default Theme to 'Light'

**Chosen:** Change `colorMode.preference` default from 'system' to 'light'

**Rationale:**
- User preference for lighter first impression
- Consistent with Vue.js
- Users can still switch to dark if preferred

**Config Change:**
```typescript
// nuxt.config.ts
colorMode: {
  classSuffix: '',
  preference: 'light',  // Changed from implicit 'system'
},
```

---

### Decision 5: Time-Based Fallback for System

**Chosen:** When user selects "System", use time-based fallback if OS preference not set

**Rationale:**
- Some users/devices don't have OS color preference
- Time-based is intuitive (dark at night, light during day)
- Provides sensible default when OS preference unavailable

**Logic:**
```typescript
// useTheme.ts
const getSystemPreference = (): 'dark' | 'light' => {
  if (import.meta.client) {
    // 1. Check OS preference first
    const osPrefersDark = window.matchMedia('(prefers-color-scheme: dark)')
    if (osPrefersDark.matches !== undefined) {
      return osPrefersDark.matches ? 'dark' : 'light'
    }
    
    // 2. Fallback: Time-based (7PM-7AM = dark)
    const hour = new Date().getHours()
    const isNightTime = hour >= 19 || hour < 7
    return isNightTime ? 'dark' : 'light'
  }
  return 'light' // SSR default
}
```

---

### Decision 6: SVG Icons

**Chosen:** Use SVG icons instead of emoji

**Rationale:**
- Professional appearance
- Consistent sizing
- Better control over styling
- Matches Vue.js exactly

**Icons:**
- Sun: Heroicons `sun` or custom SVG
- Moon: Heroicons `moon` or custom SVG
- Monitor: Heroicons `computer-desktop` or custom SVG

## Risks / Trade-offs

### Risk 1: Dropdown on Mobile
**Mitigation:** Ensure dropdown is touch-friendly, test on mobile
**Impact:** Low - Nuxt UI handles responsive dropdowns

### Risk 2: Transition Performance
**Mitigation:** Only transition background-color and color, not layout properties
**Impact:** Low - CSS transitions are hardware accelerated

### Risk 3: Time-Based Fallback Accuracy
**Mitigation:** Time-based is only fallback, OS preference takes priority
**Impact:** Low - Edge case for devices without OS preference

## Migration Plan

### Phase 1: Fix CSS Transitions (15 minutes)
1. Remove `body *` transition override
2. Set consistent 0.3s on html and body
3. Test transition animation

### Phase 2: Redesign Theme Toggle (1 hour)
1. Create ThemeToggle.vue component with pill design
2. Implement sliding indicator
3. Add SVG icons
4. Wire up color mode switching

### Phase 3: Redesign Language Dropdown (30 minutes)
1. Create LanguageDropdown.vue component
2. Use Nuxt UI UDropdown
3. Wire up i18n switching

### Phase 4: Update Configuration (15 minutes)
1. Change default to 'light' in nuxt.config.ts
2. Add time-based fallback to useTheme.ts
3. Test all scenarios

### Phase 5: Integration (30 minutes)
1. Update SiteFooter.vue to use new components
2. Test on desktop and mobile
3. Verify transitions match Vue.js

## Open Questions

1. **Should we use Heroicons or custom SVG?**
   - Heroicons: Consistent with Nuxt UI
   - Custom: Exact match with Vue.js
   - **Decision**: Use Heroicons for consistency with Nuxt UI

2. **Should time-based use user's timezone or server time?**
   - Client-side: User's local time (more accurate)
   - Server-side: Server time (simpler)
   - **Decision**: Client-side (user's timezone)

3. **What hours for "night time"?**
   - Option A: 6PM-6AM (12 hours)
   - Option B: 7PM-7AM (12 hours)
   - Option C: 8PM-6AM (10 hours)
   - **Decision**: 7PM-7AM (matches user's request)