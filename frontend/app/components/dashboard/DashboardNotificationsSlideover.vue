<template>
  <USlideover v-model:open="open">
    <template #content>
      <div class="flex h-full flex-col bg-es-bg-secondary dark:bg-es-bg-secondary-dark">
        <div class="flex items-center justify-between border-b border-es-border px-5 py-4 dark:border-es-border-dark">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.2em] text-es-text-secondary dark:text-es-text-secondary-dark">
              Alerts
            </p>
            <h2 class="mt-1 text-xl font-semibold text-es-text-primary dark:text-es-text-primary-dark">
              Notifications
            </h2>
          </div>

          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-check-check"
            :disabled="!notifications.length"
            @click="uiStore.markAllAsRead()"
          >
            Mark all read
          </UButton>
        </div>

        <div class="flex-1 space-y-3 overflow-y-auto p-5">
          <div
            v-if="!notifications.length"
            class="rounded-2xl border border-dashed border-es-border bg-es-bg-primary px-5 py-10 text-center text-sm text-es-text-secondary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-secondary-dark"
          >
            No notifications yet.
          </div>

          <article
            v-for="notification in notifications"
            :key="notification.id"
            class="rounded-2xl border border-es-border bg-es-bg-primary p-4 shadow-sm transition-colors dark:border-es-border-dark dark:bg-es-bg-primary-dark"
            :class="notification.read ? 'opacity-80' : 'ring-1 ring-es-accent-primary/20 dark:ring-es-accent-primary-dark/30'"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="space-y-2">
                <div class="flex items-center gap-2">
                  <span class="h-2.5 w-2.5 rounded-full" :class="badgeClass(notification.type)" />
                  <p class="font-medium text-es-text-primary dark:text-es-text-primary-dark">
                    {{ notification.title }}
                  </p>
                </div>

                <p class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
                  {{ notification.message }}
                </p>
              </div>

              <UButton
                color="neutral"
                variant="ghost"
                icon="i-lucide-x"
                square
                @click="uiStore.removeNotification(notification.id)"
              />
            </div>

            <div class="mt-3 flex items-center justify-between gap-3 text-xs text-es-text-secondary dark:text-es-text-secondary-dark">
              <span>{{ formatDate(notification.createdAt) }}</span>

              <UButton
                v-if="!notification.read"
                color="primary"
                variant="ghost"
                size="xs"
                @click="uiStore.markAsRead(notification.id)"
              >
                Mark read
              </UButton>
            </div>
          </article>
        </div>
      </div>
    </template>
  </USlideover>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

const open = defineModel<boolean>('open', { default: false })

const uiStore = useUiStore()
const { allNotifications } = storeToRefs(uiStore)

const notifications = computed(() => [...allNotifications.value].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()))

const badgeClass = (type: 'success' | 'error' | 'warning' | 'info') => {
  if (type === 'success') return 'bg-emerald-500'
  if (type === 'warning') return 'bg-amber-500'
  if (type === 'error') return 'bg-rose-500'
  return 'bg-es-accent-primary dark:bg-es-accent-primary-dark'
}

const formatDate = (value: Date) => value.toLocaleString()
</script>
