<template>
  <div class="min-h-screen bg-es-bg-primary dark:bg-es-bg-primary-dark">
    <!-- Banner Section -->
    <section class="relative h-[300px] md:h-[400px] bg-es-bg-secondary dark:bg-es-bg-secondary-dark">
      <div class="absolute inset-0 bg-gradient-to-r from-es-accent-primary/20 to-es-accent-primary/10 dark:from-es-accent-primary-dark/20 dark:to-es-accent-primary-dark/10"></div>
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="container mx-auto px-4 text-center">
          <h1 class="text-4xl md:text-5xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">
            Layanan Kami
          </h1>
          <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-lg max-w-2xl mx-auto">
            Solusi digital yang disusun untuk membantu bisnis bergerak lebih jelas dan lebih siap tumbuh
          </p>
        </div>
      </div>
    </section>

    <!-- Services Grid -->
    <section class="py-12 md:py-16">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <NuxtLink
            v-for="service in services"
            :key="service.slug"
            :to="localePath(`/our-services/${service.slug}`)"
            class="group bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-lg p-8 shadow-md hover:shadow-xl transition-all"
          >
            <div class="w-16 h-16 mb-6 rounded-xl bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 flex items-center justify-center group-hover:bg-es-accent-primary dark:group-hover:bg-es-accent-primary-dark transition-colors">
              <span class="text-3xl group-hover:scale-110 transition-transform">{{ service.icon }}</span>
            </div>
            <h3 class="text-2xl font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-3 group-hover:text-es-accent-primary dark:group-hover:text-es-accent-primary-dark transition-colors">
              {{ service.title }}
            </h3>
            <p class="text-es-text-secondary dark:text-es-text-secondary-dark mb-6 line-clamp-3">
              {{ service.description }}
            </p>
            <div class="flex items-center text-es-accent-primary dark:text-es-accent-primary-dark font-medium">
              Pelajari Detailnya <span class="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="py-12 md:py-16 bg-es-bg-secondary dark:bg-es-bg-secondary-dark">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">
            Kenapa Memilih Esperion?
          </h2>
          <p class="text-es-text-secondary dark:text-es-text-secondary-dark max-w-2xl mx-auto">
            Kami menggabungkan strategi, eksekusi, dan kolaborasi yang rapi untuk hasil yang lebih terarah
          </p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="reason in reasons" :key="reason.title" class="text-center">
            <div class="text-4xl mb-4">{{ reason.icon }}</div>
            <h3 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-2">
              {{ reason.title }}
            </h3>
            <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm">
              {{ reason.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 md:py-24 bg-es-accent-primary dark:bg-es-accent-primary-dark">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-es-text-inverse dark:text-es-text-inverse-dark mb-4">
          Siap Memulai Proyek Anda?
        </h2>
        <p class="text-es-text-inverse/90 dark:text-es-text-inverse-dark/90 text-lg mb-8 max-w-2xl mx-auto">
          Ceritakan konteks bisnis Anda, lalu kami bantu petakan solusi digital yang paling relevan.
        </p>
        <NuxtLink
          :to="localePath('/contact-us')"
          class="inline-flex items-center px-8 py-4 bg-es-bg-inverse dark:bg-es-bg-inverse-dark text-es-text-primary dark:text-es-text-primary-dark rounded-lg font-semibold hover:bg-es-bg-primary dark:hover:bg-es-bg-primary-dark transition-colors"
        >
          Jadwalkan Konsultasi
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { publicServices } from '../data/public-content';

// SEO Meta
const pageUrl = 'https://esperion.id/id/our-services';
const localePath = useLocalePath();

useSeoMeta({
  title: 'Layanan Digital Marketing Terbaik di Jakarta - Esperion Agency',
  description: 'Temukan layanan digital terlengkap dari Esperion Agency di Jakarta. Web development, aplikasi mobile, SEO, marketing digital, dan UI/UX design profesional.',
  ogTitle: 'Layanan Digital Agency Jakarta - Esperion',
  ogDescription: 'Layanan digital marketing, pengembangan web dan aplikasi mobile profesional di Jakarta.',
  ogImage: '/images/services-banner.jpg',
  ogUrl: pageUrl,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Layanan Digital Agency Jakarta - Esperion',
  twitterDescription: 'Web development, mobile app, dan digital marketing terbaik untuk bisnis di Indonesia.',
  twitterImage: '/images/services-banner.jpg',
  ogLocale: 'id_ID',
});

// Define schema for the services page
useSchemaOrg([
  defineWebPage({
    '@type': 'CollectionPage',
    name: 'Layanan Esperion Digital Agency',
    description: 'Berbagai layanan digital profesional untuk membantu pertumbuhan bisnis Anda di Indonesia',
    url: pageUrl,
    dateModified: new Date().toISOString()
  }),
  defineBreadcrumb({
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Beranda',
        item: 'https://esperion.id/id'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Layanan Kami',
        item: pageUrl
      }
    ]
  })
]);

const services = publicServices;

const reasons = [
  { icon: '🏆', title: 'Track record teruji', description: 'Lebih dari 150 proyek digital telah kami rampungkan.' },
  { icon: '👥', title: 'Tim lintas disiplin', description: 'Strategi, desain, dan pengembangan bergerak dalam satu alur kerja.' },
  { icon: '⚡', title: 'Eksekusi bertahap', description: 'Pendekatan iteratif membantu keputusan bergerak cepat tanpa kehilangan arah.' },
  { icon: '💬', title: 'Komunikasi terbuka', description: 'Setiap tahap kerja dibangun dengan konteks, dokumentasi, dan ekspektasi yang jelas.' },
];
</script>
