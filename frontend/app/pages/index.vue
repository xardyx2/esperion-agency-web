<template>
  <div class="min-h-screen bg-es-bg-primary dark:bg-es-bg-primary-dark">
    <!-- Section 1: Dynamic Banner Slider -->
    <section 
      class="relative h-[500px] md:h-[600px] overflow-hidden"
      @mouseenter="pauseAutoPlay"
      @mouseleave="resumeAutoPlay"
    >
      <div 
        v-for="(slide, index) in bannerSlides" 
        :key="slide.id"
        v-show="currentSlide === index"
        class="absolute inset-0 transition-opacity duration-1000"
        :class="{ 'opacity-100': currentSlide === index, 'opacity-0': currentSlide !== index }"
      >
        <div class="absolute inset-0 bg-gradient-to-r from-es-bg-secondary/90 to-es-bg-secondary/50 dark:from-es-bg-secondary-dark/90 dark:to-es-bg-secondary-dark/50 z-10"></div>
        <img 
          :src="slide.image" 
          :alt="slide.title"
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 z-20 flex items-center">
          <div class="container mx-auto px-4">
            <div class="max-w-2xl">
              <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-2">
                {{ slide.title }}
              </h1>
              <p v-if="slide.subtitle" class="text-lg md:text-xl text-es-text-secondary dark:text-es-text-secondary-dark mb-4 font-medium">
                {{ slide.subtitle }}
              </p>
              <p class="text-lg md:text-xl text-es-text-secondary dark:text-es-text-secondary-dark mb-8">
                {{ slide.description }}
              </p>
              <NuxtLink
                :to="localePath(slide.ctaLink)"
                class="inline-flex items-center px-6 py-3 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors"
              >
                {{ slide.ctaText }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Slide Navigation -->
      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
        <button
          v-for="(slide, index) in bannerSlides"
          :key="slide.id"
          @click="currentSlide = index"
          class="w-3 h-3 rounded-full transition-colors"
          :class="currentSlide === index ? 'bg-es-accent-primary dark:bg-es-accent-primary-dark' : 'bg-es-text-secondary/50 dark:bg-es-text-secondary-dark/50 hover:bg-es-text-secondary dark:hover:bg-es-text-secondary-dark'"
          :aria-label="`Go to slide ${index + 1}`"
        />
      </div>

      <!-- Arrow Navigation -->
      <button
        @click="prevSlide"
        class="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-es-bg-inverse/80 dark:bg-es-bg-inverse-dark/80 rounded-full flex items-center justify-center text-es-text-primary dark:text-es-text-primary-dark hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-all shadow-lg hidden md:flex"
        aria-label="Previous slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        @click="nextSlide"
        class="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-es-bg-inverse/80 dark:bg-es-bg-inverse-dark/80 rounded-full flex items-center justify-center text-es-text-primary dark:text-es-text-primary-dark hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-all shadow-lg hidden md:flex"
        aria-label="Next slide"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </section>

    <!-- Section 2: Who Are We -->
    <section class="py-16 md:py-24">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl md:text-4xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-6">
              {{ whoAreWe.title }}
            </h2>
            <p class="text-es-text-secondary dark:text-es-text-secondary-dark mb-6 leading-relaxed">
              {{ whoAreWe.description }}
            </p>
            <div class="flex flex-wrap gap-4">
              <div 
                v-for="value in whoAreWe.values" 
                :key="value.label"
                class="flex items-center space-x-2"
              >
                <span class="text-es-accent-primary dark:text-es-accent-primary-dark">✓</span>
                <span class="text-es-text-secondary dark:text-es-text-secondary-dark">{{ value.label }}</span>
              </div>
            </div>
          </div>
          <div class="relative">
            <img 
              :src="whoAreWe.image" 
              :alt="whoAreWe.title"
              class="rounded-lg shadow-xl w-full h-[400px] object-cover"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Section 3: Our Services -->
    <section class="py-16 md:py-24 bg-es-bg-secondary dark:bg-es-bg-secondary-dark">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">
              Our Services
          </h2>
          <p class="text-es-text-secondary dark:text-es-text-secondary-dark max-w-2xl mx-auto">
              Solusi digital yang dirancang untuk target bisnis Anda
          </p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="service in services"
            :key="service.slug"
            :to="localePath(`/our-services/${service.slug}`)"
            class="group p-6 bg-es-bg-primary dark:bg-es-bg-primary-dark rounded-lg shadow-md hover:shadow-xl transition-all"
          >
            <div class="w-12 h-12 mb-4 rounded-lg bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 flex items-center justify-center">
              <span class="text-2xl">{{ service.icon }}</span>
            </div>
            <h3 class="text-xl font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-2 group-hover:text-es-accent-primary dark:group-hover:text-es-accent-primary-dark transition-colors">
              {{ service.title }}
            </h3>
            <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm line-clamp-2">
              {{ service.description }}
            </p>
          </NuxtLink>
        </div>
        <div class="text-center mt-8">
          <NuxtLink
            :to="localePath('/our-services')"
            class="inline-flex items-center px-6 py-3 border-2 border-es-accent-primary dark:border-es-accent-primary-dark text-es-accent-primary dark:text-es-accent-primary-dark rounded-lg font-semibold hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors"
          >
            View All Services
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Section 4: Client Stats & Logos -->
    <section class="py-16 md:py-24">
      <div class="container mx-auto px-4">
        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          <div 
            v-for="stat in clientStats" 
            :key="stat.label"
            class="text-center"
          >
            <div class="text-4xl md:text-5xl font-bold text-es-accent-primary dark:text-es-accent-primary-dark mb-2">
              {{ stat.value }}
            </div>
            <div class="text-es-text-secondary dark:text-es-text-secondary-dark">
              {{ stat.label }}
            </div>
          </div>
        </div>

        <!-- Logo Carousel -->
        <div class="overflow-hidden">
          <h3 class="text-2xl font-bold text-es-text-primary dark:text-es-text-primary-dark text-center mb-8">
            Materi logo klien ditampilkan setelah persetujuan publikasi
          </h3>
          <div class="relative">
            <div 
              class="flex transition-transform duration-500 ease-in-out"
              :style="{ transform: `translateX(-${currentLogoSlide * (100 / logosVisible)}%)` }"
            >
              <div 
                v-for="client in [...clients, ...clients]" 
                :key="client.id"
                class="flex-shrink-0 px-8"
                :style="{ width: `${100 / logosVisible}%` }"
              >
                <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-lg p-6 h-24 flex items-center justify-center hover:shadow-lg transition-shadow">
                  <img :src="client.logo" :alt="client.name" class="max-h-16 w-auto object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 5: Featured Works -->
    <section class="py-16 md:py-24 bg-es-bg-secondary dark:bg-es-bg-secondary-dark">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center mb-12">
          <div>
            <h2 class="text-3xl md:text-4xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-2">
              Featured Works
            </h2>
            <p class="text-es-text-secondary dark:text-es-text-secondary-dark">
              Sorotan proyek yang mewakili pendekatan kerja Esperion
            </p>
          </div>
          <NuxtLink
            :to="localePath('/our-works')"
            class="hidden md:inline-flex items-center text-es-accent-primary dark:text-es-accent-primary-dark font-semibold hover:underline"
          >
            View All Portfolio →
          </NuxtLink>
        </div>

        <div class="relative" @mouseenter="pauseCarousel" @mouseleave="resumeCarousel">
          <div class="overflow-hidden">
            <div 
              class="flex transition-transform duration-500 ease-in-out"
              :style="{ transform: `translateX(-${currentWorkSlide * (100 / worksVisible)}%)` }"
            >
              <NuxtLink
                v-for="work in featuredWorks"
                :key="work.id"
                :to="localePath(`/our-works/${work.slug}`)"
                class="flex-shrink-0 px-4"
                :style="{ width: `${100 / worksVisible}%` }"
              >
                <div class="bg-es-bg-primary dark:bg-es-bg-primary-dark rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                  <img :src="work.image" :alt="work.title" class="w-full h-48 object-cover" />
                  <div class="p-6">
                    <h3 class="text-xl font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-2">
                      {{ work.title }}
                    </h3>
                    <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm mb-4 line-clamp-2">
                      {{ work.description }}
                    </p>
                    <div class="flex flex-wrap gap-2">
                      <span class="px-3 py-1 bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 text-es-accent-primary dark:text-es-accent-primary-dark text-xs rounded-full">
                        {{ work.service }}
                      </span>
                      <span class="px-3 py-1 bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark text-es-text-secondary dark:text-es-text-secondary-dark text-xs rounded-full">
                        {{ work.platform }}
                      </span>
                    </div>
                  </div>
                </div>
              </NuxtLink>
            </div>
          </div>

          <!-- Navigation Arrows -->
          <button
            @click="prevWork"
            class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-es-bg-primary dark:bg-es-bg-primary-dark rounded-full shadow-lg flex items-center justify-center text-es-text-primary dark:text-es-text-primary-dark hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors"
            :disabled="currentWorkSlide === 0"
          >
            ←
          </button>
          <button
            @click="nextWork"
            class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-es-bg-primary dark:bg-es-bg-primary-dark rounded-full shadow-lg flex items-center justify-center text-es-text-primary dark:text-es-text-primary-dark hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors"
            :disabled="currentWorkSlide >= featuredWorks.length - worksVisible"
          >
            →
          </button>
        </div>

        <div class="text-center mt-8 md:hidden">
          <NuxtLink
            :to="localePath('/our-works')"
            class="inline-flex items-center text-es-accent-primary dark:text-es-accent-primary-dark font-semibold hover:underline"
          >
            View All Portfolio →
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Section 6: Articles Carousel -->
    <section class="py-16 md:py-24">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center mb-12">
          <div>
            <h2 class="text-3xl md:text-4xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-2">
              Latest Articles
            </h2>
            <p class="text-es-text-secondary dark:text-es-text-secondary-dark">
              Insight singkat, pembelajaran, dan pembaruan dari tim Esperion
            </p>
          </div>
          <NuxtLink
            :to="localePath('/articles')"
            class="hidden md:inline-flex items-center text-es-accent-primary dark:text-es-accent-primary-dark font-semibold hover:underline"
          >
            View All Articles →
          </NuxtLink>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="article in articles"
            :key="article.id"
            :to="localePath(`/articles/${article.slug_id}`)"
            class="group bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
          >
            <img :src="article.image" :alt="article.title" class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
            <div class="p-6">
              <span class="px-3 py-1 bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 text-es-accent-primary dark:text-es-accent-primary-dark text-xs rounded-full">
                {{ article.category }}
              </span>
              <h3 class="text-xl font-semibold text-es-text-primary dark:text-es-text-primary-dark mt-3 mb-2 line-clamp-2 group-hover:text-es-accent-primary dark:group-hover:text-es-accent-primary-dark transition-colors">
                {{ article.title }}
              </h3>
              <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm line-clamp-3">
                {{ article.excerpt_id }}
              </p>
              <div class="mt-4 flex items-center text-es-accent-primary dark:text-es-accent-primary-dark text-sm font-medium">
                Baca Selengkapnya <span class="ml-1">→</span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <div class="text-center mt-8 md:hidden">
          <NuxtLink
            :to="localePath('/articles')"
            class="inline-flex items-center text-es-accent-primary dark:text-es-accent-primary-dark font-semibold hover:underline"
          >
            View All Articles →
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Section 7: CTA -->
    <section class="py-16 md:py-24 bg-es-accent-primary dark:bg-es-accent-primary-dark">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-es-text-inverse dark:text-es-text-inverse-dark mb-4">
          {{ cta.title }}
        </h2>
        <p class="text-es-text-inverse/90 dark:text-es-text-inverse-dark/90 text-lg mb-8 max-w-2xl mx-auto">
          {{ cta.description }}
        </p>
        <NuxtLink
          :to="localePath('/contact-us')"
          class="inline-flex items-center px-8 py-4 bg-es-bg-inverse dark:bg-es-bg-inverse-dark text-es-text-primary dark:text-es-text-primary-dark rounded-lg font-semibold hover:bg-es-bg-primary dark:hover:bg-es-bg-primary-dark transition-colors"
        >
          Start Discussion Today
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { getFeaturedWorks, publicArticles, publicServices } from '../data/public-content';

// Window type extension for keyboard handler
declare global {
  interface Window {
    _bannerKeydownHandler?: (e: KeyboardEvent) => void;
  }
}

// SEO Meta
const runtimeConfig = useRuntimeConfig();
const localePath = useLocalePath();
const { t } = useI18n();
const { locale } = useI18n();

useSeoMeta({
  title: t('seo.home.title'),
  description: t('seo.home.description'),
  ogTitle: 'Esperion Digital Agency Jakarta | Jasa Digital Marketing Terbaik',
  ogDescription: 'Esperion adalah digital agency terbaik di Jakarta. Spesialis digital marketing, SEO, social media. Konsultasi GRATIS!',
  ogImage: '/images/esperion-agency-hero.jpg',
  ogUrl: 'https://esperion.id/id',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Esperion Digital Agency Jakarta | Jasa Digital Marketing Terbaik',
  twitterDescription: 'Esperion adalah digital agency terbaik di Jakarta. Spesialis digital marketing, SEO, social media. Konsultasi GRATIS!',
  twitterImage: '/images/esperion-agency-hero.jpg',
  ogLocale: 'id_ID',
});

// Set up Schema.org Organization
useSchemaOrg([
  defineLocalBusiness({
    '@type': 'ProfessionalService',
    name: 'Esperion Digital Agency',
    legalName: 'PT Esperion Teknologi Digital',
    description: 'Digital agency terbaik di Jakarta, Indonesia. Spesialis dalam pengembangan web, aplikasi mobile, desain UI/UX, dan digital marketing.',
    email: 'info@esperion.id',
    telephone: '+62-21-1234-5678',
    url: 'https://esperion.id/id',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jl. Sudirman Kav. 52-53',
      addressLocality: 'Jakarta Selatan',
      addressRegion: 'DKI Jakarta',
      postalCode: '12190',
      addressCountry: 'ID'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -6.2146,
      longitude: 106.8451
    },
    openingHours: ['Mo-Fr 09:00-17:00', 'Sa 09:00-13:00'],
    priceRange: '$$',
    areaServed: ['Jakarta', 'Tangerang', 'Bekasi', 'Depok', 'Bogor'],
    serviceArea: [
      {
        '@type': 'City',
        name: 'Jakarta'
      },
      {
        '@type': 'City',
        name: 'Tangerang'
      },
      {
        '@type': 'City',
        name: 'Bekasi'
      }
    ],
    slogan: 'Transformasi Digital untuk Bisnis Anda',
    foundingDate: '2020',
    numberOfEmployees: 25,
    knowsAbout: ['digital marketing', 'SEO', 'web development', 'mobile app development', 'ui ux design', 'e-commerce'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Digital Marketing Services',
      itemListElement: []
    },
    sameAs: [
      'https://www.facebook.com/esperiondigital',
      'https://www.instagram.com/esperion_id',
      'https://www.linkedin.com/company/esperiondigital',
      'https://twitter.com/esperion_id',
      'https://youtube.com/@esperiondigital'
    ],
    logo: {
      '@type': 'ImageObject',
      url: '/placeholders/first-party/brand-mark-required.svg',
      width: 300,
      height: 150
    },
    image: [
      '/images/banner-1.jpg',
      '/images/team.jpg'
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+62-21-1234-5678',
        contactType: 'customer service',
        areaServed: 'ID',
        availableLanguage: 'Indonesian'
      }
    ]
  }),
  defineWebSite({
    name: 'Esperion Digital Agency',
    url: 'https://esperion.id/id',
    description: 'Esperion membantu bisnis bertumbuh lewat strategi digital, pengembangan produk, dan desain yang terarah.',
    publisher: {
      '@type': 'Organization',
      name: 'Esperion Digital Agency',
    },
  }),
  defineWebPage({
    '@type': 'AboutPage',
    name: 'Esperion Digital Agency Jakarta',
    description: 'Esperion adalah agensi digital terkemuka di Jakarta, Indonesia yang berfokus pada solusi teknologi digital.',
    datePublished: '2020-01-01',
    dateModified: new Date().toISOString()
  }),
  defineBreadcrumb({
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://esperion.id/id'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'About Us',
        item: 'https://esperion.id/id/about'
      }
    ]
  })
]);

