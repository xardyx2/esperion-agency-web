<script setup lang="ts">
/**
 * Privacy Policy Page
 *
 * GDPR-compliant privacy policy for Esperion Digital Agency
 * Available in both Indonesian and English
 */

const { t, locale } = useI18n()
const localePath = useLocalePath()

// Page metadata
useSeoMeta({
  title: () => locale.value === 'id' ? 'Kebijakan Privasi - Esperion' : 'Privacy Policy - Esperion',
  description: () => locale.value === 'id'
    ? 'Kebijakan privasi Esperion Digital Agency'
    : 'Privacy policy of Esperion Digital Agency'
})

// Content for both languages
const content = computed(() => ({
  id: {
    title: 'Kebijakan Privasi',
    lastUpdated: 'Terakhir diperbarui: 3 Mei 2026',
    sections: [
      {
        title: '1. Informasi yang Kami Kumpulkan',
        content: `
          Kami mengumpulkan berbagai jenis informasi untuk menyediakan dan meningkatkan layanan kami:
          
          **Informasi yang Anda Berikan:**
          - Nama lengkap dan nama perusahaan
          - Alamat email dan nomor telepon
          - Konten formulir kontak yang Anda kirimkan
          
          **Informasi yang Dikumpulkan Secara Otomatis:**
          - Data analitik (menggunakan Google Analytics 4)
          - Perilaku browsing (menggunakan Microsoft Clarity untuk heatmaps)
          - Cookie dan teknologi pelacakan serupa
        `
      },
      {
        title: '2. Bagaimana Kami Menggunakan Informasi Anda',
        content: `
          Kami menggunakan informasi yang dikumpulkan untuk:
          
          - Merespons pertanyaan dan permintaan Anda
          - Mengirimkan informasi yang Anda minta
          - Meningkatkan website dan layanan kami
          - Menganalisis penggunaan website untuk optimasi
          - Mematuhi kewajiban hukum
        `
      },
      {
        title: '3. Berbagi Informasi',
        content: `
          Kami **TIDAK** menjual atau menyewakan informasi pribadi Anda kepada pihak ketiga.
          
          Kami dapat berbagi informasi dengan:
          
          - **Penyedia Layanan**: Google Analytics, Microsoft Clarity untuk analitik
          - **Kewajiban Hukum**: Jika diwajibkan oleh hukum atau peraturan
          - **Persetujuan Anda**: Dengan persetujuan eksplisit Anda
        `
      },
      {
        title: '4. Cookie',
        content: `
          Website kami menggunakan cookie untuk meningkatkan pengalaman pengguna:
          
          **Cookie Esensial**: Diperlukan untuk fungsi dasar website
          
          **Cookie Analitik**: Membantu kami memahami cara penggunaan website
          - Google Analytics 4 (dapat di-opt-out)
          - Microsoft Clarity (heatmaps dan session recording)
          
          **Cookie Marketing**: (hanya dengan persetujuan Anda)
          - Meta Pixel (Facebook/Instagram)
          - TikTok Pixel
          - LinkedIn Pixel
          
          Anda dapat mengontrol pengaturan cookie melalui browser Anda.
        `
      },
      {
        title: '5. Hak Anda (GDPR)',
        content: `
          Jika Anda berada di Wilayah Ekonomi Eropa (EEA), Anda memiliki hak:
          
          - **Akses**: Meminta salinan data pribadi Anda
          - **Koreksi**: Meminta perbaikan data yang tidak akurat
          - **Penghapusan**: Meminta penghapusan data pribadi Anda
          - **Pembatasan**: Meminta pembatasan pemrosesan data
          - **Portabilitas**: Menerima data dalam format terstruktur
          - **Keberatan**: Menolak pemrosesan data tertentu
          
           Untuk menggunakan hak ini, hubungi: privacy@esperion.id
        `
      },
      {
        title: '6. Keamanan Data',
        content: `
          Kami mengambil langkah-langkah keamanan untuk melindungi informasi Anda:
          
          - Enkripsi data dalam transmisi (SSL/TLS)
          - Akses terbatas ke informasi pribadi
          - Review berkala praktik pengumpulan data
          - Penyimpanan data di server yang aman
          
          Namun, tidak ada metode transmisi internet yang 100% aman.
        `
      },
      {
        title: '7. Retensi Data',
        content: `
          Kami menyimpan informasi pribadi Anda selama:
          
          - **Data Kontak**: 3 tahun setelah interaksi terakhir
          - **Data Analitik**: 14 bulan (Google Analytics default)
          - **Session Recordings**: 30 hari (Microsoft Clarity)
          
          Setelah periode ini, data akan dihapus atau dianonimkan.
        `
      },
      {
        title: '8. Perubahan Kebijakan Privasi',
        content: `
          Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu.
          Perubahan akan diposting di halaman ini dengan tanggal pembaruan.
          
          Kami mendorong Anda untuk meninjau kebijakan ini secara berkala.
        `
      },
      {
        title: '9. Hubungi Kami',
        content: `
          Jika Anda memiliki pertanyaan tentang kebijakan privasi ini:
          
           **Email**: privacy@esperion.id
           **Alamat**: Detail alamat publik menunggu konfirmasi final
           **Telepon**: Detail telepon legal menunggu konfirmasi final
          
          Untuk keluhan, Anda dapat menghubungi otoritas perlindungan data setempat.
        `
      }
    ]
  },
  en: {
    title: 'Privacy Policy',
    lastUpdated: 'Last updated: May 3, 2026',
    sections: [
      {
        title: '1. Information We Collect',
        content: `
          We collect various types of information to provide and improve our services:
          
          **Information You Provide:**
          - Full name and company name
          - Email address and phone number
          - Contact form content you submit
          
          **Information Collected Automatically:**
          - Analytics data (using Google Analytics 4)
          - Browsing behavior (using Microsoft Clarity for heatmaps)
          - Cookies and similar tracking technologies
        `
      },
      {
        title: '2. How We Use Your Information',
        content: `
          We use the collected information to:
          
          - Respond to your inquiries and requests
          - Send information you requested
          - Improve our website and services
          - Analyze website usage for optimization
          - Comply with legal obligations
        `
      },
      {
        title: '3. Information Sharing',
        content: `
          We do **NOT** sell or rent your personal information to third parties.
          
          We may share information with:
          
          - **Service Providers**: Google Analytics, Microsoft Clarity for analytics
          - **Legal Requirements**: If required by law or regulation
          - **Your Consent**: With your explicit consent
        `
      },
      {
        title: '4. Cookies',
        content: `
          Our website uses cookies to enhance user experience:
          
          **Essential Cookies**: Required for basic website functionality
          
          **Analytics Cookies**: Help us understand website usage
          - Google Analytics 4 (can opt-out)
          - Microsoft Clarity (heatmaps and session recording)
          
          **Marketing Cookies**: (only with your consent)
          - Meta Pixel (Facebook/Instagram)
          - TikTok Pixel
          - LinkedIn Pixel
          
          You can control cookie settings through your browser.
        `
      },
      {
        title: '5. Your Rights (GDPR)',
        content: `
          If you are in the European Economic Area (EEA), you have the right to:
          
          - **Access**: Request a copy of your personal data
          - **Correction**: Request correction of inaccurate data
          - **Deletion**: Request deletion of your personal data
          - **Restriction**: Request restriction of data processing
          - **Portability**: Receive data in a structured format
          - **Objection**: Object to certain data processing
          
           To exercise these rights, contact: privacy@esperion.id
        `
      },
      {
        title: '6. Data Security',
        content: `
          We take security measures to protect your information:
          
          - Data encryption in transit (SSL/TLS)
          - Limited access to personal information
          - Regular review of data collection practices
          - Storage on secure servers
          
          However, no internet transmission method is 100% secure.
        `
      },
      {
        title: '7. Data Retention',
        content: `
          We retain personal information for:
          
          - **Contact Data**: 3 years after last interaction
          - **Analytics Data**: 14 months (Google Analytics default)
          - **Session Recordings**: 30 days (Microsoft Clarity)
          
          After these periods, data will be deleted or anonymized.
        `
      },
      {
        title: '8. Changes to This Policy',
        content: `
          We may update this privacy policy from time to time.
          Changes will be posted on this page with an updated date.
          
          We encourage you to review this policy periodically.
        `
      },
      {
        title: '9. Contact Us',
        content: `
          If you have questions about this privacy policy:
          
           **Email**: privacy@esperion.id
           **Address**: Public address details are pending final confirmation
           **Phone**: Legal contact number is pending final confirmation
          
          For complaints, you may contact your local data protection authority.
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
            'text-es-text-primary dark:text-es-text-primary-dark'
          ]"
        >
          {{ currentContent.title }}
        </h1>
        <p
          class="text-sm"
          :class="[
            'text-es-text-secondary dark:text-es-text-secondary-dark'
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
              'text-es-text-primary dark:text-es-text-primary-dark'
            ]"
          >
            {{ section.title }}
          </h2>
          <div
            class="whitespace-pre-line"
            :class="[
              'text-es-text-secondary dark:text-es-text-secondary-dark'
            ]"
            v-html="section.content"
          />
        </section>
      </article>

      <!-- Back to Home -->
      <div class="mt-12">
        <NuxtLink
          :to="localePath('/')"
          class="inline-flex items-center gap-2 text-es-accent-primary dark:text-es-accent-primary-dark hover:underline"
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
  color: inherit;
  text-decoration: underline;
}

.prose :deep(strong) {
  font-weight: 600;
}
</style>
