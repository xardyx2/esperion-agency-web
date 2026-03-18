<template>
  <div class="min-h-screen bg-es-bg-primary dark:bg-es-bg-primary-dark">
    <!-- Section 1: Dynamic Banner Slider -->
    <section class="relative h-[500px] md:h-[600px] overflow-hidden">
      <div
        v-for="(slide, index) in bannerSlides"
        v-show="currentSlide === index"
        :key="slide.id"
        class="absolute inset-0 transition-opacity duration-1000"
        :class="{ 'opacity-100': currentSlide === index, 'opacity-0': currentSlide !== index }"
      >
        <div class="absolute inset-0 bg-gradient-to-r from-es-bg-secondary/90 to-es-bg-secondary/50 dark:from-es-bg-secondary-dark/90 dark:to-es-bg-secondary-dark/50 z-10" />
        <img
          :src="slide.image"
          :alt="slide.title"
          class="w-full h-full object-cover"
        >
        <div class="absolute inset-0 z-20 flex items-center">
          <div class="container mx-auto px-4">
            <div class="max-w-2xl">
              <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">
                {{ slide.title }}
              </h1>
              <p class="text-lg md:text-xl text-es-text-secondary dark:text-es-text-secondary-dark mb-8">
                {{ slide.description }}
              </p>
              <NuxtLink
                :to="slide.ctaLink"
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
          class="w-3 h-3 rounded-full transition-colors"
          :class="currentSlide === index ? 'bg-es-accent-primary dark:bg-es-accent-primary-dark' : 'bg-es-text-secondary/50 dark:bg-es-text-secondary-dark/50 hover:bg-es-text-secondary dark:hover:bg-es-text-secondary-dark'"
          :aria-label="`Go to slide ${index + 1}`"
          @click="currentSlide = index"
        />
      </div>
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
            Comprehensive digital solutions tailored to your business needs
          </p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="service in services"
            :key="service.slug"
            :to="`/our-services/${service.slug}`"
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
            to="/our-services"
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
            Trusted by Leading Companies
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
                  <img
                    :src="client.logo"
                    :alt="client.name"
                    class="max-h-16 w-auto object-contain"
                  >
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
              Showcasing our best projects
            </p>
          </div>
          <NuxtLink
            to="/our-works"
            class="hidden md:inline-flex items-center text-es-accent-primary dark:text-es-accent-primary-dark font-semibold hover:underline"
          >
            View All Works →
          </NuxtLink>
        </div>

        <div class="relative">
          <div class="overflow-hidden">
            <div
              class="flex transition-transform duration-500 ease-in-out"
              :style="{ transform: `translateX(-${currentWorkSlide * (100 / worksVisible)}%)` }"
            >
              <NuxtLink
                v-for="work in featuredWorks"
                :key="work.id"
                :to="`/our-works/${work.slug}`"
                class="flex-shrink-0 px-4"
                :style="{ width: `${100 / worksVisible}%` }"
              >
                <div class="bg-es-bg-primary dark:bg-es-bg-primary-dark rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
                  <img
                    :src="work.image"
                    :alt="work.title"
                    class="w-full h-48 object-cover"
                  >
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
            class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-es-bg-primary dark:bg-es-bg-primary-dark rounded-full shadow-lg flex items-center justify-center text-es-text-primary dark:text-es-text-primary-dark hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors"
            :disabled="currentWorkSlide === 0"
            @click="prevWork"
          >
            ←
          </button>
          <button
            class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-es-bg-primary dark:bg-es-bg-primary-dark rounded-full shadow-lg flex items-center justify-center text-es-text-primary dark:text-es-text-primary-dark hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors"
            :disabled="currentWorkSlide >= featuredWorks.length - worksVisible"
            @click="nextWork"
          >
            →
          </button>
        </div>

        <div class="text-center mt-8 md:hidden">
          <NuxtLink
            to="/our-works"
            class="inline-flex items-center text-es-accent-primary dark:text-es-accent-primary-dark font-semibold hover:underline"
          >
            View All Works →
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
              Insights and updates from our team
            </p>
          </div>
          <NuxtLink
            to="/articles"
            class="hidden md:inline-flex items-center text-es-accent-primary dark:text-es-accent-primary-dark font-semibold hover:underline"
          >
            View All Articles →
          </NuxtLink>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="article in articles"
            :key="article.id"
            :to="`/articles/${article.slug_id}`"
            class="group bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
          >
            <img
              :src="article.image"
              :alt="article.title"
              class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
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
                Read More <span class="ml-1">→</span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <div class="text-center mt-8 md:hidden">
          <NuxtLink
            to="/articles"
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
          to="/contact-us"
          class="inline-flex items-center px-8 py-4 bg-es-bg-inverse dark:bg-es-bg-inverse-dark text-es-text-primary dark:text-es-text-primary-dark rounded-lg font-semibold hover:bg-es-bg-primary dark:hover:bg-es-bg-primary-dark transition-colors"
        >
          Get Started Today
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// SEO Meta
const runtimeConfig = useRuntimeConfig()

