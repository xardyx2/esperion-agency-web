<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <DashboardPageHeader
      eyebrow="Client showcase"
      :title="t('dashboard.clients.title')"
      :description="t('dashboard.clients.description')"
    >
      <template #actions>
        <UButton
          color="primary"
          class="rounded-full"
          @click="openCreate"
        >
          <UIcon name="i-lucide-plus" class="h-4 w-4 mr-1" />
          {{ t('dashboard.clients.newButton') }}
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

    <!-- Create/Edit Form -->
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
              {{ editingClientId ? 'Update' : 'Create' }}
            </p>
            <h2 class="mt-2 text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">
              {{ editingClientId ? t('dashboard.clients.create.update') : t('dashboard.clients.create.title') }}
            </h2>
          </div>

          <UButton
            color="neutral"
            variant="outline"
            class="rounded-full border-es-border text-es-text-primary dark:border-es-border-dark dark:text-es-text-primary-dark"
            :disabled="submitting"
            @click="closeForm"
          >
            <UIcon name="i-lucide-x" class="h-4 w-4 mr-1" />
            {{ t('dashboard.clients.create.cancel') }}
          </UButton>
        </div>
      </template>

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
          <USelect
            v-model="form.status"
            :options="[
              { label: t('dashboard.clients.status.active'), value: 'active' },
              { label: t('dashboard.clients.status.prospect'), value: 'prospect' },
              { label: t('dashboard.clients.status.inactive'), value: 'inactive' }
            ]"
            class="w-full"
          />
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
          <USwitch v-model="form.featured" size="sm" />
          {{ t('dashboard.clients.create.featured') }}
        </label>

        <div class="md:col-span-2 flex justify-end">
          <UButton
            type="submit"
            color="primary"
            class="rounded-full"
            :loading="submitting"
          >
            {{ submitting ? t('dashboard.clients.create.saveInProgress') : editingClientId ? t('dashboard.clients.create.saveButton') : t('dashboard.clients.create.createButton') }}
          </UButton>
        </div>
      </form>
    </UCard>

    <!-- Loading State -->
    <UDashboardSection v-if="pending && !showForm" class="overflow-hidden">
      <UDashboardSkeleton type="table" :rows="5" :columns="5" />
    </UDashboardSection>

    <!-- Bulk Actions Toolbar -->
    <UDashboardBulkActionsToolbar
      v-if="!pending && !showForm"
      :selected-count="selectedCount"
      :total-count="clients.length"
      :actions="bulkActions"
      @clear="clearSelection"
      @select-all="toggleAllSelection"
    />

    <!-- Content Section -->
    <UDashboardSection
      v-else-if="!showForm"
      :badge="clients.length"
    >
      <template #header>
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-es-text-secondary dark:text-es-text-secondary-dark">
              Clients
            </p>
            <h2 class="mt-2 text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">
              All Clients
            </h2>
          </div>
          <UBadge
            color="primary"
            variant="soft"
          >
            {{ clients.length }} items
          </UBadge>
        </div>
      </template>

      <!-- Empty State -->
      <UDashboardEmptyState
        v-if="!clients.length"
        icon="i-lucide-users-round"
        title="No clients yet"
        description="Add your first client to showcase on your website. Clients help build trust with potential customers."
        :primary-action="{ label: 'Add Client', icon: 'i-lucide-plus', onClick: openCreate }"
        :tips="[
          'Upload client logos for visual impact',
          'Add testimonials for social proof',
          'Categorize clients by industry'
        ]"
      />

      <!-- Clients Table -->
      <div
        v-else
        class="overflow-x-auto"
      >
        <table class="w-full">
          <thead class="bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark">
            <tr>
              <th class="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  :disabled="!clients.length"
                  class="h-4 w-4 rounded border-es-border bg-es-bg-primary text-es-accent-primary focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-accent-primary-dark dark:focus:ring-es-accent-primary-dark"
                  @change="toggleAllSelection"
                />
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ t('dashboard.clients.table.client') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ t('dashboard.clients.table.category') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ t('dashboard.clients.table.status') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-es-text-secondary dark:text-es-text-secondary-dark">
                Featured
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ t('dashboard.clients.table.testimonial') }}
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ t('dashboard.clients.table.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-es-border dark:divide-es-border-dark">
            <tr
              v-for="client in clients"
              :key="client.id"
              :class="[
                'transition-colors',
                selectedIds.has(client.id) ? 'bg-es-accent-primary/5 dark:bg-es-accent-primary-dark/5' : 'hover:bg-es-bg-tertiary/50 dark:hover:bg-es-bg-tertiary-dark/50'
              ]"
            >
              <td class="px-4 py-4">
                <input
                  type="checkbox"
                  :checked="selectedIds.has(client.id)"
                  class="h-4 w-4 rounded border-es-border bg-es-bg-primary text-es-accent-primary focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-accent-primary-dark dark:focus:ring-es-accent-primary-dark"
                  @change="toggleSelection(client.id)"
                />
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-es-bg-tertiary text-es-text-secondary dark:bg-es-bg-tertiary-dark dark:text-es-text-secondary-dark">
                    <UIcon v-if="!client.logo" name="i-lucide-building-2" class="h-5 w-5" />
                    <span v-else class="text-xs">Logo</span>
                  </div>
                  <div class="font-medium text-es-text-primary dark:text-es-text-primary-dark">
                    <UInlineEdit
                      v-model="client.name"
                      type="text"
                      placeholder="Client name"
                      @save="(value, prev) => handleInlineEdit(client.id, 'name', value, prev)"
                    />
                  </div>
                  <UBadge
                    v-if="client.featured"
                    color="warning"
                    variant="soft"
                    size="xs"
                  >
                    <UIcon name="i-lucide-star" class="h-3 w-3 mr-1" />
                    Featured
                  </UBadge>
                </div>
              </td>
              <td class="px-6 py-4">
                <UInlineEdit
                  v-model="client.category"
                  type="text"
                  placeholder="Category"
                  @save="(value, prev) => handleInlineEdit(client.id, 'category', value, prev)"
                />
              </td>
              <td class="px-6 py-4">
                <UBadge
                  :color="client.status === 'active' ? 'success' : client.status === 'prospect' ? 'info' : 'neutral'"
                  variant="soft"
                  size="sm"
                >
                  {{ client.status }}
                </UBadge>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <span class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">Featured:</span>
                  <UInlineEdit
                    v-model="client.featured"
                    type="toggle"
                    @save="(value, prev) => handleInlineEdit(client.id, 'featured', value, prev)"
                  />
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
                <div class="flex items-center gap-2">
                  <UIcon
                    :name="client.testimonial ? 'i-lucide-check-circle' : 'i-lucide-circle'"
                    class="h-4 w-4"
                    :class="client.testimonial ? 'text-green-500' : 'text-es-text-tertiary'"
                  />
                  {{ client.testimonial ? t('dashboard.clients.testimonialStatus.available') : t('dashboard.clients.testimonialStatus.none') }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex justify-end gap-2">
                  <UButton
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    @click="openEdit(client)"
                  >
                    <UIcon name="i-lucide-pencil" class="h-4 w-4 mr-1" />
                    {{ t('dashboard.clients.buttons.edit') }}
                  </UButton>
                  <UButton
                    color="danger"
                    variant="ghost"
                    size="sm"
                    @click="removeClient(client)"
                  >
                    <UIcon name="i-lucide-trash-2" class="h-4 w-4" />
                  </UButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UDashboardSection>
  </div>
</template>

<script setup lang="ts">
import { useClientsApi } from '../../composables/useApi'
import type { Client } from '../../types/api'

definePageMeta({
  layout: 'dashboard'
})

const { t } = useI18n()
const toast = useToast()

useSeoMeta({
  title: t('dashboard.clients.seo.title'),
  description: t('dashboard.clients.seo.description')
})

const clientsApi = useClientsApi()

const clients = ref<Client[]>([])
const pending = ref(false)
const submitting = ref(false)
const error = ref('')
const showForm = ref(false)
const editingClientId = ref<string | null>(null)

// Bulk selection state
const selectedIds = ref<Set<string>>(new Set())
const isAllSelected = computed(() => {
  return clients.value.length > 0 && clients.value.every(c => selectedIds.value.has(c.id))
})
const selectedCount = computed(() => selectedIds.value.size)

const toggleSelection = (id: string) => {
  if (selectedIds.value.has(id)) {
    selectedIds.value.delete(id)
  } else {
    selectedIds.value.add(id)
  }
}

const toggleAllSelection = () => {
  if (isAllSelected.value) {
    clients.value.forEach(c => selectedIds.value.delete(c.id))
  } else {
    clients.value.forEach(c => selectedIds.value.add(c.id))
  }
}

const clearSelection = () => {
  selectedIds.value.clear()
}

// Bulk actions
const bulkActions = computed(() => [
  { 
    label: 'Delete', 
    icon: 'i-lucide-trash-2', 
    color: 'error' as const,
    onClick: () => handleBulkAction('delete')
  },
  { 
    label: 'Export', 
    icon: 'i-lucide-download', 
    color: 'primary' as const,
    onClick: () => handleBulkAction('export')
  }
])

const handleBulkAction = async (action: string) => {
  const ids = Array.from(selectedIds.value)
  
  switch (action) {
    case 'delete':
      if (confirm(`Delete ${ids.length} clients?`)) {
        for (const id of ids) {
          await clientsApi.delete(id)
        }
        clearSelection()
        await loadClients()
      }
      break
    case 'export':
      const data = clients.value.filter(c => selectedIds.value.has(c.id))
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `clients-export-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
      clearSelection()
      break
  }
}

const form = reactive({
  name: '',
  logo: '',
  category: '',
  status: 'active',
  testimonial: '',
  internal_notes: '',
  featured: false
})

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

// Inline editing
const handleInlineEdit = async (id: string, field: string, value: any, previousValue: any) => {
  try {
    await clientsApi.update(id, { [field]: value })
    toast.add({
      title: 'Updated',
      description: `${field} updated successfully`,
      color: 'success',
      actions: [
        {
          label: 'Undo',
          click: async () => {
            await clientsApi.update(id, { [field]: previousValue })
            await loadClients()
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
    await loadClients()
  }
}

onMounted(loadClients)
</script>
