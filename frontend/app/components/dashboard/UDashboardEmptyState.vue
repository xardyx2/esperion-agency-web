<script setup lang="ts">
/**
 * UDashboardEmptyState - Enhanced empty state for dashboard pages
 * 
 * @usage
 * ```vue
 * <UDashboardEmptyState
 *   icon="i-lucide-images"
 *   title="Your Media Library is Empty"
 *   description="Upload images, videos, and documents to build your media library."
 *   :primary-action="{ label: 'Upload Media', to: '/dashboard/media', icon: 'i-lucide-upload' }"
 *   :tips="['Optimize images before upload', 'Use WebP format for better performance']"
 * />
 * ```
 */

interface Tip {
  icon?: string
  text: string
}

interface Action {
  label: string
  to?: string
  icon?: string
  onClick?: () => void
  variant?: 'solid' | 'outline' | 'ghost'
  external?: boolean
}

interface DocLink {
  label: string
  to: string
  icon?: string
  external?: boolean
}

interface Props {
  icon?: string
  title: string
  description?: string
  primaryAction?: Action
  secondaryActions?: Action[]
  tips?: (string | Tip)[]
  showIllustration?: boolean
  illustration?: 'folder' | 'search' | 'document' | 'media' | 'chart'
  docLinks?: DocLink[]
  videoTutorial?: {
    label: string
    url: string
    thumbnail?: string
  }
}

const props = defineProps<Props>()

const openExternalLink = (url?: string) => {
  if (url) {
    window.open(url, '_blank')
  }
}

