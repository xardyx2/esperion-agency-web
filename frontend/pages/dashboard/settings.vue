<template>
  <div>
    <h1 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-8">
      Settings
    </h1>
    <div class="space-y-6">
      <!-- General Settings -->
      <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6">
        <h2 class="text-xl font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-4">
          General Settings
        </h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">Site Title</label>
            <input
              type="text"
              value="Esperion Digital Agency"
              class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">Site Description</label>
            <textarea
              rows="3"
              class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
            >Transforming businesses through innovative digital solutions.</textarea>
          </div>
        </div>
      </div>
      <!-- SEO Settings -->
      <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6">
        <h2 class="text-xl font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-4">
          SEO Settings
        </h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">Google Analytics ID</label>
            <input
              type="text"
              placeholder="G-XXXXXXXXXX"
              class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">Meta Pixel ID</label>
            <input
              type="text"
              placeholder="1234567890"
              class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
            >
          </div>
        </div>
      </div>
      <!-- Save Button -->
      <div class="flex justify-end">
        <button class="px-8 py-3 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'Settings - Dashboard', description: 'Manage your settings.' })
</script>
