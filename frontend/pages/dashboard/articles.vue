<template>
  <div>
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-2">
          Articles
        </h1>
        <p class="text-es-text-secondary dark:text-es-text-secondary-dark">
          Manage your blog articles and content
        </p>
      </div>
      <NuxtLink
        to="/dashboard/articles/new"
        class="inline-flex items-center justify-center px-6 py-3 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors"
      >
        <span class="text-xl mr-2">+</span> New Article
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-4 mb-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search articles..."
          class="flex-1 px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
        >
        <select
          v-model="selectedCategory"
          class="px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
        >
          <option value="">
            All Categories
          </option>
          <option value="Marketing">
            Marketing
          </option>
          <option value="Design">
            Design
          </option>
          <option value="Development">
            Development
          </option>
        </select>
        <select
          v-model="selectedStatus"
          class="px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
        >
          <option value="">
            All Status
          </option>
          <option value="published">
            Published
          </option>
          <option value="draft">
            Draft
          </option>
        </select>
      </div>
    </div>

    <!-- Articles Table -->
    <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark uppercase tracking-wider">
                Title
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark uppercase tracking-wider">
                Category
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark uppercase tracking-wider">
                Date
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-es-border dark:divide-es-border-dark">
            <tr
              v-for="article in filteredArticles"
              :key="article.id"
              class="hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark"
            >
              <td class="px-6 py-4">
                <div>
                  <div class="font-medium text-es-text-primary dark:text-es-text-primary-dark">
                    {{ article.title }}
                  </div>
                  <div class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
                    by {{ article.author }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1 bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 text-es-accent-primary dark:text-es-accent-primary-dark text-xs rounded-full">
                  {{ article.category }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="article.published ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'"
                  class="px-3 py-1 text-xs rounded-full font-medium"
                >
                  {{ article.published ? 'Published' : 'Draft' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ formatDate(article.published_at) }}
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    class="p-2 hover:bg-es-bg-primary dark:hover:bg-es-bg-primary-dark rounded-lg transition-colors"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    class="p-2 hover:bg-es-bg-primary dark:hover:bg-es-bg-primary-dark rounded-lg transition-colors"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Articles - Dashboard',
  description: 'Manage your articles.'
})

const searchQuery = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')

const articles = ref([
  { id: 1, title: 'Digital Marketing Trends 2024', author: 'John Doe', category: 'Marketing', published: true, published_at: '2024-01-15' },
  { id: 2, title: 'UI/UX Best Practices', author: 'Jane Smith', category: 'Design', published: true, published_at: '2024-01-10' },
  { id: 3, title: 'React vs Vue Comparison', author: 'Mike Johnson', category: 'Development', published: false, published_at: '2024-01-05' },
  { id: 4, title: 'SEO Basics Guide', author: 'John Doe', category: 'Marketing', published: true, published_at: '2024-01-01' },
  { id: 5, title: 'Mobile First Design', author: 'Jane Smith', category: 'Design', published: true, published_at: '2023-12-25' }
])

const filteredArticles = computed(() => {
  return articles.value.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !selectedCategory.value || article.category === selectedCategory.value
    const matchesStatus = !selectedStatus.value
      || (selectedStatus.value === 'published' && article.published)
      || (selectedStatus.value === 'draft' && !article.published)
    return matchesSearch && matchesCategory && matchesStatus
  })
})

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>
