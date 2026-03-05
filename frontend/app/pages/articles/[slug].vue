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
          <span>{{ article.read_time }} min read</span>
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
        
        <h2 class="text-2xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">Introduction</h2>
        <p class="text-es-text-secondary dark:text-es-text-secondary-dark leading-relaxed mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
        </p>

        <h2 class="text-2xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">Key Points</h2>
        <p class="text-es-text-secondary dark:text-es-text-secondary-dark leading-relaxed mb-6">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
        </p>
        <ul class="space-y-2 mb-6">
          <li class="flex items-start gap-2 text-es-text-secondary dark:text-es-text-secondary-dark">
            <span class="text-es-accent-primary dark:text-es-accent-primary-dark mt-1">✓</span>
            <span>First key point with detailed explanation</span>
          </li>
          <li class="flex items-start gap-2 text-es-text-secondary dark:text-es-text-secondary-dark">
            <span class="text-es-accent-primary dark:text-es-accent-primary-dark mt-1">✓</span>
            <span>Second key point with detailed explanation</span>
          </li>
          <li class="flex items-start gap-2 text-es-text-secondary dark:text-es-text-secondary-dark">
            <span class="text-es-accent-primary dark:text-es-accent-primary-dark mt-1">✓</span>
            <span>Third key point with detailed explanation</span>
          </li>
        </ul>

        <h2 class="text-2xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">Conclusion</h2>
        <p class="text-es-text-secondary dark:text-es-text-secondary-dark leading-relaxed">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
        </p>
      </div>

      <!-- Share Section -->
      <div class="mb-12 p-6 bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl">
        <h3 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-4">Share this article</h3>
        <div class="flex gap-4">
          <button class="px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:opacity-90 transition-opacity">Facebook</button>
          <button class="px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:opacity-90 transition-opacity">Twitter</button>
          <button class="px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:opacity-90 transition-opacity">LinkedIn</button>
          <button class="px-4 py-2 bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark text-es-text-primary dark:text-es-text-primary-dark rounded-lg hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors">Copy Link</button>
        </div>
      </div>

      <!-- Author Bio -->
      <div class="mb-12 p-6 bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl">
        <div class="flex items-start gap-4">
          <div class="w-16 h-16 rounded-full bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 flex items-center justify-center text-2xl">👤</div>
          <div>
            <h3 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-1">{{ article.author }}</h3>
            <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm">Digital marketing expert with 10+ years of experience helping businesses grow their online presence.</p>
          </div>
        </div>
      </div>
    </article>

    <!-- Related Articles -->
    <section class="py-12 md:py-16 bg-es-bg-secondary dark:bg-es-bg-secondary-dark">
      <div class="container mx-auto px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-8">Related Articles</h2>
        <div class="grid md:grid-cols-3 gap-6">
          <NuxtLink v-for="related in relatedArticles" :key="related.id" :to="`/articles/${related.slug_id}`" class="group bg-es-bg-primary dark:bg-es-bg-primary-dark rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
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
        <h2 class="text-3xl md:text-4xl font-bold text-es-text-inverse dark:text-es-text-inverse-dark mb-4">Enjoyed this article?</h2>
        <p class="text-es-text-inverse/90 dark:text-es-text-inverse-dark/90 text-lg mb-8 max-w-2xl mx-auto">Subscribe to our newsletter and get the latest articles delivered straight to your inbox</p>
        <NuxtLink to="/articles" class="inline-flex items-center px-8 py-4 bg-es-bg-inverse dark:bg-es-bg-inverse-dark text-es-text-primary dark:text-es-text-primary-dark rounded-lg font-semibold hover:bg-es-bg-primary dark:hover:bg-es-bg-primary-dark transition-colors">Browse All Articles</NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
useSeoMeta({ title: 'Article - Esperion Digital Agency', description: 'Read our latest insights and updates.' });

const article = ref({
  slug_id: route.params.slug,
  title: 'Digital Marketing Trends to Watch in 2024',
  excerpt_id: 'Discover the latest trends shaping the future of digital marketing and how to leverage them for your business.',
  category: 'Marketing',
  image: '/articles/article-1.jpg',
  author: 'John Doe',
  published_at: '2024-01-15',
  read_time: 8,
});

const relatedArticles = [
  { id: 2, slug_id: 'ui-ux-best-practices', title: 'UI/UX Best Practices for Modern Websites', excerpt_id: 'Learn the essential principles of user interface design.', category: 'Design', image: '/articles/article-2.jpg' },
  { id: 5, slug_id: 'seo-basics-2024', title: 'SEO Basics Every Business Should Know', excerpt_id: 'Essential SEO strategies to improve your online visibility.', category: 'Marketing', image: '/articles/article-5.jpg' },
  { id: 9, slug_id: 'social-media-marketing', title: 'Social Media Marketing Best Practices', excerpt_id: 'Maximize your social media presence with these strategies.', category: 'Marketing', image: '/articles/article-9.jpg' },
];

const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
</script>