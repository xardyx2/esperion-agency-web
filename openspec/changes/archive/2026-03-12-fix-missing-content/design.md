## Context

**Current State:**
- Banner slider only has 3 images (banner-1.jpg, banner-2.jpg, banner-3.jpg)
- Slides 4 and 5 in `index.vue` reference `/images/banner-4.jpg` and `/images/banner-5.jpg` which don't exist
- Client logos section uses placeholder SVG (`/placeholders/first-party/client-logo-required.svg`) for all 8 slots
- All `<img>` tags use direct tags without `loading="lazy"` - poor performance
- Footer social icons use emoji (📷 👍 💼 🎵 🕙) instead of professional iconography
- **CRITICAL: Navbar transparent in dark mode due to missing CSS variables**

**Impact:**
- Slider shows broken images for slides 4-5 (404 errors)
- Client logos distract from professional appearance
- Page load performance degraded without lazy loading
- Social icons appear unprofessional compared to design system
- **Navbar unreadable in dark mode when scrolled over bright content**

**Root Cause Analysis:**
1. Banner images 4-5 were never downloaded or are missing from asset inventory
2. Client logos require first-party approval (per `asset-inventory.json`)
3. Lazy loading not implemented - images load immediately
4. Social icons not upgraded from emoji to heroicons
5. **CSS variables `--es-bg-secondary-dark`, `--es-bg-primary-dark`, etc. not defined in `:root` - Tailwind resolves `dark:bg-es-bg-secondary-dark` to empty value**

---

## Goals / Non-Goals

**Goals:**
- ✅ **Fix dark mode navbar transparency by adding missing CSS variables**
- ✅ Add missing banner images (banner-4.jpg, banner-5.jpg) from Pixabay/Unsplash
- ✅ Implement lazy loading on all images using Nuxt Image module
- ✅ Fix social media icons in footer using Heroicons brand icons
- ✅ Update client logo system to track placeholder state properly

**Non-Goals:**
- ❌ Not replacing client logo placeholders with generic stock images (first-party approval required)
- ❌ Not upgrading banner images with new creative direction (match existing style only)
- ❌ Not modifying carousel logic or auto-rotation behavior
- ❌ Not changing responsive image sizes (use existing 1600px max width)
- ❌ Not refactoring the CSS variable architecture (just add missing definitions)

---

## Decisions

### Decision 1: Banner Image Sources (Pixabay/Unsplash)

**Chosen:** Free stock images matching existing banner aesthetic (professional workspace, team collaboration, digital themes)

**Rationale:**
- Banner 1-3 are all Unsplash photos with consistent lighting/style
- Pixabay offers identical free licensing (no attribution required)
- Match "professional agency" aesthetic of existing banners
- Ensure high resolution (min 1920x1080) for full-width display

**Image Specifications:**
| Banner | Theme | Source | Resolution | License |
|--------|-------|--------|------------|---------|
| banner-4 | Digital workspace / laptop setup | Pixabay | 1920x1080 | CC0 |
| banner-5 | Team collaboration / meeting | Pixabay | 1920x1080 | CC0 |

**Download URLs (to be verified):**
- banner-4: https://pixabay.com/photos/work-laptop-business-office-3563582/
- banner-5: https://pixabay.com/photos/group-team-working-collaboration-3183859/

**Pre-flight Checks:**
1. Verify images are truly CC0 (no attribution required)
2. Download full resolution (1920px+ width)
3. Optimize to <200KB file size using WebP conversion
4. Rename to `banner-4.jpg` and `banner-5.jpg`

---

### Decision 2: Lazy Loading Implementation

**Chosen:** Nuxt Image module with `loading="lazy"` and `捕` priority for above-the-fold

**Rationale:**
- Nuxt Image provides automatic WebP optimization
- Built-in lazy loading via native `loading="lazy"` attribute
- `fetchPriority="low"` for below-the-fold images
- Consistent with existing Nuxt 3.20.2 setup

