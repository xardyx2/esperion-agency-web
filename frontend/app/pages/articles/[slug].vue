<template>
  <div class="min-h-screen bg-es-bg-primary dark:bg-es-bg-primary-dark">
    <article class="max-w-4xl mx-auto px-4 py-12">
      <!-- Category Badge -->
      <div class="mb-6">
        <span class="px-4 py-1 bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 text-es-accent-primary dark:text-es-accent-primary-dark text-sm font-semibold rounded-full">
          {{ article.category }}
        </span>
      </div>

      <!-- Title -->
      <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-6 leading-tight">
        {{ article.title }}
      </h1>

      <!-- Meta Info -->
      <div class="flex flex-wrap items-center gap-6 text-es-text-secondary dark:text-es-text-secondary-dark mb-8 pb-8 border-b border-es-border dark:border-es-border-dark">
        <div class="flex items-center gap-2">
          <span class="text-xl">👤</span>
          <span>{{ article.author }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xl">📅</span>
          <span>{{ formatDate(article.published_at) }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xl">⏱️</span>
          <span>{{ article.read_time }} menit baca</span>
        </div>
      </div>

      <!-- Hero Image -->
      <div class="mb-12">
        <img :src="article.image" :alt="article.title" class="w-full rounded-xl shadow-lg" />
      </div>

      <!-- Article Content -->
      <div class="prose prose-lg dark:prose-invert max-w-none mb-12">
        <p class="text-xl text-es-text-secondary dark:text-es-text-secondary-dark leading-relaxed mb-8">
          {{ article.excerpt_id }}
        </p>
        
        <h2 class="text-2xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">Ringkasan Utama</h2>
        <p class="text-es-text-secondary dark:text-es-text-secondary-dark leading-relaxed mb-6">
          Artikel ini merangkum pokok bahasan yang paling relevan untuk pengambilan keputusan digital, lalu menyoroti langkah awal yang bisa diprioritaskan oleh tim internal.
        </p>

        <h2 class="text-2xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">Poin Penting</h2>
        <p class="text-es-text-secondary dark:text-es-text-secondary-dark leading-relaxed mb-6">
          Fokus utamanya adalah membantu tim melihat prioritas dengan lebih jelas sebelum masuk ke tahap implementasi yang lebih detail.
        </p>
        <ul class="space-y-2 mb-6">
          <li class="flex items-start gap-2 text-es-text-secondary dark:text-es-text-secondary-dark">
            <span class="text-es-accent-primary dark:text-es-accent-primary-dark mt-1">✓</span>
            <span>Prioritaskan kejelasan tujuan bisnis sebelum memilih kanal atau teknologi.</span>
          </li>
          <li class="flex items-start gap-2 text-es-text-secondary dark:text-es-text-secondary-dark">
            <span class="text-es-accent-primary dark:text-es-accent-primary-dark mt-1">✓</span>
            <span>Pastikan pengalaman pengguna tetap konsisten dengan pesan brand di setiap touchpoint.</span>
          </li>
          <li class="flex items-start gap-2 text-es-text-secondary dark:text-es-text-secondary-dark">
            <span class="text-es-accent-primary dark:text-es-accent-primary-dark mt-1">✓</span>
            <span>Gunakan pengukuran yang sederhana dan relevan agar perbaikan berikutnya lebih terarah.</span>
          </li>
        </ul>

        <h2 class="text-2xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">Penutup</h2>
        <p class="text-es-text-secondary dark:text-es-text-secondary-dark leading-relaxed">
          Jika Anda ingin menurunkan pembahasan ini menjadi rencana kerja yang lebih konkret, tim Esperion dapat membantu menyusun prioritas yang sesuai dengan kondisi bisnis saat ini.
        </p>
      </div>

      <!-- Share Section -->
      <div class="mb-12 p-6 bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl">
        <h3 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-4">Bagikan artikel ini</h3>
        <div class="flex gap-4">
          <button class="px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:opacity-90 transition-opacity">Facebook</button>
          <button class="px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:opacity-90 transition-opacity">Twitter</button>
          <button class="px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:opacity-90 transition-opacity">LinkedIn</button>
          <button class="px-4 py-2 bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark text-es-text-primary dark:text-es-text-primary-dark rounded-lg hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors">Salin Tautan</button>
        </div>
      </div>

      <!-- Author Bio -->
      <div class="mb-12 p-6 bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl">
        <div class="flex items-start gap-4">
          <div class="w-16 h-16 rounded-full bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 flex items-center justify-center text-2xl">👤</div>
          <div>
            <h3 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-1">{{ article.author }}</h3>
            <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm">Ditulis oleh tim editorial Esperion untuk merangkum insight praktis yang relevan bagi kebutuhan digital bisnis.</p>
          </div>
        </div>
      </div>
    </article>

    <!-- Related Articles -->
    <section class="py-12 md:py-16 bg-es-bg-secondary dark:bg-es-bg-secondary-dark">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-8">Artikel Terkait</h2>
        <div class="grid md:grid-cols-3 gap-6">
          <NuxtLink v-for="related in relatedArticles" :key="related.id" :to="localePath(`/articles/${related.slug_id}`)" class="group bg-es-bg-primary dark:bg-es-bg-primary-dark rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
            <img :src="related.image" :alt="related.title" class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
            <div class="p-6">
              <span class="px-3 py-1 bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 text-es-accent-primary dark:text-es-accent-primary-dark text-xs rounded-full">{{ related.category }}</span>
              <h3 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark mt-3 mb-2 line-clamp-2 group-hover:text-es-accent-primary dark:group-hover:text-es-accent-primary-dark transition-colors">{{ related.title }}</h3>
              <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm line-clamp-2">{{ related.excerpt_id }}</p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Newsletter CTA -->
    <section class="py-16 md:py-24 bg-es-accent-primary dark:bg-es-accent-primary-dark">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl md:text-4xl font-bold text-es-text-inverse dark:text-es-text-inverse-dark mb-4">Ingin membaca insight lainnya?</h2>
        <p class="text-es-text-inverse/90 dark:text-es-text-inverse-dark/90 text-lg mb-8 max-w-2xl mx-auto">Jelajahi artikel lain dari tim Esperion untuk memahami prioritas digital dengan lebih terarah.</p>
        <NuxtLink :to="localePath('/articles')" class="inline-flex items-center px-8 py-4 bg-es-bg-inverse dark:bg-es-bg-inverse-dark text-es-text-primary dark:text-es-text-primary-dark rounded-lg font-semibold hover:bg-es-bg-primary dark:hover:bg-es-bg-primary-dark transition-colors">Lihat Semua Artikel</NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { findPublicArticleBySlug, getRelatedArticles } from '../../data/public-content';

const route = useRoute();
const localePath = useLocalePath();
const { locale } = useI18n();

const slugParam = computed(() => {
  const raw = route.params.slug;

  if (Array.isArray(raw)) {
    return raw[0] ?? '';
  }

  return typeof raw === 'string' ? raw : '';
});

const article = computed(() => {
  const record = findPublicArticleBySlug(slugParam.value);

  if (!record) {
    throw createError({ statusCode: 404, statusMessage: 'Article not found' });
  }

  return record;
});

const relatedArticles = computed(() => getRelatedArticles(article.value.slug_id, 3));

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const articleKeywords = computed(() => {
  return article.value.title
    .toLowerCase()
    .replace(/[^\w\s]|_/g, '')
    .replace(/\s+/g, ' ')
    .split(' ')
    .slice(0, 5)
    .join(',');
});

const localePrefix = computed(() => (locale.value === 'en' ? 'en' : 'id'));
const pageUrl = computed(() => `https://esperion.id/${localePrefix.value}/articles/${article.value.slug_id}`);
const imageUrl = computed(() => `https://esperion.id${article.value.image}`);

useSeoMeta({
  title: () => `${article.value.title} | Esperion Digital Agency`,
  description: () => article.value.excerpt_id,
  ogTitle: () => `${article.value.title} | Esperion Digital Agency`,
  ogDescription: () => article.value.excerpt_id,
  ogImage: () => imageUrl.value,
  ogUrl: () => pageUrl.value,
  ogType: 'article',
  articleAuthor: () => [article.value.author],
  articlePublishedTime: () => article.value.published_at,
  articleModifiedTime: () => new Date().toISOString(),
  articleSection: () => article.value.category,
  articleTag: () => [articleKeywords.value],
  twitterCard: 'summary_large_image',
  twitterTitle: () => `${article.value.title} | Esperion Digital Agency`,
  twitterDescription: () => article.value.excerpt_id,
  twitterImage: () => imageUrl.value,
  ogLocale: () => (locale.value === 'en' ? 'en_US' : 'id_ID')
});

useSchemaOrg([
  defineArticle({
    '@type': ['Article', 'BlogPosting'],
    headline: article.value.title,
    alternativeHeadline: article.value.excerpt_id,
    description: article.value.excerpt_id,
    author: {
      '@type': 'Person',
      name: article.value.author,
      url: `https://esperion.id/${localePrefix.value}/experts/${article.value.author.toLowerCase().replace(/\s+/g, '-')}`
    },
    publisher: {
      '@type': 'Organization',
      name: 'Esperion Digital Agency',
      legalName: 'PT Esperion Teknologi Digital',
      url: `https://esperion.id/${localePrefix.value}`,
      logo: {
        '@type': 'ImageObject',
        url: '/placeholders/first-party/brand-mark-required.svg',
        width: 300,
        height: 150
      }
    },
    dateModified: new Date().toISOString(),
    datePublished: article.value.published_at,
    image: imageUrl.value,
    thumbnailUrl: imageUrl.value,
    wordCount: 1200,
    articleBody: `${article.value.excerpt_id}. Content about ${article.value.title} discussed in detail with practical examples and implementation guides.`,
    articleSection: [article.value.category],
    keywords: [articleKeywords.value],
    url: pageUrl.value,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl.value
    }
  }),
  defineWebPage({
    name: article.value.title,
    description: article.value.excerpt_id,
    url: pageUrl.value,
    dateModified: new Date().toISOString(),
    datePublished: article.value.published_at
  }),
  defineBreadcrumb({
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `https://esperion.id/${localePrefix.value}`
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Artikel',
        item: `https://esperion.id/${localePrefix.value}/articles`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.value.title,
        item: pageUrl.value
      }
    ]
  })
]);
</script>
