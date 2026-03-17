<template>
  <div class="space-y-8">
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
          New article
        </UButton>
        <UButton
          color="neutral"
          variant="outline"
          class="rounded-full border-es-border text-es-text-primary dark:border-es-border-dark dark:text-es-text-primary-dark"
          :to="localePath('/dashboard/settings')"
        >
          Open settings
        </UButton>
      </template>
    </DashboardPageHeader>

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

    <section class="grid gap-6 xl:grid-cols-[1.4fr,1fr]">
      <UCard
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
                Priority lanes
              </p>
              <h2 class="mt-2 text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">
                Focus checklist
              </h2>
            </div>

            <UBadge color="primary" variant="soft">
              {{ focusChecklist.length }} lanes
            </UBadge>
          </div>
        </template>

        <div class="grid gap-4 md:grid-cols-2">
          <article
            v-for="item in focusChecklist"
            :key="item.title"
            class="rounded-2xl border border-es-border bg-es-bg-primary p-4 dark:border-es-border-dark dark:bg-es-bg-primary-dark"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="space-y-2">
                <p class="text-sm font-semibold text-es-text-primary dark:text-es-text-primary-dark">
                  {{ t(item.title) }}
                </p>
                <p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
                  {{ t(item.detail) }}
                </p>
              </div>

              <div class="flex h-9 w-9 items-center justify-center rounded-2xl bg-es-accent-primary/10 text-es-accent-primary dark:bg-es-accent-primary-dark/15 dark:text-es-accent-primary-dark">
                <UIcon :name="item.icon" class="h-4 w-4" />
              </div>
            </div>
          </article>
        </div>
      </UCard>

      <UCard
        :ui="{
          root: 'rounded-3xl border border-es-border bg-es-bg-secondary shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark',
          header: 'border-b border-es-border/70 px-6 py-5 dark:border-es-border-dark/70',
          body: 'px-6 py-5'
        }"
      >
        <template #header>
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-es-text-secondary dark:text-es-text-secondary-dark">
              Navigation
            </p>
            <h2 class="mt-2 text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">
              Quick actions
            </h2>
          </div>
        </template>

        <div class="space-y-3">
          <NuxtLink
            v-for="item in quickActions"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-3 rounded-2xl border border-es-border bg-es-bg-primary px-4 py-4 transition-colors hover:bg-es-bg-tertiary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:hover:bg-es-bg-tertiary-dark"
          >
            <div class="flex h-10 w-10 items-center justify-center rounded-2xl bg-es-accent-primary/10 text-es-accent-primary dark:bg-es-accent-primary-dark/15 dark:text-es-accent-primary-dark">
              <UIcon :name="item.icon" class="h-5 w-5" />
            </div>

            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark">
                {{ item.label }}
              </p>
              <p class="truncate text-xs text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ item.description }}
              </p>
            </div>

            <UIcon name="i-lucide-arrow-up-right" class="h-4 w-4 text-es-text-secondary dark:text-es-text-secondary-dark" />
          </NuxtLink>
        </div>
      </UCard>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

import { useDashboardNavigation } from '../../composables/useDashboardNavigation'

const { t } = useI18n()
const localePath = useLocalePath()
const { navigationGroups, quickActions } = useDashboardNavigation()

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
      detail: 'Articles, works, services, clients, media, and contact flows.',
      icon: 'i-lucide-panels-top-left',
      trend: '+ refreshed',
      to: localePath('/dashboard/articles')
    },
    {
      label: 'Operational tools',
      value: systemModules,
      detail: 'Admin support surfaces like settings, users, and API docs.',
      icon: 'i-lucide-settings-2',
      trend: 'system',
      to: localePath('/dashboard/settings')
    },
    {
      label: 'Active quick actions',
      value: quickActions.value.length,
      detail: 'Fast routes exposed directly from the redesigned shell.',
      icon: 'i-lucide-zap',
      trend: 'ready',
      to: localePath('/dashboard/analytics')
    },
    {
      label: 'Brand token mode',
      value: 'Esperion',
      detail: 'Dashboard chrome stays aligned with the shared semantic token system.',
      icon: 'i-lucide-palette',
      trend: 'on-brand',
      to: localePath('/dashboard/settings')
    }
  ]
})

const focusChecklist = [
  {
    title: 'focus.authTitle',
    detail: 'focus.authDetail',
    icon: 'i-lucide-shield-check'
  },
  {
    title: 'focus.translationTitle',
    detail: 'focus.translationDetail',
    icon: 'i-lucide-languages'
  },
  {
    title: 'focus.archiveTitle',
    detail: 'focus.archiveDetail',
    icon: 'i-lucide-archive'
  }
]
</script>
