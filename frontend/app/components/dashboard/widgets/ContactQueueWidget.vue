<script setup lang="ts">
interface ContactSubmission {
  id: string
  full_name: string
  email: string
  service: string
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  created_at: string
}

const submissions = ref<ContactSubmission[]>([
  { id: '1', full_name: 'John Doe', email: 'john@example.com', service: 'Web Development', status: 'new', created_at: '2024-01-15' },
  { id: '2', full_name: 'Jane Smith', email: 'jane@example.com', service: 'Mobile App', status: 'contacted', created_at: '2024-01-14' },
  { id: '3', full_name: 'Bob Wilson', email: 'bob@example.com', service: 'UI/UX Design', status: 'qualified', created_at: '2024-01-13' },
  { id: '4', full_name: 'Alice Brown', email: 'alice@example.com', service: 'Cloud Migration', status: 'converted', created_at: '2024-01-12' },
  { id: '5', full_name: 'Charlie Davis', email: 'charlie@example.com', service: 'Consulting', status: 'lost', created_at: '2024-01-11' },
])

const statusConfig: Record<string, { label: string; color: string }> = {
  new: { label: 'New', color: 'es-badge-info' },
  contacted: { label: 'Contacted', color: 'es-badge-warning' },
  qualified: { label: 'Qualified', color: 'es-badge-success' },
  converted: { label: 'Converted', color: 'es-badge-primary' },
  lost: { label: 'Lost', color: 'es-badge-neutral' },
}

const navigateToDetail = (id: string) => {
  navigateTo(`/dashboard/contacts/${id}`)
}
</script>

<template>
  <div class="es-card es-p-4">
    <div class="es-flex es-justify-between es-items-center es-mb-4">
      <h3 class="es-text-lg es-font-semibold es-text-es-text-dark es-dark:text-es-text-light">
        Recent Contacts
      </h3>
      <NuxtLink
        to="/dashboard/contacts"
        class="es-text-sm es-text-es-primary es-hover:es-underline es-dark:text-es-primary-light"
      >
        View all
      </NuxtLink>
    </div>

    <div v-if="submissions.length === 0" class="es-text-center es-py-8">
      <p class="es-text-es-text-muted es-dark:text-es-text-muted-dark">
        No contact submissions yet
      </p>
    </div>

    <div v-else class="es-space-y-3">
      <div
        v-for="submission in submissions"
        :key="submission.id"
        @click="navigateToDetail(submission.id)"
        class="es-cursor-pointer es-rounded es-p-3 es-hover:es-bg-es-bg-hover es-dark:es-hover:es-bg-es-bg-hover-dark es-transition-colors"
      >
        <div class="es-flex es-justify-between es-items-start es-mb-2">
          <div>
            <p class="es-font-medium es-text-es-text-dark es-dark:text-es-text-light">
              {{ submission.full_name }}
            </p>
            <p class="es-text-sm es-text-es-text-muted es-dark:text-es-text-muted-dark">
              {{ submission.email }}
            </p>
          </div>
          <span :class="['es-text-xs es-px-2 es-py-1 es-rounded-full', statusConfig[submission.status].color]">
            {{ statusConfig[submission.status].label }}
          </span>
        </div>
        <div class="es-flex es-justify-between es-items-center">
          <p class="es-text-sm es-text-es-text-muted es-dark:text-es-text-muted-dark">
            {{ submission.service }}
          </p>
          <p class="es-text-xs es-text-es-text-muted es-dark:text-es-text-muted-dark">
            {{ submission.created_at }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