// State
const currentSlide = ref(0);
const currentLogoSlide = ref(0);
const currentWorkSlide = ref(0);
const worksVisible = ref(3);
const logosVisible = ref(6);
const isPaused = ref(false);

// Banner Slides Data
const bannerSlides = computed(() => [
  {
    id: 1,
    title: t('home.hero.slide1Title'),
    subtitle: t('home.hero.slide1Sub'),
    description: t('home.hero.slide1Desc'),
    image: '/images/banner-1.jpg',
    ctaText: t('home.hero.slide1Cta'),
    ctaLink: '/contact-us',
  },
  {
    id: 2,
    title: 'Ready for Next Growth Phase?',
    subtitle: 'Digital Solutions for Your Next Growth Phase',
    description: 'Dari perencanaan sampai peluncuran, Esperion membantu tim Anda merilis pengalaman digital yang relevan dan terukur.',
    image: '/images/banner-2.jpg',
    ctaText: 'View Portfolio',
    ctaLink: '/our-works',
  },
  {
    id: 3,
    title: 'Small Team, Real Impact',
    subtitle: 'Small Team, Real Impact',
    description: 'Kami menggabungkan strategi, desain, dan pengembangan untuk menghadirkan pengalaman digital yang konsisten dengan brand Anda.',
    image: '/images/banner-3.jpg',
    ctaText: 'Learn More',
    ctaLink: '/about',
  },
  {
    id: 4,
    title: 'Comprehensive Digital Services',
    subtitle: 'Comprehensive Digital Services',
    description: 'Dari web development hingga digital marketing, kami menyediakan solusi end-to-end untuk transformasi digital.',
    image: '/images/banner-4.jpg',
    ctaText: 'Explore Services',
    ctaLink: '/our-services',
  },
  {
    id: 5,
    title: 'Trusted by Growing Businesses',
    subtitle: 'Trusted by Growing Businesses',
    description: 'Bergabung dengan bisnis yang telah tumbuh bersama Esperion melalui solusi digital yang terukur dan berdampak.',
    image: '/images/banner-5.jpg',
    ctaText: 'View Testimonials',
    ctaLink: '/our-works',
  },
];

// Who Are We Data
const whoAreWe = {
  title: 'About Esperion',
  description: 'Esperion adalah mitra digital untuk bisnis yang membutuhkan arah, eksekusi, dan pengalaman brand yang konsisten. Kami menggabungkan strategi, desain, dan pengembangan agar setiap peluncuran terasa lebih siap dan lebih relevan.',
  image: '/images/team.jpg',
  values: [
    { label: 'Strategi yang jelas' },
    { label: 'Eksekusi yang rapi' },
    { label: 'Kolaborasi terbuka' },
    { label: 'Fokus pada hasil' },
  ],
};

// Services Data
const services = ref(publicServices);

// Client Stats Data
const clientStats = [
  { value: '150+', label: 'Projects Completed' },
  { value: '80+', label: 'Client Collaborations' },
  { value: '10+', label: 'Years of Experience' },
  { value: '25+', label: 'Core Talent' },
];

// Client Logos Data
const clients = ref([
  { id: 1, name: 'Logo klien menunggu persetujuan publikasi', logo: '/placeholders/first-party/client-logo-required.svg' },
  { id: 2, name: 'Logo klien menunggu persetujuan publikasi', logo: '/placeholders/first-party/client-logo-required.svg' },
  { id: 3, name: 'Logo klien menunggu persetujuan publikasi', logo: '/placeholders/first-party/client-logo-required.svg' },
  { id: 4, name: 'Logo klien menunggu persetujuan publikasi', logo: '/placeholders/first-party/client-logo-required.svg' },
  { id: 5, name: 'Logo klien menunggu persetujuan publikasi', logo: '/placeholders/first-party/client-logo-required.svg' },
  { id: 6, name: 'Logo klien menunggu persetujuan publikasi', logo: '/placeholders/first-party/client-logo-required.svg' },
  { id: 7, name: 'Logo klien menunggu persetujuan publikasi', logo: '/placeholders/first-party/client-logo-required.svg' },
  { id: 8, name: 'Logo klien menunggu persetujuan publikasi', logo: '/placeholders/first-party/client-logo-required.svg' },
]);

// Featured Works Data
const featuredWorks = ref(getFeaturedWorks(5));

// Articles Data
const articles = ref(publicArticles.slice(0, 3));

// CTA Data
const cta = {
  title: 'Ready for Your Next Digital Step?',
  description: 'Ceritakan konteks bisnis Anda, lalu kami bantu memetakan solusi yang paling relevan untuk tahap pertumbuhan berikutnya.',
};

// Auto-rotate banner
let bannerInterval: NodeJS.Timeout;
let worksInterval: NodeJS.Timeout;

const startAutoPlay = () => {
  console.log('[Banner] Starting autoplay, currentSlide:', currentSlide.value, 'isPaused:', isPaused.value);
  bannerInterval = setInterval(() => {
    console.log('[Banner] Interval tick, isPaused:', isPaused.value, 'currentSlide:', currentSlide.value);
    if (!isPaused.value) {
      currentSlide.value = (currentSlide.value + 1) % bannerSlides.length;
      console.log('[Banner] Advanced to slide:', currentSlide.value);
    }
  }, 5000);
};

const resetInterval = () => {
  clearInterval(bannerInterval);
  startAutoPlay();
};

const pauseAutoPlay = () => {
  isPaused.value = true;
  clearInterval(bannerInterval);
};

const resumeAutoPlay = () => {
  isPaused.value = false;
  startAutoPlay();
};

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? bannerSlides.length - 1 : currentSlide.value - 1;
  resetInterval();
};

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % bannerSlides.length;
  resetInterval();
};

