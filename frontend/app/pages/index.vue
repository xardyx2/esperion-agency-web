<template>
  <div class="min-h-screen bg-es-bg-primary dark:bg-es-bg-primary-dark">
    <!-- Section 1: Dynamic Banner Slider -->
    <section
      class="relative h-[500px] md:h-[600px] overflow-hidden"
      @mouseenter="pauseAutoPlay"
      @mouseleave="resumeAutoPlay"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
    >
      <div class="relative w-full h-full">
        <Transition name="banner-slide" mode="out-in">
          <div
            :key="currentSlide"
            class="banner-slide absolute inset-0"
          >
            <div class="absolute inset-0 bg-gradient-to-r from-es-bg-secondary/90 to-es-bg-secondary/50 dark:from-es-bg-secondary-dark/90 dark:to-es-bg-secondary-dark/50 z-10" />
            <img
              :src="activeSlide.image"
              :alt="activeSlide.title"
              class="w-full h-full object-cover"
              loading="eager"
              fetchpriority="high"
            >
            <div class="absolute inset-0 z-20 flex items-center">
              <div class="container mx-auto px-4">
                <div class="max-w-2xl">
                  <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-2">
                    {{ activeSlide.title }}
                  </h1>
                  <p
                    v-if="activeSlide.subtitle"
                    class="text-lg md:text-xl text-es-text-secondary dark:text-es-text-secondary-dark mb-4 font-medium"
                  >
                    {{ activeSlide.subtitle }}
                  </p>
                  <p class="text-lg md:text-xl text-es-text-secondary dark:text-es-text-secondary-dark mb-8">
                    {{ activeSlide.description }}
                  </p>
                  <NuxtLink
                    :to="localePath(activeSlide.ctaLink)"
                    class="inline-flex items-center px-6 py-3 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors"
                  >
                    {{ activeSlide.ctaText }}
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>

      <!-- Slide Navigation -->
      <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
        <button
          v-for="(slide, index) in bannerSlides"
          :key="slide.id"
          class="w-3 h-3 rounded-full transition-colors"
          :class="currentSlide === index ? 'bg-es-accent-primary dark:bg-es-accent-primary-dark' : 'bg-es-text-secondary/50 dark:bg-es-text-secondary-dark/50 hover:bg-es-text-secondary dark:hover:bg-es-text-secondary-dark'"
          :aria-label="`Go to slide ${index + 1}`"
          @click="currentSlide = index"
        />
      </div>

      <!-- Arrow Navigation -->
      <button
        class="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-es-bg-inverse/80 dark:bg-es-bg-inverse-dark/80 rounded-full flex items-center justify-center text-es-text-primary dark:text-es-text-primary-dark hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-all shadow-lg hidden md:flex"
        aria-label="Previous slide"
        @click="prevSlide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        class="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-es-bg-inverse/80 dark:bg-es-bg-inverse-dark/80 rounded-full flex items-center justify-center text-es-text-primary dark:text-es-text-primary-dark hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-all shadow-lg hidden md:flex"
        aria-label="Next slide"
        @click="nextSlide"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 5l7 7-7 7"
          />
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
              loading="lazy"
            >
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

        <!-- Logo Marquee -->
        <div class="relative">
          <h3 class="text-2xl font-bold text-es-text-primary dark:text-es-text-primary-dark text-center mb-8">
            Materi logo klien ditampilkan setelah persetujuan publikasi
          </h3>
          <div
            ref="marqueeRef"
            class="marquee-container"
            @mouseenter="pauseMarquee"
            @mouseleave="resumeMarquee"
          >
            <div class="marquee-track">
              <div
                v-for="client in [...clients, ...clients, ...clients]"
                :key="client.id"
                class="marquee-item"
              >
                <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-lg p-6 h-24 flex items-center justify-center hover:shadow-lg transition-shadow">
                  <img
                    :src="client.logo"
                    :alt="client.name"
                    class="max-h-16 w-auto object-contain"
                    loading="lazy"
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Arrow Navigation -->
          <button
            class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-es-bg-primary dark:bg-es-bg-primary-dark rounded-full shadow-lg flex items-center justify-center text-es-text-primary dark:text-es-text-primary-dark hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-all z-10 focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
            aria-label="Scroll logos left"
            @click="scrollLogos(-1)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-es-bg-primary dark:bg-es-bg-primary-dark rounded-full shadow-lg flex items-center justify-center text-es-text-primary dark:text-es-text-primary-dark hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-all z-10 focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
            aria-label="Scroll logos right"
            @click="scrollLogos(1)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
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

        <div
          class="relative"
          @mouseenter="pauseCarousel"
          @mouseleave="resumeCarousel"
        >
          <div class="overflow-hidden">
            <div
              class="flex transition-transform"
              :style="{ transform: `translateX(-${currentWorkSlide * (100 / worksVisible)}%)` }"
            >
              <NuxtLink
                v-for="work in featuredWorks"
                :key="work.id"
                :to="localePath(`/our-works/${work.slug}`)"
                class="flex-shrink-0 px-4 work-card"
                :style="{ width: `${100 / worksVisible}%` }"
              >
                <div class="bg-es-bg-primary dark:bg-es-bg-primary-dark rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all work-card-inner">
                  <div class="overflow-hidden work-image-container">
                    <img
                      :src="work.image"
                      :alt="work.title"
                      class="w-full h-48 object-cover work-image"
                      loading="lazy"
                    >
                  </div>
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
            class="work-nav-arrow work-nav-left focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
            :disabled="currentWorkSlide === 0"
            aria-label="Previous work"
            @click="prevWork"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            class="work-nav-arrow work-nav-right focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
            :disabled="currentWorkSlide >= featuredWorks.length - worksVisible"
            aria-label="Next work"
            @click="nextWork"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
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
            <img
              :src="article.image"
              :alt="article.title"
              class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            >
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
import { getFeaturedWorks, publicArticles, publicServices } from '../data/public-content'

