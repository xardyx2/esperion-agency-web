<template>
  <div>
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-2">
        Dashboard Overview
      </h1>
      <p class="text-es-text-secondary dark:text-es-text-secondary-dark">
        Welcome back! Here's what's happening with your agency today.
      </p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div v-for="stat in stats" :key="stat.label" class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6">
        <div class="flex items-center justify-between mb-4">
          <span class="text-3xl">{{ stat.icon }}</span>
          <span :class="stat.trend > 0 ? 'text-green-500' : 'text-red-500'" class="text-sm font-medium">
            {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
          </span>
        </div>
        <div class="text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-1">
          {{ stat.value }}
        </div>
        <div class="text-es-text-secondary dark:text-es-text-secondary-dark text-sm">
          {{ stat.label }}
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid lg:grid-cols-2 gap-6 mb-8">
      <!-- Traffic Overview -->
      <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6">
        <h2 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-4">
          Traffic Overview
        </h2>
        <div class="h-64 bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark rounded-lg flex items-center justify-center">
          <p class="text-es-text-secondary dark:text-es-text-secondary-dark">📈 Chart placeholder - Integrate with Chart.js</p>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6">
        <h2 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-4">
          Recent Activity
        </h2>
        <div class="space-y-4">
          <div v-for="activity in recentActivity" :key="activity.id" class="flex items-start gap-3">
            <span class="text-xl">{{ activity.icon }}</span>
            <div>
              <p class="text-es-text-primary dark:text-es-text-primary-dark text-sm">{{ activity.message }}</p>
              <p class="text-es-text-secondary dark:text-es-text-secondary-dark text-xs">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6">
      <h2 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-4">
        Quick Actions
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <NuxtLink
          v-for="action in quickActions"
          :key="action.label"
          :to="action.href"
          class="flex flex-col items-center justify-center p-4 bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark rounded-lg hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors"
        >
          <span class="text-2xl mb-2">{{ action.icon }}</span>
          <span class="text-sm font-medium">{{ action.label }}</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO Meta
useSeoMeta({
  title: 'Dashboard - Esperion Agency',
  description: 'Manage your Esperion agency dashboard.',
});

const stats = [
  { icon: '📝', value: '24', label: 'Total Articles', trend: 12 },
  { icon: '💼', value: '48', label: 'Total Works', trend: 8 },
  { icon: '👥', value: '156', label: 'Total Clients', trend: 15 },
  { icon: '✉️', value: '12', label: 'New Inquiries', trend: -5 },
];

const recentActivity = [
  { id: 1, icon: '📝', message: 'New article published: "SEO Tips"', time: '2 hours ago' },
  { id: 2, icon: '💼', message: 'New work added: "E-commerce Site"', time: '4 hours ago' },
  { id: 3, icon: '✉️', message: 'New contact form submission', time: '6 hours ago' },
  { id: 4, icon: '👥', message: 'New client added: "Tech Corp"', time: '1 day ago' },
];

const quickActions = [
  { href: '/dashboard/articles/new', label: 'New Article', icon: '✍️' },
  { href: '/dashboard/works/new', label: 'New Work', icon: '➕' },
  { href: '/dashboard/media', label: 'Media Library', icon: '🖼️' },
  { href: '/dashboard/contact', label: 'View Inquiries', icon: '📬' },
];
</script>