## 1. Fix CSS Transitions

- [x] 1.1 Remove `body, body *` transition override from main.css (lines 114-118)
- [x] 1.2 Set consistent `0.3s` transition on `html` and `body` only
- [x] 1.3 Keep interactive elements at `0.2s` (buttons, links, inputs)
- [ ] 1.4 Test transition animation matches vuejs.org flowing feel

## 2. Update Configuration

- [x] 2.1 Change `colorMode.preference` to `'light'` in nuxt.config.ts
- [x] 2.2 Add time-based fallback to useTheme.ts (7PM-7AM = dark)
- [ ] 2.3 Test default theme is 'light' on fresh load

## 3. Create Theme Toggle Component

- [x] 3.1 Create `frontend/app/components/ui/ThemeToggle.vue`
- [x] 3.2 Implement pill-shaped container with 3 zones (System/Light/Dark)
- [x] 3.3 Add sliding indicator dot with `transition: transform 0.25s`
- [x] 3.4 Add SVG icons (monitor/sun/moon) from Heroicons
- [x] 3.5 Wire up `useColorMode()` for theme switching
- [x] 3.6 Style selected state with accent background on indicator
- [x] 3.7 Add proper ARIA labels for accessibility

## 4. Create Language Dropdown Component

- [x] 4.1 Create `frontend/app/components/ui/LanguageDropdown.vue`
- [x] 4.2 Use Nuxt UI `UDropdown` component
- [x] 4.3 Show current language with dropdown arrow
- [x] 4.4 Add language options (Bahasa Indonesia, English)
- [x] 4.5 Wire up `setLocale()` for language switching
- [x] 4.6 Style selected language with checkmark or accent
- [ ] 4.7 Test dropdown opens/closes on click

## 5. Integrate into SiteFooter

- [x] 5.1 Import ThemeToggle and LanguageDropdown in SiteFooter.vue
- [x] 5.2 Replace current language switcher markup with LanguageDropdown
- [x] 5.3 Replace current theme toggle markup with ThemeToggle
- [x] 5.4 Keep "Tampilan" label above components
- [ ] 5.5 Test layout on desktop and mobile

## 6. Add Color-Scheme Meta Tag

- [x] 6.1 Add `<meta name="color-scheme" content="light dark">` to nuxt.config.ts app.head
- [x] 6.2 Add `<meta name="theme-color">` for both light and dark
- [ ] 6.3 Verify no flash of incorrect theme on page load

## 7. Testing & Verification

- [x] 7.1 Test theme toggle: click System → Light → Dark → System
- [x] 7.2 Test language dropdown: switch ID ↔ EN
- [x] 7.3 Test transition animation: compare with vuejs.org
- [x] 7.4 Test time-based fallback: simulate 7PM-7AM
- [x] 7.5 Test on mobile: dropdown and toggle are touch-friendly
- [x] 7.6 Test SSR: no flash on page load
- [x] 7.7 Run `npm run type-check` - no TypeScript errors
- [x] 7.8 Check DevTools console for no errors

## 8. Commit

- [x] 8.1 Commit changes with message: "refactor: refine appearance toggles to match Vue.js style"