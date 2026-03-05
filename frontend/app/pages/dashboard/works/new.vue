<template>
  <div>
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-2">New Work</h1>
        <p class="text-es-text-secondary dark:text-es-text-secondary-dark">Add a new portfolio project</p>
      </div>
      <div class="flex gap-4">
        <NuxtLink to="/dashboard/works" class="px-6 py-3 border-2 border-es-border dark:border-es-border-dark text-es-text-primary dark:text-es-text-primary-dark rounded-lg font-semibold hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark transition-colors">Cancel</NuxtLink>
        <button @click="saveWork" class="px-6 py-3 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors">Publish Work</button>
      </div>
    </div>

    <!-- Work Form -->
    <div class="grid lg:grid-cols-3 gap-8">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Title -->
        <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6">
          <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">Project Title</label>
          <input v-model="form.title" type="text" placeholder="Enter project title" class="w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary" />
        </div>

        <!-- Description -->
        <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6">
          <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">Description</label>
          <textarea v-model="form.description" rows="6" placeholder="Describe the project..." class="w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary resize-none"></textarea>
        </div>

        <!-- Metrics -->
        <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6">
          <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-4">Metrics</label>
          <div v-for="(metric, index) in form.metrics" :key="index" class="grid grid-cols-3 gap-4 mb-4">
            <input v-model="metric.label" type="text" placeholder="Label (e.g., Conversion)" class="px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-sm" />
            <input v-model="metric.value" type="text" placeholder="Value (e.g., 45)" class="px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-sm" />
            <input v-model="metric.suffix" type="text" placeholder="Suffix (e.g., %)" class="px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-sm" />
          </div>
          <button @click="addMetric" class="text-es-accent-primary dark:text-es-accent-primary-dark text-sm font-medium hover:underline">+ Add Metric</button>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Project Settings -->
        <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6">
          <h3 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-4">Project Details</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">Client</label>
              <input v-model="form.client" type="text" placeholder="Client name" class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary" />
            </div>
            <div>
              <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">Service</label>
              <select v-model="form.service" class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary">
                <option value="Web Development">Web Development</option>
                <option value="Mobile App Development">Mobile App Development</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="E-Commerce Solutions">E-Commerce Solutions</option>
                <option value="Consulting">Consulting</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">Platform</label>
              <input v-model="form.platform" type="text" placeholder="e.g., Shopify, React Native" class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary" />
            </div>
            <div class="flex items-center gap-2">
              <input v-model="form.featured" type="checkbox" class="w-4 h-4 rounded border-es-border dark:border-es-border-dark text-es-accent-primary focus:ring-es-accent-primary" />
              <label class="text-sm text-es-text-primary dark:text-es-text-primary-dark">Featured Project</label>
            </div>
          </div>
        </div>

        <!-- Project Image -->
        <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6">
          <h3 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-4">Project Image</h3>
          <div class="border-2 border-dashed border-es-border dark:border-es-border-dark rounded-lg p-6 text-center hover:border-es-accent-primary dark:hover:border-es-accent-primary-dark transition-colors cursor-pointer">
            <span class="text-4xl mb-2 block">🖼️</span>
            <p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">Click to upload</p>
            <p class="text-xs text-es-text-secondary dark:text-es-text-secondary-dark mt-1">PNG, JPG up to 5MB</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'New Work - Dashboard', description: 'Add a new portfolio project.' });

const form = ref({
  title: '',
  description: '',
  client: '',
  service: 'Web Development',
  platform: '',
  featured: false,
  metrics: [{ label: '', value: '', suffix: '' }],
});

const addMetric = () => {
  form.value.metrics.push({ label: '', value: '', suffix: '' });
};

const saveWork = async () => {
  // TODO: Implement work save
  alert('Work saved successfully!');
};
</script>