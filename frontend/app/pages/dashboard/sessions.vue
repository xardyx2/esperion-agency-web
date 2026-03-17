<template>
  <div class="space-y-8">
    <DashboardPageHeader
      eyebrow="Security"
      :title="t('dashboard.sessions.title')"
      :description="t('dashboard.sessions.description')"
    >
      <template #actions>
        <UButton
          color="neutral"
          variant="outline"
          class="rounded-full border-es-border text-es-text-primary dark:border-es-border-dark dark:text-es-text-primary-dark"
          :disabled="pending"
          @click="loadSessions"
        >
          {{ pending ? t('dashboard.sessions.refresh.inProgress') : t('dashboard.sessions.refresh.button') }}
        </UButton>
      </template>
    </DashboardPageHeader>

    <div
      v-if="error"
      class="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <UCard
        v-for="session in sessions"
        :key="session.id"
        :ui="{
          root: 'rounded-3xl border border-es-border bg-es-bg-secondary shadow-sm dark:border-es-border-dark dark:bg-es-bg-secondary-dark',
          body: 'p-5'
        }"
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
          <UBadge
            :color="session.is_current ? 'success' : 'neutral'"
            variant="soft"
            class="rounded-full font-semibold"
          >
            {{ session.is_current ? t('dashboard.sessions.status.current') : t('dashboard.sessions.status.active') }}
          </UBadge>
        </div>

        <dl class="space-y-3 text-sm">
          <div>
            <dt class="text-xs uppercase tracking-wide text-es-text-secondary dark:text-es-text-secondary-dark">
              {{ t('dashboard.sessions.columns.ipAddress') }}
            </dt>
            <dd class="text-es-text-primary dark:text-es-text-primary-dark">
              {{ session.ip_address || 'Unknown' }}
            </dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wide text-es-text-secondary dark:text-es-text-secondary-dark">
              {{ t('dashboard.sessions.columns.created') }}
            </dt>
            <dd class="text-es-text-primary dark:text-es-text-primary-dark">
              {{ formatDate(session.created_at) }}
            </dd>
          </div>
          <div>
            <dt class="text-xs uppercase tracking-wide text-es-text-secondary dark:text-es-text-secondary-dark">
              {{ t('dashboard.sessions.columns.expires') }}
            </dt>
            <dd class="text-es-text-primary dark:text-es-text-primary-dark">
              {{ formatDate(session.expires_at) }}
            </dd>
          </div>
        </dl>

        <UButton
          color="red"
          variant="solid"
          block
          class="mt-5 rounded-xl"
          :disabled="pending || session.is_current"
          @click="revokeSession(session.id)"
        >
          {{ session.is_current ? t('dashboard.sessions.columns.currentSession') : t('dashboard.sessions.columns.forceLogout') }}
        </UButton>
      </UCard>
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
  layout: 'dashboard'
})

useSeoMeta({
  title: t('dashboard.sessions.seo.title'),
  description: t('dashboard.sessions.seo.description')
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
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('dashboard.sessions.loading')
  } finally {
    pending.value = false
  }
}

const revokeSession = async (sessionId: string) => {
  pending.value = true
  error.value = null

  try {
    await authApi.forceLogoutSession(sessionId)
    sessions.value = sessions.value.filter(session => session.id !== sessionId)
  } catch (err) {
    error.value = err instanceof Error ? err.message : t('dashboard.sessions.error.title')
  } finally {
    pending.value = false
  }
}

await loadSessions()
</script>
