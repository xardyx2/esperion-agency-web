<template>
  <div class="language-switcher">
    <div class="relative">
      <select 
        :value="currentLocale" 
        @change="switchLocale" 
        class="bg-transparent border-none text-white focus:outline-none cursor-pointer"
        aria-label="Select language"
      >
        <option value="id">ID</option>
        <option value="en">EN</option>
      </select>
      
      <!-- Custom dropdown arrow -->
      <div class="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
          <path d="M1 1L6 6L11 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick } from 'vue'

// Destructure the composable to get current locale and setter
const { locale: localeRef, setLocale, t } = useI18n()
const route = useRoute()
const router = useRouter()

// Computed property to get current locale
const currentLocale = computed(() => localeRef.value)

// Method to switch locale and redirect
const switchLocale = async (event: Event) => {
  const selectedLocale = (event.target as HTMLSelectElement).value as 'id' | 'en'
  
  // If same locale, do nothing
  if (selectedLocale === localeRef.value) {
    return
  }

  // Get current path
  let path = route.fullPath
  
  // Remove current locale prefix if exists
  if (path.startsWith(`/${localeRef.value}/`)) {
    path = path.substring(localeRef.value.length + 1)
  } else if (path === `/${localeRef.value}`) {
    path = '/'
  } else if (path.startsWith(`/${localeRef.value}?`) || path.startsWith(`/${localeRef.value}#`)) {
    // Handle paths with query params or hash
    const rest = path.substring(localeRef.value.length + 1)
    path = rest.startsWith('?') || rest.startsWith('#') ? `/${rest}` : rest
  }
  
  // Change locale using the composable
  await setLocale(selectedLocale)
  
  // Wait for the locale to be set before navigating
  await nextTick()
  
  // Navigate to the same route with new locale
  const newPath = `/${selectedLocale}${path !== '/' ? path : ''}`
  await navigateTo(newPath, { replace: true })
}

// Watch for external locale changes and update the select element
if (process.client) {
  const unwatch = watch(localeRef, (newLocale) => {
    // Component will re-render automatically due to reactivity
  })
  
  onUnmounted(() => {
    unwatch()
  })
}
</script>

<style scoped>
.language-switcher select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.language-switcher:hover {
  opacity: 0.8;
}
</style>