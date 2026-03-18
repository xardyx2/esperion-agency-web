<template>
  <!-- Banner Slide Template 2: Feature Highlight -->
  <!-- Showcase a key feature or service with visual emphasis -->
  <div class="banner-slide-feature relative w-full h-full">
    <!-- Background Image -->
    <img
      :src="slide.image"
      :alt="slide.title"
      class="w-full h-full object-cover"
      loading="eager"
      fetchpriority="high"
    >
    
    <!-- Dark Overlay for Readability (60% neutral coverage) -->
    <div class="absolute inset-0 bg-black/60 dark:bg-black/70 z-10" />
    
    <!-- Content Container -->
    <div class="absolute inset-0 z-20 flex items-center">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-2 gap-8 items-center">
          <!-- Left: Feature Icon/Badge (Accent - 10%) -->
          <div class="hidden md:block">
            <div class="w-24 h-24 rounded-2xl bg-es-accent-primary/20 dark:bg-es-accent-primary-dark/20 flex items-center justify-center mb-6">
              <span class="text-5xl">{{ slide.featureIcon || '✨' }}</span>
            </div>
          </div>
          
          <!-- Right: Content -->
          <div>
            <!-- Category Badge (Accent - 10%) -->
            <span
              v-if="slide.category"
              class="inline-block px-4 py-1.5 bg-es-accent-primary/20 dark:bg-es-accent-primary-dark/20 text-es-text-inverse dark:text-es-text-inverse-dark text-sm font-medium rounded-full backdrop-blur-sm mb-4"
            >
              {{ slide.category }}
            </span>
            
            <!-- Title (Neutral - 60%) -->
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-es-text-inverse dark:text-es-text-inverse-dark mb-4">
              {{ slide.title }}
            </h1>
            
            <!-- Description (Secondary - 30%) -->
            <p class="text-lg md:text-xl text-es-text-inverse/90 dark:text-es-text-inverse-dark/90 mb-8">
              {{ slide.description }}
            </p>
            
            <!-- Feature List (Neutral - 60%) -->
            <ul
              v-if="slide.features"
              class="space-y-3 mb-8"
            >
              <li
                v-for="(feature, index) in slide.features"
                :key="index"
                class="flex items-center text-es-text-inverse/90 dark:text-es-text-inverse-dark/90"
              >
                <span class="w-2 h-2 bg-es-accent-primary dark:bg-es-accent-primary-dark rounded-full mr-3" />
                {{ feature }}
              </li>
            </ul>
            
            <!-- CTA Button (Accent - 10%) -->
            <NuxtLink
              :to="localePath(slide.ctaLink)"
              class="inline-flex items-center px-6 py-3 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors"
            >
              {{ slide.ctaText }}
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath()

interface BannerSlideFeature {
  id: number
  type: 'feature'
  title: string
  category?: string
  description: string
  image: string
  featureIcon?: string
  features?: string[]
  ctaText: string
  ctaLink: string
}

defineProps<{
  slide: BannerSlideFeature
}>()
</script>
