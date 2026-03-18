<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <DashboardPageHeader
      eyebrow="Portfolio"
      :title="t('dashboard.works.title')"
      :description="t('dashboard.works.description')"
    >
      <template #actions>
        <UButton
          color="primary"
          class="rounded-full"
          :to="localePath('/dashboard/works/new')"
        >
          <UIcon name="i-lucide-plus" class="h-4 w-4 mr-1" />
          {{ t('dashboard.works.newButton') }}
        </UButton>
      </template>
    </DashboardPageHeader>

    <!-- Error State -->
    <div
      v-if="error"
      class="rounded-3xl border border-red-200 bg-red-50 px-4 py-6"
    >
      <div class="flex items-center gap-3">
        <UIcon name="i-lucide-alert-circle" class="h-5 w-5 text-red-600" />
        <p class="text-sm text-red-700">{{ error }}</p>
      </div>
    </div>

    <!-- Loading State -->
    <div
      v-if="pending"
      class="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      <UDashboardSkeleton
        v-for="n in 6"
        :key="n"
        type="card"
      />
    </div>

    <!-- Content Section -->
    <UDashboardSection
      v-else
      :badge="works.length"
    >
      <template #header>
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-es-text-secondary dark:text-es-text-secondary-dark">
              Portfolio
            </p>
            <h2 class="mt-2 text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">
              All Works
            </h2>
          </div>
          <UBadge
            color="primary"
            variant="soft"
          >
            {{ works.length }} items
          </UBadge>
        </div>
      </template>

      <!-- Empty State -->
      <UDashboardEmptyState
        v-if="!works.length"
        icon="i-lucide-briefcase-business"
        title="No portfolio works yet"
        description="Start building your portfolio by adding your first project. Showcase your best work to potential clients."
        :primary-action="{ label: 'Add Work', to: '/dashboard/works/new', icon: 'i-lucide-plus' }"
        :secondary-actions="[
          { label: 'View Public Site', to: '/our-works', icon: 'i-lucide-external-link', variant: 'outline' }
        ]"
        :tips="[
          'Add high-quality images for each project',
          'Include client testimonials when available',
          'Tag works with relevant services'
        ]"
      />

      <!-- Works Grid -->
      <div
        v-else
        class="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        <UCard
          v-for="work in works"
          :key="work.id"
          :ui="{
            root: 'rounded-3xl border border-es-border bg-es-bg-primary shadow-sm overflow-hidden transition-shadow hover:shadow-md dark:border-es-border-dark dark:bg-es-bg-primary-dark',
            body: 'p-0'
          }"
        >
          <!-- Image Placeholder -->
          <div class="aspect-video bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark flex items-center justify-center">
            <div class="flex flex-col items-center gap-2 text-es-text-tertiary dark:text-es-text-tertiary-dark">
              <UIcon name="i-lucide-image" class="h-8 w-8" />
              <span class="text-xs">{{ work.image ? 'Image' : t('dashboard.works.image.noImage') }}</span>
            </div>
          </div>

          <!-- Content -->
          <div class="p-5">
            <div class="flex items-center justify-between mb-3">
              <UBadge
                color="neutral"
                variant="soft"
                size="sm"
              >
                {{ work.service }}
              </UBadge>
              <UBadge
                v-if="work.featured"
                color="warning"
                variant="soft"
                size="sm"
              >
                <UIcon name="i-lucide-star" class="h-3 w-3 mr-1" />
                {{ t('dashboard.works.featuredBadge') }}
              </UBadge>
            </div>

            <h3 class="font-semibold text-lg text-es-text-primary dark:text-es-text-primary-dark mb-1">
              <UInlineEdit
                v-model="work.title"
                type="text"
                placeholder="Work title"
                @save="(value, prev) => handleInlineEdit(work.id, 'title', value, prev)"
              />
            </h3>
            <div class="flex items-center gap-2 mb-2">
              <span class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">Featured:</span>
              <UInlineEdit
                v-model="work.featured"
                type="toggle"
                @save="(value, prev) => handleInlineEdit(work.id, 'featured', value, prev)"
              />
            </div>
            <p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark mb-1">
              {{ work.client_name }}
            </p>
            <p class="text-xs text-es-text-tertiary dark:text-es-text-tertiary-dark mb-4">
              {{ work.platform }}
            </p>

            <div class="flex items-center justify-end gap-2 pt-4 border-t border-es-border dark:border-es-border-dark">
              <UButton
                color="neutral"
                variant="ghost"
                size="sm"
                :to="`/dashboard/works/${work.id}`"
              >
                <UIcon name="i-lucide-pencil" class="h-4 w-4 mr-1" />
                Edit
              </UButton>
              <UButton
                color="danger"
                variant="ghost"
                size="sm"
                @click="removeWork(work.id)"
              >
                <UIcon name="i-lucide-trash-2" class="h-4 w-4" />
              </UButton>
            </div>
          </div>
        </UCard>
      </div>
    </UDashboardSection>
  </div>
</template>

<script setup lang="ts">
import { useWorksApi } from '../../composables/useApi'
import type { Work } from '../../types/api'

definePageMeta({
  layout: 'dashboard'
})

const { t } = useI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: t('dashboard.works.seo.title'),
  description: t('dashboard.works.seo.description')
})

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

// Inline editing
const handleInlineEdit = async (id: string, field: string, value: any, previousValue: any) => {
  const toast = useToast()
  try {
    await worksApi.update(id, { [field]: value })
    toast.add({
      title: 'Updated',
      description: `${field} updated successfully`,
      color: 'success',
      actions: [
        {
          label: 'Undo',
          click: async () => {
            await worksApi.update(id, { [field]: previousValue })
            await loadWorks()
            toast.add({
              title: 'Restored',
              description: `${field} restored to previous value`,
              color: 'info'
            })
          }
        }
      ]
    })
  } catch (err) {
    toast.add({
      title: 'Error',
      description: err instanceof Error ? err.message : 'Failed to update',
      color: 'error'
    })
    await loadWorks()
  }
}

onMounted(loadWorks)
</script>
