<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-2">
          {{ t('dashboard.services.title') }}
        </h1>
        <p class="text-es-text-secondary dark:text-es-text-secondary-dark">
          {{ t('dashboard.services.description') }}
        </p>
      </div>
      <button
        type="button"
        class="inline-flex items-center justify-center px-6 py-3 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors"
        @click="openCreate"
      >
        <span class="text-xl mr-2">+</span> {{ t('dashboard.services.newButton') }}
      </button>
    </div>

    <div
      v-if="error"
      class="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <section
      v-if="showForm"
      class="rounded-xl border border-es-border bg-es-bg-secondary p-5 shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark"
    >
      <div class="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">
            {{ editingServiceId ? t('dashboard.services.create.update') : t('dashboard.services.create.title') }}
          </h2>
          <p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
            {{ editingServiceId ? 'Update retained service catalog fields.' : t('dashboard.services.create.title') }}
          </p>
        </div>
        <button
          type="button"
          class="rounded-lg border border-es-border px-3 py-2 text-sm text-es-text-primary hover:bg-es-bg-tertiary dark:border-es-border-dark dark:text-es-text-primary-dark dark:hover:bg-es-bg-tertiary-dark"
          :disabled="submitting"
          @click="closeForm"
        >
          {{ t('dashboard.services.create.cancel') }}
        </button>
      </div>

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
          ></textarea>
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
          <button
            type="submit"
            class="inline-flex items-center justify-center rounded-lg bg-es-accent-primary px-5 py-3 font-semibold text-es-text-inverse transition-colors hover:bg-es-accent-primary-hover disabled:opacity-60 dark:bg-es-accent-primary-dark dark:text-es-text-inverse-dark dark:hover:bg-es-accent-primary-hover-dark"
            :disabled="submitting"
          >
            {{ submitting ? t('dashboard.services.create.saveInProgress') : editingServiceId ? t('dashboard.services.create.saveButton') : t('dashboard.services.create.createButton') }}
          </button>
        </div>
      </form>
    </section>

    <div
      v-if="pending"
      class="rounded-xl border border-es-border bg-es-bg-secondary px-4 py-6 text-sm text-es-text-secondary dark:border-es-border-dark dark:bg-es-bg-secondary-dark dark:text-es-text-secondary-dark"
    >
      {{ t('dashboard.services.create.loading') }}
    </div>

    <div
      v-else
      class="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <div
        v-for="service in services"
        :key="service.id"
        class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6"
      >
        <div class="text-sm mb-4 text-es-text-secondary dark:text-es-text-secondary-dark">
          {{ service.icon || t('dashboard.services.buttons.noIcon') }}
        </div>
        <h3 class="font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-2">
          {{ service.title }}
        </h3>
        <p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark mb-4 line-clamp-2">
          {{ service.description }}
        </p>
        <div class="flex items-center justify-between">
          <span
            v-if="service.featured"
            class="px-2 py-1 bg-yellow-500/10 text-yellow-500 text-xs rounded-full"
          >{{ t('dashboard.services.buttons.featured') }}</span>
          <div class="flex items-center gap-2 ml-auto">
            <button
              type="button"
              class="p-2 hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark rounded-lg"
              @click="openEdit(service)"
            >
              {{ t('dashboard.services.buttons.edit') }}
            </button>
            <button
              type="button"
              class="p-2 hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark rounded-lg"
              @click="removeService(service)"
            >
              {{ t('dashboard.services.buttons.delete') }}
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="!services.length"
        class="col-span-full rounded-xl border border-es-border bg-es-bg-secondary px-4 py-8 text-center text-sm text-es-text-secondary dark:border-es-border-dark dark:bg-es-bg-secondary-dark dark:text-es-text-secondary-dark"
      >
        {{ t('dashboard.services.noResults') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
