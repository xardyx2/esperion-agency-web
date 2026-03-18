# Design

## Context

The current Esperion website has the theme toggle and language switcher positioned in the header. These controls need to be relocated to the footer under the Contact column for better user experience. The theme system requires expansion from a simple 2-state toggle to a 3-state theme selector (auto/light/dark). Detail pages for articles, portfolio items, and services need layout fixes and consistent structure. The contact page requires a complete redesign with proper form, information, and maps sections. Internationalization needs a hybrid strategy where English is fully translated while Indonesian uses a hybrid approach with service names remaining in English.

## Goals / Non-Goals

### Goals

- Move footer controls (theme toggle and language switcher) to footer under Contact column
- Implement 3-state theme toggle (auto/light/dark) with system preference detection
- Fix detail page layouts for articles, portfolio items, and services with consistent structure
- Redesign contact page with form, info, and maps sections
- Configure hybrid i18n strategy (English full, Indonesian hybrid)
- Set ISR rendering for public pages, CSR for dashboard pages
- Add unique banner images for each page section

### Non-Goals

- Backend API changes
- Database schema changes
- New authentication features
- Changes to existing content management workflows

## Decisions

### Theme Toggle Design

The theme system will use `@nuxtjs/color-mode` module for 3-state theme support. User preference will be stored in localStorage for persistence across sessions. System preference detection will use the CSS `prefers-color-scheme` media query when in auto mode.

**UI Component:** Segmented button control with three options:
- Auto (icon: sun-moon or cpu)
- Light (icon: sun)
- Dark (icon: moon)

**State Management:**
- Default: `auto` (follows system preference)
- Override: User selection stored in localStorage
- Fallback: `light` if no system preference detected

### Footer Layout Design

Footer will use a 4-column grid layout on desktop:

```
Company Info | Quick Links | Services | Contact Info + Controls
```

**Column 1 - Company Info:**
- Esperion logo
- Brief tagline
- Social media icons (Instagram, Facebook, TikTok, LinkedIn, X)

**Column 2 - Quick Links:**
- Home
- About Us
- Articles
- Our Works
- Our Services
- Contact Us

**Column 3 - Services:**
- Web Development
- Mobile Development
- Digital Marketing
- UI/UX Design
- Consulting

**Column 4 - Contact Info + Controls:**
- Address
- Phone number
- Email
- Business hours
- Language Switcher (bottom)
- Theme Toggle (bottom)

**Responsive Behavior:**
- Desktop (≥1024px): 4-column grid
- Tablet (768px-1023px): 2-column grid
- Mobile (<768px): Single column stack

### Contact Page Design

Contact page will use a 2-column layout on desktop with a full-width maps section below.

**Layout Structure:**

```
┌─────────────────────────────────────────────────────┐
│  Banner Image with Page Title                       │
├──────────────────────────┬──────────────────────────┤
│  Contact Form (60%)      │  Contact Info (40%)      │
│                          │                          │
│  - Name                  │  - Address               │
│  - Email                 │  - Phone                 │
│  - Phone                 │  - Email                 │
│  - Service (dropdown)    │  - Business Hours        │
│  - Message               │                          │
│  - Submit Button         │  - Social Links          │
├──────────────────────────┴──────────────────────────┤
│  Google Maps (Full Width)                           │
└─────────────────────────────────────────────────────┘
```

**Form Fields:**
- Name (text, required)
- Email (email, required)
- Phone (tel, optional)
- Service (select dropdown, required)
- Message (textarea, required)
- Submit button with loading state

**Contact Info Section:**
- Office address with icon
- Phone number with icon
- Email address with icon
- Business hours with icon
- Social media links

**Maps Section:**
- Full-width Google Maps embed
- Centered on Esperion office location
- Interactive with zoom controls

### i18n Strategy

Hybrid translation approach for multi-language support:

**English Locale (`en.json`):**
- 100% English translation
- All navigation labels
- All page content
- All form labels and placeholders
- All buttons and CTAs

**Indonesian Locale (`id.json`):**
- Descriptions and content in Indonesian
- Service names remain in English (e.g., "Web Development", not "Pengembangan Web")
- Technical terms remain in English
- Navigation labels in Indonesian
- Form labels in Indonesian

**Translation Key Structure:**
```
nav.*          - Navigation labels
home.*         - Homepage content
services.*     - Services pages
articles.*     - Article pages
portfolio.*    - Portfolio pages
contact.*      - Contact page
footer.*       - Footer content
common.*       - Shared labels
```

### Rendering Strategy

**Public Pages (ISR):**
- Articles listing and detail pages
- Portfolio listing and detail pages
- Services listing and detail pages
- About page
- Contact page
- Homepage

Configuration in `nuxt.config.ts`:
```typescript
routeRules: {
  '/': { swr: 60 },
  '/articles': { swr: 60 },
  '/articles/**': { swr: 60 },
  '/our-works': { swr: 60 },
  '/our-works/**': { swr: 60 },
  '/our-services': { swr: 60 },
  '/our-services/**': { swr: 60 },
  '/about': { swr: 60 },
  '/contact': { swr: 60 },
}
```

**Dashboard Pages (CSR):**
All dashboard routes will use client-side rendering:
```typescript
routeRules: {
  '/dashboard/**': { ssr: false }
}
```

