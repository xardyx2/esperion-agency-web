<template>
  <div class="space-y-6">
    <DashboardPageHeader
      eyebrow="Library"
      :title="t('dashboard.media.title')"
      :description="t('dashboard.media.description')"
    >
      <template #actions>
        <UButton
          color="primary"
          class="rounded-full"
        >
          <span class="text-sm">↑</span> {{ t('dashboard.media.uploadButton') }}
        </UButton>
      </template>
    </DashboardPageHeader>

    <UCard
      :ui="{
        root: 'rounded-2xl border border-es-border bg-es-bg-secondary shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark',
        header: 'border-b border-es-border/70 px-5 py-4 dark:border-es-border-dark/70',
        body: 'px-5 py-4'
      }"
    >
      <div class="flex flex-col sm:flex-row gap-4">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="t('dashboard.media.search.placeholder')"
          class="flex-1 px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
        >
        <select
          v-model="selectedType"
          class="px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
        >
          <option value="">
            {{ t('dashboard.media.filters.allTypes') }}
          </option>
          <option value="image">
            {{ t('dashboard.media.filters.image') }}
          </option>
          <option value="video">
            {{ t('dashboard.media.filters.video') }}
          </option>
          <option value="document">
            {{ t('dashboard.media.filters.document') }}
          </option>
        </select>
      </div>
    </UCard>

    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <div
        v-for="media in mediaItems"
        :key="media.id"
        class="group relative rounded-2xl border border-es-border bg-es-bg-secondary overflow-hidden dark:border-es-border-dark dark:bg-es-bg-secondary-dark"
      >
        <div class="aspect-square bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark flex items-center justify-center">
          <span class="text-4xl">{{ media.icon }}</span>
        </div>
        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button
            class="p-2 bg-white rounded-lg hover:bg-es-bg-tertiary"
            :title="t('dashboard.media.buttons.view')"
          >
            👁️
          </button>
          <button
            class="p-2 bg-white rounded-lg hover:bg-es-bg-tertiary"
            :title="t('dashboard.media.buttons.edit')"
          >
            ✏️
          </button>
          <button
            class="p-2 bg-white rounded-lg hover:bg-red-500 hover:text-white"
            :title="t('dashboard.media.buttons.delete')"
          >
            🗑️
          </button>
        </div>
        <div class="p-3">
          <p class="text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark truncate">
            {{ media.name }}
          </p>
          <p class="text-xs text-es-text-secondary dark:text-es-text-secondary-dark">
            {{ media.size }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

const { t } = useI18n()

useSeoMeta({ title: t('dashboard.media.seo.title'), description: t('dashboard.media.seo.description') })

const searchQuery = ref('')
const selectedType = ref('')

const mediaItems = ref([
  { id: 1, name: 'banner-1.jpg', type: 'image', size: '2.4 MB', icon: '🖼️' },
  { id: 2, name: 'logo.png', type: 'image', size: '156 KB', icon: '🖼️' },
  { id: 3, name: 'team-photo.jpg', type: 'image', size: '3.1 MB', icon: '🖼️' },
  { id: 4, name: 'promo-video.mp4', type: 'video', size: '45.2 MB', icon: '🎬' },
  { id: 5, name: 'brochure.pdf', type: 'document', size: '1.8 MB', icon: '📄' },
  { id: 6, name: 'work-1.jpg', type: 'image', size: '2.1 MB', icon: '🖼️' },
  { id: 7, name: 'work-2.jpg', type: 'image', size: '1.9 MB', icon: '🖼️' },
  { id: 8, name: 'icon-set.zip', type: 'document', size: '890 KB', icon: '📦' }
])
</script>
