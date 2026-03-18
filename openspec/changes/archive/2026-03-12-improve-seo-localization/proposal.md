# Proposal: Improve SEO & Localization

## Summary
Improve SEO dan localization untuk bahasa Indonesia dan Inggris dengan pendekatan hybrid context-aware: Title/Heading dalam English, Description/Body dalam Indonesia.

## Goals
1. Review dan perbaiki semua translation keys yang masih placeholder atau code-like
2. Implement hybrid localization: English untuk titles/headings, Indonesia untuk descriptions
3. Hapus legacy/unused locale files (4 files di `frontend/i18n/` dan `frontend/app/i18n/`)
4. Improve SEO meta tags untuk social sharing (Open Graph, Twitter Cards)

## Non-Goals
- Mengubah konten secara signifikan
- Menambah bahasa baru
- Mengubah i18n configuration

## Success Metrics
- Semua translation keys terisi (tidak ada yang code-like seperti `footer.contact.city` yang tampil di UI)
- Homepage SEO score 90+ di Lighthouse
- Social sharing preview menampilkan title, description, dan image yang benar
- Tidak ada unused locale files

## Rendering Strategy
- **ISR**: Semua public pages

## Tech Stack References
- @nuxtjs/i18n
- useSeoMeta() composable
- useSchemaOrg() for structured data

## Hybrid Localization Strategy
```
RULES:
├── Titles/Headings    → English (Digital Marketing, UI/UX Design, Web Development)
├── Descriptions       → Indonesia dengan keyword mix ("Jasa SEO", "Digital Marketing Agency")
├── Menu Items         → Mix (Home, Services, Artikel, Tentang)
├── CTAs              → Indonesia (Mulai Konsultasi, Pelajari Detailnya)
└── Footer            → Indonesia (kecuali service names)
```

## Examples
| Key Type | Indonesian | English |
|----------|------------|---------|
| Service Title | Web Development | Web Development |
| Service Desc | Jasa pembuatan website profesional untuk bisnis Anda | Professional website development services for your business |
| CTA | Mulai Konsultasi | Start Consultation |
| Menu | Layanan | Services |

## Design Decisions
- Keep technical terms in English (SEO, API, UI/UX, Digital Marketing)
- Use Indonesian for explanatory/descriptive text
- Mix keywords for SEO: "Jasa SEO Jakarta" not just "SEO Services"
- Remove legacy locale files to avoid confusion