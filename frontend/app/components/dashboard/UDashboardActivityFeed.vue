<script setup lang="ts">
/**
 * UDashboardActivityFeed - Real-time activity feed component
 * 
 * Displays recent activities across the dashboard with filtering
 * 
 * @usage
 * ```vue
 * <UDashboardActivityFeed
 *   :activities="activities"
 *   :loading="loading"
 *   @load-more="loadMore"
 * />
 * ```
 */

import type { ActivityEvent } from '~/composables/useActivityFeed'

interface Props {
  activities: ActivityEvent[]
  loading?: boolean
  hasMore?: boolean
  compact?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'load-more': []
  'filter-change': [filter: string]
}>()

const activeFilter = ref('all')

const filters = [
  { key: 'all', label: 'All Activity' },
  { key: 'content', label: 'Content' },
  { key: 'user', label: 'Users' },
  { key: 'system', label: 'System' }
]

const getActivityIcon = (type: ActivityEvent['type']) => {
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

const getActivityColor = (type: ActivityEvent['type']) => {
  if (type.includes('created') || type.includes('uploaded')) return 'success'
  if (type.includes('updated')) return 'info'
  if (type.includes('deleted')) return 'error'
  if (type.includes('published')) return 'primary'
  if (type.includes('login')) return 'success'
  if (type.includes('logout')) return 'neutral'
  return 'neutral'
}

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}
</script>

<template>
  <UCard
    :ui="{
      root: 'rounded-3xl border border-es-border bg-es-bg-secondary shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark',
      header: 'border-b border-es-border/70 px-6 py-4 dark:border-es-border-dark/70',
      body: 'px-0 py-0'
    }"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.2em] text-es-text-secondary dark:text-es-text-secondary-dark">
            Live Activity
          </p>
          <h2 class="mt-1 text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">
            Recent Activity
          </h2>
        </div>
        
        <!-- Filters -->
        <div class="flex items-center gap-1">
          <UButton
            v-for="filter in filters"
            :key="filter.key"
            size="xs"
            :variant="activeFilter === filter.key ? 'solid' : 'ghost'"
            :color="activeFilter === filter.key ? 'primary' : 'neutral'"
            class="rounded-full text-xs"
            @click="activeFilter = filter.key; $emit('filter-change', filter.key)"
          >
            {{ filter.label }}
          </UButton>
        </div>
      </div>
    </template>

    <!-- Activity List -->
    <div class="max-h-[500px] overflow-y-auto">
      <!-- Empty State -->
      <div
        v-if="!activities.length && !loading"
        class="flex flex-col items-center justify-center px-6 py-12 text-center"
      >
        <UIcon name="i-lucide-activity" class="mb-3 h-10 w-10 text-es-text-tertiary dark:text-es-text-tertiary-dark" />
        <p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
          No recent activity
        </p>
      </div>

      <!-- Loading Skeleton -->
      <div
        v-else-if="loading && !activities.length"
        class="space-y-3 px-6 py-4"
      >
        <div
          v-for="n in 5"
          :key="n"
          class="flex items-center gap-3"
        >
          <div class="h-10 w-10 animate-pulse rounded-full bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark" />
          <div class="flex-1 space-y-1">
            <div class="h-4 w-3/4 animate-pulse rounded bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark" />
            <div class="h-3 w-1/2 animate-pulse rounded bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark" />
          </div>
        </div>
      </div>

      <!-- Activity Items -->
      <div v-else class="divide-y divide-es-border dark:divide-es-border-dark">
        <div
          v-for="activity in activities"
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
            v-if="!compact && activity.user.avatar"
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
          @click="$emit('load-more')"
        >
          <UIcon name="i-lucide-chevron-down" class="mr-2 h-4 w-4" />
          Load More Activity
        </UButton>
      </div>
    </div>
  </UCard>
</template>
