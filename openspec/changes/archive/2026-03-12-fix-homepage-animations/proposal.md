# Proposal: Fix Homepage Animations

## Summary
Perbaiki animasi pada homepage untuk meningkatkan user experience: banner slider yang smooth, client logo section dengan continuous marquee scroll, dan featured works carousel yang lebih interaktif.

## Goals
1. Implement smooth fade/slide transition pada banner slider (mirip Vue.js)
2. Ubah client logo section dari step-by-step menjadi continuous marquee scroll dengan arrow navigation
3. Improve featured works carousel dengan smoother animations

## Non-Goals
- Mengubah struktur atau layout komponen
- Menambah atau menghapus konten
- Mengubah warna atau styling

## Success Metrics
- Banner slider: Transisi smooth dalam 0.5-1 detik tanpa instant jump
- Client logos: Continuous scroll tanpa pause, dengan arrow navigation
- Featured works: Hover effects dan smooth slide transitions
- User dapat mengontrol semua carousel dengan arrow buttons

## Rendering Strategy
- **ISR**: 60 seconds untuk homepage (already configured)

## Tech Stack References
- Vue 3 Composition API
- CSS transitions/animations
- Nuxt UI components (optional for arrows)

## Design Decisions
- Banner: Gunakan CSS transition `opacity` dengan `ease-in-out` timing
- Client logos: CSS `@keyframes` untuk infinite marquee + pause on hover
- Navigation arrows: Heroicons chevron icons
- Featured works: Touch/swipe support for mobile