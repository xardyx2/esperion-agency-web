<template>
  <div class="space-y-8">
    <DashboardPageHeader
      eyebrow="Content"
      :title="t('dashboard.services.title')"
      :description="t('dashboard.services.description')"
    >
      <template #actions>
        <UButton
          color="primary"
          class="rounded-full"
          @click="openCreate"
        >
          <span class="mr-1 text-lg">+</span>
          {{ t('dashboard.services.newButton') }}
        </UButton>
      </template>
    </DashboardPageHeader>

    <div
      v-if="error"
      class="rounded-3xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <UCard
      v-if="showForm"
      :ui="{
        root: 'rounded-3xl border border-es-border bg-es-bg-secondary shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark',
        header: 'border-b border-es-border/70 px-6 py-5 dark:border-es-border-dark/70',
        body: 'px-6 py-5'
      }"
    >
      <template #header>
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-es-text-secondary dark:text-es-text-secondary-dark">
              {{ editingServiceId ? 'Update service' : 'Create service' }}
            </p>
            <h2 class="mt-2 text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">
              {{ editingServiceId ? t('dashboard.services.create.update') : t('dashboard.services.create.title') }}
            </h2>
          </div>

          <UButton
            color="neutral"
            variant="outline"
            class="rounded-full border-es-border text-es-text-primary dark:border-es-border-dark dark:text-es-text-primary-dark"
            :disabled="submitting"
            @click="closeForm"
          >
            {{ t('dashboard.services.create.cancel') }}
          </UButton>
        </div>
      </template>

      <form
        class="grid gap-4 md:grid-cols-2"
        @submit.prevent="submitForm"
      >
        <label class="space-y-2 text-sm md:col-span-2">
          <span class="block font-medium text-es-text-primary dark:text-es-text-primary-dark">{{ t('dashboard.services.create.submitTitle') }}</span>
          <input
            v-model="form.title"
            type="text"
            required
            class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"
          >
        </label>

        <label class="space-y-2 text-sm">
          <span class="block font-medium text-es-text-primary dark:text-es-text-primary-dark">{{ t('dashboard.services.create.slugTitle') }}</span>
          <input
            v-model="form.slug"
            type="text"
            required
            :disabled="Boolean(editingServiceId)"
            class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary disabled:opacity-60 dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"
          >
        </label>

        <label class="space-y-2 text-sm">
          <span class="block font-medium text-es-text-primary dark:text-es-text-primary-dark">{{ t('dashboard.services.create.orderTitle') }}</span>
          <input
            v-model.number="form.display_order"
            type="number"
            min="0"
            class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"
          >
        </label>

        <label class="space-y-2 text-sm md:col-span-2">
          <span class="block font-medium text-es-text-primary dark:text-es-text-primary-dark">{{ t('dashboard.services.create.descTitle') }}</span>
          <textarea
            v-model="form.description"
            rows="4"
            required
            class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"
          />
        </label>

        <label class="space-y-2 text-sm">
          <span class="block font-medium text-es-text-primary dark:text-es-text-primary-dark">{{ t('dashboard.services.create.iconTitle') }}</span>
          <input
            v-model="form.icon"
            type="text"
            placeholder="Brief icon label"
            class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"
          >
        </label>

        <label class="flex items-center gap-3 text-sm text-es-text-primary dark:text-es-text-primary-dark">
          <input
            v-model="form.featured"
            type="checkbox"
            class="h-4 w-4 rounded border-es-border text-es-accent-primary focus:ring-es-accent-primary"
          >
          {{ t('dashboard.services.create.featured') }}
        </label>

        <div class="md:col-span-2 flex justify-end">
          <UButton
            type="submit"
            color="primary"
            class="rounded-full"
            :disabled="submitting"
          >
            {{ submitting ? t('dashboard.services.create.saveInProgress') : editingServiceId ? t('dashboard.services.create.saveButton') : t('dashboard.services.create.createButton') }}
          </UButton>
        </div>
      </form>
    </UCard>

    <UCard
      v-if="pending"
      :ui="{
        root: 'rounded-3xl border border-es-border bg-es-bg-secondary shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark',
        body: 'px-6 py-5'
      }"
    >
      <p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
        {{ t('dashboard.services.create.loading') }}
      </p>
    </UCard>

    <div
      v-else
      class="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      <UCard
        v-for="service in services"
        :key="service.id"
        :ui="{
          root: 'rounded-3xl border border-es-border bg-es-bg-secondary shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark',
          body: 'p-6'
        }"
      >
        <div class="space-y-4">
          <div class="flex items-start justify-between gap-4">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-es-accent-primary/10 text-es-accent-primary dark:bg-es-accent-primary-dark/15 dark:text-es-accent-primary-dark">
              <span v-if="service.icon" class="text-sm font-semibold">{{ service.icon }}</span>
              <UIcon v-else name="i-lucide-briefcase" class="h-5 w-5" />
            </div>

            <UBadge
              v-if="service.featured"
              color="primary"
              variant="soft"
              class="shrink-0"
            >
              {{ t('dashboard.services.buttons.featured') }}
            </UBadge>
          </div>

          <div>
            <h3 class="text-base font-semibold text-es-text-primary dark:text-es-text-primary-dark">
              {{ service.title }}
            </h3>
            <p class="mt-2 text-sm text-es-text-secondary dark:text-es-text-secondary-dark line-clamp-2">
              {{ service.description }}
            </p>
          </div>

          <div class="flex items-center justify-end gap-2 border-t border-es-border pt-4 dark:border-es-border-dark">
            <UButton
              color="neutral"
              variant="ghost"
              size="sm"
              class="text-es-text-primary dark:text-es-text-primary-dark"
              @click="openEdit(service)"
            >
              {{ t('dashboard.services.buttons.edit') }}
            </UButton>
            <UButton
              color="danger"
              variant="ghost"
              size="sm"
              @click="removeService(service)"
            >
              {{ t('dashboard.services.buttons.delete') }}
            </UButton>
          </div>
        </div>
      </UCard>

      <div
        v-if="!services.length"
        class="col-span-full rounded-3xl border border-dashed border-es-border bg-es-bg-secondary px-4 py-10 text-center text-sm text-es-text-secondary dark:border-es-border-dark dark:bg-es-bg-secondary-dark dark:text-es-text-secondary-dark"
      >
        {{ t('dashboard.services.noResults') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})



