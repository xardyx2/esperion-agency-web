<template>
  <div class="space-y-8">
    <DashboardPageHeader
      eyebrow="Performance"
      :title="t('dashboard.analytics.title')"
      :description="t('dashboard.analytics.description')"
    >
      <template #actions>
        <UButton
          color="neutral"
          variant="outline"
          class="rounded-full border-es-border text-es-text-primary dark:border-es-border-dark dark:text-es-text-primary-dark"
          :disabled="loading"
          @click="loadReport"
        >
          {{ loading ? t('dashboard.analytics.refresh.inProgress') : t('dashboard.analytics.refresh.button') }}
        </UButton>
      </template>
    </DashboardPageHeader>

    <div
      v-if="errorMessage"
      class="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ errorMessage }}
    </div>

    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <DashboardMetricCard
        :label="t('dashboard.analytics.overview.totalEvents')"
        :value="report.overview.total_events"
        detail="Tracked activity recorded by the analytics pipeline."
        icon="i-lucide-mouse-pointer-click"
      />
      <DashboardMetricCard
        :label="t('dashboard.analytics.overview.totalSessions')"
        :value="report.overview.total_sessions"
        detail="Authenticated and public sessions observed in the selected range."
        icon="i-lucide-users-round"
      />
      <DashboardMetricCard
        :label="t('dashboard.analytics.overview.pageViews')"
        :value="report.overview.page_views"
        detail="Page-level traffic activity available for reporting."
        icon="i-lucide-eye"
      />
      <DashboardMetricCard
        :label="t('dashboard.analytics.overview.conversionEvents')"
        :value="report.overview.conversion_events"
        detail="Events mapped to conversion or funnel progress."
        icon="i-lucide-target"
      />
    </section>

    <section class="grid gap-6 xl:grid-cols-[1.35fr,1fr]">
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
                Funnel reporting
              </p>
              <h2 class="mt-2 text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">
                {{ t('dashboard.analytics.funnels.title') }}
              </h2>
            </div>

            <UBadge
              color="primary"
              variant="soft"
            >
              {{ report.funnels.length }} active
            </UBadge>
          </div>
        </template>

        <div
          v-if="report.funnels.length === 0"
          class="rounded-2xl border border-dashed border-es-border bg-es-bg-primary px-4 py-8 text-sm text-es-text-secondary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-secondary-dark"
        >
          {{ t('dashboard.analytics.funnels.noActive') }}
        </div>

        <div
          v-else
          class="space-y-4"
        >
          <article
            v-for="funnel in report.funnels"
            :key="funnel.funnel_id"
            class="rounded-2xl border border-es-border bg-es-bg-primary p-4 dark:border-es-border-dark dark:bg-es-bg-primary-dark"
          >
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 class="text-base font-semibold text-es-text-primary dark:text-es-text-primary-dark">
                  {{ funnel.funnel_name }}
                </h3>
                <p class="text-xs text-es-text-secondary dark:text-es-text-secondary-dark">
                  {{ funnel.steps.length }} tracked stages
                </p>
              </div>

              <UBadge
                color="primary"
                variant="soft"
              >
                {{ funnel.funnel_id }}
              </UBadge>
            </div>

            <div class="mt-4 space-y-3">
              <div
                v-for="step in funnel.steps"
                :key="`${funnel.funnel_id}-${step.event_name}`"
                class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-es-border bg-es-bg-secondary px-4 py-3 dark:border-es-border-dark dark:bg-es-bg-secondary-dark"
              >
                <div>
                  <p class="text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark">
                    {{ step.step_name }}
                  </p>
                  <p class="text-xs text-es-text-secondary dark:text-es-text-secondary-dark">
                    {{ t('dashboard.analytics.funnels.eventLabel') }}: {{ step.event_name }}
                  </p>
                </div>

                <div class="text-right">
                  <p class="text-sm font-semibold text-es-text-primary dark:text-es-text-primary-dark">
                    {{ step.count }} events
                  </p>
                  <p class="text-xs text-es-text-secondary dark:text-es-text-secondary-dark">
                    {{ step.conversion_rate_from_previous == null ? t('dashboard.analytics.funnels.step') : `${step.conversion_rate_from_previous.toFixed(1)}% from previous` }}
                  </p>
                </div>
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
              Reporting notes
            </p>
            <h2 class="mt-2 text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">
              What to watch
            </h2>
          </div>
        </template>

        <div class="space-y-3">
          <article
            v-for="note in analyticsNotes"
            :key="note.title"
            class="rounded-2xl border border-es-border bg-es-bg-primary p-4 dark:border-es-border-dark dark:bg-es-bg-primary-dark"
          >
            <div class="flex items-start gap-3">
              <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-es-accent-primary/10 text-es-accent-primary dark:bg-es-accent-primary-dark/15 dark:text-es-accent-primary-dark">
                <UIcon
                  :name="note.icon"
                  class="h-5 w-5"
                />
              </div>

              <div>
                <p class="text-sm font-semibold text-es-text-primary dark:text-es-text-primary-dark">
                  {{ note.title }}
                </p>
                <p class="mt-1 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
                  {{ note.description }}
                </p>
              </div>
            </div>
          </article>
        </div>
      </UCard>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { AnalyticsReportResponse } from '../../types/api'
import { useAnalyticsApi } from '../../composables/useApi'

definePageMeta({
  layout: 'dashboard'
})

const { t } = useI18n()

useSeoMeta({
  title: t('dashboard.analytics.title'),
  description: t('dashboard.analytics.description')
})

const analyticsApi = useAnalyticsApi()
const loading = ref(false)
const errorMessage = ref('')

const report = reactive<AnalyticsReportResponse>({
  overview: {
    total_events: 0,
    total_sessions: 0,
    page_views: 0,
    conversion_events: 0
  },
  funnels: []
})

const analyticsNotes = [
  {
    title: 'Campaign health',
    description: 'Use the top KPI cards to spot abnormal swings before drilling into funnel performance.',
    icon: 'i-lucide-activity'
  },
  {
    title: 'Funnel drop-offs',
    description: 'Each stage lists conversion from the previous step so weak transitions are visible immediately.',
    icon: 'i-lucide-chart-no-axes-column-increasing'
  },
  {
    title: 'Settings alignment',
    description: 'Tracker and consent setup still live in dashboard settings, so reporting should be reviewed alongside configuration.',
    icon: 'i-lucide-settings-2'
  }
]

const loadReport = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const response = await analyticsApi.getReport()
    report.overview = response.overview
    report.funnels = response.funnels
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : t('dashboard.analytics.title')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadReport()
})
</script>
