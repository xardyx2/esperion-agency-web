<template>
  <nav
    class="container mx-auto px-4 py-6"
    aria-label="Breadcrumb"
  >
    <ol class="flex items-center space-x-3 text-sm">
      <!-- Home -->
      <li>
        <NuxtLink
          :to="localePath('/')"
          class="text-es-text-secondary dark:text-es-text-secondary-dark hover:text-es-accent-primary dark:hover:text-es-accent-primary-dark transition-colors"
        >
          <svg
            class="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </NuxtLink>
      </li>

      <!-- Separator and items -->
      <template
        v-for="(item, index) in items"
        :key="index"
      >
        <li class="flex items-center">
          <svg
            class="w-4 h-4 text-es-text-secondary dark:text-es-text-secondary-dark mx-3"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>

          <NuxtLink
            v-if="item.to && index < items.length - 1"
            :to="localePath(item.to)"
            class="text-es-text-secondary dark:text-es-text-secondary-dark hover:text-es-accent-primary dark:hover:text-es-accent-primary-dark transition-colors"
          >
            {{ item.label }}
          </NuxtLink>

          <span
            v-else
            class="text-es-text-primary dark:text-es-text-primary-dark font-medium"
            :class="{ 'text-es-accent-primary dark:text-es-accent-primary-dark': index === items.length - 1 }"
          >
            {{ item.label }}
          </span>
        </li>
      </template>
    </ol>
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  items: Array<{
    label: string
    to?: string
  }>
}>()

const localePath = useLocalePath()
</script>
