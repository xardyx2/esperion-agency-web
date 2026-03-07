import { defineStore } from 'pinia';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  createdAt: Date;
  read: boolean;
}

interface UIState {
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
  notifications: Notification[];
}

export const useUiStore = defineStore('ui', {
  state: (): UIState => ({
    theme: 'light' as 'light' | 'dark',
    sidebarCollapsed: false,
    notifications: [],
  }),

  getters: {
    currentTheme: (state) => state.theme,
    isSidebarCollapsed: (state) => state.sidebarCollapsed,
    allNotifications: (state) => state.notifications,
    unreadNotifications: (state) => state.notifications.filter(n => !n.read),
  },

  actions: {
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      
      // Update the document class for theme consistency
      if (process.client) {
        const html = window.document.documentElement;
        html.classList.remove('light', 'dark');
        html.classList.add(this.theme);
      }
    },

    setTheme(theme: 'light' | 'dark') {
      this.theme = theme;
      
      if (process.client) {
        const html = window.document.documentElement;
        html.classList.remove('light', 'dark');
        html.classList.add(this.theme);
      }
    },

    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
    },

    expandSidebar() {
      this.sidebarCollapsed = false;
    },

    collapseSidebar() {
      this.sidebarCollapsed = true;
    },

    addNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) {
      const newNotification: Notification = {
        id: Math.random().toString(36).substring(7), // Simple ID generation
        ...notification,
        createdAt: new Date(),
        read: false,
      };
      
      this.notifications.push(newNotification);
      
      // Limit notifications to 50 to prevent memory issues
      if (this.notifications.length > 50) {
        this.notifications = this.notifications.slice(-50);
      }
      
      // Auto-mark as read after 5 seconds if it's an info notification
      if (notification.type === 'info') {
        setTimeout(() => {
          this.markAsRead(newNotification.id);
        }, 5000);
      }
    },

    removeNotification(id: string) {
      this.notifications = this.notifications.filter(notif => notif.id !== id);
    },

    markAsRead(id: string) {
      const notification = this.notifications.find(notif => notif.id === id);
      if (notification) {
        notification.read = true;
      }
    },

    markAllAsRead() {
      this.notifications.forEach(notif => {
        notif.read = true;
      });
    },

    clearAllNotifications() {
      this.notifications = [];
    },

    loadThemeFromStorage() {
      if (process.client) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light' || savedTheme === 'dark') {
          this.theme = savedTheme;
          
          const html = window.document.documentElement;
          html.classList.remove('light', 'dark');
          html.classList.add(this.theme);
        }
      }
    }
  },

  persist: {
    key: 'ui-store',
    pick: ['theme', 'sidebarCollapsed'],
  },
});