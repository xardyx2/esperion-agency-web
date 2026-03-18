<template>
  <div class="flex flex-wrap gap-2">
    <span
      v-for="tag in tags"
      :key="tag"
      :class="getTagClass(tag)"
      class="px-3 py-1 text-sm rounded-full transition-colors"
    >
      {{ tag }}
    </span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  tags: string[]
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const TAG_COLORS: Record<string, string> = {
  'SEO': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  'AI': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  'Digital Marketing': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  'Web Development': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  'Design': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  'Branding': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  'Social Media': 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300',
  'E-Commerce': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  'Analytics': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  'UX/UI': 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
  '2024': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  '2026': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  'Trends': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  'Tutorial': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
  'Case Study': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
  'Performance': 'bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300',
  'Core Web Vitals': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  'Optimization': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  'Accessibility': 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300',
  'WCAG': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  'A11y': 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300',
  'Color Theory': 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
  'Web Design': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  'Visual Design': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  'UX': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  'Business Growth': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  'Strategy': 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300',
  'Entrepreneurship': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  'Scaling': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
  'Revenue': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  'Content Marketing': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300',
  'Organic Traffic': 'bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-300',
  'Google': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  'React': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
  'Vue': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  'JavaScript': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  'Frontend': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  'Mobile Design': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  'Responsive Design': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  'Mobile-First': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  'CRO': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  'Conversion Optimization': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  'Online Store': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  'Voice Search': 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300',
  'Personalization': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  'User Experience': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  'Best Practices': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  'Startup': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  'Brand Identity': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  'Marketing': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  'Instagram': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  'TikTok': 'bg-black text-white dark:bg-black dark:text-white',
  'default': 'bg-es-bg-secondary text-es-text-secondary dark:bg-es-bg-secondary-dark dark:text-es-text-secondary-dark'
}

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-2'
}

function getTagClass(tag: string): string {
  const colorClass = TAG_COLORS[tag] || TAG_COLORS.default
  const sizeClass = sizeClasses[props.size]
  return `${colorClass} ${sizeClass}`
}
</script>
