## Context

**Current State:**
- Language switcher: Not present in footer
- Dark mode toggle: Not present in footer
- No Vue.js-style appearance controls
- No system preference detection

**Vue.js Reference (vuejs.org):**
- Language switcher: Simple dropdown with flags in header
- Dark mode: Clean toggle buttons (System/Light/Dark icons)
- Consistent icon button styling
- System preference detection (prefers-color-scheme)
- localStorage persistence for user preferences

**Color-Mode.nuxt.dev Reference:**
- Toggle style: Icon buttons (💻 System / ☀️ Light / 🌙 Dark)
- Button hover animation: lifts up (`top: -3px`)
- Selected state: accent border
- Smooth 0.3s background-color transition

**Target Placement:**
- Footer: Below "Contact Us" column
- Row 1: Language switcher (Bahasa Indonesia | English)
- Row 2: Theme toggle (System | Light | Dark icons)

## Goals / Non-Goals

**Goals:**
- Add Vue.js-style language switcher to footer (below Contact Us)
- Add Vue.js-style theme toggle to footer (below language switcher)
- Add system preference detection for dark mode
- Implement localStorage persistence for user preferences
- Smooth 0.3s background-color transition (color-mode.nuxt.dev style)
- Match Vue.js design aesthetic (clean, modern icon buttons)

**Non-Goals:**
- Not changing language locales (keep ID/EN only)
- Not modifying accessibility features
- Not changing existing color palette
- Not affecting dashboard pages (public pages only)
- Not placing in header (footer only)

## Decisions

### Decision 1: Footer Placement Below Contact Us
**Chosen:** Add appearance controls to SiteFooter.vue, below Contact Us column

**Rationale:**
- User explicitly requested footer placement
- Less intrusive than header placement
- Grouped with contact information makes sense for accessibility settings
- Cleaner header navigation

**Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│                         SiteFooter.vue                          │
├─────────────┬─────────────┬─────────────┬─────────────────────┤
│ Company     │ Quick Links │ Services    │ Contact Us          │
│ • Logo      │ • Home      │ • Web Dev   │ 📍 Jakarta         │
│ • Desc      │ • Portfolio │ • Mobile    │ 📱 +62...          │
│ • Socials   │ • Services  │ • UI/UX     │ ✉️ hello@...       │
│             │ • Articles  │ • Marketing │ 🕐 09.00-18.00     │
│             │ • About     │ • E-comm    │ ─────────────────── │
│             │ • Contact   │ • Consulting│ 🌐 Bahasa Indonesia│
│             │             │             │    English         │
│             │             │             │                     │
│             │             │             │ 💻  ☀️  🌙         │
│             │             │             │ (System Light Dark)│
└─────────────┴─────────────┴─────────────┴─────────────────────┘
```

---

### Decision 2: Vue.js-Style Icon Buttons for Theme
**Chosen:** Three icon buttons for theme selection (System / Light / Dark)

**Rationale:**
- Matches color-mode.nuxt.dev exactly
- Clear visual options for users
- System option respects OS preference
- Icon buttons are clean and modern

**Implementation:**
```vue
<template>
  <div class="flex gap-2 mt-4">
    <!-- System -->
    <button
      @click="setTheme('system')"
      :class="[
        'p-2 rounded-lg border-2 transition-all duration-100',
        theme === 'system' 
          ? 'border-es-accent-primary -translate-y-0.5' 
          : 'border-es-border hover:-translate-y-0.5'
      ]"
    >
      💻
    </button>
    <!-- Light -->
    <button
      @click="setTheme('light')"
      :class="[
        'p-2 rounded-lg border-2 transition-all duration-100',
        theme === 'light' 
          ? 'border-es-accent-primary -translate-y-0.5' 
          : 'border-es-border hover:-translate-y-0.5'
      ]"
    >
      ☀️
    </button>
    <!-- Dark -->
    <button
      @click="setTheme('dark')"
      :class="[
        'p-2 rounded-lg border-2 transition-all duration-100',
        theme === 'dark' 
          ? 'border-es-accent-primary -translate-y-0.5' 
          : 'border-es-border hover:-translate-y-0.5'
      ]"
    >
      🌙
    </button>
  </div>
