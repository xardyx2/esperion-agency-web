<template>
  <!-- Banner Slide Template 3: CTA Focus -->
  <!-- Strong call-to-action with minimal distractions -->
  <div class="banner-slide-cta relative w-full h-full">
    <!-- Background with Gradient (60% neutral, 10% accent) -->
    <div class="absolute inset-0 bg-gradient-to-br from-es-bg-secondary via-es-bg-secondary to-es-accent-primary/10 dark:from-es-bg-secondary-dark dark:via-es-bg-secondary-dark dark:to-es-accent-primary-dark/10" />
    
    <!-- Background Image (optional) -->
    <img
      v-if="slide.image"
      :src="slide.image"
      :alt="slide.title"
      class="w-full h-full object-cover opacity-20 dark:opacity-10"
      loading="eager"
      fetchpriority="high"
    >
    
    <!-- Content Container -->
    <div class="absolute inset-0 z-20 flex items-center justify-center">
      <div class="container mx-auto px-4 text-center">
        <!-- Category Badge (Accent - 10%) -->
        <span
          v-if="slide.category"
          class="inline-block px-4 py-1.5 bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 text-es-accent-primary dark:text-es-accent-primary-dark text-sm font-medium rounded-full mb-6"
        >
          {{ slide.category }}
        </span>
        
        <!-- Title (Neutral - 60%) -->
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4 max-w-4xl mx-auto">
          {{ slide.title }}
        </h1>
        
        <!-- Description (Secondary - 30%) -->
        <p class="text-xl md:text-2xl text-es-text-secondary dark:text-es-text-secondary-dark mb-8 max-w-3xl mx-auto">
          {{ slide.description }}
        </p>
        
        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <!-- Primary CTA (Accent - 10%) -->
          <NuxtLink
            :to="localePath(slide.ctaLink)"
            class="inline-flex items-center px-8 py-4 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-all hover:shadow-lg hover:shadow-es-accent-primary/25 dark:hover:shadow-es-accent-primary-dark/25 transform hover:-translate-y-0.5"
          >
            {{ slide.ctaText }}
          </NuxtLink>
          
          <!-- Secondary CTA (Neutral - 60%) -->
          <NuxtLink
            v-if="slide.secondaryCtaLink && slide.secondaryCtaText"
            :to="localePath(slide.secondaryCtaLink)"
            class="inline-flex items-center px-8 py-4 border-2 border-es-accent-primary dark:border-es-accent-primary-dark text-es-accent-primary dark:text-es-accent-primary-dark rounded-lg font-semibold hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors"
          >
            {{ slide.secondaryCtaText }}
          </NuxtLink>
        </div>
        
        <!-- Trust Indicators (Secondary - 30%) -->
        <div
          v-if="slide.trustIndicators"
          class="mt-12 flex flex-wrap justify-center gap-8"
        >
          <div
            v-for="(indicator, index) in slide.trustIndicators"
            :key="index"
            class="text-center"
          >
            <p class="text-3xl font-bold text-es-accent-primary dark:text-es-accent-primary-dark">
              {{ indicator.value }}
            </p>
            <p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark mt-1">
              {{ indicator.label }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath()

interface TrustIndicator {
  value: string
  label: string
}

interface BannerSlideCTA {
  id: number
  type: 'cta'
  title: string
  category?: string
  description: string
  image?: string
  ctaText: string
  ctaLink: string
  secondaryCtaText?: string
  secondaryCtaLink?: string
  trustIndicators?: TrustIndicator[]
}

defineProps<{
  slide: BannerSlideCTA
}>()
</script>
