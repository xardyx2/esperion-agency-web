<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-es-text-primary dark:text-es-text-primary-dark">{{ t('dashboard.sessions.title') }}</h1>
        <p class="text-es-text-secondary dark:text-es-text-secondary-dark">
          {{ t('dashboard.sessions.description') }}
        </p>
      </div>
      <button
        type="button"
        class="inline-flex items-center justify-center rounded-lg border border-es-border px-4 py-2 text-sm font-semibold text-es-text-primary transition-colors hover:bg-es-bg-tertiary dark:border-es-border-dark dark:text-es-text-primary-dark dark:hover:bg-es-bg-tertiary-dark"
        :disabled="pending"
        @click="loadSessions"
      >
        {{ pending ? t('dashboard.sessions.refresh.inProgress') : t('dashboard.sessions.refresh.button') }}
      </button>
    </div>

    <div v-if="error" class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {{ error }}
    </div>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <article
        v-for="session in sessions"
        :key="session.id"
        class="rounded-xl border border-es-border bg-es-bg-secondary p-5 shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark"
      >
        <div class="mb-4 flex items-start justify-between gap-4">
          <div>
            <p class="text-sm font-semibold text-es-text-primary dark:text-es-text-primary-dark">
              {{ formatDevice(session.user_agent) }}
            </p>
            <p class="text-xs text-es-text-secondary dark:text-es-text-secondary-dark">
              {{ session.device_id || 'No device id recorded' }}
            </p>
          </div>
          <span
            class="rounded-full px-3 py-1 text-xs font-semibold"
            :class="session.is_current
              ? 'bg-green-100 text-green-700'
              : 'bg-es-bg-tertiary text-es-text-secondary dark:bg-es-bg-tertiary-dark dark:text-es-text-secondary-dark'"
          >
            {{ session.is_current ? t('dashboard.sessions.status.current') : t('dashboard.sessions.status.active') }}
          </span>
        </div>

        <dl class="space-y-3 text-sm">
          <div>
            <dt class="text-xs uppercase tracking-wide text-es-text-secondary dark:text-es-text-secondary-dark">{{ t('dashboard.sessions.columns.ipAddress') }}</dt>
            <dd class="text-es-text-primary dark:text-es-text-primary-dark">{{ session.ip_address || 'Unknown' }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wide text-es-text-secondary dark:text-es-text-secondary-dark">{{ t('dashboard.sessions.columns.created') }}</dt>
            <dd class="text-es-text-primary dark:text-es-text-primary-dark">{{ formatDate(session.created_at) }}</dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wide text-es-text-secondary dark:text-es-text-secondary-dark">{{ t('dashboard.sessions.columns.expires') }}</dt>
            <dd class="text-es-text-primary dark:text-es-text-primary-dark">{{ formatDate(session.expires_at) }}</dd>
          </div>
        </dl>

        <button
          type="button"
          class="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="pending || session.is_current"
          @click="revokeSession(session.id)"
        >
          {{ session.is_current ? t('dashboard.sessions.columns.currentSession') : t('dashboard.sessions.columns.forceLogout') }}
        </button>
      </article>
    </div>

    <div
      v-if="!pending && !sessions.length"
      class="rounded-xl border border-dashed border-es-border px-6 py-10 text-center text-sm text-es-text-secondary dark:border-es-border-dark dark:text-es-text-secondary-dark"
    >
      {{ t('dashboard.sessions.noResults') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthApi } from '../../composables/useApi'
import type { Session } from '~/types/api'

const { t } = useI18n()

definePageMeta({
  layout: 'dashboard',
})

useSeoMeta({
  title: t('dashboard.sessions.seo.title'),
  description: t('dashboard.sessions.seo.description'),
})

const authApi = useAuthApi()
const sessions = ref<Session[]>([])
const pending = ref(false)
const error = ref<string | null>(null)

const formatDate = (value: string) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString()
}

const formatDevice = (userAgent?: string | null) => {
  if (!userAgent) {
    return 'Unknown device'
  }

  if (userAgent.includes('Mobile')) {
    return 'Mobile browser'
  }

  if (userAgent.includes('Windows')) {
    return 'Windows device'
  }

  if (userAgent.includes('Macintosh')) {
    return 'Mac device'
  }

  return userAgent
}

const loadSessions = async () => {
  pending.value = true
  error.value = null

  try {
    const response = await authApi.getSessions()
    sessions.value = response.sessions
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : t('dashboard.sessions.loading')
  }
  finally {
    pending.value = false
  }
}

const revokeSession = async (sessionId: string) => {
  pending.value = true
  error.value = null

  try {
    await authApi.forceLogoutSession(sessionId)
    sessions.value = sessions.value.filter(session => session.id !== sessionId)
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : t('dashboard.sessions.error.title')
  }
  finally {
    pending.value = false
  }
}

await loadSessions()
</script>
