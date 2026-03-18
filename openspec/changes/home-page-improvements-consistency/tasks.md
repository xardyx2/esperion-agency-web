## 1. Home Page Works Carousel

- [ ] 1.1 Update `frontend/app/pages/index.vue` works section to display 3 works at a time
- [ ] 1.2 Implement infinite looping carousel logic with 5 total works
- [ ] 1.3 Add navigation arrows (left/right) for carousel
- [ ] 1.4 Add Vue transitions for smooth sliding animation
- [ ] 1.5 Ensure responsive behavior (mobile: 1 item, tablet: 2 items, desktop: 3 items)

## 2. Contact Page Updates

- [ ] 2.1 Update address in `frontend/app/pages/contact-us.vue` to "Sawangan Elok A 1 No 5 RT1 RW 10"
- [ ] 2.2 Add Google Maps link: https://maps.app.goo.gl/8k6FPBdZhEkAh3Qq6
- [ ] 2.3 Fix social media icons display (Facebook, Instagram, LinkedIn, Twitter, YouTube)
- [ ] 2.4 Ensure social icons link to correct Esperion profiles
- [ ] 2.5 Test icon visibility in both light and dark modes

## 3. Page Banners Implementation

- [ ] 3.1 Update `frontend/app/pages/articles/index.vue` with hero banner: "Articles - Insight, pembelajaran, dan pembaruan dari tim Esperion"
- [ ] 3.2 Update `frontend/app/pages/our-works/index.vue` with hero banner: "Our Works"
- [ ] 3.3 Update `frontend/app/pages/our-services/index.vue` with hero banner: "Our Services"
- [ ] 3.4 Update `frontend/app/pages/about.vue` with hero banner: "About Us"
- [ ] 3.5 Ensure banner text has proper contrast and text shadow for visibility
- [ ] 3.6 Add background images to each banner

## 4. i18n Consistency - English Titles

- [ ] 4.1 Update `frontend/locales/id.json` navigation labels to English: "Home", "Our Works", "Our Services", "Articles", "About", "Contact Us"
- [ ] 4.2 Ensure page titles in Indonesian locale remain in English
- [ ] 4.3 Update section headlines to English for Tier 1 content
- [ ] 4.4 Verify descriptions remain in Indonesian (Tier 2/3 content)

## 5. Naming Consistency

- [ ] 5.1 Fix "Our Portfolio" to "Our Works" in `frontend/app/pages/our-works/index.vue` title
- [ ] 5.2 Check and fix any inconsistent page names in navigation vs page titles
- [ ] 5.3 Verify all URLs match the navigation labels (/our-works, /our-services, /articles, /about, /contact-us)
- [ ] 5.4 Update meta titles to match navigation labels

## 6. Clickable Tags and Categories

- [ ] 6.1 Update `frontend/app/pages/articles/[slug].vue` to make tags clickable
- [ ] 6.2 Update `frontend/app/pages/articles/index.vue` to filter by tag/category from URL query params
- [ ] 6.3 Update `frontend/app/pages/our-services/[slug].vue` to make categories clickable
- [ ] 6.4 Update `frontend/app/pages/our-services/index.vue` to filter by category
- [ ] 6.5 Update `frontend/app/pages/our-works/[slug].vue` to make tags clickable
- [ ] 6.6 Update `frontend/app/pages/our-works/index.vue` to filter by tag
- [ ] 6.7 Add visual hover effects for clickable tags/categories

## 7. Testing and Verification

- [ ] 7.1 Test home page works carousel functionality
- [ ] 7.2 Verify contact page address and social icons
- [ ] 7.3 Check all page banners display correctly with visible text
- [ ] 7.4 Verify i18n consistency across all pages
- [ ] 7.5 Test clickable tags/categories filtering
- [ ] 7.6 Run `npm run type-check` to ensure TypeScript compliance
- [ ] 7.7 Test responsive design on mobile, tablet, and desktop