// Window type extension for keyboard handler
declare global {
  interface Window {
    _bannerKeydownHandler?: (e: KeyboardEvent) => void
  }
}

// SEO Meta
const runtimeConfig = useRuntimeConfig()
const localePath = useLocalePath()
const { t } = useI18n()
const { locale } = useI18n()

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
  ogLocale: 'id_ID'
})

// Set up Schema.org Organization
useSchemaOrg([
  defineLocalBusiness({
    '@type': 'ProfessionalService',
    'name': 'Esperion Digital Agency',
    'legalName': 'PT Esperion Teknologi Digital',
    'description': 'Digital agency terbaik di Jakarta, Indonesia. Spesialis dalam pengembangan web, aplikasi mobile, desain UI/UX, dan digital marketing.',
    'email': 'info@esperion.id',
    'telephone': '+62-21-1234-5678',
    'url': 'https://esperion.id/id',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Jl. Sudirman Kav. 52-53',
      'addressLocality': 'Jakarta Selatan',
      'addressRegion': 'DKI Jakarta',
      'postalCode': '12190',
      'addressCountry': 'ID'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': -6.2146,
      'longitude': 106.8451
    },
    'openingHours': ['Mo-Fr 09:00-17:00', 'Sa 09:00-13:00'],
    'priceRange': '$$',
    'areaServed': ['Jakarta', 'Tangerang', 'Bekasi', 'Depok', 'Bogor'],
    'serviceArea': [
      {
        '@type': 'City',
        'name': 'Jakarta'
      },
      {
        '@type': 'City',
        'name': 'Tangerang'
      },
      {
        '@type': 'City',
        'name': 'Bekasi'
      }
    ],
    'slogan': 'Transformasi Digital untuk Bisnis Anda',
    'foundingDate': '2020',
    'numberOfEmployees': 25,
    'knowsAbout': ['digital marketing', 'SEO', 'web development', 'mobile app development', 'ui ux design', 'e-commerce'],
    'hasOfferCatalog': {
      '@type': 'OfferCatalog',
      'name': 'Digital Marketing Services',
      'itemListElement': []
    },
    'sameAs': [
      'https://www.facebook.com/esperiondigital',
      'https://www.instagram.com/esperion_id',
      'https://www.linkedin.com/company/esperiondigital',
      'https://twitter.com/esperion_id',
      'https://youtube.com/@esperiondigital'
    ],
    'logo': {
      '@type': 'ImageObject',
      'url': '/placeholders/first-party/brand-mark-required.svg',
      'width': 300,
      'height': 150
    },
    'image': [
      '/images/banner-1.jpg',
      '/images/team.jpg'
    ],
    'contactPoint': [
      {
        '@type': 'ContactPoint',
        'telephone': '+62-21-1234-5678',
        'contactType': 'customer service',
        'areaServed': 'ID',
        'availableLanguage': 'Indonesian'
      }
    ]
  }),
  defineWebSite({
    name: 'Esperion Digital Agency',
    url: 'https://esperion.id/id',
    description: 'Esperion membantu bisnis bertumbuh lewat strategi digital, pengembangan produk, dan desain yang terarah.',
    publisher: {
      '@type': 'Organization',
      'name': 'Esperion Digital Agency'
    }
  }),
  defineWebPage({
    '@type': 'AboutPage',
    'name': 'Esperion Digital Agency Jakarta',
    'description': 'Esperion adalah agensi digital terkemuka di Jakarta, Indonesia yang berfokus pada solusi teknologi digital.',
    'datePublished': '2020-01-01',
    'dateModified': new Date().toISOString()
  }),
  defineBreadcrumb({
    itemListElement: [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://esperion.id/id'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'About Us',
        'item': 'https://esperion.id/id/about'
      }
    ]
  })
])

