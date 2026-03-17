<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="esperion-dashboard-shell"
      v-model:open="sidebarOpen"
      collapsible
      resizable
      class="bg-es-bg-secondary/95 backdrop-blur dark:bg-es-bg-secondary-dark/95"
      :ui="{
        header: 'border-b border-es-border px-4 py-4 dark:border-es-border-dark',
        body: 'px-3 py-3',
        footer: 'border-t border-es-border px-4 py-4 dark:border-es-border-dark'
      }"
    >
      <template #header="{ collapsed }">
        <div class="flex items-center gap-3">
          <NuxtLink
            :to="dashboardRoot"
            class="flex h-11 w-11 items-center justify-center rounded-2xl bg-es-accent-primary/10 text-es-accent-primary ring-1 ring-inset ring-es-accent-primary/20 dark:bg-es-accent-primary-dark/15 dark:text-es-accent-primary-dark dark:ring-es-accent-primary-dark/30"
            @click="closeSidebar"
          >
            <span class="text-lg font-semibold">E</span>
          </NuxtLink>

          <div v-if="!collapsed" class="min-w-0">
            <p class="truncate text-base font-semibold text-es-text-primary dark:text-es-text-primary-dark">
              {{ brandName }}
            </p>
            <p class="truncate text-xs uppercase tracking-[0.18em] text-es-text-secondary dark:text-es-text-secondary-dark">
              {{ brandTagline }}
            </p>
          </div>
        </div>
      </template>

      <template #default="{ collapsed }">
        <div data-testid="dashboard-sidebar" class="flex h-full flex-col gap-4">
          <UDashboardSearchButton
            :collapsed="collapsed"
            class="bg-es-bg-primary text-es-text-primary ring-1 ring-es-border dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark dark:ring-es-border-dark"
          />

          <div class="space-y-4">
            <section v-for="group in navigationGroups" :key="group.label" class="space-y-2">
              <p
                v-if="!collapsed"
                class="px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-es-text-secondary dark:text-es-text-secondary-dark"
              >
                {{ group.label }}
              </p>

              <div class="space-y-1">
                <NuxtLink
                  v-for="item in group.items"
                  :key="item.to"
                  :to="item.to"
                  :data-testid="item.testId"
                  class="group flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors"
                  :class="isActive(item.to)
                    ? 'bg-es-accent-primary/10 text-es-accent-primary ring-1 ring-inset ring-es-accent-primary/20 dark:bg-es-accent-primary-dark/15 dark:text-es-accent-primary-dark dark:ring-es-accent-primary-dark/30'
                    : 'text-es-text-secondary hover:bg-es-bg-primary hover:text-es-text-primary dark:text-es-text-secondary-dark dark:hover:bg-es-bg-primary-dark dark:hover:text-es-text-primary-dark'"
                  @click="closeSidebar"
                >
                  <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-es-bg-primary text-es-text-primary transition-colors dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark" :class="isActive(item.to) ? 'bg-transparent text-current' : ''">
                    <UIcon :name="item.icon" class="h-5 w-5" />
                  </span>

                  <div v-if="!collapsed" class="min-w-0 flex-1">
                    <div class="flex items-center gap-2">
                      <p class="truncate text-sm font-medium">
                        {{ item.label }}
                      </p>
                      <UBadge v-if="item.badge" color="primary" variant="soft" size="sm">
                        {{ item.badge }}
                      </UBadge>
                    </div>
                    <p class="truncate text-xs text-es-text-secondary dark:text-es-text-secondary-dark" :class="isActive(item.to) ? 'text-current/80' : ''">
                      {{ item.description }}
                    </p>
                  </div>
                </NuxtLink>
              </div>
            </section>
          </div>
        </div>
      </template>

      <template #footer="{ collapsed }">
        <div class="space-y-4">
          <div v-if="!collapsed" class="rounded-2xl border border-es-border bg-es-bg-primary p-3 dark:border-es-border-dark dark:bg-es-bg-primary-dark">
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-es-text-secondary dark:text-es-text-secondary-dark">
              Appearance
            </p>
            <div class="mt-3">
              <ThemeToggle />
            </div>
          </div>

          <UDropdownMenu :items="userMenuItems" :content="{ align: 'center', collisionPadding: 12 }">
            <UButton
              color="neutral"
              variant="ghost"
              block
              :square="collapsed"
              class="justify-start rounded-2xl border border-es-border bg-es-bg-primary px-3 py-3 text-left text-es-text-primary hover:bg-es-bg-tertiary dark:border-es-border-dark dark:bg-es-bg-primary-dark dark:text-es-text-primary-dark dark:hover:bg-es-bg-tertiary-dark"
            >
              <template #leading>
                <div class="flex h-9 w-9 items-center justify-center rounded-2xl bg-es-accent-primary/10 text-es-accent-primary dark:bg-es-accent-primary-dark/15 dark:text-es-accent-primary-dark">
                  <UIcon name="i-lucide-user-round" class="h-4 w-4" />
                </div>
              </template>

              <div v-if="!collapsed" class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium">
                  {{ displayUserName }}
                </p>
                <p class="truncate text-xs text-es-text-secondary dark:text-es-text-secondary-dark">
                  {{ displayUserRole }}
                </p>
              </div>
            </UButton>
          </UDropdownMenu>
        </div>
      </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="searchGroups" />

    <UDashboardPanel id="esperion-dashboard-panel" :ui="{ root: 'min-h-svh bg-transparent', body: 'p-0' }">
      <template #header>
        <UDashboardNavbar
          :title="currentPageTitle"
          :ui="{
            root: 'border-b border-es-border bg-es-bg-primary/80 backdrop-blur dark:border-es-border-dark dark:bg-es-bg-primary-dark/80',
            title: 'text-es-text-primary dark:text-es-text-primary-dark',
            right: 'gap-3'
          }"
        >
          <template #leading>
            <UDashboardSidebarCollapse data-testid="sidebar-collapse" />
          </template>

          <template #title>
            <div>
              <p class="text-sm font-semibold text-es-text-primary dark:text-es-text-primary-dark">
                {{ currentPageTitle }}
              </p>
              <p class="text-xs text-es-text-secondary dark:text-es-text-secondary-dark">
                {{ brandName }} {{ brandTagline.toLowerCase() }}
              </p>
            </div>
          </template>

          <template #right>
            <div class="hidden xl:flex items-center gap-2">
              <UButton
                v-for="item in quickActions"
                :key="item.to"
                color="neutral"
                variant="ghost"
                :to="item.to"
                class="rounded-full border border-es-border bg-es-bg-secondary px-4 py-2 text-es-text-primary hover:bg-es-bg-tertiary dark:border-es-border-dark dark:bg-es-bg-secondary-dark dark:text-es-text-primary-dark dark:hover:bg-es-bg-tertiary-dark"
              >
                {{ item.label }}
              </UButton>
            </div>

            <UButton
              color="neutral"
              variant="ghost"
              square
              class="rounded-full border border-es-border bg-es-bg-secondary text-es-text-primary hover:bg-es-bg-tertiary dark:border-es-border-dark dark:bg-es-bg-secondary-dark dark:text-es-text-primary-dark dark:hover:bg-es-bg-tertiary-dark"
              @click="notificationsOpen = true"
            >
              <UChip :show="unreadCount > 0" color="error" inset>
                <UIcon name="i-lucide-bell-ring" class="h-5 w-5" />
              </UChip>
            </UButton>

            <div class="hidden md:block">
              <ThemeToggle />
            </div>

            <UDropdownMenu :items="userMenuItems" :content="{ align: 'end', collisionPadding: 12 }">
              <UButton
                color="neutral"
                variant="ghost"
                class="rounded-full border border-es-border bg-es-bg-secondary px-2 py-2 text-es-text-primary hover:bg-es-bg-tertiary dark:border-es-border-dark dark:bg-es-bg-secondary-dark dark:text-es-text-primary-dark dark:hover:bg-es-bg-tertiary-dark"
              >
                <template #leading>
                  <div class="flex h-8 w-8 items-center justify-center rounded-full bg-es-accent-primary/10 text-es-accent-primary dark:bg-es-accent-primary-dark/15 dark:text-es-accent-primary-dark">
                    <UIcon name="i-lucide-user-round" class="h-4 w-4" />
                  </div>
                </template>

                <span class="hidden lg:inline">{{ displayUserName }}</span>
              </UButton>
            </UDropdownMenu>
          </template>
        </UDashboardNavbar>

        <UDashboardToolbar
          :ui="{
            root: 'border-b border-es-border/70 bg-es-bg-primary/70 px-4 py-3 dark:border-es-border-dark/70 dark:bg-es-bg-primary-dark/70'
          }"
        >
          <template #left>
            <div class="flex flex-wrap items-center gap-2 text-xs text-es-text-secondary dark:text-es-text-secondary-dark">
              <UBadge color="primary" variant="soft">CSR dashboard</UBadge>
              <span class="hidden sm:inline">Template-inspired admin shell with Esperion tokens</span>
            </div>
          </template>

          <template #right>
            <UButton
              color="neutral"
              variant="ghost"
              :to="localePath('/dashboard/api-docs')"
              class="rounded-full text-es-text-secondary hover:text-es-text-primary dark:text-es-text-secondary-dark dark:hover:text-es-text-primary-dark"
            >
              API docs
            </UButton>
            <UButton
              color="neutral"
              variant="ghost"
              :to="localePath('/dashboard/settings')"
              class="rounded-full text-es-text-secondary hover:text-es-text-primary dark:text-es-text-secondary-dark dark:hover:text-es-text-primary-dark"
            >
              Settings
            </UButton>
          </template>
        </UDashboardToolbar>
      </template>

      <template #body>
        <div class="mx-auto w-full max-w-[1600px] p-4 md:p-6 lg:p-8">
          <slot />
        </div>
      </template>
    </UDashboardPanel>

    <DashboardNotificationsSlideover v-model:open="notificationsOpen" />
  </UDashboardGroup>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { storeToRefs } from 'pinia'