### Banner Image Design

Each page section will have a unique banner image:

- Homepage: Hero banner with agency branding
- Articles listing: Blog/writing themed banner
- Article detail: Unique per article (based on topic)
- Portfolio listing: Showcase/project themed banner
- Portfolio detail: Unique per project (project screenshots)
- Services listing: Professional services banner
- Service detail: Unique per service (service-specific imagery)
- About: Team/office themed banner
- Contact: Communication/connectivity themed banner

**Image Specifications:**
- Format: WebP with fallback
- Dimensions: 1920x600px for desktop, 768x400px for mobile
- Text overlay: Clear, readable with contrast
- Aspect ratio: 16:9 for consistency

## Risks / Trade-offs

### Risk: Footer Controls Visibility

Moving theme and language controls from header to footer may reduce visibility and discoverability.

**Mitigation:**
- Add visual indicators (icons) for controls
- Ensure adequate spacing and separation from contact info
- Consider subtle hover animations to draw attention
- Test with users to confirm findability

### Risk: 3-State Theme Complexity

Adding auto mode increases complexity for users who may not understand the difference between auto and manual modes.

**Mitigation:**
- Clear UI labels (Auto, Light, Dark)
- Iconography that communicates meaning
- Tooltip explanations on hover
- Visual feedback showing current active state

### Risk: Hybrid i18n Confusion

Indonesian users may be confused by mixed language content (Indonesian descriptions with English service names).

**Mitigation:**
- Document the approach in UI where needed
- Ensure consistency across all pages
- Consider adding English terms in parentheses on first occurrence
- Gather user feedback and iterate

### Risk: ISR Cache Staleness

60-second SWR may show slightly outdated content during active updates.

**Mitigation:**
- Acceptable trade-off for performance gains
- Dashboard content remains real-time via CSR
- Manual cache invalidation available if needed
- Consider reducing to 30s if content freshness is critical

### Risk: Banner Image Performance

Unique banner images for each page may increase initial load time.

**Mitigation:**
- Use WebP format with fallbacks
- Implement lazy loading
- Optimize image sizes (max 200KB per banner)
- Use responsive images with srcset

## Migration Plan

### Phase 1: Footer Controls
1. Update `app/layouts/default.vue` to remove controls from header
2. Create `app/components/layout/FooterControls.vue` with theme toggle and language switcher
3. Integrate FooterControls into footer Contact column
4. Test responsive behavior across breakpoints

### Phase 2: Theme Toggle
1. Create `app/components/ui/ThemeToggle.vue` with 3-state segmented button
2. Update `app/composables/useColorMode.ts` to support auto/light/dark states
3. Implement system preference detection
4. Add localStorage persistence
5. Test across browsers and system themes

### Phase 3: Detail Page Layouts
1. Fix `app/pages/articles/[slug].vue` with consistent structure
2. Fix `app/pages/our-works/[slug].vue` with project showcase layout
3. Fix `app/pages/our-services/[slug].vue` with service information layout
4. Add banner image support to all detail pages
5. Ensure consistent typography and spacing

### Phase 4: Contact Page Redesign
1. Redesign `app/pages/contact-us.vue` with 2-column layout
2. Implement contact form with FormKit validation
3. Add contact information section
4. Integrate Google Maps embed
5. Test form submission and email notifications

### Phase 5: i18n Updates
1. Update `i18n/locales/en.json` with full English translations
2. Update `i18n/locales/id.json` with hybrid strategy
3. Add new translation keys for footer controls
4. Add new translation keys for contact page
5. Test locale switching and content rendering

### Phase 6: Rendering Configuration
1. Update `nuxt.config.ts` with route rules for ISR/SWR
2. Configure CSR for dashboard routes
3. Test rendering strategies with Lighthouse
4. Verify caching behavior

### Phase 7: Banner Images
1. Create banner images for all page types
2. Add images to `public/images/banners/`
3. Implement responsive image loading
4. Optimize file sizes and formats

## Open Questions

### Should theme preference sync across devices?

**Decision:** No, theme preference will be stored locally only.

**Rationale:** 
- Simplifies implementation
- Respects user context (different devices may have different lighting conditions)
- No backend changes required
- Aligns with privacy-first approach

### Which banner images for each page?

**Decision:** Create unique banner images for each page type.

**Approach:**
- Homepage: Agency branding with team/office imagery
- Articles: Writing/technology themed generic banner
- Article detail: Topic-specific imagery generated per article
- Portfolio: Project showcase themed generic banner
- Portfolio detail: Actual project screenshots/mockups
- Services: Professional services generic banner
- Service detail: Service-specific conceptual imagery
- About: Team culture and office environment
- Contact: Communication and connectivity themes

**Next Steps:**
- Create image generation brief for designer
- Establish image naming convention
- Define fallback strategy for missing images

### Should social media icons use brand colors or monochrome?

**Decision:** Use brand colors on hover, monochrome at rest.

**Rationale:**
- Maintains visual consistency
- Provides interactive feedback
- Reduces visual noise in footer
- Follows modern design patterns

### How to handle missing translations?

**Decision:** Fall back to English for missing Indonesian translations.

**Implementation:**
- Configure i18n fallback locale to English
- Log missing translations in development
- Create translation completeness report
- Never show raw translation keys to users
