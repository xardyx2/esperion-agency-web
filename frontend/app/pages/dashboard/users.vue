<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <DashboardPageHeader
      eyebrow="Access control"
      :title="t('dashboard.users.title')"
      :description="t('dashboard.users.description')"
    >
      <template #actions>
        <UButton
          v-if="!accessDenied"
          color="primary"
          class="rounded-full"
          :disabled="pending"
          @click="openCreate"
        >
          <UIcon name="i-lucide-plus" class="h-4 w-4 mr-1" />
          {{ t('dashboard.users.newButton') }}
        </UButton>
      </template>
    </DashboardPageHeader>

    <!-- Access Denied -->
    <div
      v-if="accessDenied"
      class="rounded-3xl border border-amber-200 bg-amber-50 px-4 py-6"
    >
      <div class="flex items-center gap-3">
        <UIcon name="i-lucide-shield-alert" class="h-5 w-5 text-amber-600" />
        <p class="text-sm text-amber-800">{{ t('dashboard.users.create.denied') }}</p>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="rounded-3xl border border-red-200 bg-red-50 px-4 py-6"
    >
      <div class="flex items-center gap-3">
        <UIcon name="i-lucide-alert-circle" class="h-5 w-5 text-red-600" />
        <p class="text-sm text-red-700">{{ error }}</p>
      </div>
    </div>

    <!-- Loading State -->
    <UDashboardSection v-if="pending && !users.length" class="overflow-hidden">
      <UDashboardSkeleton type="table" :rows="5" :columns="5" />
    </UDashboardSection>

    <!-- Create/Edit Form -->
    <UCard
      v-if="showForm && !accessDenied"
      :ui="{
        root: 'rounded-3xl border border-es-border bg-es-bg-secondary shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark',
        header: 'border-b border-es-border/70 px-6 py-5 dark:border-es-border-dark/70',
        body: 'px-6 py-5'
      }"
    >
      <template #header>
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-es-text-secondary dark:text-es-text-secondary-dark">
              {{ editingUserId ? 'Update' : 'Create' }}
            </p>
            <h2 class="mt-2 text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">
              {{ editingUserId ? t('dashboard.users.create.update') : t('dashboard.users.create.title') }}
            </h2>
          </div>

          <UButton
            color="neutral"
            variant="outline"
            class="rounded-full border-es-border text-es-text-primary dark:border-es-border-dark dark:text-es-text-primary-dark"
            :disabled="submitting"
            @click="closeForm"
          >
            <UIcon name="i-lucide-x" class="h-4 w-4 mr-1" />
            {{ t('dashboard.users.create.cancel') }}
          </UButton>
        </div>
      </template>

      <form
        class="grid gap-4 md:grid-cols-2"
        @submit="onSubmit"
      >
        <label class="space-y-2 text-sm">
          <span class="block font-medium text-es-text-primary dark:text-es-text-primary-dark">{{ t('dashboard.users.create.fullNameTitle') }}</span>
          <input
            v-model="values.full_name"
            v-bind="fullNameField"
            type="text"
            required
            class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"
            :class="{ 'border-red-500': getError('full_name') }"
          >
          <p v-if="getError('full_name')" class="text-xs text-red-600">
            {{ getError('full_name') }}
          </p>
        </label>

        <label class="space-y-2 text-sm">
          <span class="block font-medium text-es-text-primary dark:text-es-text-primary-dark">{{ t('dashboard.users.create.usernameTitle') }}</span>
          <input
            v-model="values.username"
            v-bind="usernameField"
            type="text"
            required
            class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"
            :class="{ 'border-red-500': getError('username') }"
          >
          <p v-if="getError('username')" class="text-xs text-red-600">
            {{ getError('username') }}
          </p>
        </label>

        <label class="space-y-2 text-sm">
          <span class="block font-medium text-es-text-primary dark:text-es-text-primary-dark">{{ t('dashboard.users.create.emailTitle') }}</span>
          <input
            v-model="values.email"
            v-bind="emailField"
            type="email"
            required
            :disabled="Boolean(editingUserId)"
            class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary disabled:opacity-60 dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"
            :class="{ 'border-red-500': getError('email') }"
          >
          <p v-if="getError('email')" class="text-xs text-red-600">
            {{ getError('email') }}
          </p>
        </label>

        <label class="space-y-2 text-sm">
          <span class="block font-medium text-es-text-primary dark:text-es-text-primary-dark">{{ t('dashboard.users.create.phoneTitle') }}</span>
          <input
            v-model="values.phone"
            v-bind="phoneField"
            type="tel"
            class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"
          >
        </label>

        <label class="space-y-2 text-sm">
          <span class="block font-medium text-es-text-primary dark:text-es-text-primary-dark">{{ t('dashboard.users.create.roleTitle') }}</span>
          <USelect
            v-model="values.role"
            v-bind="roleField"
            :options="roleOptions"
            class="w-full"
          />
          <p v-if="getError('role')" class="text-xs text-red-600">
            {{ getError('role') }}
          </p>
        </label>

        <label v-if="!editingUserId" class="space-y-2 text-sm">
          <span class="block font-medium text-es-text-primary dark:text-es-text-primary-dark">{{ t('dashboard.users.create.passwordTitle') }}</span>
          <input
            v-model="values.password"
            v-bind="passwordField"
            type="password"
            required
            class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark"
            :class="{ 'border-red-500': getError('password') }"
          >
          <p v-if="getError('password')" class="text-xs text-red-600">
            {{ getError('password') }}
          </p>
        </label>

        <div class="md:col-span-2 flex justify-end">
          <UButton
            type="submit"
            color="primary"
            class="rounded-full"
            :loading="submitting"
          >
            {{ submitting ? t('dashboard.users.create.saveInProgress') : editingUserId ? t('dashboard.users.create.saveButton') : t('dashboard.users.create.createButton') }}
          </UButton>
        </div>
      </form>
    </UCard>

    <!-- Bulk Actions Toolbar -->
    <UDashboardBulkActionsToolbar
      v-if="(!pending || users.length) && !showForm && !accessDenied"
      :selected-count="selectedCount"
      :total-count="users.length"
      :actions="bulkActions"
      @clear="clearSelection"
      @select-all="toggleAllSelection"
    />

    <!-- Users Section -->
    <UDashboardSection
      v-if="(!pending || users.length) && !showForm"
      :badge="users.length"
      class="overflow-hidden"
    >
      <template #header>
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.2em] text-es-text-secondary dark:text-es-text-secondary-dark">
              Users
            </p>
            <h2 class="mt-2 text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">
              All Users
            </h2>
          </div>
          <UBadge
            color="primary"
            variant="soft"
          >
            {{ users.length }} users
          </UBadge>
        </div>
      </template>

      <!-- Empty State -->
      <UDashboardEmptyState
        v-if="!users.length && !pending && !accessDenied"
        icon="i-lucide-users"
        title="No users yet"
        description="Create your first user to grant access to the dashboard."
        :primary-action="{ label: 'Create User', icon: 'i-lucide-plus', onClick: openCreate }"
      />

      <!-- Users Table -->
      <div
        v-else-if="!accessDenied"
        class="overflow-x-auto"
      >
        <table class="w-full">
          <thead class="bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark">
            <tr>
              <th class="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  :checked="isAllSelected"
                  :disabled="!users.length"
                  class="h-4 w-4 rounded border-es-border bg-es-bg-primary text-es-accent-primary focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-accent-primary-dark dark:focus:ring-es-accent-primary-dark"
                  @change="toggleAllSelection"
                />
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ t('dashboard.users.table.user') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ t('dashboard.users.table.role') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ t('dashboard.users.table.phone') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ t('dashboard.users.table.joined') }}
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ t('dashboard.users.table.actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-es-border dark:divide-es-border-dark">
            <tr
              v-for="user in users"
              :key="user.id"
              :class="[
                'transition-colors',
                selectedIds.has(user.id) ? 'bg-es-accent-primary/5 dark:bg-es-accent-primary-dark/5' : 'hover:bg-es-bg-tertiary/50 dark:hover:bg-es-bg-tertiary-dark/50'
              ]"
            >
              <td class="px-4 py-4">
                <input
                  type="checkbox"
                  :checked="selectedIds.has(user.id)"
                  class="h-4 w-4 rounded border-es-border bg-es-bg-primary text-es-accent-primary focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-accent-primary-dark dark:focus:ring-es-accent-primary-dark"
                  @change="toggleSelection(user.id)"
                />
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <UAvatar
                    :text="getInitials(user.full_name)"
                    size="sm"
                  />
                  <div>
                    <div class="font-medium text-es-text-primary dark:text-es-text-primary-dark">
                      {{ user.full_name }}
                    </div>
                    <div class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
                      {{ user.email }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <UBadge
                  :color="roleColor(user.role)"
                  variant="soft"
                  size="sm"
                >
                  {{ user.role }}
                </UBadge>
              </td>
              <td class="px-6 py-4 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ user.phone || '-' }}
              </td>
              <td class="px-6 py-4 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ formatDate(user.created_at) }}
              </td>
              <td class="px-6 py-4">
                <div class="flex justify-end gap-2">
                  <UButton
                    color="neutral"
                    variant="ghost"
                    size="sm"
                    @click="openEdit(user)"
                  >
                    <UIcon name="i-lucide-pencil" class="h-4 w-4 mr-1" />
                    {{ t('dashboard.users.buttons.edit') }}
                  </UButton>
                  <UButton
                    color="danger"
                    variant="ghost"
                    size="sm"
                    @click="removeUser(user)"
                  >
                    <UIcon name="i-lucide-trash-2" class="h-4 w-4" />
                  </UButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UDashboardSection>
  </div>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate'
import { useAuthApi, useUsersApi } from '../../composables/useApi'
import { useUiStore } from '../../stores/ui'
import type { CreateManagedUserRequest, FixedRoleCatalogEntry, UpdateManagedUserRequest, User, UserRole } from '~/types/api'
import { createUserSchema, toVeeTypedSchema, type UserFormValues } from '../../composables/useValidation'

definePageMeta({
  layout: 'dashboard'
})

const { t } = useI18n()

useSeoMeta({
  title: t('dashboard.users.seo.title'),
  description: t('dashboard.users.seo.description')
})

const authApi = useAuthApi()
const usersApi = useUsersApi()
const uiStore = useUiStore()

const users = ref<User[]>([])
const roles = ref<FixedRoleCatalogEntry[]>([])
const pending = ref(false)
const submitting = ref(false)
const error = ref<string | null>(null)
const accessDenied = ref(false)
const showForm = ref(false)
const editingUserId = ref<string | null>(null)

// Bulk selection state
const selectedIds = ref<Set<string>>(new Set())
const isAllSelected = computed(() => {
  return users.value.length > 0 && users.value.every(u => selectedIds.value.has(u.id))
})
const selectedCount = computed(() => selectedIds.value.size)

const toggleSelection = (id: string) => {
  if (selectedIds.value.has(id)) {
    selectedIds.value.delete(id)
  } else {
    selectedIds.value.add(id)
  }
}

const toggleAllSelection = () => {
  if (isAllSelected.value) {
    users.value.forEach(u => selectedIds.value.delete(u.id))
  } else {
    users.value.forEach(u => selectedIds.value.add(u.id))
  }
}

const clearSelection = () => {
  selectedIds.value.clear()
}

// Bulk actions
const bulkActions = computed(() => [
  { 
    label: 'Delete', 
    icon: 'i-lucide-trash-2', 
    color: 'error' as const,
    onClick: () => handleBulkAction('delete')
  },
  { 
    label: 'Export', 
    icon: 'i-lucide-download', 
    color: 'primary' as const,
    onClick: () => handleBulkAction('export')
  }
])

const handleBulkAction = async (action: string) => {
  const ids = Array.from(selectedIds.value)
  
  switch (action) {
    case 'delete':
      if (confirm(`Delete ${ids.length} users?`)) {
        for (const id of ids) {
          await usersApi.delete(id)
        }
        clearSelection()
        await loadPage()
      }
      break
    case 'export':
      const selectedUsers = users.value.filter(u => selectedIds.value.has(u.id))
      const data = selectedUsers.map(u => ({
        id: u.id,
        full_name: u.full_name,
        username: u.username,
        email: u.email,
        phone: u.phone,
        role: u.role,
        created_at: u.created_at
      }))
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `users-export-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
      clearSelection()
      break
  }
}

const isEditMode = computed(() => Boolean(editingUserId.value))
const locale = useI18n().locale
const schema = computed(() => toVeeTypedSchema(createUserSchema(t, locale.value, !isEditMode.value)))

const {
  values,
  errors,
  defineField,
  handleSubmit,
  resetForm,
  setValues
} = useForm<UserFormValues>({
  validationSchema: schema,
  initialValues: {
    full_name: '',
    username: '',
    email: '',
    phone: '',
    role: 'editor',
    password: ''
  }
})

const [fullName, fullNameField] = defineField('full_name')
const [username, usernameField] = defineField('username')
const [email, emailField] = defineField('email')
const [phone, phoneField] = defineField('phone')
const [role, roleField] = defineField('role')
const [password, passwordField] = defineField('password')

const roleOptions = computed(() => 
  roles.value.map(r => ({ label: r.role, value: r.role }))
)

const roleColor = (role: string) => {
  if (role === 'admin') return 'error' as const
  if (role === 'editor') return 'info' as const
  return 'neutral' as const
}

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const formatDate = (value?: string) => {
  if (!value) return '-'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString()
}

const getError = (field: string) => {
  return errors.value[field as keyof typeof errors.value]
}

const resetUserForm = () => {
  resetForm({
    values: {
      full_name: '',
      username: '',
      email: '',
      phone: '',
      role: 'editor',
      password: ''
    }
  })
  editingUserId.value = null
}

const closeForm = () => {
  resetUserForm()
  showForm.value = false
}

const loadUsers = async () => {
  const response = await usersApi.list({ page: 1, limit: 50 })
  users.value = response.data
}

const ensureAdmin = async () => {
  const currentUser = await authApi.getCurrentUser()
  if (currentUser.role !== 'admin') {
    accessDenied.value = true
    return false
  }
  accessDenied.value = false
  return true
}

const loadPage = async () => {
  pending.value = true
  error.value = null

  try {
    const allowed = await ensureAdmin()
    if (!allowed) return

    const [userResponse, roleResponse] = await Promise.all([
      usersApi.list({ page: 1, limit: 50 }),
      usersApi.listRoles()
    ])
    users.value = userResponse.data
    roles.value = roleResponse.roles
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('dashboard.users.create.loading')
  } finally {
    pending.value = false
  }
}

const openCreate = () => {
  resetUserForm()
  showForm.value = true
}

const openEdit = (user: User) => {
  editingUserId.value = user.id
  setValues({
    full_name: user.full_name,
    username: user.username,
    email: user.email,
    phone: user.phone || '',
    role: user.role as UserRole,
    password: ''
  })
  showForm.value = true
}

const onSubmit = handleSubmit(async () => {
  submitting.value = true
  error.value = null

  try {
    if (editingUserId.value) {
      const payload: UpdateManagedUserRequest = {
        full_name: values.full_name,
        username: values.username,
        phone: values.phone || undefined,
        role: values.role
      }
      await usersApi.update(editingUserId.value, payload)
      uiStore.addNotification({
        title: t('dashboard.users.notifications.userUpdated.title'),
        message: t('dashboard.users.notifications.userUpdated.message'),
        type: 'success'
      })
    } else {
      const payload: CreateManagedUserRequest = {
        email: values.email,
        password: values.password || '',
        full_name: values.full_name,
        username: values.username,
        phone: values.phone || undefined,
        role: values.role
      }
      await usersApi.create(payload)
      uiStore.addNotification({
        title: t('dashboard.users.notifications.userCreated.title'),
        message: t('dashboard.users.notifications.userCreated.message'),
        type: 'success'
      })
    }

    await loadUsers()
    closeForm()
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('dashboard.users.create.createButton')
    uiStore.addNotification({
      title: t('dashboard.users.notifications.error.title'),
      message: error.value,
      type: 'error'
    })
  } finally {
    submitting.value = false
  }
})

const removeUser = async (user: User) => {
  const confirmed = globalThis.confirm?.(t('dashboard.users.buttons.deleteConfirm', { name: user.full_name })) ?? true
  if (!confirmed) return

  pending.value = true
  error.value = null
  try {
    await usersApi.delete(user.id)
    uiStore.addNotification({
      title: t('dashboard.users.notifications.userDeleted.title'),
      message: t('dashboard.users.notifications.userDeleted.message', { name: user.full_name }),
      type: 'success'
    })
    await loadUsers()
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('dashboard.users.buttons.delete')
    uiStore.addNotification({
      title: t('dashboard.users.notifications.deleteFailed.title'),
      message: error.value,
      type: 'error'
    })
  } finally {
    pending.value = false
  }
}

onMounted(loadPage)
</script>