useSeoMeta({
  title: 'Esperion Digital Agency Jakarta | Jasa Digital Marketing Terbaik',
  description: 'Esperion adalah digital agency terbaik di Jakarta. Spesialis digital marketing, SEO, social media. Konsultasi GRATIS!',
  ogTitle: 'Esperion Digital Agency Jakarta | Jasa Digital Marketing Terbaik',
  ogDescription: 'Esperion adalah digital agency terbaik di Jakarta. Spesialis digital marketing, SEO, social media. Konsultasi GRATIS!',
  ogImage: '/images/esperion-agency-hero.jpg',
  ogUrl: 'https://esperion.one/id',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Esperion Digital Agency Jakarta | Jasa Digital Marketing Terbaik',
  twitterDescription: 'Esperion adalah digital agency terbaik di Jakarta. Spesialis digital marketing, SEO, social media. Konsultasi GRATIS!',
  twitterImage: '/images/esperion-agency-hero.jpg',
  alternates: {
    canonical: 'https://esperion.one/id'
  },
  link: [
    { rel: 'alternate', hreflang: 'id', href: 'https://esperion.one/id' },
    { rel: 'alternate', hreflang: 'en', href: 'https://esperion.one/en' },
    { rel: 'alternate', hreflang: 'x-default', href: 'https://esperion.one/id' }
  ]
})

