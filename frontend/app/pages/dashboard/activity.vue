<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <DashboardPageHeader
      eyebrow="System monitoring"
      :title="t('dashboard.activity.title')"
      :description="t('dashboard.activity.description')"
    >
      <template #actions>
        <UButton
          color="primary"
          variant="outline"
          class="rounded-full"
          :loading="exporting"
          @click="exportToCSV"
        >
          <UIcon name="i-lucide-download" class="h-4 w-4 mr-1" />
          {{ t('dashboard.activity.export') }}
        </UButton>
      </template>
    </DashboardPageHeader>

    <!-- Filter Bar -->
    <UDashboardSection class="!p-0">
      <div class="flex flex-col gap-4 p-4">
        <!-- Date Range Filter -->
        <div class="flex flex-wrap items-center gap-2">
          <UButton
            v-for="range in dateRanges"
            :key="range.value"
            size="sm"
            :variant="dateRange === range.value ? 'solid' : 'ghost'"
            :color="dateRange === range.value ? 'primary' : 'neutral'"
            class="rounded-full text-xs"
            @click="setDateRange(range.value)"
          >
            {{ range.label }}
          </UButton>
          
          <!-- Custom Date Range -->
          <div class="relative">
            <UPopover :content="{ align: 'start' }">
              <UButton
                size="sm"
                :variant="dateRange === 'custom' ? 'solid' : 'ghost'"
                :color="dateRange === 'custom' ? 'primary' : 'neutral'"
                class="rounded-full text-xs"
              >
                <UIcon name="i-lucide-calendar" class="h-3 w-3 mr-1" />
                {{ t('dashboard.activity.customRange') }}
              </UButton>
              
              <template #content>
                <div class="p-4 space-y-3">
                  <div>
                    <label class="text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark">
                      {{ t('dashboard.activity.startDate') }}
                    </label>
                    <UInput
                      v-model="customStartDate"
                      type="date"
                      class="w-full"
                      @change="applyCustomRange"
                    />
                  </div>
                  <div>
                    <label class="text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark">
                      {{ t('dashboard.activity.endDate') }}
                    </label>
                    <UInput
                      v-model="customEndDate"
                      type="date"
                      class="w-full"
                      @change="applyCustomRange"
                    />
                  </div>
                </div>
              </template>
            </UPopover>
          </div>
        </div>

        <!-- Type and User Filters -->
        <div class="flex flex-wrap items-center gap-3">
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-es-text-secondary dark:text-es-text-secondary-dark">
              {{ t('dashboard.activity.activityType') }}:
            </label>
            <USelect
              v-model="activityType"
              :options="activityTypeOptions"
              class="w-[180px]"
              @update:model-value="filterActivities"
            />
          </div>
          
          <div class="flex items-center gap-2">
            <label class="text-sm font-medium text-es-text-secondary dark:text-es-text-secondary-dark">
              {{ t('dashboard.activity.userFilter') }}:
            </label>
            <USelect
              v-model="selectedUser"
              :options="userOptions"
              option-attribute="label"
              value-attribute="value"
              class="w-[200px]"
              @update:model-value="filterActivities"
            />
          </div>
          
          <!-- Clear Filters -->
          <UButton
            v-if="hasActiveFilters"
            color="neutral"
            variant="ghost"
            size="sm"
            class="text-xs"
            @click="clearFilters"
          >
            <UIcon name="i-lucide-x" class="h-3 w-3 mr-1" />
            {{ t('dashboard.activity.clearFilters') }}
          </UButton>
        </div>
      </div>
    </UDashboardSection>

    <!-- Loading State -->
    <UDashboardSection v-if="loading" class="overflow-hidden">
      <UDashboardSkeleton type="list" :rows="8" />
    </UDashboardSection>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="rounded-3xl border border-red-200 bg-red-50 px-4 py-6"
    >
      <div class="flex items-center gap-3">
        <UIcon name="i-lucide-alert-circle" class="h-5 w-5 text-red-600" />
        <p class="text-sm text-red-700">{{ error }}</p>
      </div>
    </div>

    <!-- Activity Feed Section -->
    <UDashboardSection
      v-else
      :badge="filteredActivities.length"
      class="overflow-hidden"
    >
      <template #header>
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-es-text-secondary dark:text-es-text-secondary-dark">
              {{ t('dashboard.activity.feedTitle') }}
            </p>
            <h2 class="mt-2 text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">
              {{ t('dashboard.activity.allActivity') }}
            </h2>
          </div>
          <UBadge
            color="primary"
            variant="soft"
          >
            {{ filteredActivities.length }} {{ t('dashboard.activity.items') }}
          </UBadge>
        </div>
      </template>

      <!-- Empty State -->
      <UDashboardEmptyState
        v-if="!filteredActivities.length"
        icon="i-lucide-activity"
        :title="t('dashboard.activity.emptyState.title')"
        :description="t('dashboard.activity.emptyState.description')"
        :secondary-actions="[
          { label: t('dashboard.activity.clearFilters'), icon: 'i-lucide-x', variant: 'ghost', onClick: clearFilters }
        ]"
        :tips="[
          t('dashboard.activity.emptyState.tips[0]'),
          t('dashboard.activity.emptyState.tips[1]'),
          t('dashboard.activity.emptyState.tips[2]')
        ]"
      />

      <!-- Activity List -->
      <div
        v-else
        class="divide-y divide-es-border dark:divide-es-border-dark"
      >
        <div
          v-for="activity in filteredActivities"
          :key="activity.id"
          class="group flex items-start gap-3 px-6 py-4 transition-colors hover:bg-es-bg-tertiary/30 dark:hover:bg-es-bg-tertiary-dark/30"
        >
          <!-- Icon -->
          <div
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
            :class="{
              'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400': getActivityColor(activity.type) === 'success',
              'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400': getActivityColor(activity.type) === 'info',
              'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400': getActivityColor(activity.type) === 'error',
              'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400': getActivityColor(activity.type) === 'primary',
              'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400': getActivityColor(activity.type) === 'neutral'
            }"
          >
            <UIcon :name="getActivityIcon(activity.type)" class="h-5 w-5" />
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <p class="text-sm text-es-text-primary dark:text-es-text-primary-dark">
              <span class="font-medium">{{ activity.user.name }}</span>
              {{ activity.action }}
              <NuxtLink
                v-if="activity.target?.link"
                :to="activity.target.link"
                class="font-medium text-es-accent-primary hover:underline dark:text-es-accent-primary-dark"
              >
                {{ activity.target.name }}
              </NuxtLink>
              <span v-else-if="activity.target" class="font-medium">
                {{ activity.target.name }}
              </span>
            </p>
            <p class="mt-0.5 text-xs text-es-text-tertiary dark:text-es-text-tertiary-dark">
              {{ formatTime(activity.timestamp) }}
            </p>
          </div>

          <!-- Avatar -->
          <UAvatar
            v-if="activity.user.avatar"
            :src="activity.user.avatar"
            :alt="activity.user.name"
            size="xs"
          />
        </div>
      </div>

      <!-- Load More -->
      <div
        v-if="hasMore"
        class="border-t border-es-border px-6 py-3 dark:border-es-border-dark"
      >
        <UButton
          variant="ghost"
          color="neutral"
          size="sm"
          class="w-full rounded-lg"
          :loading="loading"
          @click="loadMore"
        >
          <UIcon name="i-lucide-chevron-down" class="mr-2 h-4 w-4" />
          {{ t('dashboard.activity.loadMore') }}
        </UButton>
      </div>
    </UDashboardSection>
  </div>
