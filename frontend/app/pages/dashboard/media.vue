<template>
  <div>
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-2">
          Media Library
        </h1>
        <p class="text-es-text-secondary dark:text-es-text-secondary-dark">
          Manage your images, videos, and files
        </p>
      </div>
      <button class="inline-flex items-center justify-center px-6 py-3 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors">
        <span class="text-xl mr-2">↑</span> Upload Media
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-4 mb-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search media..."
          class="flex-1 px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
        />
        <select
          v-model="selectedType"
          class="px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
        >
          <option value="">All Types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="document">Documents</option>
        </select>
      </div>
    </div>

    <!-- Media Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <div v-for="media in mediaItems" :key="media.id" class="group relative bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl overflow-hidden">
        <div class="aspect-square bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark flex items-center justify-center">
          <span class="text-4xl">{{ media.icon }}</span>
        </div>
        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button class="p-2 bg-white rounded-lg hover:bg-es-bg-tertiary" title="View">👁️</button>
          <button class="p-2 bg-white rounded-lg hover:bg-es-bg-tertiary" title="Edit">✏️</button>
          <button class="p-2 bg-white rounded-lg hover:bg-red-500 hover:text-white" title="Delete">🗑️</button>
        </div>
        <div class="p-3">
          <p class="text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark truncate">{{ media.name }}</p>
          <p class="text-xs text-es-text-secondary dark:text-es-text-secondary-dark">{{ media.size }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'Media Library - Dashboard', description: 'Manage your media files.' });

const searchQuery = ref('');
const selectedType = ref('');

const mediaItems = ref([
  { id: 1, name: 'banner-1.jpg', type: 'image', size: '2.4 MB', icon: '🖼️' },
  { id: 2, name: 'logo.png', type: 'image', size: '156 KB', icon: '🖼️' },
  { id: 3, name: 'team-photo.jpg', type: 'image', size: '3.1 MB', icon: '🖼️' },
  { id: 4, name: 'promo-video.mp4', type: 'video', size: '45.2 MB', icon: '🎬' },
  { id: 5, name: 'brochure.pdf', type: 'document', size: '1.8 MB', icon: '📄' },
  { id: 6, name: 'work-1.jpg', type: 'image', size: '2.1 MB', icon: '🖼️' },
  { id: 7, name: 'work-2.jpg', type: 'image', size: '1.9 MB', icon: '🖼️' },
  { id: 8, name: 'icon-set.zip', type: 'document', size: '890 KB', icon: '📦' },
]);
</script>