// State
const currentSlide = ref(0)
const currentLogoSlide = ref(0)
const currentWorkSlide = ref(0)
const worksVisible = ref(3)
const logosVisible = ref(6)
const isPaused = ref(false)
const marqueeRef = ref<HTMLDivElement>()
const touchStartX = ref(0)
const touchStartY = ref(0)
const touchEndX = ref(0)
const touchEndY = ref(0)
const isMarqueePaused = ref(false)

// Banner Slides Data
const bannerSlides = computed(() => [
  {
    id: 1,
    title: t('home.hero.slide1Title'),
    subtitle: t('home.hero.slide1Sub'),
    description: t('home.hero.slide1Desc'),
    image: '/images/banner-1.jpg',
    ctaText: t('home.hero.slide1Cta'),
    ctaLink: '/contact-us'
  },
  {
    id: 2,
    title: 'Ready for Next Growth Phase?',
    subtitle: 'Digital Solutions for Your Next Growth Phase',
    description: 'Dari perencanaan sampai peluncuran, Esperion membantu tim Anda merilis pengalaman digital yang relevan dan terukur.',
    image: '/images/banner-2.jpg',
    ctaText: 'View Portfolio',
    ctaLink: '/our-works'
  },
  {
    id: 3,
    title: 'Small Team, Real Impact',
    subtitle: 'Small Team, Real Impact',
    description: 'Kami menggabungkan strategi, desain, dan pengembangan untuk menghadirkan pengalaman digital yang konsisten dengan brand Anda.',
    image: '/images/banner-3.jpg',
    ctaText: 'Learn More',
    ctaLink: '/about'
  },
  {
    id: 4,
    title: 'Comprehensive Digital Services',
    subtitle: 'Comprehensive Digital Services',
    description: 'Dari web development hingga digital marketing, kami menyediakan solusi end-to-end untuk transformasi digital.',
    image: '/images/banner-4.jpg',
    ctaText: 'Explore Services',
    ctaLink: '/our-services'
  },
  {
    id: 5,
    title: 'Trusted by Growing Businesses',
    subtitle: 'Trusted by Growing Businesses',
    description: 'Bergabung dengan bisnis yang telah tumbuh bersama Esperion melalui solusi digital yang terukur dan berdampak.',
    image: '/images/banner-5.jpg',
    ctaText: 'View Testimonials',
    ctaLink: '/our-works'
  }
])

// Active slide computed property
const activeSlide = computed(() => bannerSlides.value[currentSlide.value])