onMounted(() => {
  console.log('[Banner] onMounted called, bannerSlides length:', bannerSlides.length);
  startAutoPlay();

  // Keyboard navigation
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  };
  window.addEventListener('keydown', handleKeydown);
  window._bannerKeydownHandler = handleKeydown;

  // Auto-rotate logos
  setInterval(() => {
    currentLogoSlide.value = (currentLogoSlide.value + 1) % clients.value.length;
  }, 3000);

  // Auto-rotate works carousel
  worksInterval = setInterval(() => {
    const maxSlide = featuredWorks.value.length - worksVisible.value;
    if (currentWorkSlide.value >= maxSlide) {
      currentWorkSlide.value = 0; // Loop back to start
    } else {
      currentWorkSlide.value++;
    }
  }, 5000);

  // Responsive adjustments
  const updateResponsive = () => {
    if (window.innerWidth < 768) {
      worksVisible.value = 1;
      logosVisible.value = 2;
    } else if (window.innerWidth < 1024) {
      worksVisible.value = 2;
      logosVisible.value = 4;
    } else {
      worksVisible.value = 3;
      logosVisible.value = 6;
    }
  };
  updateResponsive();
  window.addEventListener('resize', updateResponsive);
});

onBeforeUnmount(() => {
  clearInterval(bannerInterval);
  clearInterval(worksInterval);
  if (window._bannerKeydownHandler) {
    window.removeEventListener('keydown', window._bannerKeydownHandler);
  }
});