</template>

<script setup lang="ts">
import { useActivityFeed, type ActivityEvent, type ActivityUser } from '../../composables/useActivityFeed'

definePageMeta({
  layout: 'dashboard'
})

const { t } = useI18n()
const localePath = useLocalePath()
const toast = useToast()

useSeoMeta({
  title: t('dashboard.activity.seo.title'),
  description: t('dashboard.activity.seo.description')
})

// Date range options
const dateRanges = [
  { label: t('dashboard.activity.today'), value: 'today' },
  { label: t('dashboard.activity.last7Days'), value: '7days' },
  { label: t('dashboard.activity.last30Days'), value: '30days' },
  { label: t('dashboard.activity.allTime'), value: 'all' }
]

// Activity type options
const activityTypeOptions = [
  { label: t('dashboard.activity.allTypes'), value: 'all' },
  { label: t('dashboard.activity.contentType'), value: 'content' },
  { label: t('dashboard.activity.userType'), value: 'user' },
  { label: t('dashboard.activity.systemType'), value: 'system' }
]

// State
const dateRange = ref('all')
const customStartDate = ref('')
const customEndDate = ref('')
const activityType = ref('all')
const selectedUser = ref('all')
const exporting = ref(false)

// Fetch activities using composable
const {
  activities,
  loading,
  hasMore,
  loadMore: loadMoreActivities
} = useActivityFeed({
  transport: 'polling',
  endpoint: '/api/v1/activity',
  pollInterval: 30000,
  autoConnect: true
})

const error = ref('')

// Sample users for filter (in production, fetch from users API)
const users: ActivityUser[] = [
  { id: '1', name: 'John Doe', avatar: '' },
  { id: '2', name: 'Jane Smith', avatar: '' },
  { id: '3', name: 'Admin User', avatar: '' }
]

const userOptions = computed(() => [
  { label: t('dashboard.activity.allUsers'), value: 'all' },
  ...users.map(u => ({ label: u.name, value: u.id }))
])

// Filtered activities
const filteredActivities = ref<ActivityEvent[]>([])

// Check for active filters
const hasActiveFilters = computed(() => {
  return dateRange.value !== 'all' || 
         activityType.value !== 'all' || 
         selectedUser.value !== 'all'
})

