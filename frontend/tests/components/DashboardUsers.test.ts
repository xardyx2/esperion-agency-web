import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

import DashboardUsersPage from '../../app/pages/dashboard/users.vue'

const getCurrentUser = vi.fn()
const listUsers = vi.fn()
const listRoles = vi.fn()
const createUser = vi.fn()
const updateUser = vi.fn()
const deleteUser = vi.fn()

vi.mock('../../app/composables/useApi', () => ({
  useAuthApi: () => ({
    getCurrentUser
  }),
  useUsersApi: () => ({
    list: listUsers,
    listRoles,
    create: createUser,
    update: updateUser,
    delete: deleteUser
  })
}))

describe('Dashboard Users Page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal('definePageMeta', vi.fn())
    vi.stubGlobal('useSeoMeta', vi.fn())
    vi.stubGlobal('onMounted', (callback: () => void | Promise<void>) => {
      void callback()
    })
    vi.stubGlobal('confirm', vi.fn(() => true))
  })

  it('renders real user data for admins', async () => {
    getCurrentUser.mockResolvedValue({
      id: 'users:admin',
      email: 'admin@example.com',
      full_name: 'Admin User',
      username: 'admin',
      role: 'admin'
    })
    listUsers.mockResolvedValue({
      data: [
        {
          id: 'users:editor',
          email: 'editor@example.com',
          full_name: 'Editor User',
          username: 'editor',
          role: 'editor',
          phone: null,
          created_at: '2026-03-08T00:00:00Z'
        }
      ],
      total: 1,
      page: 1,
      limit: 50
    })
    listRoles.mockResolvedValue({
      roles: [
        { role: 'admin', permissions: ['users.read'] },
        { role: 'editor', permissions: ['content.write'] }
      ]
    })

    const wrapper = mount(DashboardUsersPage)
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(getCurrentUser).toHaveBeenCalled()
    expect(listUsers).toHaveBeenCalled()
    expect(wrapper.text()).toContain('Editor User')
    expect(wrapper.text()).toContain('editor@example.com')
  })

  it('shows access denied for non-admin users', async () => {
    getCurrentUser.mockResolvedValue({
      id: 'users:viewer',
      email: 'viewer@example.com',
      full_name: 'Viewer User',
      username: 'viewer',
      role: 'viewer'
    })

    const wrapper = mount(DashboardUsersPage)
    await new Promise(resolve => setTimeout(resolve, 0))

    expect(listUsers).not.toHaveBeenCalled()
    expect(wrapper.text()).toContain('Only administrators can access user management.')
  })
})
