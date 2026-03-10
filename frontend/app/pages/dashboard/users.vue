<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-es-text-primary dark:text-es-text-primary-dark">{{ t('dashboard.users.title') }}</h1>
        <p class="text-es-text-secondary dark:text-es-text-secondary-dark">{{ t('dashboard.users.description') }}</p>
      </div>
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-lg bg-es-accent-primary px-5 py-3 font-semibold text-es-text-inverse transition-colors hover:bg-es-accent-primary-hover dark:bg-es-accent-primary-dark dark:text-es-text-inverse-dark dark:hover:bg-es-accent-primary-hover-dark"
        :disabled="pending || accessDenied"
        @click="openCreate"
      >
        {{ t('dashboard.users.newButton') }}
      </button>
    </div>

    <div v-if="pending" class="rounded-xl border border-es-border bg-es-bg-secondary px-4 py-6 text-sm text-es-text-secondary dark:border-es-border-dark dark:bg-es-bg-secondary-dark dark:text-es-text-secondary-dark">
      {{ t('dashboard.users.create.loading') }}
    </div>

    <div v-else-if="accessDenied" class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-800">
      {{ t('dashboard.users.create.denied') }}
    </div>

    <div v-else-if="error" class="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-700">
      {{ error }}
    </div>

    <section
      v-if="showForm && !accessDenied"
      class="rounded-xl border border-es-border bg-es-bg-secondary p-5 shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark"
    >
      <div class="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 class="text-lg font-semibold text-es-text-primary dark:text-es-text-primary-dark">
            {{ editingUserId ? t('dashboard.users.create.update') : t('dashboard.users.create.title') }}
          </h2>
          <p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
            {{ editingUserId ? 'Update identity fields and fixed role assignment.' : t('dashboard.users.create.title') }}
          </p>
        </div>
        <button
          type="button"
          class="rounded-lg border border-es-border px-3 py-2 text-sm text-es-text-primary hover:bg-es-bg-tertiary dark:border-es-border-dark dark:text-es-text-primary-dark dark:hover:bg-es-bg-tertiary-dark"
          :disabled="submitting"
          @click="closeForm"
        >
          {{ t('dashboard.users.create.cancel') }}
        </button>
      </div>

      <form class="grid gap-4 md:grid-cols-2" @submit.prevent="submitForm">
        <label class="space-y-2 text-sm">
          <span class="block font-medium text-es-text-primary dark:text-es-text-primary-dark">{{ t('dashboard.users.create.fullNameTitle') }}</span>
          <input v-model="form.full_name" type="text" required class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark" />
        </label>

        <label class="space-y-2 text-sm">
          <span class="block font-medium text-es-text-primary dark:text-es-text-primary-dark">{{ t('dashboard.users.create.usernameTitle') }}</span>
          <input v-model="form.username" type="text" required class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark" />
        </label>

        <label class="space-y-2 text-sm">
          <span class="block font-medium text-es-text-primary dark:text-es-text-primary-dark">{{ t('dashboard.users.create.emailTitle') }}</span>
          <input v-model="form.email" type="email" required :disabled="Boolean(editingUserId)" class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary disabled:opacity-60 dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark" />
        </label>

        <label class="space-y-2 text-sm">
          <span class="block font-medium text-es-text-primary dark:text-es-text-primary-dark">{{ t('dashboard.users.create.phoneTitle') }}</span>
          <input v-model="form.phone" type="tel" class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark" />
        </label>

        <label class="space-y-2 text-sm">
          <span class="block font-medium text-es-text-primary dark:text-es-text-primary-dark">{{ t('dashboard.users.create.roleTitle') }}</span>
          <select v-model="form.role" class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark">
            <option v-for="role in roles" :key="role.role" :value="role.role">
              {{ role.role }}
            </option>
          </select>
        </label>

        <label v-if="!editingUserId" class="space-y-2 text-sm">
          <span class="block font-medium text-es-text-primary dark:text-es-text-primary-dark">{{ t('dashboard.users.create.passwordTitle') }}</span>
          <input v-model="form.password" type="password" minlength="8" required class="w-full rounded-lg border border-es-border bg-es-bg-primary px-4 py-3 text-es-text-primary focus:outline-none focus:ring-2 focus:ring-es-accent-primary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark" />
        </label>

        <div class="md:col-span-2 flex justify-end">
          <button
            type="submit"
            class="inline-flex items-center justify-center rounded-lg bg-es-accent-primary px-5 py-3 font-semibold text-es-text-inverse transition-colors hover:bg-es-accent-primary-hover disabled:opacity-60 dark:bg-es-accent-primary-dark dark:text-es-text-inverse-dark dark:hover:bg-es-accent-primary-hover-dark"
            :disabled="submitting"
          >
            {{ submitting ? t('dashboard.users.create.saveInProgress') : editingUserId ? t('dashboard.users.create.saveButton') : t('dashboard.users.create.createButton') }}
          </button>
        </div>
      </form>
    </section>

    <section
      v-if="!pending && !accessDenied"
      class="overflow-hidden rounded-xl border border-es-border bg-es-bg-secondary shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark"
    >
      <table class="w-full">
        <thead class="bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase text-es-text-secondary dark:text-es-text-secondary-dark">{{ t('dashboard.users.table.user') }}</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase text-es-text-secondary dark:text-es-text-secondary-dark">{{ t('dashboard.users.table.role') }}</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase text-es-text-secondary dark:text-es-text-secondary-dark">{{ t('dashboard.users.table.phone') }}</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase text-es-text-secondary dark:text-es-text-secondary-dark">{{ t('dashboard.users.table.joined') }}</th>
            <th class="px-6 py-3 text-right text-xs font-medium uppercase text-es-text-secondary dark:text-es-text-secondary-dark">{{ t('dashboard.users.table.actions') }}</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-es-border dark:divide-es-border-dark">
          <tr v-for="user in users" :key="user.id" class="hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark">
            <td class="px-6 py-4">
              <div class="font-medium text-es-text-primary dark:text-es-text-primary-dark">{{ user.full_name }}</div>
              <div class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">{{ user.email }}</div>
            </td>
            <td class="px-6 py-4">
              <span class="rounded-full px-3 py-1 text-xs font-semibold capitalize" :class="roleClass(user.role)">
                {{ user.role }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
              {{ user.phone || '-' }}
            </td>
            <td class="px-6 py-4 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
              {{ formatDate(user.created_at) }}
            </td>
            <td class="px-6 py-4">
              <div class="flex justify-end gap-2">
                <button type="button" class="rounded-lg px-3 py-2 text-sm font-medium text-es-text-primary hover:bg-es-bg-primary dark:text-es-text-primary-dark dark:hover:bg-es-bg-primary-dark" @click="openEdit(user)">
                  {{ t('dashboard.users.buttons.edit') }}
                </button>
                <button type="button" class="rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50" @click="removeUser(user)">
                  {{ t('dashboard.users.buttons.delete') }}
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="!users.length" class="px-6 py-10 text-center text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
        {{ t('dashboard.users.table.noResults') }}
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useAuthApi, useUsersApi } from '../../composables/useApi'
import { useUiStore } from '../../stores/ui'
import type {
  CreateManagedUserRequest,
  FixedRoleCatalogEntry,
  UpdateManagedUserRequest,
  User,
  UserRole,
} from '~/types/api'

