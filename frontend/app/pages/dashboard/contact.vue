<template>
  <div class="space-y-6">
    <!-- Page Header -->
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
          <UIcon name="i-lucide-download" class="h-4 w-4 mr-1" />
          {{ t('dashboard.contact.export.button') }}
        </UButton>
      </template>
    </DashboardPageHeader>

    <!-- Stats Overview -->
    <section class="grid gap-4 md:grid-cols-3">
      <DashboardMetricCard
        :label="t('dashboard.contact.stats.total')"
        :value="stats.total"
        icon="i-lucide-inbox"
        detail="All contact submissions."
      />
      <DashboardMetricCard
        :label="t('dashboard.contact.stats.new')"
        :value="stats.by_status.new"
        icon="i-lucide-bell"
        detail="New submissions pending review."
        trend="+ today"
      />
      <DashboardMetricCard
        :label="t('dashboard.contact.stats.qualified')"
        :value="stats.by_status.qualified"
        icon="i-lucide-circle-check"
        detail="Qualified leads ready for outreach."
        trend="ready"
      />
    </section>

    <!-- Filter Bar -->
    <UDashboardSection class="!p-0">
      <UDashboardFilterBar
        v-model:search="serviceFilter"
        v-model:filters="filters"
        :filter-options="filterOptions"
        search-placeholder="Filter by service..."
        @search="loadContactData"
      />
    </UDashboardSection>

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

    <!-- Bulk Actions Toolbar -->
    <UDashboardBulkActionsToolbar
      v-if="!pending"
      :selected-count="selectedCount"
      :total-count="submissions.length"
      :actions="bulkActions"
      @clear="clearSelection"
      @select-all="toggleAllSelection"
    />

    <!-- Content Section -->
    <UDashboardSection
      :badge="submissions.length"
      class="overflow-hidden"
    >
      <template #header>
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-es-text-secondary dark:text-es-text-secondary-dark">
              Submissions
            </p>
            <h2 class="mt-2 text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">
              Contact Leads
            </h2>
          </div>
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            :loading="pending"
            @click="loadContactData"
          >
            <UIcon name="i-lucide-refresh-cw" class="h-4 w-4 mr-1" />
            {{ t('dashboard.contact.filters.refresh') }}
          </UButton>
        </div>
      </template>

      <!-- Loading State -->
      <div v-if="pending">
        <UDashboardSkeleton type="table" :rows="5" :columns="6" />
      </div>

      <!-- Empty State -->
      <UDashboardEmptyState
        v-else-if="!submissions.length"
        icon="i-lucide-mail"
        title="No submissions yet"
        description="Contact form submissions will appear here when potential clients reach out through your website."
        :secondary-actions="[
          { label: 'View Contact Page', to: '/contact-us', icon: 'i-lucide-external-link', variant: 'outline' }
        ]"
        :tips="[
          'Monitor new submissions daily',
          'Update status as you progress leads',
          'Export data for CRM integration'
        ]"
      />

      <!-- Submissions Table -->
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
                  :disabled="!submissions.length"
                  class="h-4 w-4 rounded border-es-border bg-es-bg-primary text-es-accent-primary focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-accent-primary-dark dark:focus:ring-es-accent-primary-dark"
                  @change="toggleAllSelection"
                />
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ t('dashboard.contact.table.name') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ t('dashboard.contact.table.email') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ t('dashboard.contact.table.service') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ t('dashboard.contact.table.date') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ t('dashboard.contact.table.status') }}
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ t('dashboard.contact.table.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-es-border dark:divide-es-border-dark">
            <tr
              v-for="submission in submissions"
              :key="submission.id"
              :class="[
                'transition-colors',
                selectedIds.has(submission.id) ? 'bg-es-accent-primary/5 dark:bg-es-accent-primary-dark/5' : 'hover:bg-es-bg-tertiary/50 dark:hover:bg-es-bg-tertiary-dark/50'
              ]"
            >
              <td class="px-4 py-4">
                <input
                  type="checkbox"
                  :checked="selectedIds.has(submission.id)"
                  class="h-4 w-4 rounded border-es-border bg-es-bg-primary text-es-accent-primary focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-accent-primary-dark dark:focus:ring-es-accent-primary-dark"
                  @change="toggleSelection(submission.id)"
                />
              </td>
              <td class="px-6 py-4">
                <div class="font-medium text-es-text-primary dark:text-es-text-primary-dark">
                  {{ submission.full_name }}
                </div>
                <div class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
                  {{ submission.company_name || '-' }}
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ submission.email || '-' }}
              </td>
              <td class="px-6 py-4">
                <UBadge
                  color="neutral"
                  variant="soft"
                  size="sm"
                >
                  {{ submission.service }}
                </UBadge>
              </td>
              <td class="px-6 py-4 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ formatDate(submission.created_at) }}
              </td>
              <td class="px-6 py-4">
                <UBadge
                  :color="statusColor(submission.status)"
                  variant="soft"
                  size="sm"
                >
                  {{ submission.status }}
                </UBadge>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-2">
                  <USelect
                    :model-value="submission.status"
                    :options="statusOptions"
                    size="sm"
                    class="w-32"
                    :disabled="updatingId === submission.id"
                    @update:model-value="(val) => onStatusChange(submission.id, val as ContactStatus)"
                  />
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
import { useContactApi } from '../../composables/useApi'
import type { ContactStats, ContactSubmission, ContactStatus } from '../../types/api'

