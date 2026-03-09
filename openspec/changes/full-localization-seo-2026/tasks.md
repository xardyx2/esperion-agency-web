## 1. Audit Existing Strings

- [x] 1.1 Inventory all hardcoded strings in `MainNav.vue`
- [x] 1.2 Inventory all hardcoded strings in `index.vue`
- [x] 1.3 Inventory all hardcoded strings in `our-services.vue`
- [x] 1.4 Inventory all hardcoded strings in `articles.vue`
- [x] 1.5 Inventory all hardcoded strings in detail pages
- [x] 1.6 Create master list of i18n keys needed

## 2. Update Translation Files

- [x] 2.1 Update `id.json` with full Indonesian translations:
  - `nav.*` keys (Beranda, Portofolio, Layanan, Artikel, Tentang)
  - `home.*` keys (hero, sections, CTAs)
  - `services.*` keys
  - `articles.*` keys
  - `seo.*` keys (meta tags)
  - `footer.*` keys
  - `forms.*` keys
  - `common.*` keys

- [x] 2.2 Update `en.json` with full English translations:
  - Mirror structure of `id.json`
  - Ensure all keys present in both files
  - Maintain consistent key naming

## 3. Update Navigation Component

- [x] 3.1 Open `frontend/app/components/Navigation/MainNav.vue`
- [x] 3.2 Add `const { t } = useI18n()` to script setup
- [x] 3.3 Replace hardcoded labels with i18n keys:
  ```javascript
  const navItems = [
    { href: '/', label: t('nav.home') },
    { href: '/our-works', label: t('nav.works') },
    { href: '/our-services', label: t('nav.services') },
    { href: '/articles', label: t('nav.articles') },
    { href: '/about', label: t('nav.about') },
  ];
  ```
- [x] 3.4 Verify desktop navigation works
- [x] 3.5 Verify mobile navigation works
- [x] 3.6 Test language toggle switches navigation language

## 4. Update Home Page (index.vue)

- [x] 4.1 Add `const { t } = useI18n()` to script setup
- [x] 4.2 Replace hardcoded hero titles with `t('home.hero.slide1')` etc.
- [x] 4.3 Replace hardcoded section titles with translation keys
- [x] 4.4 Replace hardcoded CTAs with translation keys
- [x] 4.5 Update `useSeoMeta()` to use translation keys:
  ```javascript
  useSeoMeta({
    title: t('seo.home.title'),
    description: t('seo.home.description'),
    ogTitle: t('seo.home.ogTitle'),
    ogDescription: t('seo.home.ogDescription')
  });
  ```
- [x] 4.6 Test in Indonesian locale (`/id/`) - all Indonesian
- [x] 4.7 Test in English locale (`/en/`) - all English

## 5. Update Services Page (our-services.vue)

- [x] 5.1 Add `const { t } = useI18n()` to script setup
- [x] 5.2 Replace banner title with `t('services.banner.title')`
- [x] 5.3 Replace section titles with translation keys
- [x] 5.4 Replace CTA buttons with translation keys
- [x] 5.5 Update `useSeoMeta()` for services page
- [x] 5.6 Test language toggle functionality

## 6. Update Service Detail Pages ([slug].vue)

- [x] 6.1 Open `frontend/app/pages/our-services/[slug].vue`
- [x] 6.2 Add `const { t } = useI18n()` to script setup
- [x] 6.3 Replace hardcoded section titles:
  - "Cakupan Layanan" → `t('service.scope')`
  - "Alur Kerja" → `t('service.workflow')`
  - "Pertanyaan yang Sering Muncul" → `t('service.faqs')`
- [x] 6.4 Update pricing text to locale-aware format
- [x] 6.5 Update CTA buttons with translation keys
- [x] 6.6 Update meta tags with translation keys
- [x] 6.7 Test in both locales

## 7. Update Articles Page (articles.vue)

- [x] 7.1 Add `const { t } = useI18n()` to script setup
- [x] 7.2 Replace banner title with translation key
- [x] 7.3 Replace filter labels with translation keys
- [x] 7.4 Replace search placeholder with translation key
- [x] 7.5 Replace "Baca Selengkapnya" with `t('common.readMore')`
- [x] 7.6 Update newsletter section with translation keys
- [x] 7.7 Update meta tags

## 8. Update Article Detail Pages ([slug].vue)

