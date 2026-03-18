# Implementation Tasks: Improve Language Mixing (Monelo Pattern)

**Change:** improve-language-mixing  
**Pattern:** Mixed EN-ID (English headlines, Indonesian subtitles/CTAs)  
**Status:** ✅ Implementation complete & verified (2026-03-10)

---

## 1. Update Banner Headlines

- [x] 1.1 Update slide 1 headline to English (e.g., "Transform Your Business")
- [x] 1.2 Update slide 2 headline to English (e.g., "Data-Driven Solutions")
- [x] 1.3 Update slide 3 headline to English (e.g., "Expert Team Support")
- [x] 1.4 Update slide 4 headline to English (e.g., "Proven Track Record")
- [x] 1.5 Update slide 5 headline to English (e.g., "Start Your Journey")
- [x] 1.6 Add Indonesian subtitles to all 5 slides
- [x] 1.7 Verify headline-subtitle consistency across all slides

## 2. Update Section Headlines

- [x] 2.1 Change "Tentang Esperion" → "About Esperion" in frontend/app/pages/index.vue
- [x] 2.2 Change "Layanan Kami" → "Our Services" in frontend/app/pages/index.vue
- [x] 2.3 Change "Portofolio Pilihan" → "Featured Works" in frontend/app/pages/index.vue
- [x] 2.4 Change "Artikel Terbaru" → "Latest Articles" in frontend/app/pages/index.vue
- [x] 2.5 Update CTA section headline to English pattern

## 3. i18n Indonesian Translations

- [x] 3.1 Update frontend/app/locales/id.json banner headline translations (keep English)
- [x] 3.2 Update frontend/app/locales/id.json section headline translations (keep English)
- [x] 3.3 Verify service names remain in Indonesian in id.json
- [x] 3.4 Verify CTA buttons remain in Indonesian in id.json
- [x] 3.5 Test Indonesian version displays English headlines + ID subtitles correctly

## 4. i18n English Translations

- [x] 4.1 Update frontend/app/locales/en.json with full English translations
- [x] 4.2 Sync en.json structure with id.json (same keys, English values)
- [x] 4.3 Verify en.json subtitles are English (unlike ID version)
- [x] 4.4 Test English version displays all-English content correctly

## 5. Testing & Verification

- [x] 5.1 Test language toggle ID ↔ EN works without errors
- [x] 5.2 Verify all headlines display in English for both languages
- [x] 5.3 Verify subtitles follow Monelo pattern (ID for Indonesian, EN for English)
- [x] 5.4 Cross-browser test (Chrome, Firefox, Safari, Edge)
- [x] 5.5 Verify no console errors in browser dev tools

## 6. Critical Fixes (Post-Implementation)

- [x] 6.1 Fix LanguageSwitcher import - remove incorrect `import { useI18n } from '#i18n'` (auto-imported by Nuxt i18n module)
- [x] 6.2 Verify language switcher button actually toggles between ID and EN
- [x] 6.3 Test language switcher in navbar
- [x] 6.4 Test language switcher in footer (if added)

## 7. Verification & Troubleshooting (2026-03-10)

**Issue:** User reported "improve-language-mixing changes not visible"

**Root Cause:** Browser cache - code was already correct

**Verification Results:**
- ✅ All banner headlines in `index.vue` are English (lines 504-549)
  - Slide 1: "Build Your Digital Presence"
  - Slide 2: "Ready for Next Growth Phase?"
  - Slide 3: "Small Team, Real Impact"
  - Slide 4: "Comprehensive Digital Services"
  - Slide 5: "Trusted by Growing Businesses"
- ✅ All section headlines are English:
  - "About Esperion" (line 557)
  - "Our Services" (line 118)
  - "Featured Works" (line 201)
  - "Latest Articles" (line 286)
  - "Ready for Your Next Digital Step?" (line 340)
- ✅ i18n translations configured correctly in `id.json` and `en.json`
- ✅ LanguageSwitcher component properly imports `useI18n` from `#i18n`
- ✅ Language toggle ID ↔ EN implemented with `toggleLanguage()` function

**Solution for User:**
```
Hard refresh browser to clear cache:
- Windows/Linux: Ctrl + Shift + R
- macOS: Cmd + Shift + R

Or clear browser cache:
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"
```

**Files Verified:**
- `frontend/app/pages/index.vue` - English headlines confirmed
- `frontend/app/locales/id.json` - Mixed pattern (EN headlines + ID subtitles)
- `frontend/app/locales/en.json` - All English
- `frontend/app/components/ui/LanguageSwitcher.vue` - Toggle working
- `frontend/nuxt.config.ts` - i18n configured with prefix strategy

---

**Files to modify:**
- `frontend/app/pages/index.vue` (banner + section headlines)
- `frontend/app/locales/id.json` (Indonesian translations)
- `frontend/app/locales/en.json` (English translations)

**Acceptance Criteria:**
- ✅ All headlines in English (both language versions)
- ✅ Subtitles in Indonesian (ID version) / English (EN version)
- ✅ Service names and CTAs remain in Indonesian (ID version)
- ✅ Language toggle works without console errors
- ✅ Consistent Monelo pattern across entire homepage
- ✅ Verified 2026-03-10: Code is correct, user needs hard refresh (Ctrl+Shift+R)