**Implementation Strategy:**

#### Strategy A: Direct `loading="lazy"` on `<img>` tags
```vue
<!-- Simple case - for slides that don't need priority loading -->
<img 
  :src="slide.image" 
  :alt="slide.title"
  loading="lazy"
  class="w-full h-full object-cover"
/>
```

#### Strategy B: Nuxt Image component for hero images
```vue
<!-- Above-the-fold - priority fetch -->
<nuxt-img
  src="/images/banner-1.jpg"
  alt="Banner 1"
  format="webp"
  quality="80"
  width="1920"
  height="1080"
  loading="eager"
  fetchPriority="high"
  class="w-full h-full object-cover"
/>
```

#### Strategy C: Native lazy loading for below-the-fold
```vue
<!-- Below-the-fold - lazy fetch -->
<img 
  src="/images/banner-4.jpg"
  loading="lazy"
  fetchPriority="low"
  class="w-full h-full object-cover"
/>
```

---

### Decision 3: Social Icons (Heroicons Brand)

**Chosen:** Heroicons brand icons (SVG) replacing all emoji in footer

**Rationale:**
- Professional appearance matching design system
- Consistent sizing and styling
- Better accessibility (ARIA labels, SVG support)
- Known approach from `theme-toggle` refactoring (menu option: "Use Heroicons")

**Icons & Colors:**
| Platform | Icon | Color | Hover Color |
|----------|------|-------|-------------|
| Instagram | `instagram` | `#E4405F` | `#D52C49` |
| Facebook | `facebook` | `#1877F2` | `#166FE5` |
| LinkedIn | `linkedin` | `#0077B5` | `#00639C` |
| TikTok | `tiktok` | `#000000` | `#171717` |
| Twitter/X | `twitter` | `#000000` | `#171717` |

**Implementation:**
```vue
<!-- Before -->
<span class="text-lg" role="img" :aria-label="t('social.instagram')">📷</span>

<!-- After -->
<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.22 8.94c.26-.32.474-.665.657-1.032-1.276.568-2.67.94-4.127 1.108-.597-2.026-1.62-3.595-3.166-4.675-2.726-1.932-6.206-1.48-7.796 1.05-1.448 2.246-1.213 5.222.638 7.073 1.852 1.852 4.827 2.086 7.073.638 1.403-.982 2.498-2.45 3.033-4.247.46-1.54.392-3.17-.213-4.617zm-1.75 6.133c-.82.82-2.134.82-2.954 0-.82-.82-.82-2.134 0-2.954.82-.82 2.134-.82 2.954 0 .82.82.82 2.134 0 2.954zM8.94 12c0-1.657-1.343-3-3-3s-3 1.343-3 3 1.343 3 3 3 3-1.343 3-3zm7.12 0c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3z"/>
</svg>
```

**File Path:**
- `frontend/app/components/ui/SocialIcons.vue` (new component)

---

### Decision 4: Client Logo Tracking (Placeholder Status)

**Chosen:** Keep placeholder SVG for now, add metadata for tracking

**Rationale:**
- Asset inventory shows these are "first-party-only" (client approval required)
- Cannot use stock images (violates asset governance policy)
- Need clear tracking for when first-party logos arrive

**Implementation:**
```json
// Add to asset-governance/asset-inventory.json
{
  "path": "/placeholders/first-party/client-logo-1.svg",
  "status": "first-party-placeholder",
  "policy": "first-party-only",
  "metadata": {
    "placeholderType": "generic",
    "replacementRequired": "client-approved-logo",
    "priority": "high"
  }
}
```

**Replace in code:**
```vue
<!-- Before (line 187) -->
<img :src="client.logo" :alt="client.name" class="max-h-16 w-auto object-contain" />

<!-- After -->
<nuxt-img
  :src="client.logo"
  :alt="client.name"
  class="max-h-16 w-auto object-contain"
  loading="lazy"
  format="svg"
/>
```

---

## File Paths

