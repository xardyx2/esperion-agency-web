# Tasks: Comprehensive UI/UX Improvements

## 1. Footer Controls Implementation

- [x] 1.1 Create ThemeToggle component with 3-state (auto/light/dark) in `frontend/app/components/ui/ThemeToggle.vue`
- [x] 1.2 Update footer layout in `frontend/app/components/layout/Footer.vue` to include controls under Contact column
- [x] 1.3 Move LanguageSwitcher from header to footer in `frontend/app/components/layout/Footer.vue`
- [x] 1.4 Update `frontend/app/layouts/default.vue` layout to remove header controls
- [x] 1.5 Update `frontend/app/composables/useColorMode.ts` to support 3-state theme mode with system preference detection
- [x] 1.6 Add localStorage persistence for theme preference in ThemeToggle component

## 2. Contact Page Redesign

- [x] 2.1 Redesign `frontend/app/pages/contact-us.vue` with 2-column layout (form left 60%, info right 40%)
- [x] 2.2 Add Google Maps embed section at bottom of contact page (full-width)
- [x] 2.3 Update contact form with all required fields: name, email, phone, service dropdown, message
- [x] 2.4 Add contact information display: address, phone, email, business hours
- [x] 2.5 Add FormKit validation to contact form fields
- [x] 2.6 Implement form submission with loading state and success/error feedback

## 3. Detail Pages Layout Fix

- [x] 3.1 Fix `frontend/app/pages/articles/[slug].vue` with banner and consistent content structure
- [x] 3.2 Fix `frontend/app/pages/our-works/[slug].vue` with project showcase layout
- [x] 3.3 Fix `frontend/app/pages/our-services/[slug].vue` with service information layout
- [x] 3.4 Add consistent banner image component to all detail pages
- [x] 3.5 Ensure typography and spacing consistency across all detail pages
- [x] 3.6 Add responsive image loading with srcset for banner images

## 4. i18n Hybrid Strategy

- [x] 4.1 Update `frontend/i18n/locales/en.json` with full English translations for all new content
- [x] 4.2 Update `frontend/i18n/locales/id.json` with hybrid translations (descriptions ID, names EN)
- [x] 4.3 Add translation keys for footer controls (theme toggle labels, language switcher)
- [x] 4.4 Add translation keys for contact page (form labels, contact info, business hours)
- [x] 4.5 Test language switching across all pages (EN and ID)
- [x] 4.6 Verify SEO meta tags are translated for both locales
- [x] 4.7 Configure i18n fallback to English for missing Indonesian translations

## 5. Social Media Icons

- [x] 5.1 Add Instagram icon to footer with brand color on hover
- [x] 5.2 Add Facebook icon to footer with brand color on hover
- [x] 5.3 Add TikTok icon to footer with brand color on hover
- [x] 5.4 Add LinkedIn icon to footer with brand color on hover
- [x] 5.5 Add X (Twitter) icon to footer with brand color on hover
- [x] 5.6 Implement monochrome icons at rest, brand colors on hover
- [x] 5.7 Add proper links to social media profiles (esperion.one)

## 6. Rendering Strategy Configuration

- [x] 6.1 Configure ISR/SWR for public pages in `frontend/nuxt.config.ts` (60s SWR)
  - Homepage, articles, portfolio, services, about, contact
- [x] 6.2 Configure CSR for dashboard pages in `frontend/nuxt.config.ts` (ssr: false)
- [x] 6.3 Verify rendering strategy works correctly using Lighthouse
- [x] 6.4 Test caching behavior for ISR pages
- [x] 6.5 Verify dashboard pages render client-side only

## 7. Banner Images

- [x] 7.1 Create unique banner image for Home page (agency branding) in `frontend/public/images/banners/home.webp`
- [x] 7.2 Create unique banner image for Works page (showcase themed) in `frontend/public/images/banners/works.webp`
- [x] 7.3 Create unique banner image for Services page (professional services) in `frontend/public/images/banners/services.webp`
- [x] 7.4 Create unique banner image for Articles page (blog/writing themed) in `frontend/public/images/banners/articles.webp`
- [x] 7.5 Create unique banner image for About page (team/office themed) in `frontend/public/images/banners/about.webp`
- [x] 7.6 Create unique banner image for Contact page (communication themed) in `frontend/public/images/banners/contact.webp`
- [x] 7.7 Optimize all banner images to WebP format (max 200KB each)
- [x] 7.8 Create mobile variants for all banners (768x400px)

## 8. Final Integration

- [x] 8.1 Test all pages in light mode
- [x] 8.2 Test all pages in dark mode
- [x] 8.3 Test all pages in auto mode (system preference)
- [x] 8.4 Test language switching (EN and ID) on all pages
- [x] 8.5 Verify all banner images are unique and visible
- [x] 8.6 Test contact form submission and email notifications
- [x] 8.7 Test responsive layout on mobile, tablet, and desktop
- [x] 8.8 Verify social media icons render correctly with hover states
- [x] 8.9 Run final build and verify no errors
- [x] 8.10 Run Playwright E2E tests to verify no regressions