import { useServicesApi } from '../../composables/useApi'
import type { Service } from '../../types/api'

const { t } = useI18n()

useSeoMeta({ title: t('dashboard.services.seo.title'), description: t('dashboard.services.seo.description') })

const servicesApi = useServicesApi()

const services = ref<Service[]>([])
const pending = ref(false)
const submitting = ref(false)
const error = ref('')
const showForm = ref(false)
const editingServiceId = ref<string | null>(null)

const form = reactive({
  title: '',
  slug: '',
  description: '',
  icon: '',
  featured: false,
  display_order: 0
})

const slugify = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
}

const resetForm = () => {
  form.title = ''
  form.slug = ''
  form.description = ''
  form.icon = ''
  form.featured = false
  form.display_order = 0
  editingServiceId.value = null
}

const openCreate = () => {
  resetForm()
  showForm.value = true
}

const openEdit = (service: Service) => {
  editingServiceId.value = service.id
  form.title = service.title
  form.slug = service.slug
  form.description = service.description
  form.icon = service.icon || ''
  form.featured = service.featured
  form.display_order = service.display_order
  showForm.value = true
}

const closeForm = () => {
  resetForm()
  showForm.value = false
}

const loadServices = async () => {
  pending.value = true
  error.value = ''
  try {
    const response = await servicesApi.list({ limit: 100 })
    services.value = [...response.data].sort((a, b) => a.display_order - b.display_order)
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('dashboard.services.create.loading')
  } finally {
    pending.value = false
  }
}

const submitForm = async () => {
  submitting.value = true
  error.value = ''
  try {
    if (editingServiceId.value) {
      await servicesApi.update(editingServiceId.value, {
        title: form.title,
        description: form.description,
        icon: form.icon || undefined,
        featured: form.featured,
        display_order: form.display_order
      })
    } else {
      await servicesApi.create({
        title: form.title,
        slug: form.slug || slugify(form.title),
        description: form.description,
        icon: form.icon || undefined,
        featured: form.featured,
        display_order: form.display_order
      })
    }

    await loadServices()
    closeForm()
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('dashboard.services.create.saveInProgress')
  } finally {
    submitting.value = false
  }
}

const removeService = async (service: Service) => {
  const confirmed = globalThis.confirm?.(`Delete ${service.title}?`) ?? true
  if (!confirmed) return

  pending.value = true
  error.value = ''
  try {
    await servicesApi.delete(service.id)
    await loadServices()
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('dashboard.services.create.loading')
  } finally {
    pending.value = false
  }
}

onMounted(loadServices)
</script>
