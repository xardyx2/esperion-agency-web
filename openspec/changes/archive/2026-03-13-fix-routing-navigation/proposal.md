# Proposal: Fix Routing & Navigation

## Summary
Perbaiki routing issues: article detail page dan service detail page yang tidak muncul, serta language switch yang menyebabkan scroll jump.

## Goals
1. Debug dan fix article detail page (`/articles/[slug]`) - halaman tidak muncul saat klik "Baca Selengkapnya"
2. Debug dan fix service detail page (`/our-services/[slug]`) - halaman tidak muncul saat klik "Pelajari Detailnya"
3. Fix language switch scroll jump issue - halaman scroll ke atas dan tidak bisa scroll ke bawah setelah switch
4. Add proper error handling dan 404 fallback

## Non-Goals
- Mengubah struktur data (public-content.ts)
- Mengubah routing pattern
- Menambah fitur baru ke detail pages

## Success Metrics
- Klik "Baca Selengkapnya" pada article → halaman article detail muncul dengan konten yang benar
- Klik "Pelajari Detailnya" pada service → halaman service detail muncul dengan konten yang benar
- Language switch (ID ↔ EN) → halaman tetap di scroll position yang sama atau smooth scroll
- 404 page muncul untuk slug yang tidak ditemukan

## Rendering Strategy
- **ISR**: Articles: 300 seconds, Services: 300 seconds

## Tech Stack References
- Nuxt 3 dynamic routing (`[slug].vue`)
- Vue Router scroll behavior
- i18n middleware

## Known Issues to Investigate
1. `findPublicArticleBySlug()` - mungkin return undefined untuk beberapa slug
2. `findPublicServiceBySlug()` - mungkin return undefined untuk beberapa slugs
3. i18n middleware - mungkin reset scroll position saat locale change
4. `createError({ statusCode: 404 })` - mungkin tidak trigger error page dengan benar

## Design Decisions
- Scroll behavior: `scrollBehavior(to, from, savedPosition)` di nuxt.config.ts
- Error handling: Use `throw createError()` untuk 404
- Debug dengan console.log dan Playwright testing