// Work slider navigation
const nextWork = () => {
  if (currentWorkSlide.value < featuredWorks.value.length - worksVisible.value) {
    currentWorkSlide.value++;
  }
  // Reset interval on manual navigation
  clearInterval(worksInterval);
  worksInterval = setInterval(() => {
    const maxSlide = featuredWorks.value.length - worksVisible.value;
    if (currentWorkSlide.value >= maxSlide) {
      currentWorkSlide.value = 0;
    } else {
      currentWorkSlide.value++;
    }
  }, 5000);
};

const prevWork = () => {
  if (currentWorkSlide.value > 0) {
    currentWorkSlide.value--;
  }
  // Reset interval on manual navigation
  clearInterval(worksInterval);
  worksInterval = setInterval(() => {
    const maxSlide = featuredWorks.value.length - worksVisible.value;
    if (currentWorkSlide.value >= maxSlide) {
      currentWorkSlide.value = 0;
    } else {
      currentWorkSlide.value++;
    }
  }, 5000);
};

const pauseCarousel = () => {
  clearInterval(worksInterval);
};

const resumeCarousel = () => {
  clearInterval(worksInterval);
  worksInterval = setInterval(() => {
    const maxSlide = featuredWorks.value.length - worksVisible.value;
    if (currentWorkSlide.value >= maxSlide) {
      currentWorkSlide.value = 0;
    } else {
      currentWorkSlide.value++;
    }
  }, 5000);
};
</script>
