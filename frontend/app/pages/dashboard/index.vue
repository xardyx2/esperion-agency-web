<template>
  <div class="space-y-8">
    <!-- Welcome Header -->
    <DashboardPageHeader
      eyebrow="Agency workspace"
      :title="t('dashboard.index.title')"
      :description="t('dashboard.index.description')"
    >
      <template #actions>
        <UButton
          color="primary"
          class="rounded-full"
          :to="localePath('/dashboard/articles/new')"
        >
          <UIcon name="i-lucide-plus" class="h-4 w-4 mr-1" />
          New article
        </UButton>
        <UButton
          color="neutral"
          variant="outline"
          class="rounded-full border-es-border text-es-text-primary dark:border-es-border-dark dark:text-es-text-primary-dark"
          :to="localePath('/dashboard/settings')"
        >
          <UIcon name="i-lucide-settings-2" class="h-4 w-4 mr-1" />
          Settings
        </UButton>
      </template>
    </DashboardPageHeader>

    <!-- Metrics Overview -->
    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <DashboardMetricCard
        v-for="card in overviewCards"
        :key="card.label"
        :label="card.label"
        :value="card.value"
        :detail="card.detail"
        :icon="card.icon"
        :trend="card.trend"
        :to="card.to"
      />
    </section>

    <!-- Main Content Grid -->
    <section class="grid gap-6 xl:grid-cols-[1.4fr,1fr]">
      <!-- Priority Content Section -->
      <UDashboardSection
        title="Content Overview"
        description="Recent activity and content status"
        icon="i-lucide-layout-dashboard"
      >
        <template #actions>
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            :to="localePath('/dashboard/articles')"
          >
            View all
          </UButton>
        </template>

        <div class="grid gap-4 md:grid-cols-2">
          <article
            v-for="item in contentModules"
            :key="item.title"
            class="rounded-2xl border border-es-border bg-es-bg-primary p-4 transition-colors hover:bg-es-bg-tertiary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:hover:bg-es-bg-tertiary-dark"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="space-y-2">
                <p class="text-sm font-semibold text-es-text-primary dark:text-es-text-primary-dark">
                  {{ item.title }}
                </p>
                <p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
                  {{ item.description }}
                </p>
                <NuxtLink
                  :to="item.to"
                  class="inline-flex items-center gap-1 text-xs font-medium text-es-accent-primary hover:underline dark:text-es-accent-primary-dark"
                >
                  {{ item.action }}
                  <UIcon name="i-lucide-arrow-right" class="h-3 w-3" />
                </NuxtLink>
              </div>

              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-es-accent-primary/10 text-es-accent-primary dark:bg-es-accent-primary-dark/15 dark:text-es-accent-primary-dark">
                <UIcon
                  :name="item.icon"
                  class="h-5 w-5"
                />
              </div>
            </div>
          </article>
        </div>
      </UDashboardSection>

      <!-- Quick Actions Section -->
      <UDashboardSection
        title="Quick Actions"
        description="Frequently used workflows"
        icon="i-lucide-zap"
      >
        <div class="space-y-3">
          <NuxtLink
            v-for="item in quickActionItems"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 rounded-2xl border border-es-border bg-es-bg-primary px-4 py-4 transition-colors hover:bg-es-bg-tertiary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:hover:bg-es-bg-tertiary-dark"
          >
            <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-es-accent-primary/10 text-es-accent-primary dark:bg-es-accent-primary-dark/15 dark:text-es-accent-primary-dark">
              <UIcon
                :name="item.icon"
                class="h-5 w-5"
              />
            </div>

            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark">
                {{ item.label }}
              </p>
              <p class="truncate text-xs text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ item.description }}
              </p>
            </div>

            <UIcon
              name="i-lucide-arrow-up-right"
              class="h-4 w-4 text-es-text-secondary dark:text-es-text-secondary-dark"
            />
          </NuxtLink>
        </div>
      </UDashboardSection>
    </section>

    <!-- System Status Section -->
    <UDashboardSection
      title="System Status"
      description="Dashboard health and operational metrics"
      icon="i-lucide-activity"
    >
      <div class="grid gap-4 sm:grid-cols-3">
        <div
          v-for="status in systemStatus"
          :key="status.label"
          class="flex items-center gap-3 rounded-2xl border border-es-border bg-es-bg-primary px-4 py-3 dark:border-es-border-dark dark:bg-es-bg-primary-dark"
        >
          <div
            class="flex h-8 w-8 items-center justify-center rounded-xl"
            :class="status.statusClass"
          >
            <UIcon :name="status.icon" class="h-4 w-4" />
          </div>
          <div>
            <p class="text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark">
              {{ status.label }}
            </p>
            <p class="text-xs text-es-text-secondary dark:text-es-text-secondary-dark">
              {{ status.value }}
            </p>
          </div>
        </div>
      </div>
    </UDashboardSection>
  </div>