// Who Are We Data
const whoAreWe = {
  title: 'About Esperion',
  description: 'Esperion adalah mitra digital untuk bisnis yang membutuhkan arah, eksekusi, dan pengalaman brand yang konsisten. Kami menggabungkan strategi, desain, dan pengembangan agar setiap peluncuran terasa lebih siap dan lebih relevan.',
  image: '/images/team.jpg',
  values: [
    { label: 'Strategi yang jelas' },
    { label: 'Eksekusi yang rapi' },
    { label: 'Kolaborasi terbuka' },
    { label: 'Fokus pada hasil' }
  ]
}

// Services Data
const services = ref(publicServices)

// Client Stats Data
const clientStats = [
  { value: '150+', label: 'Projects Completed' },
  { value: '80+', label: 'Client Collaborations' },
  { value: '10+', label: 'Years of Experience' },
  { value: '25+', label: 'Core Talent' }
]

// Client Logos Data
const clients = ref([
  { id: 1, name: 'Logo klien menunggu persetujuan publikasi', logo: '/placeholders/first-party/client-logo-required.svg' },
  { id: 2, name: 'Logo klien menunggu persetujuan publikasi', logo: '/placeholders/first-party/client-logo-required.svg' },
  { id: 3, name: 'Logo klien menunggu persetujuan publikasi', logo: '/placeholders/first-party/client-logo-required.svg' },
  { id: 4, name: 'Logo klien menunggu persetujuan publikasi', logo: '/placeholders/first-party/client-logo-required.svg' },
  { id: 5, name: 'Logo klien menunggu persetujuan publikasi', logo: '/placeholders/first-party/client-logo-required.svg' },
  { id: 6, name: 'Logo klien menunggu persetujuan publikasi', logo: '/placeholders/first-party/client-logo-required.svg' },
  { id: 7, name: 'Logo klien menunggu persetujuan publikasi', logo: '/placeholders/first-party/client-logo-required.svg' },
  { id: 8, name: 'Logo klien menunggu persetujuan publikasi', logo: '/placeholders/first-party/client-logo-required.svg' }
])

// Featured Works Data
const featuredWorks = ref(getFeaturedWorks(5))

// Articles Data
const articles = ref(publicArticles.slice(0, 3))

// CTA Data
const cta = {
  title: 'Ready for Your Next Digital Step?',
  description: 'Ceritakan konteks bisnis Anda, lalu kami bantu memetakan solusi yang paling relevan untuk tahap pertumbuhan berikutnya.'
}

// Auto-rotate banner - menggunakan setTimeout untuk kontrol lebih baik
let bannerTimeout: NodeJS.Timeout
let worksInterval: NodeJS.Timeout
let lastAdvanceTime = 0

const startAutoPlay = () => {
  // Clear any existing timeout first
  clearTimeout(bannerTimeout)
  
  // Set new timeout for 5 seconds
  bannerTimeout = setTimeout(() => {
    if (!isPaused.value) {
      // Record time before advancing
      lastAdvanceTime = Date.now()
      currentSlide.value = (currentSlide.value + 1) % bannerSlides.value.length
      // Recursive call untuk timing konsisten
      startAutoPlay()
    }
  }, 5000)
}

const resetAutoPlay = () => {
  clearTimeout(bannerTimeout)
  lastAdvanceTime = Date.now()
  startAutoPlay()
}

const pauseAutoPlay = () => {
  isPaused.value = true
  clearTimeout(bannerTimeout)
}

const resumeAutoPlay = () => {
  isPaused.value = false
  startAutoPlay()
}

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0 ? bannerSlides.value.length - 1 : currentSlide.value - 1
  resetAutoPlay()
}

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % bannerSlides.value.length
  resetAutoPlay()
}

// Touch gesture handlers
const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
}

const handleTouchEnd = (e: TouchEvent) => {
  touchEndX.value = e.changedTouches[0].clientX
  touchEndY.value = e.changedTouches[0].clientY
  handleSwipe()
}

