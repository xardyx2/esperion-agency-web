<template>
  <div class="min-h-screen bg-es-bg-primary dark:bg-es-bg-primary-dark">
    <!-- Loading State -->
    <div v-if="pending" class="flex items-center justify-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-es-accent-primary"></div>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <h1 class="text-2xl font-bold text-es-text-primary mb-4">{{ t('services.detail.notFound') }}</h1>
        <NuxtLink :to="localePath('/our-services')" class="text-es-accent-primary hover:underline">
          {{ t('services.detail.backToServices') }}
        </NuxtLink>
      </div>
    </div>
    
    <!-- Service Content -->
    <template v-else-if="service">
    <!-- Hero Section -->
    <section class="relative h-[300px] md:h-[400px] bg-es-bg-secondary dark:bg-es-bg-secondary-dark">
      <div class="absolute inset-0 bg-gradient-to-r from-es-accent-primary/20 to-es-accent-primary/10 dark:from-es-accent-primary-dark/20 dark:to-es-accent-primary-dark/10" />
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="container mx-auto px-4 text-center">
          <div class="text-6xl mb-6">
            {{ service.icon }}
          </div>
          <h1 class="text-4xl md:text-5xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">
            {{ service.title }}
          </h1>
          <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-lg max-w-2xl mx-auto">
            {{ service.description }}
          </p>
        </div>
      </div>
    </section>

    <!-- Content -->
    <section class="py-12 md:py-16">
      <div class="container mx-auto px-4">
        <div class="grid lg:grid-cols-3 gap-12">
          <!-- Main Content -->
          <div class="lg:col-span-2">
            <!-- What We Offer -->
            <div class="mb-12">
              <h2 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-6">
                {{ t('services.detail.serviceScope') }}
              </h2>
              <div class="grid md:grid-cols-2 gap-6">
                <div
                  v-for="feature in features"
                  :key="feature.title"
                  class="flex gap-4"
                >
                  <div class="flex-shrink-0 w-12 h-12 rounded-lg bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 flex items-center justify-center">
                    <span class="text-xl">{{ feature.icon }}</span>
                  </div>
                  <div>
                    <h3 class="font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-1">
                      {{ feature.title }}
                    </h3>
                    <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm">
                      {{ feature.description }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Process -->
            <div class="mb-12">
              <h2 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-6">
                {{ t('services.detail.workflow') }}
              </h2>
              <div class="space-y-6">
                <div
                  v-for="(step, index) in process"
                  :key="step.title"
                  class="flex gap-4"
                >
                  <div class="flex-shrink-0 w-10 h-10 rounded-full bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark flex items-center justify-center font-bold">
                    {{ index + 1 }}
                  </div>
                  <div>
                    <h3 class="font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-1">
                      {{ step.title }}
                    </h3>
                    <p class="text-es-text-secondary dark:text-es-text-secondary-dark">
                      {{ step.description }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="lg:col-span-1">
            <!-- Pricing -->
            <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6 mb-8">
              <h3 class="text-xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">
                {{ t('services.detail.estimateStartingFrom') }}
              </h3>
              <div class="text-4xl font-bold text-es-accent-primary dark:text-es-accent-primary-dark mb-1">
                {{ formatIDR(service.pricingUSD) }}
              </div>
              <div class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark mb-2">
                ≈ {{ formatUSD(service.pricingUSD) }} USD
              </div>
              <div class="text-xs text-es-text-secondary dark:text-es-text-secondary-dark mb-2">
                {{ t('services.detail.priceNote') || 'Harga dapat disesuaikan berdasarkan scope proyek' }}
              </div>
              <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm mb-4">
                {{ t('services.detail.estimateNote') }}
              </p>
              <NuxtLink
                :to="localePath('/contact-us')"
                class="w-full inline-flex justify-center items-center px-6 py-3 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors"
              >
                {{ t('services.detail.requestEstimate') }}
              </NuxtLink>
            </div>

            <!-- FAQ -->
            <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6">
              <h3 class="text-xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">
                {{ t('services.detail.faq') }}
              </h3>
              <div class="space-y-4">
                <div
                  v-for="faq in faqs"
                  :key="faq.question"
                  class="border-b border-es-border dark:border-es-border-dark pb-4 last:border-0 last:pb-0"
                >
                  <h4 class="font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-2">
                    {{ faq.question }}
                  </h4>
                  <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm">
                    {{ faq.answer }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Related Services -->
    <section class="py-12 md:py-16 bg-es-bg-secondary dark:bg-es-bg-secondary-dark">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-8">
          {{ t('services.detail.relatedServices') }}
        </h2>
        <div class="grid md:grid-cols-3 gap-6">
          <NuxtLink
            v-for="related in relatedServices"
            :key="related.slug"
            :to="localePath(`/our-services/${related.slug}`)"
            class="group bg-es-bg-primary dark:bg-es-bg-primary-dark rounded-lg p-6 shadow-md hover:shadow-xl transition-all"
          >
            <div class="text-3xl mb-4">{{ related.icon }}</div>
            <h3 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-2 group-hover:text-es-accent-primary dark:group-hover:text-es-accent-primary-dark transition-colors">
              {{ related.title }}
            </h3>
            <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm line-clamp-2">
              {{ related.description }}
            </p>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-16 md:py-24 bg-es-accent-primary dark:bg-es-accent-primary-dark">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-es-text-inverse dark:text-es-text-inverse-dark mb-4">
          {{ t('services.detail.ctaTitle') }}
        </h2>
        <p class="text-es-text-inverse/90 dark:text-es-text-inverse-dark/90 text-lg mb-8 max-w-2xl mx-auto">
          {{ t('services.detail.ctaDescription') }}
        </p>
        <NuxtLink
          :to="localePath('/contact-us')"
          class="inline-flex items-center px-8 py-4 bg-es-bg-inverse dark:bg-es-bg-inverse-dark text-es-text-primary dark:text-es-text-primary-dark rounded-lg font-semibold hover:bg-es-bg-primary dark:hover:bg-es-bg-primary-dark transition-colors"
        >
          {{ t('services.detail.ctaButton') }}
        </NuxtLink>
      </div>
    </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { findPublicServiceBySlug, getRelatedServices } from '../../data/public-content'

// Dual Currency Display - IDR primary, USD reference
const EXCHANGE_RATE = 15500 // 1 USD = 15,500 IDR

const formatIDR = (priceUSD: number): string => {
  const priceIDR = Math.round(priceUSD * EXCHANGE_RATE)
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(priceIDR)
}

const formatUSD = (priceUSD: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(priceUSD)
}

const route = useRoute()
const localePath = useLocalePath()
const { t, locale } = useI18n()

// Slug parsing with edge case handling
const slugParam = computed(() => {
  const raw = route.params.slug

  if (Array.isArray(raw)) {
    return raw[0] ?? ''
  }

  return typeof raw === 'string' ? raw : ''
})

// FIX: Use useAsyncData dengan watch untuk reactive route changes
const { data: service, pending, error } = await useAsyncData(
  `service-${route.params.slug}`,
  () => {
    const record = findPublicServiceBySlug(slugParam.value)
    
    if (!record) {
      throw createError({ statusCode: 404, statusMessage: 'Service not found' })
    }
    
    return record
  },
  {
    watch: [slugParam],
    server: true,
    default: () => null
  }
)

// Handle error after fetch completes
watchEffect(() => {
  if (!pending.value && error.value) {
    throw createError({ statusCode: 404, statusMessage: 'Service not found' })
  }
})

const features = computed(() => service.value?.features || [])
const process = computed(() => service.value?.process || [])
const faqs = computed(() => service.value?.faqs || [])
const relatedServices = computed(() => service.value ? getRelatedServices(service.value.slug, 3) : [])

const serviceName = computed(() => service.value?.title || '')
const serviceSlug = computed(() => service.value?.slug || '')
const localePrefix = computed(() => (locale.value === 'en' ? 'en' : 'id'))

const pageUrl = computed(() => service.value ? `https://esperion.one/${localePrefix.value}/our-services/${serviceSlug.value}` : '')
const imageUrl = computed(() => service.value ? `/images/service-${serviceSlug.value.replace(/-/g, '')}.jpg` : '')

// Only set SEO meta when service is loaded
watchEffect(() => {
  if (!service.value) return
  
  useSeoMeta({
    title: `${serviceName.value} Jakarta | ${t('seo.services.title')}`,
    description: `${t('services.detail.serviceScope')}: ${service.value.description}`,
    ogTitle: `${serviceName.value} - Esperion`,
    ogDescription: service.value.description,
    ogImage: imageUrl.value || '/images/hero-service-development.jpg',
    ogUrl: pageUrl.value,
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: `${serviceName.value} - Esperion`,
    twitterDescription: service.value.description,
    twitterImage: imageUrl.value || '/images/hero-service-development.jpg',
    ogLocale: locale.value === 'en' ? 'en_US' : 'id_ID'
  })
})

/*
// Only set Schema.org when service is loaded
watchEffect(() => {
  if (!service.value) return
  
  const priceUSD = service.value.pricingUSD
  const priceIDR = Math.round(priceUSD * EXCHANGE_RATE)
  
  useSchemaOrg([
    // AI-Friendly Service Schema with Dual Currency
    {
      '@type': 'Service',
      name: service.value.title,
      description: service.value.description,
      provider: {
        '@type': 'Organization',
        name: 'Esperion Digital Agency',
        url: 'https://esperion.one'
      },
      areaServed: {
        '@type': 'Country',
        name: 'Indonesia'
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: service.value.title,
        itemListElement: {
          '@type': 'Offer',
          price: priceUSD.toString(),
          priceCurrency: 'USD',
          priceValidUntil: '2026-12-31',
          availability: 'https://schema.org/InStock',
          description: `Starting from Rp ${priceIDR.toLocaleString('id-ID')} IDR ($${priceUSD.toLocaleString('en-US')} USD)`,
          // AI-friendly dual currency
          priceSpecification: {
            '@type': 'PriceSpecification',
            minPrice: priceUSD.toString(),
            maxPrice: (priceUSD * 3).toString(), // Estimate max 3x starting
            priceCurrency: 'USD',
            valueAddedTaxIncluded: false,
            description: `IDR: Rp ${priceIDR.toLocaleString('id-ID')} | USD: $${priceUSD.toLocaleString('en-US')}`
          }
        }
      },
      // Service details
      serviceType: 'Digital Agency Services',
      termsOfService: 'Project-based with milestone payments'
    },
    // WebPage schema
    defineWebPage({
      '@type': 'CollectionPage',
      name: service.value.title,
      description: service.value.description,
      url: pageUrl.value,
      image: imageUrl.value || '/images/hero-service-development.jpg',
      dateModified: new Date().toISOString()
    }),
    // Breadcrumb
    defineBreadcrumb({
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: t('breadcrumb.home'),
          item: `https://esperion.one/${localePrefix.value}`
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: t('breadcrumb.services'),
          item: `https://esperion.one/${localePrefix.value}/our-services`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: service.value.title,
          item: pageUrl.value
        }
      ]
    })
  ])
})
*/
</script>
