<template>
  <div class="min-h-screen bg-es-bg-primary dark:bg-es-bg-primary-dark">
    <!-- Banner Section -->
    <section class="relative h-[300px] md:h-[400px] bg-es-bg-secondary dark:bg-es-bg-secondary-dark">
      <div class="absolute inset-0 bg-gradient-to-r from-es-accent-primary/20 to-es-accent-primary/10 dark:from-es-accent-primary-dark/20 dark:to-es-accent-primary-dark/10"></div>
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="container mx-auto px-4 text-center">
          <h1 class="text-4xl md:text-5xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">
            Articles
          </h1>
          <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-lg max-w-2xl mx-auto">
            Insights, tips, and updates from our team
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
                placeholder="Search articles..."
                class="w-64 px-4 py-2 pl-10 bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-secondary dark:text-es-text-secondary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark"
              />
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-es-text-secondary dark:text-es-text-secondary-dark">🔍</span>
            </div>

            <button
              v-if="selectedCategory || searchQuery"
              @click="clearFilters"
              class="px-4 py-2 text-es-accent-primary dark:text-es-accent-primary-dark hover:underline text-sm font-medium"
            >
              Clear
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
            Showing {{ filteredArticles.length }} of {{ articles.length }} articles
          </p>
        </div>

        <!-- Empty State -->
        <div v-if="filteredArticles.length === 0" class="text-center py-16">
          <div class="text-6xl mb-4">📝</div>
          <h3 class="text-xl font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-2">
            No articles found
          </h3>
          <p class="text-es-text-secondary dark:text-es-text-secondary-dark mb-4">
            Try adjusting your search or filters
          </p>
          <button
            @click="clearFilters"
            class="px-6 py-2 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-medium hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors"
          >
            Clear All Filters
          </button>
        </div>

        <!-- Articles Grid -->
        <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NuxtLink
            v-for="article in filteredArticles"
            :key="article.id"
            :to="`/articles/${article.slug_id}`"
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
                Read More <span class="ml-1 group-hover:translate-x-1 transition-transform">→</span>
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
            Load More Articles
          </button>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="py-16 md:py-24 bg-es-bg-secondary dark:bg-es-bg-secondary-dark">
      <div class="container mx-auto px-4">
        <div class="max-w-2xl mx-auto text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p class="text-es-text-secondary dark:text-es-text-secondary-dark mb-8">
            Get the latest articles and updates delivered straight to your inbox
          </p>
          <form @submit.prevent="subscribe" class="flex flex-col sm:flex-row gap-4">
            <input
              v-model="email"
              type="email"
              placeholder="Enter your email"
              required
              class="flex-1 px-6 py-4 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:focus:ring-es-accent-primary-dark"
            />
            <button
              type="submit"
              class="px-8 py-4 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// SEO Meta
useSeoMeta({
  title: 'Articles - Esperion Digital Agency Blog',
  description: 'Read our latest articles on web development, design, digital marketing, and more.',
  ogTitle: 'Articles Blog',
  ogDescription: 'Insights and updates from our team.',
});

// State
const selectedCategory = ref('');
const searchQuery = ref('');
const visibleCount = ref(6);
const email = ref('');

