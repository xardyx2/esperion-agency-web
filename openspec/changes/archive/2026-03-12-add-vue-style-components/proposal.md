## Why

Esperion currently has language switcher and dark mode toggle components, but they're scattered (language in footer, dark mode in footer) and lack the cohesive, modern design found on Vue.js website. The Vue.js implementation features:
- Unified **Appearance** menu in the header that matches Vue's design aesthetic
- Language switcher with clean dropdown showing all available languages
- Dark mode toggle with smooth transitions and system pref detection

This change will modernize these components to match Vue's implementation style, improving user experience and consistency.

## What Changes

- **Replaces** scattered footer toggles with unified header **Appearance** dropdown menu
- **Adds** language switcher as a dropdown menu item with all available languages (ID/EN)
- **Adds** dark mode toggle with:
  - 0.3s background-color CSS transitions on body following Nuxt Color Mode style
  - System preference detection (prefers-color-scheme)
  - localStorage persistence
- **Removes** language switcher and dark mode toggle from SiteFooter.vue
- **Modifies** MainNav.vue to include Appearance dropdown in right-side button group

## Capabilities

### New Capabilities
- `vue-style-components`: New component implementation pattern for language/dark mode toggle

### Modified Capabilities
- `public-navigation`: Updates to include unified Appearance dropdown menu
- `theme-system`: Adds system preference detection and localStorage persistence

## Impact

**Affected Components:**
- `frontend/app/components/Navigation/MainNav.vue` - Add Appearance dropdown
- `frontend/app/components/Footer/SiteFooter.vue` - Remove language/dark mode toggles

**Affected Files:**
- `frontend/app/composables/` - Create/use composable for theme management
- `frontend/app/assets/css/main.css` - Add smooth transition classes

**No Breaking Changes:**
- Existing language toggle functionality preserved
- Existing dark mode functionality preserved
- Only UI/UX improvements, no API changes