definePageMeta({
  layout: 'dashboard'
})

const { t } = useI18n()

useSeoMeta({
  title: t('dashboard.contact.seo.title'),
  description: t('dashboard.contact.seo.description')
})

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
const filters = ref({
  status: ''
})

// Bulk selection state
const selectedIds = ref<Set<string>>(new Set())
const isAllSelected = computed(() => {
  return submissions.value.length > 0 && submissions.value.every(s => selectedIds.value.has(s.id))
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
    submissions.value.forEach(s => selectedIds.value.delete(s.id))
  } else {
    submissions.value.forEach(s => selectedIds.value.add(s.id))
  }
}

const clearSelection = () => {
  selectedIds.value.clear()
}

// Bulk actions
const bulkActions = computed(() => [
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
    case 'export':
      const selectedSubmissions = submissions.value.filter(s => selectedIds.value.has(s.id))
      const rows = [
        ['id', 'full_name', 'email', 'company_name', 'service', 'status', 'created_at'],
        ...selectedSubmissions.map(item => [
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
      clearSelection()
      break
  }
}

const filterOptions = [
  {
    key: 'status',
    label: 'Status',
    type: 'select' as const,
    options: [
      { label: 'All Status', value: '' },
      { label: t('dashboard.contact.filters.statusOptions.new'), value: 'new' },
      { label: t('dashboard.contact.filters.statusOptions.contacted'), value: 'contacted' },
      { label: t('dashboard.contact.filters.statusOptions.qualified'), value: 'qualified' },
      { label: t('dashboard.contact.filters.statusOptions.converted'), value: 'converted' },
      { label: t('dashboard.contact.filters.statusOptions.lost'), value: 'lost' }
    ]
  }
]

const statusOptions = [
  { label: t('dashboard.contact.filters.statusOptions.new'), value: 'new' },
  { label: t('dashboard.contact.filters.statusOptions.contacted'), value: 'contacted' },
  { label: t('dashboard.contact.filters.statusOptions.qualified'), value: 'qualified' },
  { label: t('dashboard.contact.filters.statusOptions.converted'), value: 'converted' },
  { label: t('dashboard.contact.filters.statusOptions.lost'), value: 'lost' }
]

const statusColor = (status: ContactStatus) => {
  if (status === 'new') return 'info' as const
  if (status === 'contacted') return 'warning' as const
  if (status === 'qualified') return 'success' as const
  if (status === 'converted') return 'primary' as const
  return 'neutral' as const
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
        status: filters.value.status || undefined
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

const onStatusChange = async (id: string, nextStatus: ContactStatus) => {
  updatingId.value = id
  error.value = ''

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

watch([serviceFilter, () => filters.value.status], () => {
  loadContactData()
})

onMounted(loadContactData)
</script>
