<template>
  <div>
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark mb-2">
          Contact Submissions
        </h1>
        <p class="text-es-text-secondary dark:text-es-text-secondary-dark">
          Manage inquiries from your website
        </p>
      </div>
      <button class="inline-flex items-center justify-center px-6 py-3 bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark text-es-text-primary dark:text-es-text-primary-dark rounded-lg font-semibold hover:bg-es-accent-primary hover:text-es-text-inverse dark:hover:bg-es-accent-primary-dark dark:hover:text-es-text-inverse-dark transition-colors">
        📥 Export CSV
      </button>
    </div>
    <div class="bg-es-bg-secondary dark:bg-es-bg-secondary-dark rounded-xl overflow-hidden">
      <table class="w-full">
        <thead class="bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark uppercase">
              Name
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark uppercase">
              Email
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark uppercase">
              Service
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark uppercase">
              Date
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark uppercase">
              Status
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-es-text-secondary dark:text-es-text-secondary-dark uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-es-border dark:divide-es-border-dark">
          <tr
            v-for="submission in submissions"
            :key="submission.id"
            class="hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark"
          >
            <td class="px-6 py-4">
              <div>
                <div class="font-medium text-es-text-primary dark:text-es-text-primary-dark">
                  {{ submission.name }}
                </div>
                <div class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
                  {{ submission.company }}
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
              {{ submission.email }}
            </td>
            <td class="px-6 py-4">
              <span class="px-3 py-1 bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 text-es-accent-primary dark:text-es-accent-primary-dark text-xs rounded-full">{{ submission.service }}</span>
            </td>
            <td class="px-6 py-4 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
              {{ submission.date }}
            </td>
            <td class="px-6 py-4">
              <span
                :class="submission.status === 'new' ? 'bg-blue-500/10 text-blue-500' : submission.status === 'contacted' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-green-500/10 text-green-500'"
                class="px-3 py-1 text-xs rounded-full capitalize"
              >{{ submission.status }}</span>
            </td>
            <td class="px-6 py-4 text-right">
              <div class="flex items-center justify-end gap-2">
                <button class="p-2 hover:bg-es-bg-primary dark:hover:bg-es-bg-primary-dark rounded-lg">
                  👁️
                </button>
                <button class="p-2 hover:bg-es-bg-primary dark:hover:bg-es-bg-primary-dark rounded-lg">
                  ✏️
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
useSeoMeta({ title: 'Contact - Dashboard', description: 'Manage contact submissions.' })
const submissions = ref([
  { id: 1, name: 'John Doe', email: 'john@example.com', company: 'Tech Corp', service: 'Web Development', date: '2024-01-15', status: 'new' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', company: 'Design Co', service: 'UI/UX Design', date: '2024-01-14', status: 'contacted' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', company: 'Startup Inc', service: 'Mobile App', date: '2024-01-13', status: 'qualified' },
  { id: 4, name: 'Sarah Lee', email: 'sarah@example.com', company: 'Retail Ltd', service: 'E-Commerce', date: '2024-01-12', status: 'new' }
])
</script>
