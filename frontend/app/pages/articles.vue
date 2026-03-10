<template>
  <div class="min-h-screen bg-es-bg-primary dark:bg-es-bg-primary-dark">
    <!-- Banner Section -->
    <section class="relative h-[300px] md:h-[400px] bg-es-bg-secondary dark:bg-es-bg-secondary-dark">
      <div class="absolute inset-0 bg-gradient-to-r from-es-accent-primary/20 to-es-accent-primary/10 dark:from-es-accent-primary-dark/20 dark:to-es-accent-primary-dark/10"></div>
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="container mx-auto px-4 text-center">
          <h1 class="text-4xl md:text-5xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">
            {{ t('articles.banner.title') }}
          </h1>
          <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-lg max-w-2xl mx-auto">
            {{ t('articles.banner.description') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Filter & Search Section -->
    <section class="py-8 border-b border-es-border dark:border-es-border-dark sticky top-16 z-40 bg-es-bg-primary dark:bg-es-bg-primary-dark">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
          <!-- Category Filter Buttons -->
          <div class="flex flex-wrap gap-2">
            <button
              v-for="category in allCategories"
              :key="category.value"
              @click="selectedCategory = category.value"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              :class="selectedCategory === category.value 
                ? 'bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark' 
                : 'bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark text-es-text-secondary dark:text-es-text-secondary-dark hover:bg-es-accent-primary/10 dark:hover:bg-es-accent-primary-dark/10'"
            >
              {{ category.label }}
            </button>
          </div>

          <!-- Search -->
          <div class="flex items-center gap-2">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="t('articles.search.placeholder')"
                class="w-64 px-4 py-2 pl-10 bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-secondary dark:text-es-text-secondary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark"
              />
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-es-text-secondary dark:text-es-text-secondary-dark">🔍</span>
            </div>

            <button
              v-if="selectedCategory || searchQuery"
              @click="clearFilters"
              class="px-4 py-2 text-es-accent-primary dark:text-es-accent-primary-dark hover:underline text-sm font-medium"
            >
              {{ t('common.reset') }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Articles Grid -->
    <section class="py-12 md:py-16">
      <div class="container mx-auto px-4">
        <!-- Results Count -->
        <div class="mb-8">
          <p class="text-es-text-secondary dark:text-es-text-secondary-dark">
            Showing {{ filteredArticles.length }} dari {{ articles.length }} artikel
          </p>
        </div>

        <!-- Empty State -->
        <div v-if="filteredArticles.length === 0" class="text-center py-16">
          <div class="text-6xl mb-4">📝</div>
          <h3 class="text-xl font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-2">
            {{ t('articles.emptyState.title') }}
          </h3>
          <p class="text-es-text-secondary dark:text-es-text-secondary-dark mb-4">
            {{ t('articles.emptyState.description') }}
          </p>
          <button
            @click="clearFilters"
            class="px-6 py-2 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-medium hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors"
          >
            {{ t('common.reset') }} Semua Filter
          </button>
        </div>

        <!-- Articles Grid -->
        <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="article in filteredArticles"
            :key="article.id"
            :to="articlePath(article)"
            class="group bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
          >
            <div class="relative overflow-hidden">
              <img :src="article.image" :alt="article.title" class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
              <span class="absolute top-4 left-4 px-3 py-1 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark text-xs font-semibold rounded-full">
                {{ article.category }}
              </span>
            </div>
            <div class="p-6">
              <div class="flex items-center gap-4 text-xs text-es-text-secondary dark:text-es-text-secondary-dark mb-3">
                <span>📅 {{ formatDate(article.published_at) }}</span>
                <span>👤 {{ article.author }}</span>
              </div>
              <h3 class="text-xl font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-2 line-clamp-2 group-hover:text-es-accent-primary dark:group-hover:text-es-accent-primary-dark transition-colors">
                {{ article.title }}
              </h3>
              <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm line-clamp-3 mb-4">
                {{ article.excerpt_id }}
              </p>
              <div class="flex items-center text-es-accent-primary dark:text-es-accent-primary-dark text-sm font-medium">
                {{ t('common.readMore') }} <span class="ml-1 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Load More -->
        <div v-if="filteredArticles.length > visibleCount" class="text-center mt-12">
          <button
            @click="loadMore"
            class="px-8 py-3 bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark text-es-text-primary dark:text-es-text-primary-dark rounded-lg font-medium hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors"
          >
            {{ t('articles.loadMore.button') }}
          </button>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="py-16 md:py-24 bg-es-bg-secondary dark:bg-es-bg-secondary-dark">
      <div class="container mx-auto px-4">
        <div class="max-w-2xl mx-auto text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">
            {{ t('articles.newsletter.title') }}
          </h2>
          <p class="text-es-text-secondary dark:text-es-text-secondary-dark mb-8">
            {{ t('articles.newsletter.description') }}
          </p>
          <form @submit.prevent="subscribe" class="flex flex-col sm:flex-row gap-4">
            <input
              v-model="email"
              type="email"
              :placeholder="t('articles.newsletter.placeholder')"
              required
              class="flex-1 px-6 py-4 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark"
            />
<button
              type="submit"
              class="px-8 py-4 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors"
            >
              {{ t('articles.newsletter.subscribeButton') }}
            </button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { publicArticles } from '../data/public-content';

const localePath = useLocalePath();
const { t } = useI18n();
const { locale } = useI18n();

// SEO Meta
useSeoMeta({
  title: t('articles.banner.title') + ' - Insight Digital dari Esperion',
  description: 'Baca artikel, insight, dan pembelajaran seputar pengembangan web, desain, dan pemasaran digital dari tim Esperion.',
  ogTitle: t('articles.banner.title') + ' Esperion',
  ogDescription: 'Insight dan pembaruan dari tim Esperion.',
});

// State
const selectedCategory = ref('');
const searchQuery = ref('');
const visibleCount = ref(6);
const email = ref('');

// All Categories for filter
const allCategories = computed(() => [
  { value: '', label: t('articles.filters.allCategories') },
  { value: 'Marketing', label: t('articles.filters.marketing') },
  { value: 'Design', label: t('articles.filters.design') },
  { value: 'Development', label: t('articles.filters.development') },
  { value: 'E-Commerce', label: t('articles.filters.ecommerce') },
  { value: 'Business', label: t('articles.filters.business') },
]);

// Articles data
const articles = ref(publicArticles);

const articlePath = (article: (typeof publicArticles)[number]) => {
  const slug = locale.value === 'en' ? (article.slug_en || article.slug_id) : article.slug_id;
  return localePath(`/articles/${slug}`);
};

// Computed
const filteredArticles = computed(() => {
  return articles.value.filter(article => {
    const matchesCategory = !selectedCategory.value || article.category === selectedCategory.value;
    const matchesSearch = !searchQuery.value || 
      article.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      article.excerpt_id.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchesCategory && matchesSearch;
  });
});

// Methods
const clearFilters = () => {
  selectedCategory.value = '';
  searchQuery.value = '';
  visibleCount.value = 6;
};

const loadMore = () => {
  visibleCount.value += 6;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const subscribe = () => {
  alert(t('articles.newsletter.successMessage'));
  email.value = '';
};
</script>
