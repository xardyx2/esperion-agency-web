# frontend-ux-cleanup Tasks

## 1. Move Language Switcher to Footer

- [x] 1.1 Open `frontend/app/components/Footer/SiteFooter.vue`
- [x] 1.2 Add LanguageSwitcher component to bottom bar section (before or after copyright)
- [x] 1.3 Use variant="buttons" for footer placement
- [x] 1.4 Style appropriately for footer (smaller size, proper spacing)
- [x] 1.5 Remove LanguageSwitcher from MainNav.vue (line 37)
- [x] 1.6 Test language switcher in footer

## 2. Move Theme Toggle to Footer

- [x] 2.1 Add theme toggle button to SiteFooter.vue (next to language switcher)
- [x] 2.2 Import useColorMode composable
- [x] 2.3 Implement toggleTheme function
- [x] 2.4 Style consistently with language switcher
- [x] 2.5 Remove theme toggle button from MainNav.vue (lines 40-48)
- [x] 2.6 Test theme toggle in footer

## 3. Verify Toggles Working

- [x] 3.1 Test language switcher toggles ID ↔ EN
- [x] 3.2 Verify language cookie is set
- [x] 3.3 Test theme toggle switches light ↔ dark
- [x] 3.4 Verify no console errors
- [x] 3.5 Test on mobile responsive view

## 4. Update Social Media Handles (Pending Client Confirmation)

- [x] 4.1 Verify Instagram handle (@esperion_id)
- [x] 4.2 Verify Facebook handle (esperiondigital)
- [x] 4.3 Verify LinkedIn URL (/company/esperiondigital)
- [x] 4.4 Verify TikTok handle (@esperion_id)
- [x] 4.5 Verify Twitter/X handle (@esperion_id)
- [x] 4.6 Update SiteFooter.vue with correct handles

## 5. Testing & Cache Clear

- [x] 5.1 Restart Docker frontend: `docker-compose restart frontend`
- [x] 5.2 Clear browser cache: `Ctrl+Shift+R`
- [x] 5.3 Test all footer toggles on desktop
- [x] 5.4 Test all footer toggles on mobile
- [x] 5.5 Verify no console errors
- [x] 5.6 Verify navbar is cleaner (no toggles)

---

## Acceptance Criteria

- ✅ Language switcher in footer (functional)
- ✅ Theme toggle in footer (functional)
- ✅ Navbar cleaner (toggles removed)
- ✅ Language toggle switches ID ↔ EN
- ✅ Theme toggle switches light ↔ dark
- ✅ Social media links correct (once confirmed)
- ✅ Zero console errors
- ✅ Responsive on mobile

## Files to Modify

1. `frontend/app/components/Footer/SiteFooter.vue` - Add toggles
2. `frontend/app/components/Navigation/MainNav.vue` - Remove toggles
3. `frontend/app/locales/` - Verify i18n files

## Estimated Time

- Move toggles: 1 hour
- Verify functionality: 30 min
- Social media update: 15 min (pending info)
- Testing: 30 min
- **Total: ~2 hours**
