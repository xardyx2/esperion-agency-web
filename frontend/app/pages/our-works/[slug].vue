<template>
  <div class="min-h-screen bg-es-bg-primary dark:bg-es-bg-primary-dark">
    <!-- Hero Image -->
    <section class="relative h-[400px] md:h-[500px]">
      <img :src="work.image" :alt="work.title" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-es-bg-primary dark:from-es-bg-primary-dark to-transparent"></div>
    </section>

    <!-- Content -->
    <section class="py-12 md:py-16 -mt-32 relative z-10">
      <div class="container mx-auto px-4">
        <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-2xl p-8 md:p-12 shadow-xl">
          <!-- Header -->
          <div class="flex flex-wrap items-center gap-4 mb-6">
            <span class="px-4 py-1 bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 text-es-accent-primary dark:text-es-accent-primary-dark rounded-full text-sm font-medium">
              {{ work.service }}
            </span>
            <span class="px-4 py-1 bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark text-es-text-secondary dark:text-es-text-secondary-dark rounded-full text-sm">
              {{ work.platform }}
            </span>
            <span v-if="work.featured" class="px-4 py-1 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-full text-sm font-semibold">
              {{ t('works.detail.featuredProject') }}
            </span>
          </div>

          <h1 class="text-3xl md:text-4xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-6">
            {{ work.title }}
          </h1>

          <div class="flex flex-wrap items-center gap-6 text-es-text-secondary dark:text-es-text-secondary-dark mb-8">
            <div class="flex items-center gap-2">
              <span>👤</span>
              <span>{{ t('works.detail.client') }}: <strong class="text-es-text-primary dark:text-es-text-primary-dark">{{ work.client_name }}</strong></span>
            </div>
          </div>

          <!-- Metrics -->
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12 p-6 bg-es-bg-primary dark:bg-es-bg-primary-dark rounded-xl">
            <div v-for="metric in work.metrics" :key="metric.label" class="text-center">
              <div class="text-2xl md:text-3xl font-bold text-es-accent-primary dark:text-es-accent-primary-dark mb-1">
                {{ metric.value }}{{ metric.suffix }}
              </div>
              <div class="text-xs md:text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ metric.label }}
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="prose prose-lg dark:prose-invert max-w-none mb-12">
            <h2 class="text-2xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">{{ t('works.detail.projectSummary') }}</h2>
            <p class="text-es-text-secondary dark:text-es-text-secondary-dark leading-relaxed">
              {{ work.description }}
            </p>
            <p class="text-es-text-secondary dark:text-es-text-secondary-dark leading-relaxed">
              {{ t('works.detail.projectDescription') }}
            </p>
          </div>

          <!-- Key Features -->
          <div class="mb-12">
            <h2 class="text-2xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-6">{{ t('works.detail.keyFeatures') }}</h2>
            <div class="grid md:grid-cols-2 gap-4">
              <div v-for="feature in features" :key="feature" class="flex items-start gap-3">
                <span class="text-es-accent-primary dark:text-es-accent-primary-dark mt-1">✓</span>
                <span class="text-es-text-secondary dark:text-es-text-secondary-dark">{{ feature }}</span>
              </div>
            </div>
          </div>

          <!-- Gallery -->
          <div class="mb-12">
            <h2 class="text-2xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-6">{{ t('works.detail.projectGallery') }}</h2>
            <div class="grid md:grid-cols-2 gap-4">
              <img v-for="img in gallery" :key="img" :src="img" :alt="work.title" class="rounded-lg hover:shadow-lg transition-shadow" />
            </div>
          </div>

          <!-- CTA -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <NuxtLink
              :to="localePath('/contact-us')"
              class="inline-flex justify-center items-center px-8 py-4 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors"
            >
              {{ t('works.detail.startProjectDiscussion') }}
            </NuxtLink>
            <NuxtLink
              :to="localePath('/our-works')"
              class="inline-flex justify-center items-center px-8 py-4 border-2 border-es-border dark:border-es-border-dark text-es-text-primary dark:text-es-text-primary-dark rounded-lg font-semibold hover:border-es-accent-primary dark:hover:border-es-accent-primary-dark transition-colors"
            >
              {{ t('works.detail.viewAllPortfolio') }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Related Works -->
    <section class="py-12 md:py-16 bg-es-bg-secondary dark:bg-es-bg-secondary-dark">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-8">
          {{ t('works.detail.relatedWorks') }}
        </h2>
        <div class="grid md:grid-cols-3 gap-6">
          <NuxtLink
            v-for="related in relatedWorks"
            :key="related.id"
            :to="localePath(`/our-works/${related.slug}`)"
            class="group bg-es-bg-primary dark:bg-es-bg-primary-dark rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
          >
            <img :src="related.image" :alt="related.title" class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
            <div class="p-6">
              <h3 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-2 group-hover:text-es-accent-primary dark:group-hover:text-es-accent-primary-dark transition-colors">
                {{ related.title }}
              </h3>
              <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm">
                {{ related.service }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { findPublicWorkBySlug, getRelatedWorks } from '../../data/public-content';

const route = useRoute();
const localePath = useLocalePath();
const { t, locale } = useI18n();

const slugParam = computed(() => {
  const raw = route.params.slug;

  if (Array.isArray(raw)) {
    return raw[0] ?? '';
  }

  return typeof raw === 'string' ? raw : '';
});

const work = computed(() => {
  const record = findPublicWorkBySlug(slugParam.value);

  if (!record) {
    throw createError({ statusCode: 404, statusMessage: 'Work not found' });
  }

  return record;
});

const features = computed(() => work.value.features);
const gallery = computed(() => work.value.gallery);
const relatedWorks = computed(() => getRelatedWorks(work.value.slug, 3));

const localePrefix = computed(() => (locale.value === 'en' ? 'en' : 'id'));
const pageUrl = computed(() => `https://esperion.id/${localePrefix.value}/our-works/${work.value.slug}`);

useSeoMeta({
  title: () => t('works.detail.seo.title', { title: work.value.title }),
  description: () => t('works.detail.seo.description', { description: work.value.description }),
  ogTitle: () => `${work.value.title} - Esperion`,
  ogDescription: () => work.value.description,
  ogImage: () => work.value.image,
  ogUrl: () => pageUrl.value,
  ogType: 'article',
  twitterCard: 'summary_large_image',
  twitterTitle: () => `${work.value.title} - Esperion`,
  twitterDescription: () => work.value.description,
  twitterImage: () => work.value.image,
  ogLocale: () => (locale.value === 'en' ? 'en_US' : 'id_ID')
});

useSchemaOrg([
  defineWebPage({
    '@type': 'ItemPage',
    name: () => work.value.title,
    description: () => work.value.description,
    url: pageUrl.value,
    image: () => work.value.image,
    dateModified: new Date().toISOString()
  }),
  defineBreadcrumb({
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('breadcrumb.home'),
        item: `https://esperion.id/${localePrefix.value}`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('breadcrumb.works'),
        item: `https://esperion.id/${localePrefix.value}/our-works`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: () => work.value.title,
        item: pageUrl.value
      }
    ]
  })
]);
</script>