// Set up Schema.org Organization
useSchemaOrg([
  defineLocalBusiness({
    '@type': 'ProfessionalService',
    'name': 'Esperion Digital Agency',
    'legalName': 'PT Esperion Teknologi Digital',
    'description': 'Digital agency terbaik di Jakarta, Indonesia. Spesialis dalam pengembangan web, aplikasi mobile, desain UI/UX, dan digital marketing.',
    'email': 'info@esperion.one',
    'telephone': '+62-21-1234-5678',
    'url': 'https://esperion.one/id',
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
      'url': 'https://esperion.one/images/logo.svg',
      'width': 300,
      'height': 150
    },
    'image': [
      'https://esperion.one/images/banner-1.jpg',
      'https://esperion.one/images/team.jpg'
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
    url: 'https://esperion.one/id',
    description: 'Digital agency terbaik di Jakarta yang menyediakan layanan pemasaran digital, pengembangan web, dan desain UI/UX.',
    publisher: 'Esperion Digital Agency'
  }),
  defineWebPage({
    '@type': 'AboutPage',
    'name': 'Esperion Digital Agency Jakarta',
    'description': 'Esperion adalah agensi digital terkemuka di Jakarta, Indonesia yang berfokus pada solusi teknologi digital.',
    'datePublished': '2020-01-01',
    'dateModified': new Date().toISOString()
  }),
  defineBreadcrumbList({
    itemListElement: [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Beranda',
        'item': 'https://esperion.one/id'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Tentang Kami',
        'item': 'https://esperion.one/id/about'
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

// Banner Slides Data
const bannerSlides = [
  {
    id: 1,
    title: 'Transform Your Digital Presence',
    description: 'We create stunning websites and applications that drive results for your business.',
    image: '/images/banner-1.jpg',
    ctaText: 'Get Started',
    ctaLink: '/contact-us'
  },
  {
    id: 2,
    title: 'Innovative Solutions for Modern Business',
    description: 'From concept to launch, we partner with you to build digital products that matter.',
    image: '/images/banner-2.jpg',
    ctaText: 'View Our Work',
    ctaLink: '/our-works'
  },
  {
    id: 3,
    title: 'Expert Team, Exceptional Results',
    description: 'Our team of experts delivers high-quality solutions tailored to your needs.',
    image: '/images/banner-3.jpg',
    ctaText: 'Learn More',
    ctaLink: '/about'
  }
]

// Who Are We Data
const whoAreWe = {
  title: 'Who Are We',
  description: 'Esperion is a full-service digital agency based in Jakarta, Indonesia. We combine creativity, technology, and strategy to help businesses thrive in the digital age. Our team of passionate designers, developers, and strategists work together to deliver exceptional results that exceed expectations.',
  image: '/images/team.jpg',
  values: [
    { label: 'Innovation' },
    { label: 'Quality' },
    { label: 'Collaboration' },
    { label: 'Results-Driven' }
  ]
}

// Services Data
const services = ref([
  { slug: 'web-development', title: 'Web Development', description: 'Custom websites and web applications built with modern technologies.', icon: '💻' },
  { slug: 'mobile-app-development', title: 'Mobile App Development', description: 'Native and cross-platform mobile applications for iOS and Android.', icon: '📱' },
  { slug: 'ui-ux-design', title: 'UI/UX Design', description: 'User-centered design that creates intuitive and engaging experiences.', icon: '🎨' },
  { slug: 'digital-marketing', title: 'Digital Marketing', description: 'SEO, SEM, and social media strategies to grow your online presence.', icon: '📈' },
  { slug: 'ecommerce-solutions', title: 'E-Commerce Solutions', description: 'Complete online store setup and optimization for maximum conversions.', icon: '🛒' },
  { slug: 'consulting', title: 'Consulting', description: 'Technology and digital transformation consulting for your business.', icon: '💡' }
])

// Client Stats Data
const clientStats = [
  { value: '150+', label: 'Projects Completed' },
  { value: '80+', label: 'Happy Clients' },
  { value: '10+', label: 'Years Experience' },
  { value: '25+', label: 'Team Members' }
]

// Client Logos Data
const clients = ref([
  { id: 1, name: 'Client 1', logo: '/logos/client-1.png' },
  { id: 2, name: 'Client 2', logo: '/logos/client-2.png' },
  { id: 3, name: 'Client 3', logo: '/logos/client-3.png' },
  { id: 4, name: 'Client 4', logo: '/logos/client-4.png' },
  { id: 5, name: 'Client 5', logo: '/logos/client-5.png' },
  { id: 6, name: 'Client 6', logo: '/logos/client-6.png' },
  { id: 7, name: 'Client 7', logo: '/logos/client-7.png' },
  { id: 8, name: 'Client 8', logo: '/logos/client-8.png' }
])

// Featured Works Data
const featuredWorks = ref([
  { id: 1, slug: 'project-1', title: 'E-Commerce Platform', description: 'Complete redesign of online store resulting in 45% increase in conversions.', image: '/works/work-1.jpg', service: 'Web Development', platform: 'Shopify' },
  { id: 2, slug: 'project-2', title: 'Mobile Banking App', description: 'Secure and intuitive mobile banking experience for iOS and Android.', image: '/works/work-2.jpg', service: 'Mobile App Development', platform: 'React Native' },
  { id: 3, slug: 'project-3', title: 'Healthcare Portal', description: 'Patient management system with telemedicine capabilities.', image: '/works/work-3.jpg', service: 'Web Development', platform: 'Next.js' },
  { id: 4, slug: 'project-4', title: 'Restaurant Chain Website', description: 'Multi-location website with online ordering integration.', image: '/works/work-4.jpg', service: 'Web Development', platform: 'Nuxt' },
  { id: 5, slug: 'project-5', title: 'Fitness Tracking App', description: 'Comprehensive fitness tracking with AI-powered recommendations.', image: '/works/work-5.jpg', service: 'Mobile App Development', platform: 'Flutter' }
])

// Articles Data
const articles = ref([
  { id: 1, slug_id: 'digital-marketing-trends-2024', title: 'Digital Marketing Trends to Watch in 2024', excerpt_id: 'Discover the latest trends shaping the future of digital marketing and how to leverage them for your business.', category: 'Marketing', image: '/articles/article-1.jpg' },
  { id: 2, slug_id: 'ui-ux-best-practices', title: 'UI/UX Best Practices for Modern Websites', excerpt_id: 'Learn the essential principles of user interface and experience design that drive engagement.', category: 'Design', image: '/articles/article-2.jpg' },
  { id: 3, slug_id: 'ecommerce-optimization-guide', title: 'Complete Guide to E-Commerce Optimization', excerpt_id: 'Proven strategies to increase conversions and boost your online store performance.', category: 'E-Commerce', image: '/articles/article-3.jpg' }
])

// CTA Data
const cta = {
  title: 'Ready to Start Your Project?',
  description: 'Let us help you transform your digital presence. Contact us today for a free consultation.'
}

// Auto-rotate banner
let bannerInterval: NodeJS.Timeout
onMounted(() => {
  bannerInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % bannerSlides.length
  }, 5000)

  // Auto-rotate logos
  setInterval(() => {
    currentLogoSlide.value = (currentLogoSlide.value + 1) % clients.value.length
  }, 3000)

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
})

// Work slider navigation
const nextWork = () => {
  if (currentWorkSlide.value < featuredWorks.value.length - worksVisible.value) {
    currentWorkSlide.value++
  }
}

const prevWork = () => {
  if (currentWorkSlide.value > 0) {
    currentWorkSlide.value--
  }
}
</script>// Test hot reload at Sat Mar  7 19:27:43 SEAST 2026
