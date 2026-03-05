<script setup lang="ts">
/**
 * Custom 404 Page
 * 
 * Handles all unmatched routes
 * Available in both Indonesian and English
 * Auto-detects user language and offers redirect to correct language version
 */

const { locale, detectLanguage } = useI18n()
const route = useRoute()

// Page metadata
useSeoMeta({
  title: () => locale.value === 'id' ? 'Halaman Tidak Ditemukan - Esperion' : 'Page Not Found - Esperion',
  description: () => locale.value === 'id' 
    ? 'Maaf, halaman yang Anda cari tidak ditemukan' 
    : 'Sorry, the page you are looking for does not exist',
})

// Content for both languages
const content = computed(() => ({
  id: {
    title: '404',
    subtitle: 'Halaman Tidak Ditemukan',
    message: 'Maaf, kami tidak dapat menemukan halaman yang Anda cari.',
    possibleReasons: [
      'URL salah atau sudah kedaluwarsa',
      'Halaman telah dipindahkan atau dihapus',
      'Halaman bersifat privat dan memerlukan login',
    ],
    suggestions: [
      'Periksa kembali URL',
      'Kembali ke beranda',
      'Hubungi kami jika butuh bantuan',
    ],
    backHome: 'Kembali ke Beranda',
    contactUs: 'Hubungi Kami',
  },
  en: {
    title: '404',
    subtitle: 'Page Not Found',
    message: 'Sorry, we couldn\'t find the page you\'re looking for.',
    possibleReasons: [
      'The URL is incorrect or expired',
      'The page has been moved or deleted',
      'The page is private and requires login',
    ],
    suggestions: [
      'Check the URL again',
      'Go back to homepage',
      'Contact us if you need help',
    ],
    backHome: 'Back to Home',
    contactUs: 'Contact Us',
  },
}))

const currentContent = computed(() => content.value[locale.value as 'id' | 'en'])

// Detect if user might be on wrong language version
const showLanguagePrompt = ref(false)
const suggestedLang = ref<'id' | 'en' | null>(null)

onMounted(async () => {
  const detected = await detectLanguage()
  if (detected !== locale.value) {
    showLanguagePrompt.value = true
    suggestedLang.value = detected
  }
})

// Switch to suggested language
function switchToSuggestedLang() {
  if (suggestedLang.value) {
    const newPath = route.path.replace(
      `/${locale.value}/`,
      `/${suggestedLang.value}/`
    )
    navigateTo(newPath)
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center py-12">
    <div class="container mx-auto px-4 max-w-2xl text-center">
      <!-- 404 Title -->
      <h1
        class="text-9xl font-bold mb-4"
        :class="[
          'text-esperion-primary',
        ]"
      >
        {{ currentContent.title }}
      </h1>

      <!-- Subtitle -->
      <h2
        class="text-3xl font-semibold mb-6"
        :class="[
          'text-esperion-light-text-primary dark:text-esperion-dark-text-primary',
        ]"
      >
        {{ currentContent.subtitle }}
      </h2>

      <!-- Message -->
      <p
        class="text-lg mb-8"
        :class="[
          'text-esperion-light-text-secondary dark:text-esperion-dark-text-secondary',
        ]"
      >
        {{ currentContent.message }}
      </p>

      <!-- Possible Reasons -->
      <div
        v-if="currentContent.possibleReasons.length > 0"
        class="mb-8 p-6 rounded-lg"
        :class="[
          'bg-esperion-light-surface dark:bg-esperion-dark-surface',
          'border border-esperion-light-border dark:border-esperion-dark-border',
        ]"
      >
        <h3
          class="text-lg font-semibold mb-3"
          :class="[
            'text-esperion-light-text-primary dark:text-esperion-dark-text-primary',
          ]"
        >
          {{ locale === 'id' ? 'Kemungkinan Penyebab:' : 'Possible Reasons:' }}
        </h3>
        <ul class="text-left space-y-2">
          <li
            v-for="reason in currentContent.possibleReasons"
            :key="reason"
            class="flex items-start gap-2"
            :class="[
              'text-esperion-light-text-secondary dark:text-esperion-dark-text-secondary',
            ]"
          >
            <span class="text-esperion-primary mt-1">•</span>
            <span>{{ reason }}</span>
          </li>
        </ul>
      </div>

      <!-- Suggestions -->
      <div class="mb-8">
        <h3
          class="text-lg font-semibold mb-3"
          :class="[
            'text-esperion-light-text-primary dark:text-esperion-dark-text-primary',
          ]"
        >
          {{ locale === 'id' ? 'Saran Kami:' : 'Our Suggestions:' }}
        </h3>
        <ul class="text-left space-y-2 inline-block">
          <li
            v-for="suggestion in currentContent.suggestions"
            :key="suggestion"
            class="flex items-start gap-2"
            :class="[
              'text-esperion-light-text-secondary dark:text-esperion-dark-text-secondary',
            ]"
          >
            <span class="text-esperion-primary mt-1">✓</span>
            <span>{{ suggestion }}</span>
          </li>
        </ul>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-wrap justify-center gap-4 mb-8">
        <NuxtLink
          to="/"
          class="inline-flex items-center px-6 py-3 text-base font-medium rounded-lg transition-colors"
          :class="[
            'bg-esperion-primary hover:bg-blue-600 text-white',
          ]"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          {{ currentContent.backHome }}
        </NuxtLink>

        <NuxtLink
          to="/contact-us"
          class="inline-flex items-center px-6 py-3 text-base font-medium rounded-lg transition-colors"
          :class="[
            'bg-esperion-light-surface dark:bg-esperion-dark-surface',
            'border border-esperion-light-border dark:border-esperion-dark-border',
            'text-esperion-light-text-primary dark:text-esperion-dark-text-primary',
            'hover:bg-gray-50 dark:hover:bg-gray-800',
          ]"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {{ currentContent.contactUs }}
        </NuxtLink>
      </div>

      <!-- Language Switch Prompt -->
      <div
        v-if="showLanguagePrompt"
        class="mt-8 p-4 rounded-lg"
        :class="[
          'bg-esperion-primary/10',
          'border border-esperion-primary/20',
        ]"
      >
        <p
          class="mb-3"
          :class="[
            'text-esperion-light-text-primary dark:text-esperion-dark-text-primary',
          ]"
        >
          {{ locale === 'id' 
            ? '🌐 Halaman ini tersedia dalam bahasa Inggris' 
            : '🌐 This page is available in Indonesian' 
          }}
        </p>
        <button
          @click="switchToSuggestedLang"
          class="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors"
          :class="[
            'bg-esperion-primary hover:bg-blue-600 text-white',
          ]"
        >
          {{ locale === 'id' ? 'Lihat dalam Bahasa Inggris' : 'View in Indonesian' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Smooth fade-in animation */
h1, h2, p {
  animation: fadeIn 0.5s ease-out;
}

h2 {
  animation-delay: 0.1s;
}

p {
  animation-delay: 0.2s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>