<template>
  <div class="min-h-screen bg-es-bg-primary dark:bg-es-bg-primary-dark flex items-center justify-center px-4">
    <div class="text-center max-w-md">
      <!-- Offline Icon -->
      <div class="text-8xl mb-8">📡</div>

      <!-- Title -->
      <h1 class="text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">
        {{ t('offline.title') }}
      </h1>

      <!-- Message -->
      <p class="text-es-text-secondary dark:text-es-text-secondary-dark mb-8">
        {{ t('offline.message') }}
      </p>

      <!-- Actions -->
      <div class="space-y-4">
        <button
          @click="retryConnection"
          class="w-full px-6 py-3 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors"
        >
          {{ t('offline.tryAgain') }}
        </button>

        <NuxtLink
          :to="localePath('/')"
          class="w-full inline-flex justify-center items-center px-6 py-3 border-2 border-es-border dark:border-es-border-dark text-es-text-primary dark:text-es-text-primary-dark rounded-lg font-semibold hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark transition-colors"
        >
          {{ t('offline.goToHomepage') }}
        </NuxtLink>
      </div>

      <!-- Cached Pages Info -->
      <div class="mt-8 pt-8 border-t border-es-border dark:border-es-border-dark">
        <p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
          {{ t('offline.availablePages') }}
        </p>
        <ul class="mt-4 space-y-2 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
          <li>📄 {{ t('offline.cachedPages.home') }}</li>
          <li>📄 {{ t('offline.cachedPages.works') }}</li>
          <li>📄 {{ t('offline.cachedPages.services') }}</li>
          <li>📄 {{ t('offline.cachedPages.articles') }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: t('offline.seo.title'),
  description: t('offline.seo.description'),
})

const retryConnection = async () => {
  if (navigator.onLine) {
    window.location.reload()
  } else {
    // Show retry message
    alert(t('offline.stillOffline'))
  }
}

// Listen for online event
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    window.location.reload()
  })
}
</script>