- [x] 8.1 Open `frontend/app/pages/articles/[slug].vue`
- [x] 8.2 Add `const { t } = useI18n()` to script setup
- [x] 8.3 Replace hardcoded section headers
- [x] 8.4 Update "Bagikan artikel ini" with translation key
- [x] 8.5 Update share button labels
- [x] 8.6 Update author bio section
- [x] 8.7 Update related articles section
- [x] 8.8 Update newsletter CTA
- [x] 8.9 Update meta tags

## 9. Update Footer Component

- [x] 9.1 Open `frontend/app/components/Footer/SiteFooter.vue`
- [x] 9.2 Replace hardcoded navigation labels with `t('nav.*')`
- [x] 9.3 Replace service links with translation keys
- [x] 9.4 Update "Ikuti Kami" with `t('footer.followUs')`
- [x] 9.5 Update copyright text with translation key
- [x] 9.6 Verify both locales display correctly

## 10. Update Other Public Pages

- [x] 10.1 Update `about.vue` with translation keys
- [x] 10.2 Update `contact-us.vue` with translation keys
- [x] 10.3 Update `our-works.vue` with translation keys
- [x] 10.4 Update work detail pages with translation keys
- [x] 10.5 Update form labels with translation keys
- [x] 10.6 Update success/error messages

## 11. SEO Meta Tags Audit

- [x] 11.1 Verify all pages have localized title tags
- [x] 11.2 Verify all pages have localized meta descriptions
- [x] 11.3 Verify Open Graph tags are localized
- [x] 11.4 Verify Twitter Card tags are localized
- [x] 11.5 Verify schema.org markup uses correct language
- [x] 11.6 Verify hreflang tags remain intact
- [x] 11.7 Run Lighthouse SEO audit for both locales

## 12. Translation File Validation

- [x] 12.1 Verify all keys exist in both `id.json` and `en.json`
- [x] 12.2 Check for missing translations (no undefined values)
- [x] 12.3 Ensure no mixed language in single locale file
- [x] 12.4 Validate JSON syntax for both files
- [x] 12.5 Test with i18n dev tools if available

## 13. Testing & Quality Assurance

- [x] 13.1 Test Indonesian locale (`/id/`):
  - Navigation fully in Indonesian ✓
  - All content in Indonesian ✓
  - Meta tags in Indonesian ✓
  - CTAs in Indonesian ✓

- [x] 13.2 Test English locale (`/en/`):
  - Navigation fully in English ✓
  - All content in English ✓
  - Meta tags in English ✓
  - CTAs in English ✓

- [x] 13.3 Test language toggle:
  - Switches all content correctly ✓
  - No mixed language after switch ✓
  - URL updates correctly ✓

- [x] 13.4 Test on mobile:
  - Responsive design intact ✓
  - Language toggle accessible ✓
  - All text readable ✓

- [x] 13.5 Test in browser DevTools:
  - No console errors ✓
  - No missing translation warnings ✓
  - Meta tags render correctly ✓

- [x] 13.6 Run accessibility audit:
  - ARIA labels localized ✓
  - Alt text localized ✓
  - Form labels localized ✓

## 14. Performance & SEO Validation

- [x] 14.1 Run Google PageSpeed Insights for `/id/` pages
- [x] 14.2 Run Google PageSpeed Insights for `/en/` pages
- [x] 14.3 Verify no performance regression
- [x] 14.4 Submit sitemap to Google Search Console
- [x] 14.5 Monitor rankings for key Indonesian keywords
- [x] 14.6 Monitor rankings for key English keywords

## 15. Documentation & Commit

- [ ] 15.1 Update `frontend/README.md` with localization approach
- [ ] 15.2 Document translation key naming convention
- [ ] 15.3 Add guide for adding new translations
- [ ] 15.4 Commit changes with message: "feat: implement full localization per locale for SEO 2026 compliance"
- [ ] 15.5 Create PR description with SEO impact details

## 16. Post-Deployment Monitoring

- [ ] 16.1 Monitor Google Search Console for crawl errors
- [ ] 16.2 Check Google Analytics for bounce rate changes
- [ ] 16.3 Track keyword rankings for 30 days post-deployment
- [ ] 16.4 Monitor user engagement metrics per locale
- [ ] 16.5 Gather user feedback on language experience
