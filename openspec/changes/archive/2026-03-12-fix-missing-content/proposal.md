# Proposal: Fix Missing Content

## Summary
Lengkapi konten yang hilang: gambar banner, client logos, dan implement lazy loading untuk semua gambar. Perbaiki social media icons di footer.

## Goals
1. Tambahkan banner-4.jpg dan banner-5.jpg (dari Pixabay/Unsplash, professional/business theme)
2. Ganti placeholder client logos dengan gambar real dari Pixabay/Unsplash
3. Implement lazy loading pada semua gambar di homepage
4. Perbaiki social media icons di footer (gunakan Heroicons atau brand SVGs)

## Non-Goals
- Mengubah layout atau struktur
- Menambah konten teks baru
- Optimasi performa lain (hanya lazy loading)

## Success Metrics
- Semua banner images (1-5) tersedia dan loading dengan benar
- Client logos section menampilkan 8 logo real (bukan placeholder)
- Lazy loading aktif, initial page load lebih cepat
- Social media icons tampil dengan benar (Instagram, Facebook, LinkedIn, TikTok, Twitter)

## Rendering Strategy
- **ISR**: 60 seconds untuk homepage

## Tech Stack References
- Nuxt Image module (`<NuxtImg>`) untuk lazy loading
- Pixabay API atau Unsplash untuk free stock images
- Heroicons untuk social icons (i-heroicons-*)

## Image Requirements
### Banner Images (5 total)
- Theme: Professional, business, digital/tech
- Size: 1920x1080px minimum
- Style: Consistent dengan existing banner-1,2,3

### Client Logos (8 total)
- Theme: Generic business/tech companies
- Format: SVG atau PNG dengan transparent background
- Size: Logo yang clear pada 150x80px

## Design Decisions
- Gunakan `<NuxtImg loading="lazy">` untuk semua gambar
- Social icons: Heroicons brand icons atau custom SVGs
- Client logos: Placeholder dari Pixabay (free untuk commercial use)