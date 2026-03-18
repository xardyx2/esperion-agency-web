<template>
  <!-- Banner Slide Template 1: Hero -->
  <!-- Main value proposition with strong CTA -->
  <div class="banner-slide-hero relative w-full h-full">
    <!-- Background Image -->
    <img
      :src="slide.image"
      :alt="slide.title"
      class="w-full h-full object-cover"
      loading="eager"
      fetchpriority="high"
    >
    
    <!-- Gradient Overlay (60% neutral coverage) -->
    <div class="absolute inset-0 bg-gradient-to-r from-es-bg-secondary/90 via-es-bg-secondary/70 to-transparent dark:from-es-bg-secondary-dark/90 dark:via-es-bg-secondary-dark/70 dark:to-transparent z-10" />
    
    <!-- Content Container -->
    <div class="absolute inset-0 z-20 flex items-center">
      <div class="container mx-auto px-4">
        <div class="max-w-2xl">
          <!-- Title (Accent - 10%) -->
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-2">
            {{ slide.title }}
          </h1>
          
          <!-- Subtitle (Secondary - 30%) -->
          <p
            v-if="slide.subtitle"
            class="text-lg md:text-xl text-es-text-secondary dark:text-es-text-secondary-dark mb-4 font-medium"
          >
            {{ slide.subtitle }}
          </p>
          
          <!-- Description (Neutral - 60%) -->
          <p class="text-lg md:text-xl text-es-text-secondary dark:text-es-text-secondary-dark mb-8">
            {{ slide.description }}
          </p>
          
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
</template>

<script setup lang="ts">
const localePath = useLocalePath()

interface BannerSlideHero {
  id: number
  type: 'hero'
  title: string
  subtitle?: string
  description: string
  image: string
  ctaText: string
  ctaLink: string
}

defineProps<{
  slide: BannerSlideHero
}>()
</script>
