<script setup lang="ts">
/**
 * UDashboardSkeleton - Loading skeleton for dashboard components
 * 
 * @usage
 * ```vue
 * <UDashboardSkeleton type="card" />
 * <UDashboardSkeleton type="table" :rows="5" />
 * <UDashboardSkeleton type="list" :items="3" />
 * ```
 */

interface Props {
  type: 'card' | 'table' | 'list' | 'chart' | 'form'
  rows?: number
  items?: number
  columns?: number
}

const props = withDefaults(defineProps<Props>(), {
  rows: 3,
  items: 3,
  columns: 4
})
</script>

<template>
  <!-- Card Skeleton -->
  <div
    v-if="type === 'card'"
    class="animate-pulse rounded-3xl border border-es-border bg-es-bg-secondary p-6 dark:border-es-border-dark dark:bg-es-bg-secondary-dark"
  >
    <div class="mb-4 flex items-center justify-between">
      <div class="h-6 w-1/3 rounded bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark" />
      <div class="h-6 w-16 rounded-full bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark" />
    </div>
    <div class="space-y-3">
      <div class="h-4 w-full rounded bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark" />
      <div class="h-4 w-5/6 rounded bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark" />
      <div class="h-4 w-4/6 rounded bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark" />
    </div>
  </div>

  <!-- Table Skeleton -->
  <div
    v-else-if="type === 'table'"
    class="animate-pulse rounded-3xl border border-es-border bg-es-bg-secondary dark:border-es-border-dark dark:bg-es-bg-secondary-dark"
  >
    <!-- Header -->
    <div class="border-b border-es-border bg-es-bg-tertiary px-6 py-4 dark:border-es-border-dark dark:bg-es-bg-tertiary-dark">
      <div class="flex gap-4">
        <div
          v-for="n in columns"
          :key="n"
          class="h-4 flex-1 rounded bg-es-bg-primary dark:bg-es-bg-primary-dark"
        />
      </div>
    </div>
    <!-- Rows -->
    <div class="divide-y divide-es-border dark:divide-es-border-dark">
      <div
        v-for="n in rows"
        :key="n"
        class="flex gap-4 px-6 py-4"
      >
        <div
          v-for="m in columns"
          :key="m"
          class="h-4 flex-1 rounded bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark"
        />
      </div>
    </div>
  </div>

  <!-- List Skeleton -->
  <div
    v-else-if="type === 'list'"
    class="space-y-3"
  >
    <div
      v-for="n in items"
      :key="n"
      class="flex animate-pulse items-center gap-4 rounded-xl border border-es-border bg-es-bg-secondary p-4 dark:border-es-border-dark dark:bg-es-bg-secondary-dark"
    >
      <div class="h-10 w-10 shrink-0 rounded-full bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark" />
      <div class="flex-1 space-y-2">
        <div class="h-4 w-1/3 rounded bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark" />
        <div class="h-3 w-1/2 rounded bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark" />
      </div>
      <div class="h-8 w-20 rounded-full bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark" />
    </div>
  </div>

  <!-- Chart Skeleton -->
  <div
    v-else-if="type === 'chart'"
    class="animate-pulse rounded-3xl border border-es-border bg-es-bg-secondary p-6 dark:border-es-border-dark dark:bg-es-bg-secondary-dark"
  >
    <div class="mb-6 flex items-center justify-between">
      <div class="h-6 w-1/4 rounded bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark" />
      <div class="h-4 w-24 rounded bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark" />
    </div>
    <div class="flex h-64 items-end gap-2">
      <div
        v-for="n in 8"
        :key="n"
        class="flex-1 rounded-t bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark"
        :style="{ height: `${Math.random() * 80 + 20}%` }"
      />
    </div>
  </div>

  <!-- Form Skeleton -->
  <div
    v-else-if="type === 'form'"
    class="animate-pulse space-y-6 rounded-3xl border border-es-border bg-es-bg-secondary p-6 dark:border-es-border-dark dark:bg-es-bg-secondary-dark"
  >
    <div class="h-6 w-1/3 rounded bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark" />
    <div class="grid gap-4 md:grid-cols-2">
      <div
        v-for="n in 4"
        :key="n"
        class="space-y-2"
      >
        <div class="h-4 w-24 rounded bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark" />
        <div class="h-10 w-full rounded-lg bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark" />
      </div>
    </div>
    <div class="flex justify-end">
      <div class="h-10 w-32 rounded-full bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark" />
    </div>
  </div>
</template>
