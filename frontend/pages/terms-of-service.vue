<script setup lang="ts">
/**
 * Terms of Service Page
 *
 * Terms and conditions for Esperion Digital Agency
 * Available in both Indonesian and English
 */

const { locale } = useI18n()

// Page metadata
useSeoMeta({
  title: () => locale.value === 'id' ? 'Syarat & Ketentuan - Esperion' : 'Terms of Service - Esperion',
  description: () => locale.value === 'id'
    ? 'Syarat dan ketentuan layanan Esperion Digital Agency'
    : 'Terms and conditions of Esperion Digital Agency services'
})

// Content for both languages
const content = computed(() => ({
  id: {
    title: 'Syarat & Ketentuan',
    lastUpdated: 'Terakhir diperbarui: 3 Mei 2026',
    sections: [
      {
        title: '1. Penerimaan Syarat',
        content: `
          Dengan mengakses dan menggunakan website Esperion Digital Agency ("Website"), 
          Anda menerima dan setuju untuk terikat dengan syarat dan ketentuan ini.
          
          Jika Anda tidak setuju dengan syarat ini, harap tidak menggunakan Website kami.
        `
      },
      {
        title: '2. Layanan Kami',
        content: `
          Esperion Digital Agency menyediakan layanan:
          
          - **Digital Advertising**: Iklan digital terarget
          - **Marketplace Marketing**: Optimasi marketplace (Shopee, Tokopedia)
          - **Social Media Marketing**: Manajemen media sosial
          - **Search Engine Optimization (SEO)**: Optimasi mesin pencari
          - **Consultant**: Konsultasi digital marketing
          - **Web & Mobile Development**: Pengembangan website dan aplikasi
          
          Kami berhak mengubah atau menghentikan layanan kapan saja.
        `
      },
      {
        title: '3. Penggunaan Website',
        content: `
          Anda setuju untuk:
          
          - Menggunakan Website hanya untuk tujuan legal
          - Tidak mengganggu atau mencoba mengakses sistem secara tidak sah
          - Tidak menggunakan Website untuk menyebarkan konten berbahaya
          - Mematuhi semua hukum dan peraturan yang berlaku
          
          Pelanggaran dapat mengakibatkan penghentian akses.
        `
      },
      {
        title: '4. Hak Kekayaan Intelektual',
        content: `
          Semua konten di Website ini dilindungi hak cipta:
          
          - **Milik Esperion**: Logo, branding, konten original
          - **Milik Klien**: Portfolio, testimonial (digunakan dengan izin)
          - **Third-party**: Analytics tools, fonts (licensed)
          
          Dilarang mengcopy, mendistribusikan, atau membuat karya turunan 
          tanpa izin tertulis dari Esperion Digital Agency.
        `
      },
      {
        title: '5. Disclaimer',
        content: `
          Website ini disediakan "sebagaimana adanya" tanpa jaminan:
          
          - **Tidak Ada Jaminan**: Kami tidak menjamin hasil spesifik
          - **Hasil Bervariasi**: Hasil marketing bergantung pada banyak faktor
          - **Informasi Umum**: Konten adalah informasi umum, bukan advice profesional
          
          Esperion tidak bertanggung jawab atas kerugian dari penggunaan Website.
        `
      },
      {
        title: '6. Limitasi Tanggung Jawab',
        content: `
          Sepanjang diizinkan oleh hukum:
          
          - Esperion tidak bertanggung jawab untuk kerugian tidak langsung
          - Tanggung jawab maksimal terbatas pada jumlah yang Anda bayar (jika ada)
          - Kami tidak bertanggung jawab untuk error, downtime, atau kehilangan data
          
          Beberapa yurisdiksi tidak mengizinkan limitasi ini.
        `
      },
      {
        title: '7. Link ke Website Lain',
        content: `
          Website kami mungkin berisi link ke website third-party:
          
          - Kami tidak mengontrol konten third-party
          - Link tidak berarti endorsemen dari Esperion
          - Akses website third-party atas risiko Anda sendiri
          
          Kami tidak bertanggung jawab untuk konten atau praktik third-party.
        `
      },
      {
        title: '8. Perubahan Syarat',
        content: `
          Kami dapat mengubah syarat ini kapan saja:
          
          - Perubahan akan diposting di halaman ini
          - Tanggal pembaruan akan diupdate
          - Penggunaan berkelanjutan berarti penerimaan perubahan
          
          Harap tinjau syarat ini secara berkala.
        `
      },
      {
        title: '9. Hukum yang Berlaku',
        content: `
          Syarat ini diatur oleh hukum Indonesia:
          
          - **Yurisdiksi**: Pengadilan Indonesia
          - **Bahasa**: Bahasa Indonesia adalah bahasa resmi
          - **Sengketa**: Akan diselesaikan melalui negosiasi terlebih dahulu
          
          Jika ada klausul yang tidak valid, sisinya tetap berlaku.
        `
      },
      {
        title: '10. Kontak',
        content: `
          Untuk pertanyaan tentang syarat ini:
          
          **Email**: legal@esperion.com
          **Alamat**: [Alamat Perusahaan Anda]
          **Telepon**: [Nomor Telepon Anda]
          
          Kami akan merespons dalam 5-7 hari kerja.
        `
      }
    ]
  },
  en: {
    title: 'Terms of Service',
    lastUpdated: 'Last updated: May 3, 2026',
    sections: [
      {
        title: '1. Acceptance of Terms',
        content: `
          By accessing and using Esperion Digital Agency's website ("Website"), 
          you accept and agree to be bound by these terms and conditions.
          
          If you do not agree to these terms, please do not use our Website.
        `
      },
      {
        title: '2. Our Services',
        content: `
          Esperion Digital Agency provides the following services:
          
          - **Digital Advertising**: Targeted digital advertising
          - **Marketplace Marketing**: Marketplace optimization (Shopee, Tokopedia)
          - **Social Media Marketing**: Social media management
          - **Search Engine Optimization (SEO)**: Search engine optimization
          - **Consultant**: Digital marketing consultation
          - **Web & Mobile Development**: Website and application development
          
          We reserve the right to modify or discontinue services at any time.
        `
      },
      {
        title: '3. Website Usage',
        content: `
          You agree to:
          
          - Use the Website only for lawful purposes
          - Not interfere with or attempt to access systems unauthorized
          - Not use the Website to distribute harmful content
          - Comply with all applicable laws and regulations
          
          Violations may result in access termination.
        `
      },
      {
        title: '4. Intellectual Property',
        content: `
          All content on this Website is protected by copyright:
          
          - **Esperion Owned**: Logo, branding, original content
          - **Client Owned**: Portfolio, testimonials (used with permission)
          - **Third-party**: Analytics tools, fonts (licensed)
          
          Copying, distributing, or creating derivative works is prohibited 
          without written permission from Esperion Digital Agency.
        `
      },
      {
        title: '5. Disclaimer',
        content: `
          This Website is provided "as is" without warranties:
          
          - **No Warranties**: We do not guarantee specific results
          - **Results Vary**: Marketing results depend on many factors
          - **General Information**: Content is general information, not professional advice
          
          Esperion is not liable for damages arising from Website use.
        `
      },
      {
        title: '6. Limitation of Liability',
        content: `
          To the extent permitted by law:
          
          - Esperion is not liable for indirect or consequential damages
          - Maximum liability is limited to amounts paid (if any)
          - We are not liable for errors, downtime, or data loss
          
          Some jurisdictions do not allow these limitations.
        `
      },
      {
        title: '7. Third-Party Links',
        content: `
          Our Website may contain links to third-party websites:
          
          - We do not control third-party content
          - Links do not imply endorsement by Esperion
          - Access third-party websites at your own risk
          
          We are not responsible for third-party content or practices.
        `
      },
      {
        title: '8. Changes to Terms',
        content: `
          We may modify these terms at any time:
          
          - Changes will be posted on this page
          - Updated date will be reflected
          - Continued use constitutes acceptance of changes
          
          Please review these terms periodically.
        `
      },
      {
        title: '9. Governing Law',
        content: `
          These terms are governed by Indonesian law:
          
          - **Jurisdiction**: Indonesian courts
          - **Language**: Indonesian is the official language
          - **Disputes**: Will be resolved through negotiation first
          
          If any clause is invalid, the remainder remains effective.
        `
      },
      {
        title: '10. Contact',
        content: `
          For questions about these terms:
          
          **Email**: legal@esperion.com
          **Address**: [Your Company Address]
          **Phone**: [Your Phone Number]
          
          We will respond within 5-7 business days.
        `
      }
    ]
  }
}))

