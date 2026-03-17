<template>
  <div class="space-y-6">
    <DashboardPageHeader
      eyebrow="Developer"
      title="API Documentation"
      description="Backend API reference and endpoints"
    />

    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="flex items-center justify-center min-h-[60vh]"
    >
      <div class="text-center space-y-4">
        <div class="animate-spin w-12 h-12 border-4 border-es-accent-primary border-t-transparent rounded-full mx-auto" />
        <p class="text-es-text-secondary dark:text-es-text-secondary-dark">
          {{ t('dashboard.apiDocs.loading') }}
        </p>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="flex items-center justify-center min-h-[60vh]"
    >
      <div class="text-center space-y-4 max-w-md mx-auto px-4">
        <div class="text-6xl">⚠️</div>
        <h2 class="text-xl font-semibold text-es-text-primary dark:text-es-text-primary-dark">
          {{ t('dashboard.apiDocs.errorTitle') }}
        </h2>
        <p class="text-es-text-secondary dark:text-es-text-secondary-dark">
          {{ t('dashboard.apiDocs.errorMessage') }}
        </p>
        <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-lg p-4 text-left text-sm">
          <p class="font-mono text-es-text-secondary dark:text-es-text-secondary-dark break-all">
            {{ t('dashboard.apiDocs.backendUrl') }}: {{ openApiUrl }}
          </p>
        </div>
        <div class="flex gap-3 justify-center pt-2">
          <button
            class="px-4 py-2 bg-es-accent-primary text-white rounded-lg hover:opacity-90 transition-opacity"
            @click="retryFetch"
          >
            {{ t('dashboard.apiDocs.retry') }}
          </button>
          <a
            :href="openApiUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="px-4 py-2 border border-es-border dark:border-es-border-dark rounded-lg hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark transition-colors"
          >
            {{ t('dashboard.apiDocs.openDirect') }}
          </a>
        </div>
      </div>
    </div>

    <!-- Success State - Scalar will render here -->
    <div
      v-else
      id="scalar-container"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})


const { t } = useI18n()
const config = useRuntimeConfig()

// Backend OpenAPI URL - configurable via runtime config
const openApiUrl = computed(() => {
  // In Docker dev environment, use the configured backend URL
  const apiBase = config.public.apiBase || 'http://localhost:8080'
  // For Docker dev, backend runs on port 8081
  return 'http://localhost:8081/api/v1/openapi.json'
})

const isLoading = ref(true)
const error = ref(false)

// SEO Meta
useSeoMeta({
  title: t('dashboard.apiDocs.title'),
  description: t('dashboard.apiDocs.description')
})

// Fetch OpenAPI spec to verify backend is available
const fetchOpenApiSpec = async () => {
  isLoading.value = true
  error.value = false

  try {
    const response = await fetch(openApiUrl.value, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const spec = await response.json()

    // Validate it's a proper OpenAPI spec
    if (!spec.openapi && !spec.swagger) {
      throw new Error('Invalid OpenAPI specification')
    }

    // Success - Scalar will handle rendering
    isLoading.value = false
  } catch (err) {
    console.error('Failed to fetch OpenAPI spec:', err)
    error.value = true
    isLoading.value = false
  }
}

const retryFetch = () => {
  fetchOpenApiSpec()
}

// Fetch on mount
onMounted(() => {
  fetchOpenApiSpec()
})
</script>

<style>
/* Scalar will inject its own styles */
/* Ensure full height for the container */
#scalar-container {
  min-height: 100vh;
}
</style>
