<template>
  <div>
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-2">
          Works
        </h1>
        <p class="text-es-text-secondary dark:text-es-text-secondary-dark">
          Manage your portfolio projects
        </p>
      </div>
      <NuxtLink
        to="/dashboard/works/new"
        class="inline-flex items-center justify-center px-6 py-3 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors"
      >
        <span class="text-xl mr-2">+</span> New Work
      </NuxtLink>
    </div>

    <!-- Works Grid -->
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="work in works"
        :key="work.id"
        class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl overflow-hidden"
      >
        <div class="aspect-video bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark flex items-center justify-center">
          <span class="text-4xl">🖼️</span>
        </div>
        <div class="p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="px-2 py-1 bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 text-es-accent-primary dark:text-es-accent-primary-dark text-xs rounded-full">{{ work.service }}</span>
            <span
              v-if="work.featured"
              class="px-2 py-1 bg-yellow-500/10 text-yellow-500 text-xs rounded-full"
            >Featured</span>
          </div>
          <h3 class="font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-1">
            {{ work.title }}
          </h3>
          <p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark mb-3">
            {{ work.client }}
          </p>
          <div class="flex items-center justify-end gap-2">
            <button class="p-2 hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark rounded-lg transition-colors">
              ✏️
            </button>
            <button class="p-2 hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark rounded-lg transition-colors">
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'Works - Dashboard', description: 'Manage your portfolio.' })

const works = ref([
  { id: 1, title: 'E-Commerce Platform', client: 'Fashion Retailer', service: 'Web Development', featured: true },
  { id: 2, title: 'Mobile Banking App', client: 'Regional Bank', service: 'Mobile App', featured: true },
  { id: 3, title: 'Healthcare Portal', client: 'Healthcare Network', service: 'Web Development', featured: false },
  { id: 4, title: 'Restaurant Website', client: 'Restaurant Group', service: 'Web Development', featured: false },
  { id: 5, title: 'Fitness App', client: 'Fitness Startup', service: 'Mobile App', featured: true },
  { id: 6, title: 'SaaS Dashboard', client: 'SaaS Company', service: 'UI/UX Design', featured: false }
])
</script>
