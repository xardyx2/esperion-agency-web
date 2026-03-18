# improve-language-mixing Proposal

## Problem Statement

Current website uses **full Indonesian** for all content, which may not align with Jakarta digital agency industry standards and could limit perceived professionalism for premium/international clients.

**Research Findings** (5 Indonesian agencies benchmarked):
- **83% use Full English** (TWOMC, Youwez, RAF-Studio, IDEASI, Ardhaya360)
- **17% use Mixed Indonesian-dominant** (Monelo - recommended pattern)
- **0% use Full Indonesian** (even local-focused agencies avoid this)

## Proposed Solution

Apply **Monelo Pattern** - Mixed Indonesian-English approach that balances:
- **Professionalism** (English for technical/service terms)
- **Accessibility** (Indonesian for descriptions and CTAs)
- **Cultural connection** (Indonesian for local market)

### Language Mixing Pattern

| Content Type | Language | Rationale | Examples |
|-------------|----------|-----------|----------|
| **Navigation** | Indonesian | Maintain current i18n strategy | Beranda, Tentang, Layanan |
| **Section Headlines** | **English** | Professional, industry standard | "Build Your Digital Presence" |
| **Section Subtitles** | Indonesian | Accessibility, explanation | "Bangun kehadiran digital yang meyakinkan" |
| **Service Names** | **English** | Industry standard | Web Design, Digital Marketing, SEO |
| **CTA Buttons** | Indonesian | Cultural connection, action | "Mulai Konsultasi", "Hubungi Kami" |
| **Body Descriptions** | Indonesian | Storytelling, connection | Full Indonesian paragraphs |
| **Meta Titles** | Mixed | SEO + professionalism | "Esperion - Digital Agency Jakarta" |

## Implementation Strategy

### Headline Transformation Examples

**Homepage Banner Slides:**

| Before (Full Indonesian) | After (Mixed Pattern) |
|-------------------------|----------------------|
| "Bangun Kehadiran Digital yang Lebih Meyakinkan" | **"Build Your Digital Presence"**<br><small>Bangun kehadiran digital yang lebih meyakinkan untuk bisnis Anda</small> |
| "Solusi Digital untuk Fase Tumbuh Berikutnya" | **"Ready for Next Growth Phase?"**<br><small>Solusi digital untuk fase tumbuh bisnis Anda berikutnya</small> |
| "Tim Kecil yang Fokus pada Hasil Nyata" | **"Small Team, Real Impact"**<br><small>Fokus pada hasil nyata untuk pertumbuhan bisnis Anda</small> |

**Section Headlines:**

| Before | After |
|--------|-------|
| "Tentang Esperion" | **"About Esperion"** |
| "Layanan Kami" | **"Our Services"** |
| "Portofolio Pilihan" | **"Featured Works"** |
| "Artikel Terbaru" | **"Latest Articles"** |
| "Siap Menyusun Langkah Digital Berikutnya?" | **"Ready to Grow Digitally?"** |

**Service Names** (already in English - keep as-is):
- ✅ Web Design & Development
- ✅ Digital Marketing
- ✅ Brand & Identity
- ✅ Mobile App Development
- ✅ E-Commerce Solutions
- ✅ SEO & Analytics

## Scope

### In Scope (Change 3)
- ✅ Update homepage banner headlines (5 slides)
- ✅ Update section headlines across homepage
- ✅ Update i18n translations (id.json + en.json)
- ✅ Update meta titles/descriptions
- ✅ Maintain service names in English
- ✅ Keep CTAs in Indonesian
- ✅ Keep body descriptions in Indonesian

### Out of Scope
- ❌ Change navigation labels (keep Indonesian per current i18n)
- ❌ Modify footer content
- ❌ Change dashboard language
- ❌ Update blog article content (future task)
- ❌ Legal pages (privacy policy, terms)

## Success Criteria

1. **Homepage headlines in English** - All major section headlines converted
2. **Subtitles in Indonesian** - Explanatory text remains Indonesian
3. **Service names in English** - Industry standard maintained
4. **CTAs in Indonesian** - Cultural connection preserved
5. **i18n complete** - Both id.json and en.json updated
6. **Consistent pattern** - Applied across all 5 banner slides
7. **No broken links** - All CTAs still functional
8. **SEO maintained** - Meta descriptions updated properly

## Content Guidelines

### Do ✅
- Use English for **headlines** (short, punchy, professional)
- Use Indonesian for **descriptions** (storytelling, explanation)
- Keep **service names** in English (industry terms)
- Keep **CTAs** in Indonesian (action-oriented, cultural)
- Maintain **brand voice** (professional yet approachable)

### Don't ❌
- Don't mix languages within single headline
- Don't translate service names to Indonesian
- Don't use Indonesian slang or informal language
- Don't create awkward direct translations
- Don't lose brand personality

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Inconsistent application | Medium | Medium | Create style guide, review all pages |
| Awkward translations | Low | Medium | Use professional copy, not direct translation |
| SEO impact | Low | Medium | Maintain keywords in both languages |
| User confusion | Low | Low | Keep pattern consistent, test with users |
| i18n sync issues | Medium | Medium | Update both id.json and en.json together |

## Migration Plan

### Phase 1: Homepage Banners (Priority 1)
- Update 5 banner slide headlines to English
- Add Indonesian subtitles
- Update CTA text (keep Indonesian)

### Phase 2: Section Headlines (Priority 2)
- Update all section headlines on homepage
- Update meta titles/descriptions
- Update OpenGraph social sharing text

### Phase 3: i18n Translations (Priority 3)
- Update `frontend/app/locales/id.json`
- Update `frontend/app/locales/en.json`
- Test both language versions

### Phase 4: Other Pages (Future)
- Apply pattern to about page
- Apply pattern to services pages
- Apply pattern to articles pages

## Timeline Estimate

- **Content writing**: 1-1.5 hours (craft headlines)
- **Implementation**: 1-1.5 hours (update files)
- **i18n updates**: 30 min
- **Testing**: 30 min
- **Total**: ~3-4 hours

## Files to Modify

1. `frontend/app/pages/index.vue` - Update headlines
2. `frontend/app/locales/id.json` - Indonesian translations
3. `frontend/app/locales/en.json` - English translations
4. `frontend/nuxt.config.ts` - Meta titles (if needed)
5. `openspec/changes/improve-language-mixing/` - Documentation

## Open Questions

1. **Should we A/B test this?** - Test conversion rates before/after
2. **Need professional copywriter?** - Or use AI + internal review?
3. **Apply to all pages at once?** - Or phase by page?
4. **Client approval needed?** - For headline changes?

## References

**Monelo Pattern** (Recommended):
- Navigation: Indonesian (Beranda, Tentang, Layanan)
- Headlines: English ("Digital Agency 360°")
- Services: English (Social Media, Digital Marketing)
- CTAs: Indonesian (Mulai Project, Hubungi)
- Body: Indonesian

**Competitive Landscape**:
- 5/6 agencies use Full English
- Only Monelo uses mixed approach successfully
- Zero agencies use Full Indonesian

## Recommendation

**Apply Monelo Pattern** - Best balance of:
- ✅ Professional positioning (English headlines)
- ✅ Local accessibility (Indonesian descriptions)
- ✅ Industry alignment (English service names)
- ✅ Cultural connection (Indonesian CTAs)

This positions Esperion as **premium yet approachable** - matching successful Jakarta agencies while maintaining local market appeal.
