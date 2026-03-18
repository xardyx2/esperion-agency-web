## Context

The Esperion public website has three UX issues affecting the contact page and overall responsive layout:

1. **Contact Page Map**: Currently displays a static image instead of an interactive Google Maps iframe, preventing users from interacting with the map (zoom, directions, etc.)

2. **Desktop Layout Constraints**: Content containers have max-width limits that leave excessive empty space on large screens, not utilizing available viewport width effectively

3. **Banner Text Contrast**: Hero/banner sections have text that blends into background images, reducing readability especially on certain screen brightness levels

All public pages use ISR (Incremental Static Regeneration) and follow the Esperion Design System with semantic color names.

## Goals / Non-Goals

**Goals:**
- Embed functional Google Maps iframe with proper API key configuration
- Remove max-width constraints from content containers for better desktop utilization
- Improve banner text contrast using gradients and text shadows
- Maintain ISR rendering strategy
- Comply with Esperion Design System (semantic color names, no hardcoded hex)

**Non-Goals:**
- No backend API changes
- No new database schema modifications
- No changes to dashboard/admin pages
- No modifications to existing color palette
- No changes to mobile layout (focus on desktop improvements)

## Decisions

**1. Google Maps Embed Approach**
- **Decision**: Use Google Maps Embed API iframe rather than @vue-googleMaps component
- **Rationale**: Simpler implementation, no additional npm dependencies, iframe provides built-in interactivity
- **Alternative**: Considered @vue-googleMaps/vue3-google-map but adds dependency complexity for a simple embed

**2. Max-Width Removal Strategy**
- **Decision**: Remove max-width from container classes in affected .vue files only
- **Rationale**: Targeted fix without affecting global Tailwind config
- **Alternative**: Could modify tailwind.config.ts but risks unintended side effects on other components

**3. Banner Text Contrast Enhancement**
- **Decision**: Combine gradient overlays with text-shadow for dual-layer contrast improvement
- **Rationale**: Gradient provides background separation, text-shadow adds edge definition
- **Alternative**: Solid background overlay would block underlying imagery entirely

**4. Google Maps API Key**
- **Decision**: Use existing reCAPTCHA Google Cloud project credentials
- **Rationale**: reCAPTCHA v3 already configured, Maps Embed API has separate free tier quota
- **Note**: Maps Embed API is free for typical usage (no billing required for embeds)

## Risks / Trade-offs

**[Google Maps API Quota]** → Monitor usage; embeds are free but should verify no unexpected charges
- Mitigation: Use standard embed URL format which is covered under free tier

**[Layout Shifts on Load]** → Iframe may cause CLS (Cumulative Layout Shift)
- Mitigation: Set explicit width/height attributes on iframe, use aspect-ratio container

**[Dark Mode Compatibility]** → Gradient overlays may appear differently in dark mode
- Mitigation: Test both light/dark modes, adjust gradient opacity if needed

**[Mobile View Unchanged]** → This fix targets desktop; mobile may still have spacing issues
- Mitigation: Document as known limitation, address in future mobile-specific change

## Migration Plan

**Deployment Steps:**
1. Update 5 .vue files with max-width removals and banner improvements
2. Add Google Maps iframe to contact-us.vue
3. Test in Docker development environment
4. Verify ISR cache invalidation (contact page: 60s)
5. Deploy via existing blue-green deployment

**Rollback Strategy:**
- Git revert of the 5 modified .vue files
- No database migrations to reverse
- No API changes to rollback

## Open Questions

- Should we add a fallback static image if Google Maps fails to load?
- Is there a preferred zoom level for the embedded map?
- Should we add a "Get Directions" CTA button below the map?

## Google Maps API Configuration

**No API Key Required for Basic Embed**
The Google Maps Embed API used in this implementation does NOT require an API key for standard usage. The embed URL format used is:
```
https://www.google.com/maps/embed?pb=...
```

**Free Tier Quota:**
- Unlimited map loads for standard embeds
- No billing required for basic map display
- Quota resets daily

**If API Key is Needed (Advanced Features):**
Should future enhancements require an API key (custom styling, advanced markers, etc.):
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select the existing Esperion project
3. Enable "Maps Embed API" in the APIs & Services section
4. Create an API key under Credentials
5. Restrict the key to HTTP referrers (esperion.one domains)
6. Add the key to the embed URL: `?key=YOUR_API_KEY`

**Team Notes:**
- Current implementation uses the standard embed URL without API key
- Monitor map functionality regularly
- If quota limits are hit, the map will display an error message instead of loading
- Consider adding a static map fallback image for redundancy
