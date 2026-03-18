## Why

The current implementation of appearance toggles (language switcher and theme toggle) needs refinement:

1. **Animation issue**: Theme switching feels "instant" instead of the smooth flowing transition seen on vuejs.org. The CSS has conflicting transition blocks (100ms vs 0.3s) causing inconsistent animations.

2. **Toggle design mismatch**: Current implementation uses 3 separate icon buttons for System/Light/Dark, while Vue.js uses a single pill-shaped toggle switch with sliding indicator.

3. **Language switcher design**: Current inline text buttons don't match Vue.js dropdown style which is more space-efficient and scalable.

4. **Default theme**: Currently defaults to 'system', but user prefers 'light' as default.

5. **System option clarity**: Users don't understand what "System" means - needs an icon indicator.

## What Changes

- **Replaces** 3 separate theme buttons with single pill-shaped toggle switch (Vue.js style)
- **Changes** language switcher from inline buttons to dropdown menu
- **Fixes** CSS transition conflict for smooth 0.3s flowing animation
- **Changes** default theme preference from 'system' to 'light'
- **Adds** time-based fallback for System preference (7PM-7AM = dark)
- **Adds** monitor icon indicator for System option clarity
- **Switches** from emoji icons to SVG icons for professional appearance

## Capabilities

### Modified Capabilities
- `theme-system`: Improves toggle UI, fixes animation, adds time-based fallback
- `vue-style-components`: Refines to match Vue.js exactly (pill switch, dropdown)

## Impact

**Affected Components:**
- `frontend/app/components/Footer/SiteFooter.vue` - Redesign toggles
- `frontend/app/assets/css/main.css` - Fix transition conflicts
- `frontend/nuxt.config.ts` - Change default to 'light'

**Affected Files:**
- `frontend/app/composables/useTheme.ts` - Add time-based fallback
- `frontend/app/components/ui/ThemeToggle.vue` - New component (extracted)
- `frontend/app/components/ui/LanguageDropdown.vue` - New component (extracted)

**No Breaking Changes:**
- All functionality preserved
- Only UI/UX improvements
- localStorage persistence maintained