const currentContent = computed(() => content.value[locale.value as 'id' | 'en'])
</script>

<template>
  <div class="min-h-screen py-12">
    <div class="container mx-auto px-4 max-w-4xl">
      <!-- Header -->
      <header class="mb-8">
        <h1
          class="text-4xl font-bold mb-4"
          :class="[
            'text-esperion-light-text-primary dark:text-esperion-dark-text-primary'
          ]"
        >
          {{ currentContent.title }}
        </h1>
        <p
          class="text-sm"
          :class="[
            'text-esperion-light-text-secondary dark:text-esperion-dark-text-secondary'
          ]"
        >
          {{ currentContent.lastUpdated }}
        </p>
      </header>

      <!-- Content Sections -->
      <article class="prose prose-lg dark:prose-invert max-w-none">
        <section
          v-for="section in currentContent.sections"
          :key="section.title"
          class="mb-8"
        >
          <h2
            class="text-2xl font-semibold mb-4"
            :class="[
              'text-esperion-light-text-primary dark:text-esperion-dark-text-primary'
            ]"
          >
            {{ section.title }}
          </h2>
          <div
            class="whitespace-pre-line"
            :class="[
              'text-esperion-light-text-secondary dark:text-esperion-dark-text-secondary'
            ]"
            v-html="section.content"
          />
        </section>
      </article>

      <!-- Back to Home -->
      <div class="mt-12">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 text-esperion-primary hover:underline"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          {{ locale === 'id' ? 'Kembali ke Beranda' : 'Back to Home' }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.prose :deep(a) {
  color: #2B9EDB;
  text-decoration: underline;
}

.prose :deep(strong) {
  font-weight: 600;
}
</style>
