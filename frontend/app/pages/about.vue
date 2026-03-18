<template>
  <div class="min-h-screen bg-es-bg-primary dark:bg-es-bg-primary-dark">
    <!-- Banner Section -->
    <section class="relative h-[400px] md:h-[400px] overflow-hidden">
      <img
        src="/images/banners/about.webp"
        srcset="/images/banners/about-mobile.webp 768w, /images/banners/about.webp 1920w"
        sizes="(max-width: 768px) 768px, 1920px"
        alt="Esperion About Banner"
        class="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        fetchpriority="high"
      >
      <div class="absolute inset-0 bg-gradient-to-r from-es-accent-primary/30 to-es-accent-primary/20 dark:from-es-accent-primary-dark/40 dark:to-es-accent-primary-dark/30" />
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="container mx-auto px-4 text-center">
          <h1 class="text-4xl md:text-5xl font-bold text-es-text-inverse dark:text-es-text-inverse-dark mb-4 drop-shadow-lg">
            {{ t('about.banner.title') }}
          </h1>
          <p class="text-es-text-inverse/90 dark:text-es-text-inverse-dark/90 text-lg max-w-2xl mx-auto drop-shadow">
            {{ t('about.banner.description') }}
          </p>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="py-12 md:py-16">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-2 gap-12 items-start">
          <!-- Tentang Esperion -->
          <div>
            <h2 class="text-3xl md:text-4xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-6">
              {{ t('about.aboutSection.title') }}
            </h2>
            <p class="text-es-text-secondary dark:text-es-text-secondary-dark leading-relaxed mb-6">
              {{ t('about.aboutSection.paragraph1') }}
            </p>
            <p class="text-es-text-secondary dark:text-es-text-secondary-dark leading-relaxed mb-6">
              {{ t('about.aboutSection.paragraph2') }}
            </p>
            <p class="text-es-text-secondary dark:text-es-text-secondary-dark leading-relaxed">
              {{ t('about.aboutSection.paragraph3') }}
            </p>
          </div>

          <!-- Vision & Mission -->
          <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-8">
            <h3 class="text-2xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-6">
              {{ t('about.visionMission.title') }}
            </h3>
            <div class="space-y-6">
              <div>
                <div class="flex items-center gap-3 mb-3">
                  <span class="text-3xl">🎯</span>
                  <h4 class="text-xl font-semibold text-es-text-primary dark:text-es-text-primary-dark">
                    {{ t('about.visionMission.visionTitle') }}
                  </h4>
                </div>
                <p class="text-es-text-secondary dark:text-es-text-secondary-dark">
                  {{ t('about.visionMission.visionDescription') }}
                </p>
              </div>
              <div>
                <div class="flex items-center gap-3 mb-3">
                  <span class="text-3xl">🚀</span>
                  <h4 class="text-xl font-semibold text-es-text-primary dark:text-es-text-primary-dark">
                    {{ t('about.visionMission.missionTitle') }}
                  </h4>
                </div>
                <ul class="space-y-2 text-es-text-secondary dark:text-es-text-secondary-dark">
                  <li
                    v-for="(item, index) in missionItems"
                    :key="index"
                    class="flex items-start gap-2"
                  >
                    <span class="text-es-accent-primary dark:text-es-accent-primary-dark mt-1">✓</span>
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-12 md:py-16 bg-es-bg-secondary dark:bg-es-bg-secondary-dark">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div class="text-center">
            <div class="text-4xl md:text-5xl font-bold text-es-accent-primary dark:text-es-accent-primary-dark mb-2">
              150+
            </div>
            <div class="text-es-text-secondary dark:text-es-text-secondary-dark">
              {{ t('about.stats.projectsCompleted') }}
            </div>
          </div>
          <div class="text-center">
            <div class="text-4xl md:text-5xl font-bold text-es-accent-primary dark:text-es-accent-primary-dark mb-2">
              80+
            </div>
            <div class="text-es-text-secondary dark:text-es-text-secondary-dark">
              {{ t('about.stats.clientCollaborations') }}
            </div>
          </div>
          <div class="text-center">
            <div class="text-4xl md:text-5xl font-bold text-es-accent-primary dark:text-es-accent-primary-dark mb-2">
              10+
            </div>
            <div class="text-es-text-secondary dark:text-es-text-secondary-dark">
              {{ t('about.stats.yearsExperience') }}
            </div>
          </div>
          <div class="text-center">
            <div class="text-4xl md:text-5xl font-bold text-es-accent-primary dark:text-es-accent-primary-dark mb-2">
              25+
            </div>
            <div class="text-es-text-secondary dark:text-es-text-secondary-dark">
              {{ t('about.stats.coreTalent') }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Founders Section -->
    <section class="py-12 md:py-16">
      <div class="container mx-auto px-4">
        <div class="max-w-3xl mx-auto text-center bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-2xl p-8 md:p-10">
          <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-es-bg-primary dark:bg-es-bg-primary-dark overflow-hidden flex items-center justify-center">
            <img
              src="/images/team.jpg"
              :alt="t('about.founders.title')"
              class="w-full h-full object-cover"
            >
          </div>
          <h2 class="text-3xl md:text-4xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">
            {{ t('about.founders.title') }}
          </h2>
          <p class="text-es-text-secondary dark:text-es-text-secondary-dark leading-relaxed">
            {{ t('about.founders.description') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="py-12 md:py-16 bg-es-bg-secondary dark:bg-es-bg-secondary-dark">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="text-3xl md:text-4xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">
            {{ t('about.values.title') }}
          </h2>
          <p class="text-es-text-secondary dark:text-es-text-secondary-dark max-w-2xl mx-auto">
            {{ t('about.values.description') }}
          </p>
        </div>
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="value in values"
            :key="value.title"
            class="text-center"
          >
            <div class="text-5xl mb-4">
              {{ value.icon }}
            </div>
            <h3 class="text-xl font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-3">
              {{ value.title }}
            </h3>
            <p class="text-es-text-secondary dark:text-es-text-secondary-dark">
              {{ value.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 md:py-24 bg-es-accent-primary dark:bg-es-accent-primary-dark">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-es-text-inverse dark:text-es-text-inverse-dark mb-4">
          {{ t('about.cta.title') }}
        </h2>
        <p class="text-es-text-inverse/90 dark:text-es-text-inverse-dark/90 text-lg mb-8 max-w-2xl mx-auto">
          {{ t('about.cta.description') }}
        </p>
        <NuxtLink
          :to="localePath('/contact-us')"
          class="inline-flex items-center px-8 py-4 bg-es-bg-inverse dark:bg-es-bg-inverse-dark text-es-text-primary dark:text-es-text-primary-dark rounded-lg font-semibold hover:bg-es-bg-primary dark:hover:bg-es-bg-primary-dark transition-colors"
        >
          {{ t('about.cta.button') }}
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

// SEO Meta
useSeoMeta({
  title: t('about.seo.title'),
  description: t('about.seo.description'),
  ogTitle: t('about.seo.ogTitle'),
  ogDescription: t('about.seo.ogDescription'),
  ogImage: '/images/about-esperion-agency.jpg',
  ogUrl: () => `https://esperion.id/${localePath('/about').split('/')[1] || 'id'}/about`,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: t('about.seo.ogTitle'),
  twitterDescription: t('about.seo.ogDescription'),
  twitterImage: '/images/about-esperion-agency.jpg'
})

/*
// Define schema for the about page
const pageUrl = computed(() => {
  const locale = localePath('/about').split('/')[1] || 'id'
  return `https://esperion.id/${locale}/about`
})

useSchemaOrg([
  defineWebPage({
    '@type': 'AboutPage',
    'name': t('about.seo.schemaName'),
    'description': t('about.seo.schemaDescription'),
    'url': pageUrl.value,
    'dateModified': new Date().toISOString()
  }),
  defineBreadcrumb({
    itemListElement: [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': t('breadcrumb.home'),
        'item': () => {
          const locale = localePath('/about').split('/')[1] || 'id'
          return `https://esperion.id/${locale}`
        }
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': t('breadcrumb.about'),
        'item': pageUrl.value
      }
    ]
  })
])
*/

const missionItems = computed(() => [
  t('about.visionMission.missionItems.0'),
  t('about.visionMission.missionItems.1'),
  t('about.visionMission.missionItems.2'),
  t('about.visionMission.missionItems.3')
])

const values = computed(() => [
  {
    icon: t('about.values.items.0.icon'),
    title: t('about.values.items.0.title'),
    description: t('about.values.items.0.description')
  },
  {
    icon: t('about.values.items.1.icon'),
    title: t('about.values.items.1.title'),
    description: t('about.values.items.1.description')
  },
  {
    icon: t('about.values.items.2.icon'),
    title: t('about.values.items.2.title'),
    description: t('about.values.items.2.description')
  },
  {
    icon: t('about.values.items.3.icon'),
    title: t('about.values.items.3.title'),
    description: t('about.values.items.3.description')
  }
])
</script>
