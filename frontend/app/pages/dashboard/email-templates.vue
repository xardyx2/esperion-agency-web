<template>
  <div class="space-y-6">
    <DashboardPageHeader
      eyebrow="Email Templates"
      title="Template Editor"
      description="Create and manage email templates with variable substitution"
    />

    <!-- Template List -->
    <UCard
      :ui="{
        root: 'rounded-3xl border border-es-border bg-es-bg-secondary shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark',
        header: 'border-b border-es-border/70 px-6 py-5 dark:border-es-border-dark/70',
        body: 'px-6 py-5'
      }"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <h2 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">
            Email Templates
          </h2>
          <UButton color="primary" variant="outline" size="sm" @click="showCreateModal = true">
            + New Template
          </UButton>
        </div>
      </template>

      <div class="space-y-3">
        <div
          v-for="template in templates"
          :key="template.id"
          class="flex items-center justify-between p-4 bg-es-bg-primary dark:bg-es-bg-primary-dark rounded-lg border border-es-border dark:border-es-border-dark"
        >
          <div>
            <h3 class="font-semibold text-es-text-primary dark:text-es-text-primary-dark">
              {{ template.name }}
            </h3>
            <p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
              {{ template.slug }} • {{ template.category }}
            </p>
          </div>
          <div class="flex gap-2">
            <UButton
              color="gray"
              variant="ghost"
              size="sm"
              @click="editTemplate(template)"
            >
              Edit
            </UButton>
            <UButton
              color="red"
              variant="ghost"
              size="sm"
              @click="deleteTemplate(template)"
            >
              Delete
            </UButton>
          </div>
        </div>

        <div v-if="templates.length === 0" class="text-center py-8 text-es-text-secondary dark:text-es-text-secondary-dark">
          No templates found. Create your first template!
        </div>
      </div>
    </UCard>

    <!-- Template Editor -->
    <UCard
      v-if="editingTemplate"
      :ui="{
        root: 'rounded-3xl border border-es-border bg-es-bg-secondary shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark',
        header: 'border-b border-es-border/70 px-6 py-5 dark:border-es-border-dark/70',
        body: 'px-6 py-5'
      }"
    >
      <template #header>
        <h2 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">
          {{ editingTemplate.id ? 'Edit' : 'Create' }} Template
        </h2>
      </template>

      <div class="space-y-4">
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
              Template Name
            </label>
            <input
              v-model="editingTemplate.name"
              type="text"
              placeholder="Welcome Email"
              class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
              Slug
            </label>
            <input
              v-model="editingTemplate.slug"
              type="text"
              placeholder="welcome-email"
              class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
            >
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
              Category
            </label>
            <select
              v-model="editingTemplate.category"
              class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
            >
              <option value="general">General</option>
              <option value="contact">Contact</option>
              <option value="user">User</option>
              <option value="notification">Notification</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>
          <div>
            <label class="inline-flex items-center gap-2 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
              <input
                v-model="editingTemplate.is_active"
                type="checkbox"
                class="h-4 w-4"
              > Active
            </label>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
            Email Subject
          </label>
          <input
            v-model="editingTemplate.subject"
            type="text"
            placeholder="Welcome to {{company_name}}!"
            class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
          >
          <p class="mt-1 text-xs text-es-text-secondary dark:text-es-text-secondary-dark">
            Use {{variable}} syntax for dynamic content
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
            Plain Text Body
          </label>
          <textarea
            v-model="editingTemplate.body_plain"
            rows="6"
            placeholder="Dear {{name}},&#10;&#10;Welcome to our platform!&#10;&#10;Best regards,&#10;The Team"
            class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary font-mono text-sm"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
            HTML Body (Optional)
          </label>
          <textarea
            v-model="editingTemplate.body_html"
            rows="12"
            placeholder="<html><body><h1>Welcome {{name}}!</h1></body></html>"
            class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary font-mono text-sm"
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
            Variables (comma-separated)
          </label>
          <input
            v-model="variablesInput"
            type="text"
            placeholder="name, email, company_name"
            class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
          >
          <div class="mt-2 flex flex-wrap gap-2">
            <span
              v-for="variable in editingTemplate.variables"
              :key="variable"
              class="inline-flex items-center gap-1 px-2 py-1 bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 text-es-accent-primary dark:text-es-accent-primary-dark rounded text-xs"
            >
              {{ variable }}
              <button
                type="button"
                @click="removeVariable(variable)"
                class="hover:text-es-text-primary dark:hover:text-es-text-primary-dark"
              >
                ×
              </button>
            </span>
          </div>
        </div>

        <div class="flex gap-4 pt-4">
          <UButton
            color="primary"
            :loading="saving"
            @click="saveTemplate"
          >
            Save Template
          </UButton>
          <UButton
            color="gray"
            variant="outline"
            @click="cancelEdit"
          >
            Cancel
          </UButton>
          <UButton
            v-if="editingTemplate.id"
            color="blue"
            variant="outline"
            @click="previewTemplate"
          >
            Preview
          </UButton>
        </div>
      </div>
    </UCard>

    <!-- Create Modal -->
    <UModal v-model="showCreateModal">
      <UCard
        :ui="{
          root: 'rounded-3xl border border-es-border bg-es-bg-secondary shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark',
        }"
      >
        <template #header>
          <h3 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">
            Create New Template
          </h3>
        </template>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
              Template Name
            </label>
            <input
              v-model="newTemplateName"
              type="text"
              placeholder="Template name"
              class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
              Slug
            </label>
            <input
              v-model="newTemplateSlug"
              type="text"
              placeholder="template-slug"
              class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark mb-2">
              Category
            </label>
            <select
              v-model="newTemplateCategory"
              class="w-full px-4 py-2 bg-es-bg-primary dark:bg-es-bg-primary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-primary dark:text-es-text-primary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
            >
              <option value="general">General</option>
              <option value="contact">Contact</option>
              <option value="user">User</option>
              <option value="notification">Notification</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>
        </div>

        <div class="flex gap-4 mt-6">
          <UButton color="primary" @click="createNewTemplate">
            Create
          </UButton>
          <UButton color="gray" variant="outline" @click="showCreateModal = false">
            Cancel
          </UButton>
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const { $api } = useNuxtApp()

