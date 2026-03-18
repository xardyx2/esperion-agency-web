<script setup lang="ts">
/**
 * UDashboardSection - Reusable content section wrapper for dashboard pages
 * 
 * @usage
 * ```vue
 * <UDashboardSection title="Articles" description="Manage your content">
 *   <template #actions>
 *     <UButton>New Article</UButton>
 *   </template>
 *   <!-- Content here -->
 * </UDashboardSection>
 * ```
 */

interface Props {
  title?: string
  description?: string
  icon?: string
  badge?: string | number
  class?: string
}

const props = defineProps<Props>()
</script>

<template>
  <section 
    class="rounded-3xl border border-es-border bg-es-bg-secondary shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark"
    :class="props.class"
  >
    <!-- Header -->
    <header 
      v-if="title || description || $slots.actions || $slots.header"
      class="flex flex-col gap-4 border-b border-es-border/70 px-6 py-5 sm:flex-row sm:items-center sm:justify-between dark:border-es-border-dark/70"
    >
      <div class="flex items-start gap-3">
        <!-- Icon -->
        <div
          v-if="icon"
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-es-accent-primary/10 text-es-accent-primary dark:bg-es-accent-primary-dark/15 dark:text-es-accent-primary-dark"
        >
          <UIcon :name="icon" class="h-5 w-5" />
        </div>
        
        <div class="min-w-0">
          <div class="flex items-center gap-2">
            <h2 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">
              {{ title }}
            </h2>
            <UBadge
              v-if="badge"
              color="primary"
              variant="soft"
              size="sm"
            >
              {{ badge }}
            </UBadge>
          </div>
          <p
            v-if="description"
            class="mt-1 text-sm text-es-text-secondary dark:text-es-text-secondary-dark"
          >
            {{ description }}
          </p>
        </div>
      </div>
      
      <!-- Actions slot -->
      <div
        v-if="$slots.actions"
        class="flex items-center gap-2"
      >
        <slot name="actions" />
      </div>
      
      <!-- Custom header slot -->
      <slot name="header" />
    </header>
    
    <!-- Body -->
    <div class="px-6 py-5">
      <slot />
    </div>
    
    <!-- Footer slot -->
    <footer
      v-if="$slots.footer"
      class="border-t border-es-border/70 px-6 py-4 dark:border-es-border-dark/70"
    >
      <slot name="footer" />
    </footer>
  </section>
</template>