const handleSwipe = () => {
  const diffX = touchStartX.value - touchEndX.value
  const diffY = touchStartY.value - touchEndY.value

  // Only handle horizontal swipes (horizontal movement > vertical movement)
  if (Math.abs(diffX) > Math.abs(diffY)) {
    // Horizontal swipe threshold: 50px
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        // Swipe left - next slide
        nextSlide()
      } else {
        // Swipe right - previous slide
        prevSlide()
      }
    }
  }
}

// Marquee controls
const pauseMarquee = () => {
  isMarqueePaused.value = true
  if (marqueeRef.value) {
    marqueeRef.value.style.setProperty('--marquee-play-state', 'paused')
  }
}

const resumeMarquee = () => {
  isMarqueePaused.value = false
  if (marqueeRef.value) {
    marqueeRef.value.style.setProperty('--marquee-play-state', 'running')
  }
}

const scrollLogos = (direction: number) => {
  // Pause marquee on manual navigation
  pauseMarquee()

  if (marqueeRef.value) {
    const scrollAmount = direction * 200
    marqueeRef.value.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }

  // Resume marquee after 3 seconds
  setTimeout(() => {
    resumeMarquee()
  }, 3000)
}

onMounted(() => {
  console.log('[Banner] onMounted called, bannerSlides length:', bannerSlides.value.length)
  startAutoPlay()

  // Keyboard navigation for banner
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      prevSlide()
    } else if (e.key === 'ArrowRight') {
      nextSlide()
    }
  }
  window.addEventListener('keydown', handleKeydown)
  window._bannerKeydownHandler = handleKeydown

  // Auto-rotate logos - replaced with CSS marquee
  // Manual arrow navigation available via buttons

  // Auto-rotate works carousel
  worksInterval = setInterval(() => {
    const maxSlide = featuredWorks.value.length - worksVisible.value
    if (currentWorkSlide.value >= maxSlide) {
      currentWorkSlide.value = 0 // Loop back to start
    } else {
      currentWorkSlide.value++
    }
  }, 5000)

  // Responsive adjustments
  const updateResponsive = () => {
    if (window.innerWidth < 768) {
      worksVisible.value = 1
      logosVisible.value = 2
    } else if (window.innerWidth < 1024) {
      worksVisible.value = 2
      logosVisible.value = 4
    } else {
      worksVisible.value = 3
      logosVisible.value = 6
    }
  }
  updateResponsive()
  window.addEventListener('resize', updateResponsive)
})

onBeforeUnmount(() => {
  clearInterval(bannerInterval)
  clearInterval(worksInterval)
  if (window._bannerKeydownHandler) {
    window.removeEventListener('keydown', window._bannerKeydownHandler)
  }
})

// Work slider navigation
const nextWork = () => {
  if (currentWorkSlide.value < featuredWorks.value.length - worksVisible.value) {
    currentWorkSlide.value++
  }
  // Reset interval on manual navigation
  clearInterval(worksInterval)
  worksInterval = setInterval(() => {
    const maxSlide = featuredWorks.value.length - worksVisible.value
    if (currentWorkSlide.value >= maxSlide) {
      currentWorkSlide.value = 0
    } else {
      currentWorkSlide.value++
    }
  }, 5000)
}

const prevWork = () => {
  if (currentWorkSlide.value > 0) {
    currentWorkSlide.value--
  }
  // Reset interval on manual navigation
  clearInterval(worksInterval)
  worksInterval = setInterval(() => {
    const maxSlide = featuredWorks.value.length - worksVisible.value
    if (currentWorkSlide.value >= maxSlide) {
      currentWorkSlide.value = 0
    } else {
      currentWorkSlide.value++
    }
  }, 5000)
}

const pauseCarousel = () => {
  clearInterval(worksInterval)
}

const resumeCarousel = () => {
  clearInterval(worksInterval)
  worksInterval = setInterval(() => {
    const maxSlide = featuredWorks.value.length - worksVisible.value
    if (currentWorkSlide.value >= maxSlide) {
      currentWorkSlide.value = 0
    } else {
      currentWorkSlide.value++
    }
  }, 5000)
}
</script>

