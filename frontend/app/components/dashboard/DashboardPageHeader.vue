<template>
  <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
    <div class="space-y-2">
      <p v-if="eyebrow" class="text-xs font-semibold uppercase tracking-[0.22em] text-es-accent-primary dark:text-es-accent-primary-dark">
        {{ eyebrow }}
      </p>
      <h1 class="text-2xl font-semibold tracking-tight text-es-text-primary dark:text-es-text-primary-dark md:text-3xl">
        {{ title }}
      </h1>
      <p v-if="description" class="max-w-3xl text-sm text-es-text-secondary dark:text-es-text-secondary-dark md:text-base">
        {{ description }}
      </p>
    </div>

    <div v-if="$slots.actions" class="flex flex-wrap items-center gap-3">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  eyebrow?: string
}>()
</script>
