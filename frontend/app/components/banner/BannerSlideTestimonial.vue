<template>
  <!-- Banner Slide Template 4: Testimonial -->
  <!-- Social proof with client quote and credentials -->
  <div class="banner-slide-testimonial relative w-full h-full">
    <!-- Background Image -->
    <img
      :src="slide.backgroundImage"
      :alt="slide.title"
      class="w-full h-full object-cover"
      loading="eager"
      fetchpriority="high"
    >
    
    <!-- Overlay (60% neutral coverage) -->
    <div class="absolute inset-0 bg-gradient-to-r from-es-bg-secondary/95 via-es-bg-secondary/90 to-es-bg-secondary/70 dark:from-es-bg-secondary-dark/95 dark:via-es-bg-secondary-dark/90 dark:to-es-bg-secondary-dark/70 z-10" />
    
    <!-- Content Container -->
    <div class="absolute inset-0 z-20 flex items-center">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <!-- Left: Quote -->
          <div>
            <!-- Quote Icon (Accent - 10%) -->
            <div class="mb-6">
              <svg
                class="w-12 h-12 text-es-accent-primary dark:text-es-accent-primary-dark opacity-50"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>
            
            <!-- Testimonial Quote (Neutral - 60%) -->
            <blockquote class="text-2xl md:text-3xl text-es-text-primary dark:text-es-text-primary-dark font-medium leading-relaxed mb-8">
              "{{ slide.quote }}"
            </blockquote>
            
            <!-- Client Info (Secondary - 30%) -->
            <div class="flex items-center">
              <!-- Client Photo -->
              <img
                v-if="slide.clientPhoto"
                :src="slide.clientPhoto"
                :alt="slide.clientName"
                class="w-14 h-14 rounded-full object-cover mr-4 border-2 border-es-accent-primary dark:border-es-accent-primary-dark"
              >
              <div
                v-else
                class="w-14 h-14 rounded-full bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 flex items-center justify-center mr-4 border-2 border-es-accent-primary dark:border-es-accent-primary-dark"
              >
                <span class="text-xl text-es-accent-primary dark:text-es-accent-primary-dark">
                  {{ slide.clientName.charAt(0) }}
                </span>
              </div>
              
              <!-- Client Details -->
              <div>
                <p class="font-semibold text-es-text-primary dark:text-es-text-primary-dark">
                  {{ slide.clientName }}
                </p>
                <p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
                  {{ slide.clientTitle }}, {{ slide.clientCompany }}
                </p>
              </div>
            </div>
          </div>
          
          <!-- Right: Stats or CTA -->
          <div class="hidden md:block">
            <!-- Stats Cards (30% secondary, 10% accent) -->
            <div
              v-if="slide.stats"
              class="grid grid-cols-2 gap-4"
            >
              <div
                v-for="(stat, index) in slide.stats"
                :key="index"
                class="bg-es-bg-primary dark:bg-es-bg-primary-dark rounded-xl p-6 border border-es-border dark:border-es-border-dark"
              >
                <p class="text-3xl font-bold text-es-accent-primary dark:text-es-accent-primary-dark mb-2">
                  {{ stat.value }}
                </p>
                <p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
                  {{ stat.label }}
                </p>
              </div>
            </div>
            
            <!-- Alternative: CTA Button -->
            <div
              v-else-if="slide.ctaText"
              class="text-center"
            >
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
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath()

interface Stat {
  value: string
  label: string
}

interface BannerSlideTestimonial {
  id: number
  type: 'testimonial'
  quote: string
  clientName: string
  clientTitle: string
  clientCompany: string
  clientPhoto?: string
  backgroundImage: string
  stats?: Stat[]
  ctaText?: string
  ctaLink?: string
}

defineProps<{
  slide: BannerSlideTestimonial
}>()
</script>
