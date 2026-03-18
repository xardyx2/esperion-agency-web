## Why

Multiple UI/UX inconsistencies and missing features on the Esperion website need to be addressed to improve user experience, content discoverability, and brand consistency across all pages.

## What Changes

1. **Home Page Works Section**: Implement infinite looping carousel showing 5 works but displaying 3 at a time with navigation arrows
2. **Address Update**: Update contact address to "Sawangan Elok A 1 No 5 RT1 RW 10" with Google Maps link
3. **Contact Page Social Icons**: Fix social media icon display issues
4. **Indonesian Language Titles**: Ensure headlines/titles remain in English (Tier 1 content strategy per translation guidelines)
5. **Page Banners**: Add hero banners to each page (Articles, Works, Services, About, Contact) with clear, visible text
6. **Naming Consistency**: Fix page name inconsistencies (e.g., "Our Works" vs "Our Portfolio") across navigation, page titles, and permalinks
7. **Clickable Tags/Categories**: Make tags and categories clickable on articles, services, and works pages for filtering/navigation

## Capabilities

### New Capabilities
- `works-carousel`: Infinite looping carousel for works/portfolio section on homepage
- `clickable-taxonomy`: Clickable tags and categories system across content types

### Modified Capabilities
- `contact-page`: Update address info and fix social media icons
- `page-banners`: Add consistent hero banners across all public pages
- `i18n-consistency`: Ensure Tier 1 content (titles/headlines) remains in English for Indonesian locale
- `naming-consistency`: Standardize page names across navigation and titles

## Impact

- Frontend: Updates to multiple Vue components (index.vue, contact-us.vue, articles pages, services pages, works pages)
- i18n: Translation key updates for consistency
- Routing: Category/tag filter routes for clickable taxonomy
- Design System: Consistent banner implementation across pages