// Get activity icon based on type
const getActivityIcon = (type: string) => {
  const icons: Record<string, string> = {
    'article.created': 'i-lucide-file-plus',
    'article.updated': 'i-lucide-file-edit',
    'article.deleted': 'i-lucide-file-x',
    'article.published': 'i-lucide-send',
    'work.created': 'i-lucide-briefcase-plus',
    'work.updated': 'i-lucide-briefcase',
    'work.deleted': 'i-lucide-trash-2',
    'client.created': 'i-lucide-user-plus',
    'client.updated': 'i-lucide-user-cog',
    'user.login': 'i-lucide-log-in',
    'user.logout': 'i-lucide-log-out',
    'user.created': 'i-lucide-user-plus',
    'settings.changed': 'i-lucide-settings',
    'media.uploaded': 'i-lucide-image-plus',
    'media.deleted': 'i-lucide-image-minus'
  }
  return icons[type] || 'i-lucide-circle'
}

// Get activity color based on type
const getActivityColor = (type: string) => {
  if (type.includes('created') || type.includes('uploaded')) return 'success'
  if (type.includes('updated')) return 'info'
  if (type.includes('deleted')) return 'error'
  if (type.includes('published')) return 'primary'
  if (type.includes('login')) return 'success'
  if (type.includes('logout')) return 'neutral'
  return 'neutral'
}

// Format time relative to now
const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return t('dashboard.activity.justNow')
  if (minutes < 60) return t('dashboard.activity.minutesAgo', { count: minutes })
  if (hours < 24) return t('dashboard.activity.hoursAgo', { count: hours })
  if (days < 7) return t('dashboard.activity.daysAgo', { count: days })
  return date.toLocaleDateString()
}

// Check if activity is within date range
const isWithinDateRange = (timestamp: string) => {
  if (dateRange.value === 'all') return true
  
  const activityDate = new Date(timestamp)
  const now = new Date()
  
  if (dateRange.value === 'today') {
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    return activityDate >= startOfDay
  }
  
  if (dateRange.value === '7days') {
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    return activityDate >= sevenDaysAgo
  }
  
  if (dateRange.value === '30days') {
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    return activityDate >= thirtyDaysAgo
  }
  
  if (dateRange.value === 'custom' && customStartDate.value && customEndDate.value) {
    const start = new Date(customStartDate.value)
    const end = new Date(customEndDate.value)
    end.setHours(23, 59, 59, 999) // Include entire end day
    return activityDate >= start && activityDate <= end
  }
  
  return true
}

// Check if activity matches type filter
const matchesTypeFilter = (type: string) => {
  if (activityType.value === 'all') return true
  
  const contentTypes = ['article', 'work', 'media', 'client']
  const userTypes = ['user']
  const systemTypes = ['settings']
  
  const typePrefix = type.split('.')[0]
  
  if (activityType.value === 'content') {
    return contentTypes.includes(typePrefix)
  }
  if (activityType.value === 'user') {
    return userTypes.includes(typePrefix)
  }
  if (activityType.value === 'system') {
    return systemTypes.includes(typePrefix)
  }
  
  return true
}

// Check if activity matches user filter
const matchesUserFilter = (userId: string) => {
  if (selectedUser.value === 'all') return true
  return userId === selectedUser.value
}

// Filter activities based on all criteria
const filterActivities = () => {
  filteredActivities.value = activities.value.filter(activity => {
    return isWithinDateRange(activity.timestamp) &&
           matchesTypeFilter(activity.type) &&
           matchesUserFilter(activity.user.id)
  })
}

// Set date range
const setDateRange = (range: string) => {
  dateRange.value = range
  filterActivities()
}

// Apply custom date range
const applyCustomRange = () => {
  if (customStartDate.value && customEndDate.value) {
    dateRange.value = 'custom'
    filterActivities()
  }
}

// Clear all filters
const clearFilters = () => {
  dateRange.value = 'all'
  activityType.value = 'all'
  selectedUser.value = 'all'
  customStartDate.value = ''
  customEndDate.value = ''
  filterActivities()
}

// Load more activities
const loadMore = async () => {
  await loadMoreActivities()
  filterActivities()
}

// Export to CSV
const exportToCSV = async () => {
  exporting.value = true
  try {
    // Prepare CSV data
    const headers = ['ID', 'Type', 'User', 'Action', 'Target', 'Timestamp']
    const rows = filteredActivities.value.map(activity => [
      activity.id,
      activity.type,
      activity.user.name,
      activity.action,
      activity.target?.name || '-',
      new Date(activity.timestamp).toLocaleString()
    ])
    
    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `activity-export-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
    
    toast.add({
      title: t('common.success'),
      description: t('dashboard.activity.exportSuccess'),
      color: 'success'
    })
  } catch (err) {
    toast.add({
      title: t('common.error'),
      description: t('dashboard.activity.exportError'),
      color: 'error'
    })
  } finally {
    exporting.value = false
  }
}

// Watch for activity changes and re-filter
watch(activities, () => {
  filterActivities()
}, { deep: true })

// Initial filter
onMounted(() => {
  filterActivities()
})
</script>