</template>
```

---

### Decision 3: Language Switcher Style
**Chosen:** Simple text buttons (Bahasa Indonesia | English)

**Rationale:**
- Vue.js uses simple dropdown text
- Footer has limited space
- Text is clearer than flags for accessibility
- Matches i18n naming convention

**Implementation:**
```vue
<template>
  <div class="flex gap-3 mt-4">
    <button
      @click="setLocale('id')"
      :class="[
        'text-sm transition-colors',
        locale === 'id' 
          ? 'text-es-accent-primary font-semibold' 
          : 'text-es-text-secondary hover:text-es-accent-primary'
      ]"
    >
      Bahasa Indonesia
    </button>
    <span class="text-es-text-tertiary">|</span>
    <button
      @click="setLocale('en')"
      :class="[
        'text-sm transition-colors',
        locale === 'en' 
          ? 'text-es-accent-primary font-semibold' 
          : 'text-es-text-secondary hover:text-es-accent-primary'
      ]"
    >
      English
    </button>
  </div>
</template>
```

---

### Decision 4: Smooth CSS Transitions (Color-Mode.nuxt.dev 0.3s)
**Chosen:** 300ms `background-color` transition on body

**Rationale:**
- Exact match to color-mode.nuxt.dev demo
- Smooth visible transition
- Performance-optimized (single property)

**CSS Implementation:**
```css
/* Global styles - add to app.vue or main CSS */
body {
  background-color: var(--bg);
  color: var(--color);
  transition: background-color 0.3s ease;
}

/* Tailwind already handles dark: classes */
/* Ensure dark mode class applies to html element */
```

**Nuxt Color Mode Config:**
```typescript
// nuxt.config.ts
colorMode: {
  classSuffix: '',
  preference: 'system',
  fallback: 'light',
}
```

---

### Decision 5: System Preference Detection
**Chosen:** Default to 'system', allow explicit override

**Rationale:**
- Matches Vue.js and color-mode.nuxt.dev behavior
- Respects user's OS preference by default
- User can override if desired
- Stored in localStorage for persistence

**Logic:**
1. **Default**: Check `localStorage.getItem('nuxt-color-mode')` or use `'system'`
2. **System**: If `'system'`, check `prefers-color-scheme: dark` media query
3. **Override**: If user clicks Light/Dark, store preference in localStorage
4. **Applied**: `@nuxtjs/color-mode` handles class application automatically

## Risks / Trade-offs

### Risk 1: Footer Space Constraints
**Mitigation:** Use compact button layout, test on mobile
**Impact:** Low - footer has adequate space

### Risk 2: Mobile Responsiveness
**Mitigation:** Test toggle buttons on touch devices
**Impact:** Low - icon buttons work well on mobile

### Risk 3: Transition Flash on Page Load
**Mitigation:** @nuxtjs/color-mode handles SSR correctly
**Impact:** Low - module handles this automatically

## Migration Plan

### Phase 1: Add Components to Footer (1 hour)
1. Add language switcher buttons to SiteFooter.vue below Contact Us
2. Add theme toggle icon buttons below language switcher
3. Wire up i18n locale switching
4. Wire up color mode switching

### Phase 2: CSS Transitions (30 minutes)
1. Ensure body has `transition: background-color 0.3s`
2. Verify color variables work correctly
3. Test dark/light switching animation

### Phase 3: Testing & Validation (30 minutes)
1. Test language switching ID ↔ EN
2. Test theme switching System ↔ Light ↔ Dark
3. Verify system preference detection
4. Verify localStorage persistence
5. Test on mobile and desktop
6. Check for console errors

## Open Questions

1. **Should we use emoji icons or SVG icons?**
   - Emoji: 💻 ☀️ 🌙 (simple, works everywhere)
   - SVG: Heroicons or similar (more professional)
   - **Decision**: Use emoji for simplicity, can upgrade to SVG later

2. **Should appearance controls be in a separate section?**
   - Current: Below Contact Us info
   - Alternative: Separate "Settings" column
   - **Decision**: Below Contact Us as requested by user

3. **Should we add a label above the toggles?**
   - Option: "Tampilan" / "Appearance" label
   - Alternative: Just icons (cleaner)
   - **Decision**: Add small label "Tampilan" for clarity