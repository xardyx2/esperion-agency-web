<template>
  <section class="relative h-[300px] md:h-[400px] overflow-hidden">
    <!-- Background with gradient placeholder -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-es-accent-primary/30 via-es-accent-primary/20 to-es-bg-secondary-dark"
      :style="backgroundStyle"
    />

    <!-- Dark overlay for text readability -->
    <div class="absolute inset-0 bg-black/50 dark:bg-black/60" />

    <!-- Content -->
    <div class="absolute inset-0 flex items-center justify-center">
      <div class="container mx-auto px-4 text-center">
        <!-- Optional icon/badge -->
        <div
          v-if="icon"
          class="text-5xl md:text-6xl mb-4"
        >
          {{ icon }}
        </div>

        <!-- Title -->
        <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-es-text-inverse dark:text-es-text-inverse-dark mb-4">
          {{ title }}
        </h1>

        <!-- Optional subtitle -->
        <p
          v-if="subtitle"
          class="text-lg md:text-xl text-es-text-inverse/90 dark:text-es-text-inverse-dark/90 max-w-2xl mx-auto"
        >
          {{ subtitle }}
        </p>

        <!-- Optional category badge -->
        <span
          v-if="category"
          class="inline-block mt-4 px-4 py-1 bg-es-accent-primary/20 dark:bg-es-accent-primary-dark/20 text-es-text-inverse dark:text-es-text-inverse-dark text-sm font-medium rounded-full backdrop-blur-sm"
        >
          {{ category }}
        </span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  subtitle?: string
  icon?: string
  category?: string
  backgroundImage?: string
}>()

const backgroundStyle = computed(() => {
  if (props.backgroundImage) {
    return {
      backgroundImage: `url(${props.backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }
  }
  return {}
})
</script>
