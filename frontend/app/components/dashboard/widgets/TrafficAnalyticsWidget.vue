<script setup lang="ts">
/**
 * TrafficAnalyticsWidget - Compact dashboard widget for traffic metrics
 * 
 * Displays:
 * - Total visitors today
 * - Page views
 * - Bounce rate percentage
 * - Mini line chart showing traffic trend
 */

import { useColorMode } from '#imports'

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

// Sample data
const data = ref({
  visitors: 1234,
  pageViews: 5678,
  bounceRate: 42,
  trend: [100, 120, 110, 130, 140, 160, 150]
})

// Generate chart data for sparkline
const chartData = computed(() => ({
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [{
    label: 'Visitors',
    data: data.value.trend
  }]
}))

// Format numbers
const formatNumber = (num: number) => {
  return new Intl.NumberFormat('id-ID').format(num)
}
</script>

<template>
  <div class="flex h-full flex-col gap-4">
    <!-- Metrics Grid -->
    <div class="grid grid-cols-3 gap-3">
      <!-- Visitors -->
      <div class="rounded-xl bg-es-bg-tertiary p-3 dark:bg-es-bg-tertiary-dark">
        <div class="flex items-center gap-1.5">
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-es-accent-primary/10 text-es-accent-primary dark:bg-es-accent-primary-dark/15 dark:text-es-accent-primary-dark">
            <UIcon name="i-lucide-users" class="h-4 w-4" />
          </div>
        </div>
        <p class="mt-2 text-[10px] font-medium uppercase tracking-[0.15em] text-es-text-secondary dark:text-es-text-secondary-dark">
          Visitors
        </p>
        <p class="mt-1 text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">
          {{ formatNumber(data.visitors) }}
        </p>
      </div>

      <!-- Page Views -->
      <div class="rounded-xl bg-es-bg-tertiary p-3 dark:bg-es-bg-tertiary-dark">
        <div class="flex items-center gap-1.5">
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-es-success/10 text-es-success dark:bg-es-success-dark/15 dark:text-es-success-dark">
            <UIcon name="i-lucide-eye" class="h-4 w-4" />
          </div>
        </div>
        <p class="mt-2 text-[10px] font-medium uppercase tracking-[0.15em] text-es-text-secondary dark:text-es-text-secondary-dark">
          Page Views
        </p>
        <p class="mt-1 text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">
          {{ formatNumber(data.pageViews) }}
        </p>
      </div>

      <!-- Bounce Rate -->
      <div class="rounded-xl bg-es-bg-tertiary p-3 dark:bg-es-bg-tertiary-dark">
        <div class="flex items-center gap-1.5">
          <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-es-warning/10 text-es-warning dark:bg-es-warning-dark/15 dark:text-es-warning-dark">
            <UIcon name="i-lucide-percent" class="h-4 w-4" />
          </div>
        </div>
        <p class="mt-2 text-[10px] font-medium uppercase tracking-[0.15em] text-es-text-secondary dark:text-es-text-secondary-dark">
          Bounce Rate
        </p>
        <p class="mt-1 text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">
          {{ data.bounceRate }}%
        </p>
      </div>
    </div>

    <!-- Sparkline Chart -->
    <div class="flex-1 rounded-xl bg-es-bg-primary p-2 dark:bg-es-bg-primary-dark">
      <p class="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-es-text-secondary dark:text-es-text-secondary-dark">
        Weekly Trend
      </p>
      <div class="h-24">
        <UDashboardChart
          type="line"
          :data="chartData"
          height="100%"
          :show-legend="false"
          :dark-mode="isDark"
        />
      </div>
    </div>
  </div>
</template>
