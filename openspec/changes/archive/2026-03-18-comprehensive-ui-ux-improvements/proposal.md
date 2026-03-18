## Why

The current Esperion website needs comprehensive UI/UX improvements to enhance user experience, ensure proper multi-language support, and optimize rendering strategies. Key issues include: theme toggle and language switcher placement in header (should be in footer), missing 3-state theme toggle (auto/light/dark), incomplete detail pages for articles/portfolio/services, contact page lacking proper layout with form/info/maps sections, and missing unique banner images across pages.

## What Changes

### UI/UX Improvements
- **Move LanguageSwitcher and ThemeToggle to footer** - Relocate from header to footer under Contact Us column for better UX
- **Implement 3-state Theme Toggle** - Add auto/light/dark mode toggle following Nuxt Color Mode best practices (https://color-mode.nuxt.dev/)
- **Fix Social Media Icons** - Add proper Instagram, Facebook, TikTok, LinkedIn, and X icons to footer

### Page Layout Fixes
- **Article Detail Page** - Fix layout, add proper content structure, and banner images
- **Portfolio Detail Page** - Fix layout, add project showcase structure, and banner images  
- **Services Detail Page** - Fix layout, add service information structure, and banner images
- **Contact Us Page** - Redesign with 3-column layout: left (contact form), right (contact info & address), bottom (Google Maps)

### Internationalization (i18n)
- **English Locale** - Full English translation for all content
- **Indonesian Locale** - Hybrid approach: descriptions in Indonesian, service names and technical terms in English

### Rendering Strategy
- **Public Pages** - Configure ISR (Incremental Static Regeneration) with SWR for optimal performance
- **Dashboard Pages** - Keep CSR (Client-Side Rendering) for dynamic CMS functionality

### Asset Management
- **Banner Images** - Add unique banner images to all page sections with clear text visibility
- **Placeholder Images** - Fill empty image slots with unique temporary images (no duplicates)
- **Website Domain** - Ensure all references use esperion.one

## Capabilities

### New Capabilities
- `footer-controls`: Theme toggle and language switcher in footer with 3-state theme support
- `contact-page-redesign`: Multi-section contact page with form, info, and maps
- `detail-page-layouts`: Standardized layouts for article, portfolio, and service detail pages
- `i18n-hybrid-strategy`: Hybrid translation approach for Indonesian locale
- `banner-image-system`: Unique banner images for all page sections

### Modified Capabilities
- `theme-management`: Extend from simple toggle to 3-state (auto/light/dark) with system preference detection
- `social-media-integration`: Update footer social links with proper brand icons

## Impact

### Frontend Changes
- Modify `app/layouts/default.vue` - Move controls to footer
- Update `app/components/ui/LanguageSwitcher.vue` - Relocate and restyle
- Create new `app/components/ThemeToggle.vue` - 3-state toggle component
- Redesign `app/pages/contact-us.vue` - New 3-section layout
- Fix `app/pages/articles/[slug].vue` - Layout and content structure
- Fix `app/pages/our-works/[slug].vue` - Layout and content structure
- Fix `app/pages/our-services/[slug].vue` - Layout and content structure
- Update `app/composables/useColorMode.ts` - Support 3-state mode

### i18n Changes
- Update `i18n/locales/en.json` - Full English translations
- Update `i18n/locales/id.json` - Hybrid Indonesian/English translations

### Configuration Changes
- Update `nuxt.config.ts` - Route rules for ISR/SWR public pages and CSR dashboard
- Update `app.config.ts` - Color mode configuration

### Asset Changes
- Add banner images to `public/images/banners/` (unique for each page)
- Add placeholder images to `public/images/placeholders/` (unique temp images)

### Dependencies
- @iconify-json/lucide (already added) for icons
- @nuxtjs/color-mode for theme management (already configured)

## Success Metrics

1. All 3 theme states (auto/light/dark) functional and persisting across sessions
2. Language switcher in footer working with smooth locale transitions
3. Contact page displays form, info, and maps sections properly
4. All detail pages (article/portfolio/service) have consistent layout with banners
5. Social media icons render correctly with brand-appropriate styling
6. i18n: English 100% translated, Indonesian hybrid strategy implemented
7. Public pages render with ISR/SWR, dashboard with CSR
8. No duplicate images across the site
