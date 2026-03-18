<script setup lang="ts">
/**
 * UEditLock - Edit lock warning component
 * 
 * Shows warning when another user is editing the same content
 * 
 * @usage
 * ```vue
 * <UEditLock
 *   :lock="currentLock"
 *   :current-user-id="userId"
 *   @request-access="requestAccess"
 * />
 * ```
 */

interface EditLock {
  userId: string
  userName: string
  userAvatar?: string
  timestamp: string
  contentType: string
  contentId: string
}

interface Props {
  lock?: EditLock | null
  currentUserId: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'request-access': []
}>()

const isOwnLock = computed(() => props.lock?.userId === props.currentUserId)

const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform -translate-y-2 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform -translate-y-2 opacity-0"
  >
    <div
      v-if="lock && !isOwnLock"
      class="mb-4 rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-3 dark:border-yellow-900/50 dark:bg-yellow-900/20"
    >
      <div class="flex items-center gap-3">
        <!-- User Avatar -->
        <UAvatar
          v-if="lock.userAvatar"
          :src="lock.userAvatar"
          :alt="lock.userName"
          size="sm"
        />
        <div
          v-else
          class="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-xs font-medium text-white"
        >
          {{ lock.userName.charAt(0).toUpperCase() }}
        </div>

        <!-- Warning Message -->
        <div class="flex-1">
          <p class="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            {{ lock.userName }} is editing this content
          </p>
          <p class="text-xs text-yellow-600 dark:text-yellow-400">
            Locked since {{ formatTime(lock.timestamp) }}
          </p>
        </div>

        <!-- Action Button -->
        <UButton
          size="sm"
          color="warning"
          variant="soft"
          class="rounded-full"
          @click="$emit('request-access')"
        >
          Request Access
        </UButton>
      </div>
    </div>
  </Transition>
</template>