const templates = ref<any[]>([])
const editingTemplate = ref<any>(null)
const saving = ref(false)
const showCreateModal = ref(false)
const newTemplateName = ref('')
const newTemplateSlug = ref('')
const newTemplateCategory = ref('general')
const variablesInput = ref('')

// Load templates
const loadTemplates = async () => {
  try {
    const response = await $api('/api/v1/email/templates')
    templates.value = response.data?.templates || []
  } catch (error) {
    console.error('Failed to load templates:', error)
  }
}

// Edit template
const editTemplate = (template: any) => {
  editingTemplate.value = { ...template }
  variablesInput.value = template.variables?.join(', ') || ''
}

// Remove variable
const removeVariable = (variable: string) => {
  if (editingTemplate.value) {
    editingTemplate.value.variables = editingTemplate.value.variables.filter((v: string) => v !== variable)
  }
}

// Watch variables input
watch(variablesInput, (newVal) => {
  if (editingTemplate.value) {
    editingTemplate.value.variables = newVal
      .split(',')
      .map((v: string) => v.trim())
      .filter((v: string) => v.length > 0)
  }
})

// Save template
const saveTemplate = async () => {
  if (!editingTemplate.value) return
  
  saving.value = true
  try {
    const payload = {
      name: editingTemplate.value.name,
      slug: editingTemplate.value.slug,
      subject: editingTemplate.value.subject,
      body_plain: editingTemplate.value.body_plain,
      body_html: editingTemplate.value.body_html || null,
      variables: editingTemplate.value.variables || [],
      category: editingTemplate.value.category,
      is_active: editingTemplate.value.is_active,
    }

    if (editingTemplate.value.id) {
      // Update existing
      const id = editingTemplate.value.id.split(':')[1]
      await $api(`/api/v1/email/templates/${id}`, {
        method: 'PUT',
        body: payload
      })
    } else {
      // Create new
      await $api('/api/v1/email/templates', {
        method: 'POST',
        body: payload
      })
    }

    await loadTemplates()
    cancelEdit()
    alert('Template saved successfully!')
  } catch (error: any) {
    console.error('Failed to save template:', error)
    alert(`Failed to save template: ${error.message}`)
  } finally {
    saving.value = false
  }
}

// Cancel edit
const cancelEdit = () => {
  editingTemplate.value = null
  variablesInput.value = ''
}

// Create new template
const createNewTemplate = async () => {
  editingTemplate.value = {
    name: newTemplateName.value,
    slug: newTemplateSlug.value,
    subject: '',
    body_plain: '',
    body_html: null,
    variables: [],
    category: newTemplateCategory.value,
    is_active: true,
  }
  variablesInput.value = ''
  showCreateModal.value = false
  newTemplateName.value = ''
  newTemplateSlug.value = ''
  newTemplateCategory.value = 'general'
}

// Delete template
const deleteTemplate = async (template: any) => {
  if (!confirm(`Are you sure you want to delete "${template.name}"?`)) return

  try {
    const id = template.id.split(':')[1]
    await $api(`/api/v1/email/templates/${id}`, {
      method: 'DELETE'
    })
    await loadTemplates()
    if (editingTemplate.value?.id === template.id) {
      cancelEdit()
    }
    alert('Template deleted successfully!')
  } catch (error: any) {
    console.error('Failed to delete template:', error)
    alert(`Failed to delete template: ${error.message}`)
  }
}

// Preview template
const previewTemplate = () => {
  // Simple preview - in production, you'd want a more sophisticated preview
  const variables = editingTemplate.value.variables?.reduce((acc: any, v: string) => {
    acc[v] = `{{${v}}}`
    return acc
  }, {}) || {}
  
  alert('Subject: ' + editingTemplate.value.subject + '\n\nPlain:\n' + editingTemplate.value.body_plain)
}

onMounted(() => {
  loadTemplates()
})
</script>
