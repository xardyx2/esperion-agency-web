## 1. Create Theme Management Composable

- [x] 1.1 Create `frontend/app/composables/useTheme.ts` for theme state management
- [x] 1.2 Implement system preference detection using `window.matchMedia('(prefers-color-scheme: dark)')`
- [x] 1.3 Implement localStorage persistence for theme preference
- [x] 1.4 Create `toggleTheme()` function to switch between light and dark modes
- [x] 1.5 Export `theme`, `isDark`, and `toggleTheme` from composable

## 2. Update Language Management

- [x] 2.1 Create `frontend/app/composables/useLanguage.ts` for language state (if not exists)
- [x] 2.2 Create `appearanceItems` array in MainNav for dropdown structure
- [x] 2.3 Add language items (Indonesian, English) to Appearance dropdown
- [x] 2.4 Implement language switcher in dropdown (reusing existing LanguageSwitcher logic)

## 3. Main Navigation Updates

- [x] 3.1 Open `frontend/app/components/Navigation/MainNav.vue`
- [x] 3.2 Add import for theme composable: `import { useTheme } from '~/composables/useTheme'`
- [x] 3.3 Add import for language composable: `import { useLanguage } from '~/composables/useLanguage'`
- [x] 3.4 Create `appearanceMenu` array in setup with theme and language items
- [x] 3.5 Add Appearance dropdown button in right-side button group (before mobile menu button)
- [x] 3.6 Use NuxtUiDropdown or custom dropdown with semantic colors
- [x] 3.7 Add proper ARIA labels for accessibility
- [x] 3.8 Add icons for theme (moon/sun) and language (globe)

## 4. Footer Cleanup

- [x] 4.1 Open `frontend/app/components/Footer/SiteFooter.vue`
- [x] 4.2 Remove LanguageSwitcher component (line ~138)
- [x] 4.3 Remove custom theme toggle button (lines ~140-149)
- [x] 4.4 Keep social media links (Instagram, Facebook, LinkedIn, TikTok, Twitter)
- [x] 4.5 Keep navigation links and contact info

## 5. CSS Transitions (Nuxt Color Mode 0.3s Pattern)

- [x] 5.1 Open `frontend/app/assets/css/main.css`
- [x] 5.2 Add CSS variables for theming in `:root`:
  - `--es-bg: #FAFCFF`
  - `--es-text: #102B4E`
  - `--es-text-secondary: #475569`
  - `--es-border: #E2E8F0`
- [x] 5.3 Add `.dark` variant of CSS variables:
  - `--es-bg: #0B1120`
  - `--es-text: #F8FAFC`
  - `--es-text-secondary: #94A3B8`
  - `--es-border: #1E293B`
- [x] 5.4 Add body transitions: `body { transition: background-color 0.3s }`
- [x] 5.5 Update all Esperion color classes to use CSS variables

## 6. Testing & Verification

- [x] 6.1 Test language switcher in Appearance dropdown toggles ID ↔ EN
- [x] 6.2 Test dark mode toggle switches light ↔ dark
- [x] 6.3 Verify system preference detection (check light/dark on first visit)
- [x] 6.4 Verify localStorage persistence (toggle, refresh, preference preserved)
- [x] 6.5 Test smooth CSS transitions on theme switch (0.3s as in Nuxt Color Mode)
- [x] 6.6 Test on mobile view (appears correctly, touch friendly)
- [x] 6.7 Test keyboard navigation (tab to dropdown, enter/arrow keys work)
- [x] 6.8 Check DevTools console for no errors
- [x] 6.9 Run `npm run type-check` - no TypeScript errors
- [x] 6.10 Restart Docker frontend: `docker-compose restart frontend`

## 7. Documentation & Commit

- [x] 7.1 Update `frontend/README.md` if needed (component usage)
- [x] 7.2 Test in browser hard refresh (Ctrl+Shift+R)
- [x] 7.3 Verify no visually broken layouts
- [x] 7.4 Commit changes with message: "feat: add Vue-style appearance dropdown in header"