// All Categories for filter
const allCategories = [
  { value: '', label: 'All Categories' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Design', label: 'Design' },
  { value: 'Development', label: 'Development' },
  { value: 'E-Commerce', label: 'E-Commerce' },
  { value: 'Business', label: 'Business' },
];

// Articles data
const articles = ref([
  { 
    id: 1, 
    slug_id: 'digital-marketing-trends-2024', 
    title: 'Digital Marketing Trends to Watch in 2024', 
    excerpt_id: 'Discover the latest trends shaping the future of digital marketing and how to leverage them for your business.',
    category: 'Marketing', 
    image: '/articles/article-1.jpg',
    author: 'John Doe',
    published_at: '2024-01-15',
  },
  { 
    id: 2, 
    slug_id: 'ui-ux-best-practices', 
    title: 'UI/UX Best Practices for Modern Websites', 
    excerpt_id: 'Learn the essential principles of user interface and experience design that drive engagement.',
    category: 'Design', 
    image: '/articles/article-2.jpg',
    author: 'Jane Smith',
    published_at: '2024-01-10',
  },
  { 
    id: 3, 
    slug_id: 'ecommerce-optimization-guide', 
    title: 'Complete Guide to E-Commerce Optimization', 
    excerpt_id: 'Proven strategies to increase conversions and boost your online store performance.',
    category: 'E-Commerce', 
    image: '/articles/article-3.jpg',
    author: 'Mike Johnson',
    published_at: '2024-01-05',
  },
  { 
    id: 4, 
    slug_id: 'react-vs-vue-2024', 
    title: 'React vs Vue: Which Framework to Choose in 2024?', 
    excerpt_id: 'A comprehensive comparison of React and Vue for your next web project.',
    category: 'Development', 
    image: '/articles/article-4.jpg',
    author: 'Sarah Lee',
    published_at: '2024-01-01',
  },
  { 
    id: 5, 
    slug_id: 'seo-basics-2024', 
    title: 'SEO Basics Every Business Should Know', 
    excerpt_id: 'Essential SEO strategies to improve your online visibility and drive organic traffic.',
    category: 'Marketing', 
    image: '/articles/article-5.jpg',
    author: 'John Doe',
    published_at: '2023-12-28',
  },
  { 
    id: 6, 
    slug_id: 'mobile-first-design', 
    title: 'Why Mobile-First Design Matters', 
    excerpt_id: 'Understanding the importance of mobile-first design in todays digital landscape.',
    category: 'Design', 
    image: '/articles/article-6.jpg',
    author: 'Jane Smith',
    published_at: '2023-12-25',
  },
  { 
    id: 7, 
    slug_id: 'business-growth-strategies', 
    title: '10 Strategies for Business Growth', 
    excerpt_id: 'Practical strategies to scale your business and increase revenue.',
    category: 'Business', 
    image: '/articles/article-7.jpg',
    author: 'Mike Johnson',
    published_at: '2023-12-20',
  },
  { 
    id: 8, 
    slug_id: 'web-performance-optimization', 
    title: 'Web Performance Optimization Tips', 
    excerpt_id: 'Learn how to make your website faster and improve user experience.',
    category: 'Development', 
    image: '/articles/article-8.jpg',
    author: 'Sarah Lee',
    published_at: '2023-12-15',
  },
  { 
    id: 9, 
    slug_id: 'social-media-marketing', 
    title: 'Social Media Marketing Best Practices', 
    excerpt_id: 'Maximize your social media presence with these proven strategies.',
    category: 'Marketing', 
    image: '/articles/article-9.jpg',
    author: 'John Doe',
    published_at: '2023-12-10',
  },
  { 
    id: 10, 
    slug_id: 'branding-guide', 
    title: 'Complete Branding Guide for Startups', 
    excerpt_id: 'Build a strong brand identity from scratch with this comprehensive guide.',
    category: 'Business', 
    image: '/articles/article-10.jpg',
    author: 'Jane Smith',
    published_at: '2023-12-05',
  },
  { 
    id: 11, 
    slug_id: 'accessibility-web', 
    title: 'Web Accessibility: Why It Matters', 
    excerpt_id: 'Making your website accessible to everyone is not just good practice, its essential.',
    category: 'Development', 
    image: '/articles/article-11.jpg',
    author: 'Sarah Lee',
    published_at: '2023-12-01',
  },
  { 
    id: 12, 
    slug_id: 'color-theory-design', 
    title: 'Color Theory for Web Designers', 
    excerpt_id: 'Understanding color psychology and how to use it effectively in your designs.',
    category: 'Design', 
    image: '/articles/article-12.jpg',
    author: 'Jane Smith',
    published_at: '2023-11-28',
  },
]);

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
  // TODO: Implement newsletter subscription
  alert('Thank you for subscribing!');
  email.value = '';
};
</script>