const { t } = useI18n()

definePageMeta({
  layout: 'dashboard',
})

useSeoMeta({
  title: t('dashboard.users.seo.title'),
  description: t('dashboard.users.seo.description'),
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

const form = reactive<CreateManagedUserRequest>({
  email: '',
  password: '',
  full_name: '',
  username: '',
  phone: '',
  role: 'editor',
})

const roleClass = (role: string) => {
  if (role === 'admin') return 'bg-red-100 text-red-700'
  if (role === 'editor') return 'bg-blue-100 text-blue-700'
  return 'bg-gray-100 text-gray-700'
}

const formatDate = (value?: string) => {
  if (!value) return '-'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString()
}

const resetForm = () => {
  form.email = ''
  form.password = ''
  form.full_name = ''
  form.username = ''
  form.phone = ''
  form.role = 'editor'
  editingUserId.value = null
}

const closeForm = () => {
  resetForm()
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
      usersApi.listRoles(),
    ])
    users.value = userResponse.data
    roles.value = roleResponse.roles
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : t('dashboard.users.create.loading')
  }
  finally {
    pending.value = false
  }
}

const openCreate = () => {
  resetForm()
  showForm.value = true
}

const openEdit = (user: User) => {
  editingUserId.value = user.id
  form.email = user.email
  form.password = ''
  form.full_name = user.full_name
  form.username = user.username
  form.phone = user.phone || ''
  form.role = user.role as UserRole
  showForm.value = true
}

const submitForm = async () => {
  submitting.value = true
  error.value = null

  try {
    if (editingUserId.value) {
      const payload: UpdateManagedUserRequest = {
        full_name: form.full_name,
        username: form.username,
        phone: form.phone || undefined,
        role: form.role,
      }
      await usersApi.update(editingUserId.value, payload)
      uiStore.addNotification({
        title: t('dashboard.users.notifications.userUpdated.title'),
        message: t('dashboard.users.notifications.userUpdated.message'),
        type: 'success',
      })
    } else {
      await usersApi.create({
        email: form.email,
        password: form.password,
        full_name: form.full_name,
        username: form.username,
        phone: form.phone || undefined,
        role: form.role,
      })
      uiStore.addNotification({
        title: t('dashboard.users.notifications.userCreated.title'),
        message: t('dashboard.users.notifications.userCreated.message'),
        type: 'success',
      })
    }

    await loadUsers()
    closeForm()
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : t('dashboard.users.create.createButton')
    uiStore.addNotification({
      title: t('dashboard.users.notifications.error.title'),
      message: error.value,
      type: 'error',
    })
  }
  finally {
    submitting.value = false
  }
}

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
      type: 'success',
    })
    await loadUsers()
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : t('dashboard.users.buttons.delete')
    uiStore.addNotification({
      title: t('dashboard.users.notifications.deleteFailed.title'),
      message: error.value,
      type: 'error',
    })
  }
  finally {
    pending.value = false
  }
}

onMounted(loadPage)
</script>
