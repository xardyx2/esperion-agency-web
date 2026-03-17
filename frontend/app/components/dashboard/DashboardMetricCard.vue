<template>
  <component
    :is="to ? NuxtLink : 'div'"
    :to="to"
    class="group block rounded-3xl border border-es-border bg-es-bg-secondary p-5 shadow-sm transition-all dark:border-es-border-dark dark:bg-es-bg-secondary-dark"
    :class="to ? 'hover:-translate-y-0.5 hover:border-es-accent-primary/40 hover:shadow-md dark:hover:border-es-accent-primary-dark/40' : ''"
  >
    <div class="flex items-start justify-between gap-4">
      <div class="space-y-3">
        <div class="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-es-accent-primary/10 text-es-accent-primary ring-1 ring-inset ring-es-accent-primary/20 dark:bg-es-accent-primary-dark/15 dark:text-es-accent-primary-dark dark:ring-es-accent-primary-dark/25">
          <UIcon :name="icon" class="h-5 w-5" />
        </div>

        <div>
          <p class="text-xs font-medium uppercase tracking-[0.18em] text-es-text-secondary dark:text-es-text-secondary-dark">
            {{ label }}
          </p>
          <p class="mt-2 text-2xl font-semibold text-es-text-primary dark:text-es-text-primary-dark">
            {{ value }}
          </p>
        </div>
      </div>

      <div class="text-right">
        <UBadge v-if="trend" color="primary" variant="soft">
          {{ trend }}
        </UBadge>
        <UIcon
          v-if="to"
          name="i-lucide-arrow-up-right"
          class="mt-2 h-4 w-4 text-es-text-secondary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 dark:text-es-text-secondary-dark"
        />
      </div>
    </div>

    <p v-if="detail" class="mt-4 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
      {{ detail }}
    </p>
  </component>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
  detail?: string
  icon?: string
  trend?: string
  to?: string
}>()
</script>