const getIllustrationIcon = (type?: string) => {
  switch (type) {
    case 'folder': return 'i-lucide-folder-open'
    case 'search': return 'i-lucide-search-x'
    case 'document': return 'i-lucide-file-x'
    case 'media': return 'i-lucide-images'
    case 'chart': return 'i-lucide-bar-chart-2'
    default: return props.icon || 'i-lucide-inbox'
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-center py-12 px-4 text-center">
    <!-- Illustration -->
    <div
      v-if="showIllustration !== false"
      class="mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-es-accent-primary/10 text-es-accent-primary dark:bg-es-accent-primary-dark/15 dark:text-es-accent-primary-dark"
    >
      <UIcon
        :name="getIllustrationIcon(illustration)"
        class="h-12 w-12"
      />
    </div>
    
    <!-- Icon only (when no illustration) -->
    <div
      v-else-if="icon"
      class="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-es-bg-tertiary text-es-text-secondary dark:bg-es-bg-tertiary-dark dark:text-es-text-secondary-dark"
    >
      <UIcon :name="icon" class="h-8 w-8" />
    </div>
    
    <!-- Title -->
    <h3 class="text-xl font-semibold text-es-text-primary dark:text-es-text-primary-dark">
      {{ title }}
    </h3>
    
    <!-- Description -->
    <p
      v-if="description"
      class="mt-2 max-w-md text-sm text-es-text-secondary dark:text-es-text-secondary-dark"
    >
      {{ description }}
    </p>
    
    <!-- Primary Action -->
    <div
      v-if="primaryAction"
      class="mt-6"
    >
      <UButton
        v-if="primaryAction.to && !primaryAction.external"
        color="primary"
        :to="primaryAction.to"
        class="rounded-full"
      >
        <UIcon
          v-if="primaryAction.icon"
          :name="primaryAction.icon"
          class="h-4 w-4"
        />
        {{ primaryAction.label }}
      </UButton>
      <UButton
        v-else-if="primaryAction.to && primaryAction.external"
        color="primary"
        class="rounded-full"
        @click="openExternalLink(primaryAction.to)"
      >
        <UIcon
          v-if="primaryAction.icon"
          :name="primaryAction.icon"
          class="h-4 w-4"
        />
        {{ primaryAction.label }}
        <UIcon name="i-lucide-external-link" class="h-3 w-3 ml-1" />
      </UButton>
      <UButton
        v-else
        color="primary"
        class="rounded-full"
        @click="primaryAction.onClick"
      >
        <UIcon
          v-if="primaryAction.icon"
          :name="primaryAction.icon"
          class="h-4 w-4"
        />
        {{ primaryAction.label }}
      </UButton>
    </div>
    
    <!-- Secondary Actions -->
    <div
      v-if="secondaryActions?.length"
      class="mt-3 flex flex-wrap items-center justify-center gap-2"
    >
      <template v-for="(action, index) in secondaryActions" :key="index">
        <UButton
          v-if="action.to && !action.external"
          color="neutral"
          :variant="action.variant || 'ghost'"
          :to="action.to"
          class="rounded-full"
        >
          <UIcon
            v-if="action.icon"
            :name="action.icon"
            class="h-4 w-4"
          />
          {{ action.label }}
        </UButton>
        <UButton
          v-else-if="action.to && action.external"
          color="neutral"
          :variant="action.variant || 'ghost'"
          class="rounded-full"
          @click="openExternalLink(action.to)"
        >
          <UIcon
            v-if="action.icon"
            :name="action.icon"
            class="h-4 w-4"
          />
          {{ action.label }}
          <UIcon name="i-lucide-external-link" class="h-3 w-3 ml-1" />
        </UButton>
        <UButton
          v-else
          color="neutral"
          :variant="action.variant || 'ghost'"
          class="rounded-full"
          @click="action.onClick"
        >
          <UIcon
            v-if="action.icon"
            :name="action.icon"
            class="h-4 w-4"
          />
          {{ action.label }}
        </UButton>
      </template>
    </div>
    
    <!-- Tips Section -->
    <div
      v-if="tips?.length"
      class="mt-8 rounded-2xl border border-es-border bg-es-bg-primary px-6 py-4 dark:border-es-border-dark dark:bg-es-bg-primary-dark"
    >
      <p class="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-es-text-secondary dark:text-es-text-secondary-dark">
        <UIcon name="i-lucide-lightbulb" class="h-4 w-4 text-es-accent-primary dark:text-es-accent-primary-dark" />
        Quick Tips
      </p>
      <ul class="space-y-2 text-left">
        <li
          v-for="(tip, index) in tips"
          :key="index"
          class="flex items-start gap-2 text-sm text-es-text-secondary dark:text-es-text-secondary-dark"
        >
          <UIcon
            :name="typeof tip === 'string' ? 'i-lucide-check' : (tip.icon || 'i-lucide-check')"
            class="mt-0.5 h-4 w-4 shrink-0 text-es-accent-primary dark:text-es-accent-primary-dark"
          />
          <span>{{ typeof tip === 'string' ? tip : tip.text }}</span>
        </li>
      </ul>
    </div>
    
    <!-- Additional content slot -->
    <slot />
    
    <!-- Documentation Links -->
    <div
      v-if="docLinks?.length || videoTutorial"
      class="mt-6 flex flex-wrap items-center justify-center gap-3"
    >
      <template v-if="docLinks?.length">
        <NuxtLink
          v-for="(link, index) in docLinks"
          :key="index"
          :to="link.to"
          :external="link.external"
          :target="link.external ? '_blank' : undefined"
          class="inline-flex items-center gap-1.5 text-sm text-es-accent-primary hover:text-es-accent-primary/80 dark:text-es-accent-primary-dark dark:hover:text-es-accent-primary-dark/80"
        >
          <UIcon :name="link.icon || 'i-lucide-book-open'" class="h-4 w-4" />
          {{ link.label }}
          <UIcon v-if="link.external" name="i-lucide-external-link" class="h-3 w-3" />
        </NuxtLink>
      </template>
      
      <!-- Video Tutorial -->
      <NuxtLink
        v-if="videoTutorial"
        :to="videoTutorial.url"
        external
        target="_blank"
        class="inline-flex items-center gap-1.5 text-sm text-es-accent-primary hover:text-es-accent-primary/80 dark:text-es-accent-primary-dark dark:hover:text-es-accent-primary-dark/80"
      >
        <UIcon name="i-lucide-play-circle" class="h-4 w-4" />
        {{ videoTutorial.label }}
        <UIcon name="i-lucide-external-link" class="h-3 w-3" />
      </NuxtLink>
    </div>
  </div>
</template>
