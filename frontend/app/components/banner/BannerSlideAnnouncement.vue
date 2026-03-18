<template>
  <!-- Banner Slide Template 5: Announcement -->
  <!-- News, updates, or special offers with urgency -->
  <div class="banner-slide-announcement relative w-full h-full">
    <!-- Background with Bold Gradient (10% accent, 60% neutral) -->
    <div class="absolute inset-0 bg-gradient-to-br from-es-accent-primary via-es-bg-secondary to-es-bg-secondary dark:from-es-accent-primary-dark dark:via-es-bg-secondary-dark dark:to-es-bg-secondary-dark" />
    
    <!-- Pattern Overlay (optional) -->
    <div
      v-if="slide.showPattern"
      class="absolute inset-0 opacity-5 dark:opacity-10"
      style="background-image: radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0);"
      :style="{ color: 'var(--es-text-inverse)' }"
    />
    
    <!-- Content Container -->
    <div class="absolute inset-0 z-20 flex items-center">
      <div class="container mx-auto px-4">
        <div class="max-w-4xl mx-auto text-center">
          <!-- Announcement Badge (Accent - 10%) -->
          <div
            v-if="slide.badge"
            class="inline-flex items-center px-4 py-2 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-full text-sm font-semibold mb-6 animate-pulse"
          >
            <span class="mr-2">{{ slide.badgeIcon || '📢' }}</span>
            {{ slide.badge }}
          </div>
          
          <!-- Title (Neutral - 60%) -->
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-4">
            {{ slide.title }}
          </h1>
          
          <!-- Subtitle (Secondary - 30%) -->
          <p
            v-if="slide.subtitle"
            class="text-xl md:text-2xl text-es-text-secondary dark:text-es-text-secondary-dark mb-6"
          >
            {{ slide.subtitle }}
          </p>
          
          <!-- Description (Neutral - 60%) -->
          <p class="text-lg md:text-xl text-es-text-secondary dark:text-es-text-secondary-dark mb-8 max-w-2xl mx-auto">
            {{ slide.description }}
          </p>
          
          <!-- Countdown Timer (optional) -->
          <div
            v-if="slide.countdownDate"
            class="flex justify-center gap-4 mb-8"
          >
            <div
              v-for="(unit, index) in countdownUnits"
              :key="index"
              class="bg-es-bg-primary dark:bg-es-bg-primary-dark rounded-lg p-4 min-w-[80px] border border-es-border dark:border-es-border-dark"
            >
              <p class="text-2xl md:text-3xl font-bold text-es-accent-primary dark:text-es-accent-primary-dark">
                {{ unit.value }}
              </p>
              <p class="text-xs text-es-text-secondary dark:text-es-text-secondary-dark uppercase tracking-wider">
                {{ unit.label }}
              </p>
            </div>
          </div>
          
          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <!-- Primary CTA (Accent - 10%) -->
            <NuxtLink
              :to="localePath(slide.ctaLink)"
              class="inline-flex items-center px-8 py-4 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-all hover:shadow-lg hover:shadow-es-accent-primary/25 dark:hover:shadow-es-accent-primary-dark/25 transform hover:-translate-y-0.5"
            >
              {{ slide.ctaText }}
            </NuxtLink>
            
            <!-- Secondary Link (Neutral - 60%) -->
            <NuxtLink
              v-if="slide.secondaryCtaLink"
              :to="localePath(slide.secondaryCtaLink)"
              class="text-es-accent-primary dark:text-es-accent-primary-dark font-semibold hover:underline"
            >
              {{ slide.secondaryCtaText || 'Learn more' }} →
            </NuxtLink>
          </div>
          
          <!-- Fine Print (Secondary - 30%) -->
          <p
            v-if="slide.finePrint"
            class="mt-6 text-sm text-es-text-tertiary dark:text-es-text-tertiary-dark"
          >
            {{ slide.finePrint }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath()

interface CountdownUnit {
  value: string
  label: string
}

interface BannerSlideAnnouncement {
  id: number
  type: 'announcement'
  badge?: string
  badgeIcon?: string
  title: string
  subtitle?: string
  description: string
  image?: string
  showPattern?: boolean
  countdownDate?: string
  ctaText: string
  ctaLink: string
  secondaryCtaText?: string
  secondaryCtaLink?: string
  finePrint?: string
}

const props = defineProps<{
  slide: BannerSlideAnnouncement
}>()

// Countdown timer logic
const countdownUnits = ref<CountdownUnit[]>([])

const updateCountdown = () => {
  if (!props.slide.countdownDate) return
  
  const now = new Date()
  const target = new Date(props.slide.countdownDate)
  const diff = target.getTime() - now.getTime()
  
  if (diff <= 0) {
    countdownUnits.value = []
    return
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  
  countdownUnits.value = [
    { value: String(days).padStart(2, '0'), label: 'Days' },
    { value: String(hours).padStart(2, '0'), label: 'Hours' },
    { value: String(minutes).padStart(2, '0'), label: 'Minutes' },
    { value: String(seconds).padStart(2, '0'), label: 'Seconds' }
  ]
}

onMounted(() => {
  updateCountdown()
  const interval = setInterval(updateCountdown, 1000)
  onBeforeUnmount(() => clearInterval(interval))
})
</script>
