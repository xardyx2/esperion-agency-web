<script setup lang="ts">
/**
 * UPresenceIndicator - Real-time presence indicator component
 * 
 * Shows users currently online or viewing the same page
 * 
 * @usage
 * ```vue
 * <UPresenceIndicator
 *   :users="onlineUsers"
 *   :show-avatars="true"
 *   :max-display="3"
 * />
 * ```
 */

interface PresenceUser {
  id: string
  name: string
  avatar?: string
  status: 'online' | 'away' | 'busy'
  currentPage?: string
}

interface Props {
  users: PresenceUser[]
  showAvatars?: boolean
  showTooltip?: boolean
  maxDisplay?: number
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  showAvatars: true,
  showTooltip: true,
  maxDisplay: 3,
  size: 'md'
})

const visibleUsers = computed(() => props.users.slice(0, props.maxDisplay))
const remainingCount = computed(() => Math.max(0, props.users.length - props.maxDisplay))

const sizeClasses = {
  sm: 'h-6 w-6 text-[10px]',
  md: 'h-8 w-8 text-xs',
  lg: 'h-10 w-10 text-sm'
}

const statusColors = {
  online: 'bg-green-500',
  away: 'bg-yellow-500',
  busy: 'bg-red-500'
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
</script>

<template>
  <div class="flex items-center">
    <div class="flex -space-x-2">
      <div
        v-for="user in visibleUsers"
        :key="user.id"
        class="relative inline-block rounded-full border-2 border-es-bg-secondary dark:border-es-bg-secondary-dark"
        :class="sizeClasses[size]"
      >
        <!-- Avatar -->
        <UAvatar
          v-if="showAvatars && user.avatar"
          :src="user.avatar"
          :alt="user.name"
          :size="size"
          class="h-full w-full"
        />
        <div
          v-else
          class="flex h-full w-full items-center justify-center rounded-full bg-es-accent-primary text-white"
          :class="sizeClasses[size]"
        >
          {{ getInitials(user.name) }}
        </div>

        <!-- Status Indicator -->
        <span
          class="absolute bottom-0 right-0 block rounded-full ring-2 ring-es-bg-secondary dark:ring-es-bg-secondary-dark"
          :class="[
            statusColors[user.status],
            size === 'sm' ? 'h-2 w-2' : size === 'md' ? 'h-2.5 w-2.5' : 'h-3 w-3'
          ]"
        />
      </div>

      <!-- Overflow Count -->
      <div
        v-if="remainingCount > 0"
        class="flex items-center justify-center rounded-full border-2 border-es-bg-secondary bg-es-bg-tertiary text-es-text-secondary dark:border-es-bg-secondary-dark dark:bg-es-bg-tertiary-dark dark:text-es-text-secondary-dark"
        :class="sizeClasses[size]"
      >
        +{{ remainingCount }}
      </div>
    </div>

    <!-- Tooltip -->
    <UTooltip
      v-if="showTooltip && users.length > 0"
      :text="users.map(u => `${u.name} (${u.status})`).join(', ')"
      class="ml-2"
    >
      <span class="text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
        {{ users.length }} online
      </span>
    </UTooltip>
  </div>
</template>
