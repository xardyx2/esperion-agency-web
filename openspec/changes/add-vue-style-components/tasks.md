## 1. Add Language Switcher to Footer

- [x] 1.1 Open `frontend/app/components/Footer/SiteFooter.vue`
- [x] 1.2 Add "Tampilan" label below Contact Us info
- [x] 1.3 Add language switcher buttons (Bahasa Indonesia | English)
- [x] 1.4 Wire up i18n locale switching with `setLocale()`
- [x] 1.5 Style: active language has accent color + bold

## 2. Add Theme Toggle to Footer

- [x] 2.1 Add three icon buttons below language switcher: 💻 System / ☀️ Light / 🌙 Dark
- [x] 2.2 Wire up color mode switching with `useColorMode()`
- [x] 2.3 Implement "system" preference detection
- [x] 2.4 Style: selected icon lifts up (`-translate-y-0.5`) with accent border
- [x] 2.5 Style: hover lifts up with transition

## 3. CSS Transitions (Color-Mode.nuxt.dev 0.3s)

- [x] 3.1 Verify body has `transition: background-color 0.3s ease`
- [x] 3.2 Test dark/light switching animation matches color-mode.nuxt.dev
- [x] 3.3 Ensure no flash on page load (SSR handling)

## 4. Testing & Verification

- [x] 4.1 Test language switching ID ↔ EN in footer
- [x] 4.2 Test theme switching System ↔ Light ↔ Dark
- [x] 4.3 Verify system preference detection works
- [x] 4.4 Verify localStorage persistence
- [x] 4.5 Test smooth 0.3s background-color transition
- [x] 4.6 Test on mobile view (buttons fit, touch friendly)
- [x] 4.7 Check DevTools console for no errors
- [x] 4.8 Run `npm run type-check` - no TypeScript errors

## 5. Commit

- [ ] 5.1 Commit changes with message: "feat: add Vue.js-style appearance toggles to footer"