<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-2">
          Clients
        </h1>
        <p class="text-es-text-secondary dark:text-es-text-secondary-dark">
          Manage your client relationships
        </p>
      </div>
      <button class="inline-flex items-center justify-center px-6 py-3 bg-es-accent-primary dark:bg-es-accent-primary-dark text-es-text-inverse dark:text-es-text-inverse-dark rounded-lg font-semibold hover:bg-es-accent-primary-hover dark:hover:bg-es-accent-primary-hover-dark transition-colors">
        <span class="text-xl mr-2">+</span> New Client
      </button>
    </div>
    <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl overflow-hidden">
      <table class="w-full">
        <thead class="bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark uppercase">
              Client
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark uppercase">
              Category
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark uppercase">
              Status
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark uppercase">
              Testimonial
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-es-border dark:divide-es-border-dark">
          <tr
            v-for="client in clients"
            :key="client.id"
            class="hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark"
          >
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark flex items-center justify-center">
                  🏢
                </div>
                <div>
                  <div class="font-medium text-es-text-primary dark:text-es-text-primary-dark">
                    {{ client.name }}
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <span class="px-3 py-1 bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 text-es-accent-primary dark:text-es-accent-primary-dark text-xs rounded-full">{{ client.category }}</span>
            </td>
            <td class="px-6 py-4">
              <span
                :class="client.status === 'active' ? 'bg-green-500/10 text-green-500' : client.status === 'prospect' ? 'bg-blue-500/10 text-blue-500' : 'bg-gray-500/10 text-gray-500'"
                class="px-3 py-1 text-xs rounded-full capitalize"
              >{{ client.status }}</span>
            </td>
            <td class="px-6 py-4 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
              {{ client.testimonial ? '✓' : '-' }}
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-2">
                <button class="p-2 hover:bg-es-bg-primary dark:hover:bg-es-bg-primary-dark rounded-lg">
                  ✏️
                </button>
                <button class="p-2 hover:bg-es-bg-primary dark:hover:bg-es-bg-primary-dark rounded-lg">
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'Clients - Dashboard', description: 'Manage clients.' })
const clients = ref([
  { id: 1, name: 'Tech Corp', category: 'Technology', status: 'active', testimonial: true },
  { id: 2, name: 'Fashion Retailer', category: 'Retail', status: 'active', testimonial: true },
  { id: 3, name: 'Regional Bank', category: 'Finance', status: 'active', testimonial: true },
  { id: 4, name: 'Healthcare Network', category: 'Healthcare', status: 'active', testimonial: false },
  { id: 5, name: 'Fitness Startup', category: 'Health & Fitness', status: 'prospect', testimonial: false }
])
</script>
