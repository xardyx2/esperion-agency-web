<template>
  <div class="min-h-screen bg-es-bg-primary dark:bg-es-bg-primary-dark">
    <!-- Dashboard Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-50 w-64 bg-es-bg-secondary dark:bg-es-bg-secondary-dark border-r border-es-border dark:border-es-border-dark transform transition-transform duration-300 ease-in-out"
      :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    >
      <!-- Logo -->
      <div class="flex items-center justify-between h-16 px-4 border-b border-es-border dark:border-es-border-dark">
        <NuxtLink
          to="/dashboard"
          class="text-xl font-bold text-es-text-primary dark:text-es-text-primary-dark"
        >
          Esperion
        </NuxtLink>
        <button
          class="lg:hidden p-2 rounded-lg hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark"
          @click="sidebarOpen = false"
        >
          <span class="text-xl">✕</span>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="p-4 space-y-1">
        <NuxtLink
          v-for="item in navigation"
          :key="item.href"
          :to="item.href"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-es-text-secondary dark:text-es-text-secondary-dark hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark hover:text-es-text-primary dark:hover:text-es-text-primary-dark transition-colors"
          :class="{ 'bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 text-es-accent-primary dark:text-es-accent-primary-dark': isActive(item.href) }"
        >
          <span class="text-xl">{{ item.icon }}</span>
          <span class="font-medium">{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <!-- Dashboard Switcher -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-es-border dark:border-es-border-dark">
        <select
          v-model="currentDashboard"
          class="w-full px-4 py-2 bg-es-bg-tertiary dark:bg-es-bg-tertiary-dark border border-es-border dark:border-es-border-dark rounded-lg text-es-text-secondary dark:text-es-text-secondary-dark focus:outline-none focus:ring-2 focus:ring-es-accent-primary"
        >
          <option value="agency">
            Agency Dashboard
          </option>
          <option value="capital">
            Capital Dashboard
          </option>
        </select>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="lg:pl-64">
      <!-- Top Bar -->
      <header class="sticky top-0 z-40 bg-es-bg-primary dark:bg-es-bg-primary-dark border-b border-es-border dark:border-es-border-dark">
        <div class="flex items-center justify-between h-16 px-4">
          <!-- Mobile Menu Button -->
          <button
            class="lg:hidden p-2 rounded-lg hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark"
            @click="sidebarOpen = true"
          >
            <span class="text-2xl">☰</span>
          </button>

          <!-- Breadcrumb -->
          <div class="hidden sm:flex items-center gap-2 text-sm text-es-text-secondary dark:text-es-text-secondary-dark">
            <NuxtLink
              to="/dashboard"
              class="hover:text-es-accent-primary dark:hover:text-es-accent-primary-dark"
            >Dashboard</NuxtLink>
            <span>/</span>
            <span class="text-es-text-primary dark:text-es-text-primary-dark">{{ currentPage }}</span>
          </div>

          <!-- Right Side -->
          <div class="flex items-center gap-4">
            <!-- Theme Toggle -->
            <button
              class="p-2 rounded-lg hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark transition-colors"
              :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
              @click="toggleTheme"
            >
              <span
                v-if="isDark"
                class="text-xl"
              >☀️</span>
              <span
                v-else
                class="text-xl"
              >🌙</span>
            </button>

            <!-- Notifications -->
            <button class="relative p-2 rounded-lg hover:bg-es-bg-tertiary dark:hover:bg-es-bg-tertiary-dark transition-colors">
              <span class="text-xl">🔔</span>
              <span class="absolute top-1 right-1 w-2 h-2 bg-es-accent-primary rounded-full" />
            </button>

            <!-- User Menu -->
            <div class="flex items-center gap-3">
              <div class="hidden sm:block text-right">
                <div class="text-sm font-medium text-es-text-primary dark:text-es-text-primary-dark">
                  {{ user.name }}
                </div>
                <div class="text-xs text-es-text-secondary dark:text-es-text-secondary-dark">
                  {{ user.role }}
                </div>
              </div>
              <div class="w-10 h-10 rounded-full bg-es-accent-primary/10 dark:bg-es-accent-primary-dark/10 flex items-center justify-center text-xl">
                👤
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-4 md:p-6 lg:p-8">
        <slot />
      </main>
    </div>

    <!-- Overlay for mobile -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
      @click="sidebarOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
const sidebarOpen = ref(false)
const isDark = useColorMode()
const currentDashboard = ref('agency')

const toggleTheme = () => {
  isDark.value = isDark.value === 'dark' ? 'light' : 'dark'
}

const isActive = (href: string) => {
  const route = useRoute()
  return route.path === href || (href !== '/dashboard' && route.path.startsWith(href))
}

const navigation = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/dashboard/articles', label: 'Articles', icon: '📝' },
  { href: '/dashboard/media', label: 'Media Library', icon: '🖼️' },
  { href: '/dashboard/works', label: 'Works', icon: '💼' },
  { href: '/dashboard/services', label: 'Services', icon: '🛠️' },
  { href: '/dashboard/clients', label: 'Clients', icon: '👥' },
  { href: '/dashboard/contact', label: 'Contact', icon: '✉️' },
  { href: '/dashboard/settings', label: 'Settings', icon: '⚙️' }
]

const user = {
  name: 'Admin User',
  role: 'Administrator'
}

const route = useRoute()
const currentPage = computed(() => {
  const path = route.path.replace('/dashboard/', '')
  return path ? path.charAt(0).toUpperCase() + path.slice(1) : 'Overview'
})
</script>
