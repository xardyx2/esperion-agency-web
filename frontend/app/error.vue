<template>
  <div class="min-h-screen bg-es-bg-primary dark:bg-es-bg-primary-dark flex items-center justify-center px-4">
    <div class="text-center max-w-2xl">
      <!-- Error Code -->
      <div class="mb-8">
        <span class="text-9xl font-bold text-es-accent-primary dark:text-es-accent-primary-dark">
          {{ error?.statusCode || 404 }}
        </span>
      </div>

      <!-- Error Title -->
      <h1 class="text-3xl md:text-4xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">
        {{ errorTitle }}
      </h1>

      <!-- Error Message -->
      <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-lg mb-8">
        {{ errorMessage }}
      </p>

      <!-- Back Link -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <NuxtLink
          :to="localePath('/')"
          class="inline-flex items-center justify-center px-6 py-3 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors"
        >
          {{ t('error.backToHome') }}
        </NuxtLink>

        <!-- Fallback links for specific error types -->
        <NuxtLink
          v-if="isArticleError"
          :to="localePath('/articles')"
          class="inline-flex items-center justify-center px-6 py-3 border-2 border-es-accent-primary dark:border-es-accent-primary-dark text-es-accent-primary dark:text-es-accent-primary-dark rounded-lg font-semibold hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors"
        >
          {{ t('error.backToArticles') }}
        </NuxtLink>

        <NuxtLink
          v-if="isServiceError"
          :to="localePath('/our-services')"
          class="inline-flex items-center justify-center px-6 py-3 border-2 border-es-accent-primary dark:border-es-accent-primary-dark text-es-accent-primary dark:text-es-accent-primary-dark rounded-lg font-semibold hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors"
        >
          {{ t('error.backToServices') }}
        </NuxtLink>
      </div>

      <!-- Error Details (for development) -->
      <div
        v-if="isDev && error?.message"
        class="mt-12 p-4 bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-lg text-left"
      >
        <p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark font-mono">
          {{ error.message }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

interface Props {
  error: NuxtError
}

const props = defineProps<Props>()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

const isDev = import.meta.dev

// Determine error type based on current route path
const isArticleError = computed(() => {
  return route.path.includes('/articles/')
})

const isServiceError = computed(() => {
  return route.path.includes('/our-services/')
})

// Get error title based on status code and locale
const errorTitle = computed(() => {
  const code = props.error?.statusCode || 404

  if (code === 404) {
    return locale.value === 'en'
      ? 'Page Not Found'
      : 'Halaman Tidak Ditemukan'
  }

  return locale.value === 'en'
    ? 'An Error Occurred'
    : 'Terjadi Kesalahan'
})

// Get error message based on status code and locale
const errorMessage = computed(() => {
  const code = props.error?.statusCode || 404

  if (code === 404) {
    if (isArticleError.value) {
      return locale.value === 'en'
        ? 'The article you are looking for does not exist or has been moved.'
        : 'Artikel yang Anda cari tidak ada atau telah dipindahkan.'
    }

    if (isServiceError.value) {
      return locale.value === 'en'
        ? 'The service you are looking for does not exist or has been moved.'
        : 'Layanan yang Anda cari tidak ada atau telah dipindahkan.'
    }

    return locale.value === 'en'
      ? 'The page you are looking for does not exist or has been moved.'
      : 'Halaman yang Anda cari tidak ada atau telah dipindahkan.'
  }

  return locale.value === 'en'
    ? 'Sorry, something went wrong. Please try again later.'
    : 'Maaf, terjadi kesalahan. Silakan coba lagi nanti.'
})

// SEO Meta
useSeoMeta({
  title: () => `${errorTitle.value} - Esperion`,
  description: () => errorMessage.value,
  robots: 'noindex, nofollow'
})
</script>
