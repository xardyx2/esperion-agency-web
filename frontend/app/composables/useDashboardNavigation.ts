import type { NavigationMenuItem } from '@nuxt/ui'

export interface DashboardNavItem {
  label: string
  description: string
  icon: string
  to: string
  testId: string
  badge?: string
}

export interface DashboardNavGroup {
  label: string
  items: DashboardNavItem[]
}

export const useDashboardNavigation = () => {
  const localePath = useLocalePath()
  const route = useRoute()

  const navigationGroups = computed<DashboardNavGroup[]>(() => [
    {
      label: 'Workspace',
      items: [
        {
          label: 'Overview',
          description: 'Dashboard home and priorities',
          icon: 'i-lucide-layout-dashboard',
          to: localePath('/dashboard'),
          testId: 'nav-dashboard'
        },
        {
          label: 'Analytics',
          description: 'Traffic, funnels, and conversion health',
          icon: 'i-lucide-chart-column',
          to: localePath('/dashboard/analytics'),
          testId: 'nav-analytics'
        },
        {
          label: 'Sessions',
          description: 'Active sessions and device access',
          icon: 'i-lucide-shield-check',
          to: localePath('/dashboard/sessions'),
          testId: 'nav-sessions'
        }
      ]
    },
    {
      label: 'Content',
      items: [
        {
          label: 'Articles',
          description: 'Editorial workflow and translations',
          icon: 'i-lucide-file-text',
          to: localePath('/dashboard/articles'),
          testId: 'nav-articles'
        },
        {
          label: 'Works',
          description: 'Portfolio and case studies',
          icon: 'i-lucide-briefcase-business',
          to: localePath('/dashboard/works'),
          testId: 'nav-works'
        },
        {
          label: 'Services',
          description: 'Service catalog and featured offers',
          icon: 'i-lucide-panels-top-left',
          to: localePath('/dashboard/services'),
          testId: 'nav-services'
        },
        {
          label: 'Clients',
          description: 'Showcase logos and testimonials',
          icon: 'i-lucide-users-round',
          to: localePath('/dashboard/clients'),
          testId: 'nav-clients'
        },
        {
          label: 'Media',
          description: 'Library and upload references',
          icon: 'i-lucide-images',
          to: localePath('/dashboard/media'),
          testId: 'nav-media'
        },
        {
          label: 'Contact',
          description: 'Leads and submission triage',
          icon: 'i-lucide-mail',
          to: localePath('/dashboard/contact'),
          testId: 'nav-contact'
        }
      ]
    },
    {
      label: 'System',
      items: [
        {
          label: 'Users',
          description: 'Roles, access, and administrators',
          icon: 'i-lucide-user-cog',
          to: localePath('/dashboard/users'),
          testId: 'nav-users'
        },
        {
          label: 'API Docs',
          description: 'Backend API reference surface',
          icon: 'i-lucide-book-open-text',
          to: localePath('/dashboard/api-docs'),
          testId: 'nav-api-docs'
        },
        {
          label: 'Settings',
          description: 'Monitoring, backup, and analytics setup',
          icon: 'i-lucide-settings-2',
          to: localePath('/dashboard/settings'),
          testId: 'nav-settings'
        }
      ]
    }
  ])

  const quickActions = computed(() => [
    navigationGroups.value[0]?.items[0],
    navigationGroups.value[1]?.items[0],
    navigationGroups.value[2]?.items[2]
  ].filter((item): item is DashboardNavItem => Boolean(item)))

  const searchGroups = computed(() => {
    const allItems = navigationGroups.value.flatMap(group => group.items)

    return [
      {
        id: 'dashboard-navigation',
        label: 'Dashboard navigation',
        items: allItems.map<NavigationMenuItem & { onSelect: () => void }>(item => ({
          label: item.label,
          icon: item.icon,
          to: item.to,
          badge: item.badge,
          onSelect: () => navigateTo(item.to)
        }))
      }
    ]
  })

  const currentPageTitle = computed(() => {
    const allItems = navigationGroups.value.flatMap(group => group.items)
    const active = allItems.find(item => route.path === item.to || route.path.startsWith(`${item.to}/`))
    return active?.label || 'Dashboard'
  })

  return {
    navigationGroups,
    quickActions,
    searchGroups,
    currentPageTitle
  }
}
