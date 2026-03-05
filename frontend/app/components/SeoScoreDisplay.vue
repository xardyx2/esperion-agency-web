<template>
  <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6">
    <h3 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-4">SEO Score</h3>
    
    <!-- Score Display -->
    <div v-if="seoScore" class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <span class="text-4xl font-bold" :class="scoreColor">{{ seoScore.score }}/100</span>
        <span class="px-3 py-1 rounded-full text-sm font-medium" :class="gradeColor">{{ seoScore.grade }}</span>
      </div>
      
      <!-- Progress Bar -->
      <div class="w-full bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark rounded-full h-4 mb-6">
        <div 
          class="h-4 rounded-full transition-all duration-500" 
          :class="scoreBarColor"
          :style="{ width: seoScore.score + '%' }"
        ></div>
      </div>

      <!-- Breakdown -->
      <div class="space-y-3">
        <div v-for="item in breakdown" :key="item.label">
          <div class="flex items-center justify-between mb-1">
            <span class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">{{ item.label }}</span>
            <span class="text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark">{{ item.value }}/{{ item.max }}</span>
          </div>
          <div class="w-full bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark rounded-full h-2">
            <div 
              class="h-2 rounded-full transition-all duration-500" 
              :class="scoreBarColor"
              :style="{ width: (item.value / item.max * 100) + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Suggestions -->
    <div v-if="seoScore && seoScore.suggestions.length > 0" class="mt-6 pt-6 border-t border-es-border dark:border-es-border-dark">
      <h4 class="text-sm font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-3">Suggestions for Improvement</h4>
      <ul class="space-y-2">
        <li v-for="(suggestion, index) in seoScore.suggestions" :key="index" class="flex items-start gap-2 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
          <span class="text-yellow-500 mt-0.5">⚠️</span>
          <span>{{ suggestion }}</span>
        </li>
      </ul>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8">
      <span class="text-4xl mb-2 block">📊</span>
      <p class="text-es-text-secondary dark:text-es-text-secondary-dark">No SEO score available yet</p>
      <button @click="$emit('calculate')" class="mt-4 px-4 py-2 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg text-sm font-medium hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors">
        Calculate SEO Score
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface SeoScoreBreakdown {
  content_quality: number;
  on_page_seo: number;
  readability: number;
  internal_linking: number;
  technical_seo: number;
  local_seo: number;
}

interface SeoScore {
  score: number;
  grade: string;
  breakdown: SeoScoreBreakdown;
  suggestions: string[];
}

defineProps<{
  seoScore: SeoScore | null;
}>();

defineEmits<{
  (e: 'calculate'): void;
}>();

const breakdown = computed(() => {
  if (!props.seoScore) return [];
  
  const b = props.seoScore.breakdown;
  return [
    { label: 'Content Quality', value: b.content_quality, max: 35 },
    { label: 'On-Page SEO', value: b.on_page_seo, max: 25 },
    { label: 'Readability', value: b.readability, max: 15 },
    { label: 'Internal Linking', value: b.internal_linking, max: 10 },
    { label: 'Technical SEO', value: b.technical_seo, max: 10 },
    { label: 'Local SEO', value: b.local_seo, max: 5 },
  ];
});

const scoreColor = computed(() => {
  if (!props.seoScore) return '';
  const score = props.seoScore.score;
  if (score >= 90) return 'text-green-500';
  if (score >= 80) return 'text-blue-500';
  if (score >= 70) return 'text-yellow-500';
  if (score >= 60) return 'text-orange-500';
  return 'text-red-500';
});

const gradeColor = computed(() => {
  if (!props.seoScore) return '';
  const score = props.seoScore.score;
  if (score >= 90) return 'bg-green-500/10 text-green-500';
  if (score >= 80) return 'bg-blue-500/10 text-blue-500';
  if (score >= 70) return 'bg-yellow-500/10 text-yellow-500';
  if (score >= 60) return 'bg-orange-500/10 text-orange-500';
  return 'bg-red-500/10 text-red-500';
});

const scoreBarColor = computed(() => {
  if (!props.seoScore) return '';
  const score = props.seoScore.score;
  if (score >= 90) return 'bg-green-500';
  if (score >= 80) return 'bg-blue-500';
  if (score >= 70) return 'bg-yellow-500';
  if (score >= 60) return 'bg-orange-500';
  return 'bg-red-500';
});

const props = defineProps<{
  seoScore: SeoScore | null;
}>();
</script>