# Theme System Specification

## Overview
The theme system manages dark/light mode switching using Nuxt Color Mode pattern with CSS variables and class-based theming.

## Requirements

### Core Functionality
- [ ] System preference detection using `prefers-color-scheme: dark` media query
- [ ] User preference persistence in localStorage
- [ ] Toggle between light and dark modes
- [ ] CSS variable-based theming (`--es-bg`, `--es-text`, etc.)
- [ ] Smooth 0.3s background-color transitions on body

### Technical Requirements
- [ ] Apply `.system`, `.dark`, `.light` classes to `<html>` element
- [ ] Support SSR with pre-hydration class application
- [ ] No flash of unstyled content (FOUC) on page load
- [ ] Keyboard accessible (tab to toggle)

### CSS Variables (Light Mode - Default)
```css
:root {
  --es-bg: #FAFCFF;
  --es-text: #102B4E;
  --es-text-secondary: #475569;
  --es-border: #E2E8F0;
  --es-accent-primary: #2B9EDB;
}
```

### CSS Variables (Dark Mode)
```css
:root.dark {
  --es-bg: #0B1120;
  --es-text: #F8FAFC;
  --es-text-secondary: #94A3B8;
  --es-border: #1E293B;
  --es-accent-primary: #2B9EDB;
}
```

### Transitions
```css
body {
  transition: background-color 0.3s;
}
```

### Storage
- **Key**: `nuxt-color-mode`
- **Values**: `system` | `light` | `dark`
- **Fallback**: `system`

## Implementation Notes

### Key Files
- `frontend/app/composables/useTheme.ts` - Theme state management
- `frontend/app/assets/css/main.css` - CSS variables and transitions
- `frontend/app/app.vue` - Initial class application before hydration

### Waterfall Logic
1. Check `localStorage.getItem('nuxt-color-mode')` - if exists, use it
2. If not, check `window.matchMedia('(prefers-color-scheme: dark)').matches`
3. Apply `.dark` or `.light` class to `<html>` element
4. Update CSS variables via class selector

## Acceptance Criteria
- Dark mode toggles without JS re-renders (CSS class change only)
- Transition completes smoothly over 0.3s
- No console errors on theme change
- Works identically on client and server renders
- User preference persists across page refreshes