</template>

<script setup lang="ts">
import { useDashboardNavigation } from '../../composables/useDashboardNavigation'

definePageMeta({
  layout: 'dashboard'
})

const { t } = useI18n()
const localePath = useLocalePath()
const { navigationGroups } = useDashboardNavigation()

useSeoMeta({
  title: t('dashboard.index.title'),
  description: t('dashboard.index.description')
})

const overviewCards = computed(() => {
  const contentModules = navigationGroups.value.find(group => group.label === 'Content')?.items.length || 0
  const systemModules = navigationGroups.value.find(group => group.label === 'System')?.items.length || 0

  return [
    {
      label: 'Content modules',
      value: contentModules,
      detail: 'Active content management areas',
      icon: 'i-lucide-panels-top-left',
      trend: '+ active',
      to: localePath('/dashboard/articles')
    },
    {
      label: 'System modules',
      value: systemModules,
      detail: 'Admin and configuration tools',
      icon: 'i-lucide-settings-2',
      trend: 'ready',
      to: localePath('/dashboard/settings')
    },
    {
      label: 'Quick actions',
      value: 5,
      detail: 'Fast routes for common tasks',
      icon: 'i-lucide-zap',
      trend: 'available',
      to: localePath('/dashboard/analytics')
    },
    {
      label: 'Brand mode',
      value: 'Esperion',
      detail: 'Using Esperion design tokens',
      icon: 'i-lucide-palette',
      trend: 'on-brand',
      to: localePath('/dashboard/settings')
    }
  ]
})

const contentModules = [
  {
    title: 'Articles',
    description: 'Manage blog posts and editorial content',
    icon: 'i-lucide-file-text',
    to: '/dashboard/articles',
    action: 'Manage articles'
  },
  {
    title: 'Portfolio Works',
    description: 'Showcase projects and case studies',
    icon: 'i-lucide-briefcase-business',
    to: '/dashboard/works',
    action: 'View works'
  },
  {
    title: 'Services',
    description: 'Configure service offerings',
    icon: 'i-lucide-panels-top-left',
    to: '/dashboard/services',
    action: 'Edit services'
  },
  {
    title: 'Media Library',
    description: 'Upload and organize media files',
    icon: 'i-lucide-images',
    to: '/dashboard/media',
    action: 'Open library'
  }
]

const quickActionItems = [
  {
    label: 'Create New Article',
    description: 'Start writing new content',
    icon: 'i-lucide-file-plus',
    to: '/dashboard/articles/new'
  },
  {
    label: 'View Analytics',
    description: 'Check traffic and performance',
    icon: 'i-lucide-chart-column',
    to: '/dashboard/analytics'
  },
  {
    label: 'Manage Users',
    description: 'Review team access and roles',
    icon: 'i-lucide-users',
    to: '/dashboard/users'
  },
  {
    label: 'API Documentation',
    description: 'Backend API reference',
    icon: 'i-lucide-book-open',
    to: '/dashboard/api-docs'
  }
]

const systemStatus = [
  {
    label: 'Dashboard Status',
    value: 'Operational',
    icon: 'i-lucide-check-circle',
    statusClass: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
  },
  {
    label: 'Authentication',
    value: 'Secure',
    icon: 'i-lucide-shield',
    statusClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
  },
  {
    label: 'Theme System',
    value: 'Active',
    icon: 'i-lucide-sun-moon',
    statusClass: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
  }
]
</script>