import { useDashboardNavigation } from '../composables/useDashboardNavigation'
import { useAuthStore } from '../stores/auth'
import { useUiStore } from '../stores/ui'

const authStore = useAuthStore()
const uiStore = useUiStore()
const appConfig = useAppConfig()
const router = useRouter()
const localePath = useLocalePath()

const { navigationGroups, quickActions, searchGroups, currentPageTitle } = useDashboardNavigation()
const { unreadNotifications } = storeToRefs(uiStore)

const sidebarOpen = ref(false)
const notificationsOpen = ref(false)

const dashboardRoot = computed(() => localePath('/dashboard'))
const brandName = computed(() => appConfig.esperion?.name || 'Esperion')
const brandTagline = computed(() => appConfig.esperion?.tagline || 'Dashboard')
const displayUserName = computed(() => authStore.user?.full_name || authStore.user?.username || 'Dashboard User')
const displayUserRole = computed(() => authStore.user?.role || 'authenticated')
const unreadCount = computed(() => unreadNotifications.value.length)

const isActive = (to: string) => {
  return router.currentRoute.value.path === to || (to !== dashboardRoot.value && router.currentRoute.value.path.startsWith(`${to}/`))
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

const logout = async () => {
  await authStore.logout()
  closeSidebar()
  await router.push(localePath('/login'))
}

const userMenuItems = computed<DropdownMenuItem[][]>(() => ([
  [
    {
      type: 'label',
      label: displayUserName.value,
      icon: 'i-lucide-user-round'
    }
  ],
  [
    {
      label: 'Sessions',
      icon: 'i-lucide-shield-check',
      to: localePath('/dashboard/sessions')
    },
    {
      label: 'Settings',
      icon: 'i-lucide-settings-2',
      to: localePath('/dashboard/settings')
    }
  ],
  [
    {
      label: 'Log out',
      icon: 'i-lucide-log-out',
      color: 'error',
      onSelect: async () => {
        await logout()
      }
    }
  ]
]))

onMounted(async () => {
  authStore.initFromCookie()

  if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchCurrentUser()
    } catch {
      // Leave route middleware / page logic to handle unauthorized state.
    }
  }
})
</script>
