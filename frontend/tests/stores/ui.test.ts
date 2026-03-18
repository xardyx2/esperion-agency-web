import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useUiStore } from '~/stores/ui'

describe('UI Store', () => {
  beforeEach(() => {
    // Create a fresh Pinia instance
    const pinia = createPinia()
    setActivePinia(pinia)
  })

  it('should initialize with default values', () => {
    const uiStore = useUiStore()

    expect(uiStore.sidebarCollapsed).toBe(false)
    expect(uiStore.notifications).toEqual([])
  })

  it('should have getters', () => {
    const uiStore = useUiStore()

    expect(uiStore.isSidebarCollapsed).toBe(false)
    expect(uiStore.allNotifications).toEqual([])
    expect(uiStore.unreadNotifications).toEqual([])
  })

  it('should toggle sidebar', () => {
    const uiStore = useUiStore()

    uiStore.toggleSidebar()
    expect(uiStore.sidebarCollapsed).toBe(true)

    uiStore.toggleSidebar()
    expect(uiStore.sidebarCollapsed).toBe(false)
  })

  it('should collapse and expand sidebar', () => {
    const uiStore = useUiStore()

    uiStore.collapseSidebar()
    expect(uiStore.sidebarCollapsed).toBe(true)

    uiStore.expandSidebar()
    expect(uiStore.sidebarCollapsed).toBe(false)
  })

  it('should add notification', () => {
    const uiStore = useUiStore()

    uiStore.addNotification({
      title: 'Test Title',
      message: 'Test message',
      type: 'success'
    })

    expect(uiStore.notifications.length).toBe(1)
    const notification = uiStore.notifications[0]
    expect(notification.title).toBe('Test Title')
    expect(notification.message).toBe('Test message')
    expect(notification.type).toBe('success')
    expect(notification.read).toBe(false)
  })

  it('should remove notification', () => {
    const uiStore = useUiStore()

    uiStore.addNotification({
      title: 'Test Title',
      message: 'Test message',
      type: 'success'
    })

    const { id } = uiStore.notifications[0]
    expect(uiStore.notifications.length).toBe(1)

    uiStore.removeNotification(id)
    expect(uiStore.notifications.length).toBe(0)
  })

  it('should mark notification as read', () => {
    const uiStore = useUiStore()

    uiStore.addNotification({
      title: 'Test Title',
      message: 'Test message',
      type: 'info'
    })

    const { id } = uiStore.notifications[0]
    const notification = uiStore.notifications.find(n => n.id === id)
    expect(notification?.read).toBe(false)

    uiStore.markAsRead(id)
    const updatedNotification = uiStore.notifications.find(n => n.id === id)
    expect(updatedNotification?.read).toBe(true)
  })

  it('should mark all notifications as read', () => {
    const uiStore = useUiStore()

    uiStore.addNotification({
      title: 'Test 1',
      message: 'Test message 1',
      type: 'info'
    })

    uiStore.addNotification({
      title: 'Test 2',
      message: 'Test message 2',
      type: 'info'
    })

    expect(uiStore.notifications.some(n => !n.read)).toBe(true)

    uiStore.markAllAsRead()
    expect(uiStore.notifications.every(n => n.read)).toBe(true)
  })

  it('should clear all notifications', () => {
    const uiStore = useUiStore()

    uiStore.addNotification({
      title: 'Test Title',
      message: 'Test message',
      type: 'success'
    })

    expect(uiStore.notifications.length).toBe(1)

    uiStore.clearAllNotifications()
    expect(uiStore.notifications).toEqual([])
  })

  it('should return correct counts for unread notifications', () => {
    const uiStore = useUiStore()

    // Add 3 notifications
    uiStore.addNotification({
      title: 'Unread 1',
      message: 'Message 1',
      type: 'info'
    })

    uiStore.addNotification({
      title: 'Unread 2',
      message: 'Message 2',
      type: 'info'
    })

    uiStore.addNotification({
      title: 'Read',
      message: 'Message 3',
      type: 'info'
    })

    // Mark one as read
    uiStore.markAsRead(uiStore.notifications[2].id)

    expect(uiStore.allNotifications.length).toBe(3)
    expect(uiStore.unreadNotifications.length).toBe(2)
  })
})
