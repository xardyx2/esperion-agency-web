<template>
  <div class="space-y-6">
    <DashboardPageHeader
      eyebrow="Client showcase"
      :title="t('dashboard.clients.title')"
      :description="t('dashboard.clients.description')"
    >
      <template #actions>
        <button
          type="button"
          class="inline-flex items-center justify-center rounded-full bg-es-accent-primary px-6 py-3 font-semibold text-es-text-inverse transition-colors hover:bg-es-accent-primary-hover dark:bg-es-accent-primary-dark dark:text-es-text-inverse-dark dark:hover:bg-es-accent-primary-hover-dark"
          @click="openCreate"
        >
          <span class="mr-2 text-xl">+</span> {{ t('dashboard.clients.newButton') }}
        </button>
      </template>
    </DashboardPageHeader>

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
            {{ editingClientId ? t('dashboard.clients.create.update') : t('dashboard.clients.create.title') }}
          </h2>
          <p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
            {{ editingClientId ? 'Update retained client showcase details.' : t('dashboard.clients.create.title') }}
          </p>
        </div>
        <button
          type="button"
          class="rounded-lg border border-es-border px-3 py-2 text-sm text-es-text-primary hover:bg-es-bg-tertiary dark:border-es-border-dark dark:text-es-text-primary-dark dark:hover:bg-es-bg-tertiary-dark"
          :disabled="submitting"
          @click="closeForm"
        >
          {{ t('dashboard.clients.create.cancel') }}
        </button>
      </div>

      <form
        class="grid gap-4 md:grid-cols-2"
        @submit.prevent="submitForm"
      >
        <label class="space-y-2 text-sm">
          <span class="block font-medium text-es-text-primary dark:text-es-text-primary-dark">{{ t('dashboard.clients.create.nameTitle') }}</span>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"
          >
        </label>

        <label class="space-y-2 text-sm">
          <span class="block font-medium text-es-text-primary dark:text-es-text-primary-dark">{{ t('dashboard.clients.create.logoTitle') }}</span>
          <input
            v-model="form.logo"
            type="text"
            required
            :placeholder="t('dashboard.clients.create.logoPlaceholder')"
            class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"
          >
        </label>

        <label class="space-y-2 text-sm">
          <span class="block font-medium text-es-text-primary dark:text-es-text-primary-dark">{{ t('dashboard.clients.create.categoryTitle') }}</span>
          <input
            v-model="form.category"
            type="text"
            :placeholder="t('dashboard.clients.create.categoryPlaceholder')"
            class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"
          >
        </label>

        <label class="space-y-2 text-sm">
          <span class="block font-medium text-es-text-primary dark:text-es-text-primary-dark">{{ t('dashboard.clients.create.statusTitle') }}</span>
          <select
            v-model="form.status"
            class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"
          >
            <option value="active">{{ t('dashboard.clients.status.active') }}</option>
            <option value="prospect">{{ t('dashboard.clients.status.prospect') }}</option>
            <option value="inactive">{{ t('dashboard.clients.status.inactive') }}</option>
          </select>
        </label>

        <label class="space-y-2 text-sm md:col-span-2">
          <span class="block font-medium text-es-text-primary dark:text-es-text-primary-dark">{{ t('dashboard.clients.create.testimonialTitle') }}</span>
          <textarea
            v-model="form.testimonial"
            rows="3"
            class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"
          />
        </label>

        <label class="space-y-2 text-sm md:col-span-2">
          <span class="block font-medium text-es-text-primary dark:text-es-text-primary-dark">{{ t('dashboard.clients.create.internalNotesTitle') }}</span>
          <textarea
            v-model="form.internal_notes"
            rows="3"
            class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"
          />
        </label>

        <label class="flex items-center gap-3 text-sm text-es-text-primary dark:text-es-text-primary-dark md:col-span-2">
          <input
            v-model="form.featured"
            type="checkbox"
            class="h-4 w-4 rounded border-es-border text-es-accent-primary focus:ring-es-accent-primary"
          >
          {{ t('dashboard.clients.create.featured') }}
        </label>

        <div class="md:col-span-2 flex justify-end">
          <button
            type="submit"
            class="inline-flex items-center justify-center rounded-lg bg-es-accent-primary px-5 py-3 font-semibold text-es-text-inverse transition-colors hover:bg-es-accent-primary-hover disabled:opacity-60 dark:bg-es-accent-primary-dark dark:text-es-text-inverse-dark dark:hover:bg-es-accent-primary-hover-dark"
            :disabled="submitting"
          >
            {{ submitting ? t('dashboard.clients.create.saveInProgress') : editingClientId ? t('dashboard.clients.create.saveButton') : t('dashboard.clients.create.createButton') }}
          </button>
        </div>
      </form>
    </section>

    <div
      v-if="pending"
      class="rounded-xl border border-es-border bg-es-bg-secondary px-4 py-6 text-sm text-es-text-secondary dark:border-es-border-dark dark:bg-es-bg-secondary-dark dark:text-es-text-secondary-dark"
    >
      {{ t('dashboard.clients.create.loading') }}
    </div>

    <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl overflow-hidden">
      <table class="w-full">
        <thead class="bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark uppercase">
              {{ t('dashboard.clients.table.client') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark uppercase">
              {{ t('dashboard.clients.table.category') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark uppercase">
              {{ t('dashboard.clients.table.status') }}
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark uppercase">
              {{ t('dashboard.clients.table.testimonial') }}
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark uppercase">
              {{ t('dashboard.clients.table.actions') }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-es-border dark:divide-es-border-dark">
          <tr
            v-for="client in clients"
            :key="client.id"
            class="hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark"
          >
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark flex items-center justify-center">
                  {{ client.logo ? 'Logo' : t('dashboard.clients.status.n_a') }}
                </div>
                <div>
                  <div class="font-medium text-es-text-primary dark:text-es-text-primary-dark">
                    {{ client.name }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <span class="px-3 py-1 bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 text-es-accent-primary dark:text-es-accent-primary-dark text-xs rounded-full">{{ client.category || '-' }}</span>
            </td>
            <td class="px-6 py-4">
              <span
                :class="statusClass(client.status)"
                class="px-3 py-1 text-xs rounded-full capitalize"
              >{{ client.status }}</span>
            </td>
            <td class="px-6 py-4 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
              {{ client.testimonial ? t('dashboard.clients.testimonialStatus.available') : t('dashboard.clients.testimonialStatus.none') }}
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-2">
                <button
                  type="button"
                  class="p-2 hover:bg-es-bg-primary dark:hover:bg-es-bg-primary-dark rounded-lg"
                  @click="openEdit(client)"
                >
                  {{ t('dashboard.clients.buttons.edit') }}
                </button>
                <button
                  type="button"
                  class="p-2 hover:bg-es-bg-primary dark:hover:bg-es-bg-primary-dark rounded-lg"
                  @click="removeClient(client)"
                >
                  {{ t('dashboard.clients.buttons.delete') }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div
        v-if="!pending && !clients.length"
        class="px-6 py-10 text-center text-sm text-es-text-secondary dark:text-es-text-secondary-dark"
      >
        {{ t('dashboard.clients.table.noResults') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})



import { useClientsApi } from '../../composables/useApi'
import type { Client } from '../../types/api'

const { t } = useI18n()

useSeoMeta({ title: t('dashboard.clients.seo.title'), description: t('dashboard.clients.seo.description') })

const clientsApi = useClientsApi()

const clients = ref<Client[]>([])
const pending = ref(false)
const submitting = ref(false)
const error = ref('')
const showForm = ref(false)
const editingClientId = ref<string | null>(null)

const form = reactive({
  name: '',
  logo: '',
  category: '',
  status: 'active',
  testimonial: '',
  internal_notes: '',
  featured: false
})

const statusClass = (status: string) => {
  if (status === 'active') return 'bg-green-500/10 text-green-500'
  if (status === 'prospect') return 'bg-blue-500/10 text-blue-500'
  return 'bg-gray-500/10 text-gray-500'
}

const resetForm = () => {
  form.name = ''
  form.logo = ''
  form.category = ''
  form.status = 'active'
  form.testimonial = ''
  form.internal_notes = ''
  form.featured = false
  editingClientId.value = null
}

const openCreate = () => {
  resetForm()
  showForm.value = true
}

const openEdit = (client: Client) => {
  editingClientId.value = client.id
  form.name = client.name
  form.logo = client.logo
  form.category = client.category || ''
  form.status = client.status
  form.testimonial = client.testimonial || ''
  form.internal_notes = client.internal_notes || ''
  form.featured = client.featured
  showForm.value = true
}

const closeForm = () => {
  resetForm()
  showForm.value = false
}

const loadClients = async () => {
  pending.value = true
  error.value = ''
  try {
    const response = await clientsApi.list({ limit: 100 })
    clients.value = response.data
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('dashboard.clients.create.loading')
  } finally {
    pending.value = false
  }
}

const submitForm = async () => {
  submitting.value = true
  error.value = ''
  try {
    if (editingClientId.value) {
      await clientsApi.update(editingClientId.value, {
        name: form.name,
        logo: form.logo,
        category: form.category || undefined,
        status: form.status,
        testimonial: form.testimonial || undefined,
        internal_notes: form.internal_notes || undefined,
        featured: form.featured
      })
    } else {
      await clientsApi.create({
        name: form.name,
        logo: form.logo,
        category: form.category || undefined,
        status: form.status,
        testimonial: form.testimonial || undefined,
        internal_notes: form.internal_notes || undefined,
        featured: form.featured
      })
    }

    await loadClients()
    closeForm()
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('dashboard.clients.create.saveInProgress')
  } finally {
    submitting.value = false
  }
}

const removeClient = async (client: Client) => {
  const confirmed = globalThis.confirm?.(`Delete ${client.name}?`) ?? true
  if (!confirmed) return

  pending.value = true
  error.value = ''
  try {
    await clientsApi.delete(client.id)
    await loadClients()
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('dashboard.clients.create.loading')
  } finally {
    pending.value = false
  }
}

onMounted(loadClients)
</script>