<style scoped>
/* Define CSS variables locally for this component */
.marquee-container {
  --es-marquee-duration: 30s;
  --es-transition-duration: 500ms;
  --es-easing-material: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Banner Slider Styles - Vue TransitionGroup animation */
.banner-slide {
  position: absolute;
  inset: 0;
  will-change: transform, opacity;
  /* Ensure hardware acceleration */
  transform: translateZ(0);
  backface-visibility: hidden;
}

/* Enter animation (new slide coming in from right) */
.banner-slide-enter-active {
  transition: transform 600ms cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  inset: 0;
}

.banner-slide-enter-from {
  transform: translateX(100%);
}

.banner-slide-enter-to {
  transform: translateX(0);
}

/* Leave animation (old slide going to left) */
.banner-slide-leave-active {
  transition: transform 600ms cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  inset: 0;
}

.banner-slide-leave-from {
  transform: translateX(0);
}

.banner-slide-leave-to {
  transform: translateX(-100%);
}

/* Remove old slide positioning classes (no longer needed with TransitionGroup) */

/* Client Logos Marquee */
.marquee-container {
  position: relative;
  overflow: hidden;
  width: 100%;
  --marquee-play-state: running;
}

.marquee-container::before,
.marquee-container::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100px;
  z-index: 2;
  pointer-events: none;
}

.marquee-container::before {
  left: 0;
  background: linear-gradient(to right,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 0) 100%);
}

.marquee-container::after {
  right: 0;
  background: linear-gradient(to left,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 0) 100%);
}

.dark .marquee-container::before {
  background: linear-gradient(to right,
    rgba(15, 23, 42, 1) 0%,
    rgba(15, 23, 42, 0) 100%);
}

.dark .marquee-container::after {
  background: linear-gradient(to left,
    rgba(15, 23, 42, 1) 0%,
    rgba(15, 23, 42, 0) 100%);
}

.marquee-track {
  display: flex;
  gap: 2rem;
  animation: marquee var(--es-marquee-duration) linear infinite;
  animation-play-state: var(--marquee-play-state);
  padding: 1rem 0;
}

.marquee-container:hover .marquee-track {
  animation-play-state: paused;
}

.marquee-item {
  flex-shrink: 0;
  min-width: 200px;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* Featured Works Card Hover Effects */
.work-card {
  transition: transform 500ms cubic-bezier(0.4, 0, 0.2, 1);
}

.work-card-inner {
  transition: all 500ms cubic-bezier(0.4, 0, 0.2, 1);
}

.work-card:hover .work-card-inner {
  transform: translateY(-8px);
}

.work-image-container {
  overflow: hidden;
}

.work-image {
  transition: transform 500ms cubic-bezier(0.4, 0, 0.2, 1);
}

.work-card:hover .work-image {
  transform: scale(1.05);
}

/* Work Navigation Arrows */
.work-nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  background-color: rgb(255 255 255);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(15, 23, 42);
  transition: all 500ms cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
}

.dark .work-nav-arrow {
  background-color: rgb(15, 23, 42);
  color: rgb(255, 255, 255);
}

.work-nav-arrow:hover:not(:disabled) {
  background-color: rgb(59, 130, 246);
  color: rgb(255, 255, 255);
}

.dark .work-nav-arrow:hover:not(:disabled) {
  background-color: rgb(59, 130, 246);
  color: rgb(255, 255, 255);
}

.work-nav-arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.work-nav-left {
  left: 0;
  margin-left: -1rem;
}

.work-nav-right {
  right: 0;
  margin-right: -1rem;
}

/* Mobile: Hide arrows on small screens */
@media (max-width: 767px) {
  .work-nav-arrow {
    display: none;
  }
}

/* Responsive logo display */
@media (max-width: 767px) {
  .marquee-item {
    min-width: calc(50% - 1rem); /* 2 logos */
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .marquee-item {
    min-width: calc(25% - 1rem); /* 4 logos */
  }
}

@media (min-width: 1024px) {
  .marquee-item {
    min-width: calc(16.666% - 1rem); /* 6 logos */
  }
}
</style>