### New Files
```
frontend/public/images/
├── banner-4.jpg      # Download from Pixabay (1920x1080)
└── banner-5.jpg      # Download from Pixabay (1920x1080)

frontend/app/components/ui/
├── SocialIcons.vue   # Heroicons social media component
```

### Modified Files
```
frontend/app/pages/index.vue
├── Banner slider section (lines 17-21)
│   └── Add `loading="lazy"` to all <img> tags
├── Client logos section (lines 187)
│   └── Replace direct <img> with <nuxt-img>
├── Featured works section (lines 230, 250)
│   └── Add lazy loading attributes
├── Articles section (line 307)
│   └── Add lazy loading attributes

frontend/app/components/Footer/SiteFooter.vue
└── Social icons (lines 26, 35, 44, 53, 62)
    └── Replace emoji with Heroicons SVG

frontend/public/asset-governance/
├── asset-inventory.json
│   └── Add banner-4.jpg, banner-5.jpg entries
└── stock-source-log.json
    └── Add download metadata for new banners
```

---

## Risks / Trade-offs

### Risk 1: HTTP 404 on Banner Images
**Mitigation:** Verify URLs before download, check file integrity after download
**Impact:** High - breaks slider functionality

### Risk 2: License Violation
**Mitigation:** Download from verified CC0 sources (Pixabay/Unsplash), document source URLs
**Impact:** Critical - legal exposure

### Risk 3: Performance degradation from lazy loading
**Mitigation:** Use `eager` for above-the-fold, measure LCP impact
**Impact:** Low - lazy loading should improve performance

### Risk 4: Heroicons visual mismatch
**Mitigation:** Test icons match design system size/color, compare with existing ThemeToggle icons
**Impact:** Medium - visual inconsistency if colors don't match

---

## Migration Plan

### Phase 1: Download Banner Images (30 minutes)
1. Download banner-4.jpg from Pixabay
2. Download banner-5.jpg from Pixabay
3. Verify resolution (min 1920x1080)
4. Optimize to <200KB (WebP conversion)
5. Place in `frontend/public/images/`
6. Verify no 404 errors in browser console

### Phase 2: Update Footer Social Icons (45 minutes)
1. Create `SocialIcons.vue` component
2. Replace all 5 emoji in footer
3. Add hover states with brand colors
4. Test accessibility (screen reader)
5. Verify mobile touch targets (min 44x44px)

### Phase 3: Implement Lazy Loading (30 minutes)
1. Add `loading="lazy"` to all `<img>` tags in index.vue
2. Replace client logos with `<nuxt-img>`
3. Testscroll performance (Lighthouse)
4. Verify above-the-fold images load first

### Phase 4: Asset Governance Updates (15 minutes)
1. Add banner-4.jpg, banner-5.jpg to asset-inventory.json
2. Add download metadata to stock-source-log.json
3. Update client logo metadata (priority flag)

### Phase 5: Testing & Verification (30 minutes)
1. Run `npm run dev` in Docker
2. Verify slider displays 5 slides (no broken images)
3. Test lazy loading (DevTools Network tab)
4. Run Lighthouse audit (target: >90 performance)
5. Check console for no errors

---

## Open Questions

**Question 1: Should we use WebP format for banner images?**
- Option A: Keep original JPEG (simpler)
- Option B: Convert to WebP (smaller, better performance)
- **Decision:** WebP conversion (Nuxt Image handles this automatically)

**Question 2: Should we use Nuxt Image for all images or mix with native lazy loading?**
- Option A: All Nuxt Image (consistent, automatic optimization)
- Option B: Mix native lazy loading (simpler for existing setup)
- **Decision:** Mix - Nuxt Image for hero/above-fold, native lazy for carousel (minimize build changes)

**Question 3: Should social icons have brand colors or monochrome?**
- Option A: Brand colors (recognizable)
- Option B: Monochrome (matches footer design)
- **Decision:** Brand colors (better visual identity, social platforms家人 recognize)
