<template>
  <div>
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-2">New Article</h1>
        <p class="text-es-text-secondary dark:text-es-text-secondary-dark">Create a new blog article</p>
      </div>
      <div class="flex gap-4">
        <NuxtLink to="/dashboard/articles" class="px-6 py-3 border-2 border-es-border dark:border-es-border-dark text-es-text-primary dark:text-es-text-primary-dark rounded-lg font-semibold hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark transition-colors">Cancel</NuxtLink>
        <button @click="saveArticle" class="px-6 py-3 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors">Publish Article</button>
      </div>
    </div>

    <!-- Article Form -->
    <div class="grid lg:grid-cols-3 gap-8">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Title -->
        <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6">
          <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">Title</label>
          <input v-model="form.title" type="text" placeholder="Enter article title" class="w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary" />
        </div>

        <!-- Content -->
        <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6">
          <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">Content</label>
          <textarea v-model="form.content" rows="12" placeholder="Write your article content here..." class="w-full px-4 py-3 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary resize-none"></textarea>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Publish Settings -->
        <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6">
          <h3 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-4">Publish Settings</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">Category</label>
              <select v-model="form.category" class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary">
                <option value="Marketing">Marketing</option>
                <option value="Design">Design</option>
                <option value="Development">Development</option>
                <option value="E-Commerce">E-Commerce</option>
                <option value="Business">Business</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">Status</label>
              <select v-model="form.status" class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
        </div>

        <!-- SEO Settings -->
        <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6">
          <h3 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-4">SEO Settings</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">Meta Description</label>
              <textarea v-model="form.metaDescription" rows="3" placeholder="Brief description for search engines" class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary resize-none"></textarea>
            </div>
          </div>
        </div>

        <!-- Featured Image -->
        <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl p-6">
          <h3 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark mb-4">Featured Image</h3>
          <div class="border-2 border-dashed border-es-border dark:border-es-border-dark rounded-lg p-6 text-center hover:border-es-accent-primary dark:hover:border-es-accent-primary-dark transition-colors cursor-pointer">
            <span class="text-4xl mb-2 block">🖼️</span>
            <p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">Click to upload or drag and drop</p>
            <p class="text-xs text-es-text-secondary dark:text-es-text-secondary-dark mt-1">PNG, JPG up to 5MB</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'New Article - Dashboard', description: 'Create a new article.' });

const form = ref({
  title: '',
  content: '',
  category: 'Marketing',
  status: 'draft',
  metaDescription: '',
});

const saveArticle = async () => {
  // TODO: Implement article save
  alert('Article saved successfully!');
};
</script>