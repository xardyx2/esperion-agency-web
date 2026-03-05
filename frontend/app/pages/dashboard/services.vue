<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-2">Services</h1>
        <p class="text-es-text-secondary dark:text-es-text-secondary-dark">Manage your service offerings</p>
      </div>
      <button class="inline-flex items-center justify-center px-6 py-3 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors">
        <span class="text-xl mr-2">+</span> New Service
      </button>
    </div>
    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="service in services" :key="service.id" class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6">
        <div class="text-4xl mb-4">{{ service.icon }}</div>
        <h3 class="font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-2">{{ service.title }}</h3>
        <p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark mb-4 line-clamp-2">{{ service.description }}</p>
        <div class="flex items-center justify-between">
          <span v-if="service.featured" class="px-2 py-1 bg-yellow-500/10 text-yellow-500 text-xs rounded-full">Featured</span>
          <div class="flex items-center gap-2 ml-auto">
            <button class="p-2 hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark rounded-lg">✏️</button>
            <button class="p-2 hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark rounded-lg">🗑️</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
useSeoMeta({ title: 'Services - Dashboard', description: 'Manage services.' });
const services = ref([
  { id: 1, title: 'Web Development', description: 'Custom websites and web applications', icon: '💻', featured: true },
  { id: 2, title: 'Mobile App Development', description: 'Native and cross-platform mobile apps', icon: '📱', featured: true },
  { id: 3, title: 'UI/UX Design', description: 'User-centered design solutions', icon: '🎨', featured: false },
  { id: 4, title: 'Digital Marketing', description: 'SEO, SEM, and social media marketing', icon: '📈', featured: false },
  { id: 5, title: 'E-Commerce Solutions', description: 'Complete online store solutions', icon: '🛒', featured: false },
  { id: 6, title: 'Consulting', description: 'Technology and digital transformation', icon: '💡', featured: false },
]);
</script>