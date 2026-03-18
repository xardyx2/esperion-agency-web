<template>
  <div class="space-y-6">
    <DashboardPageHeader
      eyebrow="Content"
      :title="t('dashboard.works.title')"
      :description="t('dashboard.works.description')"
    >
      <template #actions>
        <NuxtLink
          to="/dashboard/works/new"
          class="inline-flex items-center justify-center rounded-full bg-es-accent-primary px-6 py-3 font-semibold text-es-text-inverse transition-colors hover:bg-es-accent-primary-hover dark:bg-es-accent-primary-dark dark:text-es-text-inverse-dark dark:hover:bg-es-accent-primary-hover-dark"
        >
          <span class="mr-2 text-xl">+</span> {{ t('dashboard.works.newButton') }}
        </NuxtLink>
      </template>
    </DashboardPageHeader>

    <div
      v-if="error"
      class="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <div
      v-if="pending"
      class="rounded-xl border border-es-border bg-es-bg-secondary px-4 py-6 text-sm text-es-text-secondary dark:border-es-border-dark dark:bg-es-bg-secondary-dark dark:text-es-text-secondary-dark"
    >
      {{ t('dashboard.works.loading') }}
    </div>

    <div
      v-else
      class="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <UCard
        v-for="work in works"
        :key="work.id"
        :ui="{
          root: 'rounded-3xl border border-es-border bg-es-bg-secondary shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark',
          header: 'border-b border-es-border/70 px-6 py-5 dark:border-es-border-dark/70',
          body: 'p-0'
        }"
        class="overflow-hidden"
      >
        <div class="aspect-video bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark flex items-center justify-center">
          <span class="text-4xl">{{ work.image ? 'Image' : t('dashboard.works.image.noImage') }}</span>
        </div>
        <div class="p-5">
          <div class="flex items-center justify-between mb-3">
            <span class="px-3 py-1 bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 text-es-accent-primary dark:text-es-accent-primary-dark text-xs rounded-full">{{ work.service }}</span>
            <span
              v-if="work.featured"
              class="px-3 py-1 bg-yellow-500/10 text-yellow-500 text-xs rounded-full"
            >{{ t('dashboard.works.featuredBadge') }}</span>
          </div>
          <h3 class="font-semibold text-lg text-es-text-primary dark:text-es-text-primary-dark mb-2">
            {{ work.title }}
          </h3>
          <p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark mb-1">
            {{ work.client_name }}
          </p>
          <p class="text-xs text-es-text-secondary dark:text-es-text-secondary-dark mb-4">
            {{ work.platform }}
          </p>
          <div class="flex items-center justify-end gap-2">
            <button
              type="button"
              class="p-2 hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark rounded-lg transition-colors text-sm text-es-text-secondary dark:text-es-text-secondary-dark"
              @click="removeWork(work.id)"
            >
              {{ t('dashboard.works.buttons.delete') }}
            </button>
          </div>
        </div>
      </UCard>

      <div
        v-if="!works.length"
        class="col-span-full rounded-xl border border-es-border bg-es-bg-secondary px-4 py-8 text-center text-sm text-es-text-secondary dark:border-es-border-dark dark:bg-es-bg-secondary-dark dark:text-es-text-secondary-dark"
      >
        {{ t('dashboard.works.noResults') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWorksApi } from '../../composables/useApi'
import type { Work } from '../../types/api'

definePageMeta({
  layout: 'dashboard'
})

const { t } = useI18n()

useSeoMeta({ title: t('dashboard.works.seo.title'), description: t('dashboard.works.seo.description') })

const worksApi = useWorksApi()

const works = ref<Work[]>([])
const pending = ref(false)
const error = ref('')

const loadWorks = async () => {
  pending.value = true
  error.value = ''
  try {
    const response = await worksApi.list({ limit: 100 })
    works.value = response.data
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('dashboard.works.loading')
  } finally {
    pending.value = false
  }
}

const removeWork = async (id: string) => {
  if (!(globalThis.confirm?.(t('dashboard.works.buttons.deleteConfirm')) ?? true)) return
  pending.value = true
  error.value = ''
  try {
    await worksApi.delete(id)
    await loadWorks()
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('dashboard.works.loading')
  } finally {
    pending.value = false
  }
}

onMounted(loadWorks)
</script>
