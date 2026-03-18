/**
 * Dashboard Widgets Library
 * 
 * Available widgets for the customizable dashboard grid
 */

export const availableWidgets = [
  {
    id: 'traffic-analytics',
    name: 'Traffic Analytics',
    icon: 'i-lucide-chart-line',
    description: 'Real-time traffic metrics and trends',
    defaultSize: { w: 2, h: 2 },
    minSize: { w: 1, h: 1 },
    maxSize: { w: 4, h: 3 },
    component: 'TrafficAnalyticsWidget'
  },
  {
    id: 'recent-articles',
    name: 'Recent Articles',
    icon: 'i-lucide-file-text',
    description: 'Latest published and draft articles',
    defaultSize: { w: 1, h: 3 },
    minSize: { w: 1, h: 2 },
    maxSize: { w: 2, h: 4 },
    component: 'RecentArticlesWidget'
  },
  {
    id: 'contact-queue',
    name: 'Contact Queue',
    icon: 'i-lucide-mail',
    description: 'Recent contact form submissions',
    defaultSize: { w: 1, h: 3 },
    minSize: { w: 1, h: 2 },
    maxSize: { w: 2, h: 4 },
    component: 'ContactQueueWidget'
  },
  {
    id: 'quick-actions',
    name: 'Quick Actions',
    icon: 'i-lucide-zap',
    description: 'Frequently used shortcuts',
    defaultSize: { w: 1, h: 2 },
    minSize: { w: 1, h: 1 },
    maxSize: { w: 2, h: 2 },
    component: 'QuickActionsWidget'
  },
  {
    id: 'system-health',
    name: 'System Health',
    icon: 'i-lucide-activity',
    description: 'API, database, and service status',
    defaultSize: { w: 2, h: 1 },
    minSize: { w: 1, h: 1 },
    maxSize: { w: 3, h: 2 },
    component: 'SystemHealthWidget'
  },
  {
    id: 'recent-works',
    name: 'Recent Works',
    icon: 'i-lucide-briefcase',
    description: 'Latest portfolio works',
    defaultSize: { w: 1, h: 3 },
    minSize: { w: 1, h: 2 },
    maxSize: { w: 2, h: 4 },
    component: 'RecentWorksWidget'
  },
  {
    id: 'media-preview',
    name: 'Media Preview',
    icon: 'i-lucide-images',
    description: 'Recent media uploads',
    defaultSize: { w: 2, h: 2 },
    minSize: { w: 1, h: 1 },
    maxSize: { w: 3, h: 3 },
    component: 'MediaPreviewWidget'
  },
  {
    id: 'seo-scores',
    name: 'SEO Scores',
    icon: 'i-lucide-trending-up',
    description: 'Content SEO performance overview',
    defaultSize: { w: 2, h: 2 },
    minSize: { w: 1, h: 1 },
    maxSize: { w: 3, h: 3 },
    component: 'SeoScoresWidget'
  }
]

export type WidgetId = typeof availableWidgets[number]['id']
export type WidgetDefinition = typeof availableWidgets[number]
