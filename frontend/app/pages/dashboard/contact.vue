<template>
  <div class="space-y-8">
    <DashboardPageHeader
      eyebrow="Leads"
      :title="t('dashboard.contact.title')"
      :description="t('dashboard.contact.description')"
    >
      <template #actions>
        <UButton
          color="primary"
          variant="outline"
          class="rounded-full"
          @click="exportCsv"
        >
          <template #leading>
            <UIcon
              name="i-lucide-download"
              class="h-4 w-4"
            />
          </template>
          {{ t('dashboard.contact.export.button') }}
        </UButton>
      </template>
    </DashboardPageHeader>

    <section class="grid gap-4 md:grid-cols-3">
      <DashboardMetricCard
        :label="t('dashboard.contact.stats.total')"
        :value="stats.total"
        :icon="'i-lucide-inbox'"
        detail="All contact submissions."
      />
      <DashboardMetricCard
        :label="t('dashboard.contact.stats.new')"
        :value="stats.by_status.new"
        :icon="'i-lucide-bell'"
        detail="New submissions pending review."
      />
      <DashboardMetricCard
        :label="t('dashboard.contact.stats.qualified')"
        :value="stats.by_status.qualified"
        :icon="'i-lucide-circle-check'"
        detail="Qualified leads ready for outreach."
      />
    </section>

    <UCard
      :ui="{
        root: 'rounded-3xl border border-es-border bg-es-bg-secondary shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark',
        body: 'p-4'
      }"
    >
      <div class="flex flex-col gap-4 md:flex-row">
        <input
          v-model="serviceFilter"
          type="text"
          :placeholder="t('dashboard.contact.filters.service')"
          class="flex-1 rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"
        >
        <select
          v-model="statusFilter"
          class="rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"
        >
          <option value="">
            {{ t('dashboard.contact.filters.allStatuses') }}
          </option>
          <option value="new">
            {{ t('dashboard.contact.filters.statusOptions.new') }}
          </option>
          <option value="contacted">
            {{ t('dashboard.contact.filters.statusOptions.contacted') }}
          </option>
          <option value="qualified">
            {{ t('dashboard.contact.filters.statusOptions.qualified') }}
          </option>
          <option value="converted">
            {{ t('dashboard.contact.filters.statusOptions.converted') }}
          </option>
          <option value="lost">
            {{ t('dashboard.contact.filters.statusOptions.lost') }}
          </option>
        </select>
        <UButton
          color="neutral"
          variant="outline"
          class="rounded-lg"
          :loading="pending"
          @click="loadContactData"
        >
          {{ t('dashboard.contact.filters.refresh') }}
        </UButton>
      </div>
    </UCard>

    <UCard
      :ui="{
        root: 'rounded-3xl border border-es-border bg-es-bg-secondary shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark',
        body: 'p-0'
      }"
    >
      <div
        v-if="error"
        class="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700"
      >
        {{ error }}
      </div>

      <div
        v-if="pending"
        class="px-4 py-6 text-sm text-es-text-secondary dark:text-es-text-secondary-dark"
      >
        {{ t('dashboard.contact.loading') }}
      </div>

      <div
        v-else-if="submissions.length"
        class="overflow-hidden"
      >
        <table class="w-full">
          <thead class="bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark uppercase">
                {{ t('dashboard.contact.table.name') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark uppercase">
                {{ t('dashboard.contact.table.email') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark uppercase">
                {{ t('dashboard.contact.table.service') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark uppercase">
                {{ t('dashboard.contact.table.date') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark uppercase">
                {{ t('dashboard.contact.table.status') }}
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark uppercase">
                {{ t('dashboard.contact.table.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-es-border dark:divide-es-border-dark">
            <tr
              v-for="submission in submissions"
              :key="submission.id"
              class="hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark"
            >
              <td class="px-6 py-4">
                <div>
                  <div class="font-medium text-es-text-primary dark:text-es-text-primary-dark">
                    {{ submission.full_name }}
                  </div>
                  <div class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
                    {{ submission.company_name || '-' }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ submission.email || '-' }}
              </td>
              <td class="px-6 py-4">
                <span class="px-3 py-1 bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 text-es-accent-primary dark:text-es-accent-primary-dark text-xs rounded-full">{{ submission.service }}</span>
              </td>
              <td class="px-6 py-4 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ formatDate(submission.created_at) }}
              </td>
              <td class="px-6 py-4">
                <span
                  :class="statusClass(submission.status)"
                  class="px-3 py-1 text-xs rounded-full capitalize"
                >{{ submission.status }}</span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <select
                    :value="submission.status"
                    class="rounded-lg border border-es-border bg-es-bg-primary px-3 py-2 text-xs text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"
                    :disabled="updatingId === submission.id"
                    @change="onStatusChange(submission.id, $event)"
                  >
                    <option value="new">
                      {{ t('dashboard.contact.filters.statusOptions.new') }}
                    </option>
                    <option value="contacted">
                      {{ t('dashboard.contact.filters.statusOptions.contacted') }}
                    </option>
                    <option value="qualified">
                      {{ t('dashboard.contact.filters.statusOptions.qualified') }}
                    </option>
                    <option value="converted">
                      {{ t('dashboard.contact.filters.statusOptions.converted') }}
                    </option>
                    <option value="lost">
                      {{ t('dashboard.contact.filters.statusOptions.lost') }}
                    </option>
                  </select>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        v-else-if="!pending && !error"
        class="px-6 py-10 text-center text-sm text-es-text-secondary dark:text-es-text-secondary-dark"
      >
        {{ t('dashboard.contact.table.noResults') }}
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useContactApi } from '../../composables/useApi'
import type { ContactStats, ContactSubmission, ContactStatus } from '../../types/api'

definePageMeta({
  layout: 'dashboard'
})

const { t } = useI18n()

useSeoMeta({ title: t('dashboard.contact.seo.title'), description: t('dashboard.contact.seo.description') })

const contactApi = useContactApi()

const submissions = ref<ContactSubmission[]>([])
const stats = reactive<ContactStats>({
  total: 0,
  by_status: {
    new: 0,
    contacted: 0,
    qualified: 0,
    converted: 0,
    lost: 0
  },
  by_service: []
})

const pending = ref(false)
const error = ref('')
const updatingId = ref<string | null>(null)
const serviceFilter = ref('')
const statusFilter = ref('')

const statusClass = (status: ContactStatus) => {
  if (status === 'new') return 'bg-blue-500/10 text-blue-500'
  if (status === 'contacted') return 'bg-yellow-500/10 text-yellow-500'
  if (status === 'qualified') return 'bg-green-500/10 text-green-500'
  if (status === 'converted') return 'bg-emerald-500/10 text-emerald-500'
  return 'bg-gray-500/10 text-gray-500'
}

const formatDate = (value?: string) => {
  if (!value) return '-'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString()
}

const loadContactData = async () => {
  pending.value = true
  error.value = ''
  try {
    const [listResponse, statsResponse] = await Promise.all([
      contactApi.list({
        limit: 100,
        service: serviceFilter.value || undefined,
        status: statusFilter.value || undefined
      }),
      contactApi.stats()
    ])
    submissions.value = listResponse.data
    stats.total = statsResponse.total
    stats.by_status = statsResponse.by_status
    stats.by_service = statsResponse.by_service
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('dashboard.contact.loading')
  } finally {
    pending.value = false
  }
}

const onStatusChange = async (id: string, event: Event) => {
  const target = event.target
  if (!(target instanceof HTMLSelectElement)) return

  updatingId.value = id
  error.value = ''

  const nextStatus = target.value as ContactStatus
  try {
    await contactApi.update(id, { status: nextStatus })
    const existing = submissions.value.find(item => item.id === id)
    if (existing) {
      existing.status = nextStatus
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to update submission status'
    await loadContactData()
  } finally {
    updatingId.value = null
  }
}

const exportCsv = () => {
  if (typeof window === 'undefined') return
  const rows = [
    ['id', 'full_name', 'email', 'company_name', 'service', 'status', 'created_at'],
    ...submissions.value.map(item => [
      item.id,
      item.full_name,
      item.email || '',
      item.company_name || '',
      item.service,
      item.status,
      item.created_at || ''
    ])
  ]

  const csv = rows
    .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `contact-submissions-${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

watch([serviceFilter, statusFilter], () => {
  loadContactData()
})

onMounted(loadContactData)
</script>
