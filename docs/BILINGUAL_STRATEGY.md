# Bilingual Content Strategy

## Overview

Esperion menggunakan pendekatan bilingual (Indonesia + Inggris) dengan strategi hybrid yang mempertahankan terminologi profesional dalam bahasa Inggris sambil menerjemahkan konten deskriptif ke dalam bahasa Indonesia.

## Strategi Hybrid

### Tier 1: Selalu dalam Bahasa Inggris

Kategori berikut **harus** tetap dalam bahasa Inggris di semua konten:

#### Nama Layanan (Service Names)
- Web Development
- UI/UX Design
- Digital Marketing
- Mobile App Development
- E-Commerce Solutions
- Digital Consulting

#### Nama Platform & Teknologi
- WordPress
- Shopify
- React
- Vue.js
- Node.js
- Google Analytics
- Microsoft Clarity

#### Akronim Industri
- SEO (Search Engine Optimization)
- PPC (Pay-Per-Click)
- CRM (Customer Relationship Management)
- API (Application Programming Interface)
- SaaS (Software as a Service)
- CMS (Content Management System)

#### Navigasi & CTA
- Home
- Services
- Portfolio / Works
- Articles
- About
- Contact Us
- Get Started
- Learn More
- Read More

### Tier 2: Selalu dalam Bahasa Indonesia

Kategori berikut **harus** diterjemahkan ke bahasa Indonesia:

#### Konten Halaman
- Deskripsi layanan
- Paragraf penjelasan
- Artikel blog
- Konten marketing

#### Label Form
- Nama Lengkap
- Email
- Nomor Telepon
- Pesan
- Kirim

#### Pesan Validasi
- "Field ini wajib diisi"
- "Format email tidak valid"
- "Nomor telepon tidak valid"

### Tier 3: Hybrid (Konteks Indonesia + Terminologi Inggris)

Format: **Indonesia + [Terminologi Inggris]**

Contoh:
- "Jasa **Web Development** profesional untuk bisnis Anda"
- "Tim kami ahli dalam **UI/UX Design** dan **Digital Marketing**"
- "Solusi **E-Commerce** dengan integrasi **Shopify**"

## Implementasi di Locale Files

### Struktur id.json

```json
{
  "nav": {
    "home": "Home",
    "services": "Services",
    "works": "Portfolio",
    "contact": "Contact Us"
  },
  "services": {
    "webDevelopment": {
      "title": "Web Development",
      "description": "Jasa Web Development profesional untuk bisnis Anda..."
    },
    "uiUxDesign": {
      "title": "UI/UX Design",
      "description": "Desain UI/UX yang fokus pada pengalaman pengguna..."
    }
  }
}
```

### Struktur en.json

```json
{
  "nav": {
    "home": "Home",
    "services": "Services",
    "works": "Portfolio",
    "contact": "Contact Us"
  },
  "services": {
    "webDevelopment": {
      "title": "Web Development",
      "description": "Professional web development services for your business..."
    },
    "uiUxDesign": {
      "title": "UI/UX Design",
      "description": "UI/UX design focused on user experience..."
    }
  }
}
```

## Aturan Penulisan

### 1. Service Names
- Selalu kapitalisasi: Web Development (bukan Web development)
- Tidak diterjemahkan: "Web Development" (bukan "Pengembangan Web")
- Konsisten di semua konteks: footer, form, halaman detail

### 2. Platform Names
- Gunakan nama resmi: WordPress (bukan Wordpress)
- Tidak diterjemahkan: Shopify (bukan "Toko Online")

### 3. Akronim
- Pertama kali muncul: Search Engine Optimization (SEO)
- Selanjutnya: SEO saja
- Tidak perlu diterjemahkan

### 4. Navigasi
- Pertahankan bahasa Inggris untuk konsistensi internasional
- Contoh: "Contact Us" (bukan "Hubungi Kami")

## Contoh Implementasi

### Halaman Services (id)

```
Judul: Layanan Kami

Web Development
Jasa Web Development profesional untuk bisnis Indonesia. Kami 
membangun website yang cepat, aman, dan siap berkembang.

CTA: Learn More
```

### Halaman Services (en)

```
Title: Our Services

Web Development
Professional web development services. We build fast, secure, 
and scalable websites for growing businesses.

CTA: Learn More
```

### Form Contact (id)

```
Layanan yang Dibutuhkan:
[Dropdown]
- Web Development
- UI/UX Design
- Digital Marketing
- Lainnya

Nama Lengkap: [input]
Email: [input]
```

## SEO Considerations

### Indonesian Locale
- Target keyword: "jasa web development jakarta"
- Meta description menggunakan bahasa Indonesia dengan terminologi Inggris
- Contoh: "Jasa Web Development profesional di Jakarta. Esperion menyediakan solusi UI/UX Design dan Digital Marketing."

### English Locale
- Target keyword: "web development services jakarta"
- Full English content
- Meta description: "Professional web development services in Jakarta. Esperion provides UI/UX Design and Digital Marketing solutions."

## Quality Checklist

Sebelum deploy, verifikasi:

- [ ] Semua service names dalam bahasa Inggris
- [ ] Platform names tidak diterjemahkan
- [ ] Akronim konsisten
- [ ] Navigasi dalam bahasa Inggris
- [ ] Konten deskriptif dalam bahasa Indonesia (id) / Inggris (en)
- [ ] Form labels dalam bahasa Indonesia (id) / Inggris (en)
- [ ] Tidak ada mixed language yang aneh (e.g., "Jasa Digital Marketing" ✓, "Jasa Marketing Digital" ✗)

## Referensi

Lihat file locale untuk implementasi lengkap:
- `frontend/app/locales/id.json`
- `frontend/app/locales/en.json`
