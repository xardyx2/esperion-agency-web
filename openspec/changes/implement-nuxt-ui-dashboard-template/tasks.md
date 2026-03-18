## 1. Setup & Template Download

- [x] 1.1 Clone Nuxt UI Dashboard template to `reference/dashboard-template/`
  - Source: https://github.com/nuxt-ui-templates/dashboard
  - Acceptance: Template files exist in reference folder

- [ ] 1.2 Review template structure and components
  - Review `app/layouts/`, `app/components/`, `app/pages/` structure
  - Acceptance: Document key components to reuse

- [x] 1.3 Update Nuxt UI theme configuration
  - File: `frontend/app.config.ts`
  - Set primary color to #2B9EDB (Esperion sky blue)
  - Acceptance: Primary buttons use Esperion blue

## 2. Dashboard Layout Implementation

- [x] 2.1 Create new dashboard layout file
  - File: `frontend/app/layouts/dashboard.vue`
  - Use Nuxt UI Dashboard layout structure
  - Acceptance: Layout renders with header, sidebar, content areas

- [ ] 2.2 Implement DashboardHeader component
  - File: `frontend/app/components/dashboard/DashboardHeader.vue`
  - Include: user profile, notification bell, theme toggle
  - Acceptance: Header displays on all dashboard pages

- [ ] 2.3 Implement DashboardSidebar component
  - File: `frontend/app/components/dashboard/DashboardSidebar.vue`
  - Include: navigation menu, collapse button, active state
  - Acceptance: Sidebar shows all navigation links, can collapse

- [ ] 2.4 Add responsive behavior to layout
  - Mobile: Sidebar becomes hamburger menu
  - Desktop: Sidebar visible by default
  - Acceptance: Layout adapts to viewport size

## 3. Dashboard Home Page

- [ ] 3.1 Create DashboardMetricCard component
  - File: `frontend/app/components/dashboard/DashboardMetricCard.vue`
  - Props: label, value, trend, icon, to (link)
  - Acceptance: Card displays metric with trend indicator

- [ ] 3.2 Update dashboard index page
  - File: `frontend/app/pages/dashboard/index.vue`
  - Add metric cards grid (4 columns desktop, 2 tablet, 1 mobile)
  - Acceptance: Dashboard home shows metrics overview

- [ ] 3.3 Add recent activity section
  - File: `frontend/app/pages/dashboard/index.vue`
  - Show recent articles, works, users
  - Acceptance: Recent items list displays below metrics

## 4. Data Table Components

- [ ] 4.1 Create DashboardTable component
  - File: `frontend/app/components/dashboard/DashboardTable.vue`
  - Features: sorting, pagination, search
  - Acceptance: Table displays data with sortable columns

- [ ] 4.2 Add table row actions
  - Edit button navigates to edit page
  - Delete button shows confirmation dialog
  - Acceptance: Actions work for each row

- [ ] 4.3 Implement table filtering
  - Search by text input
  - Filter by status dropdown
  - Acceptance: Filters update displayed rows

## 5. Content Management Pages

- [ ] 5.1 Update articles list page
  - File: `frontend/app/pages/dashboard/articles.vue`
  - Use DashboardTable component
  - Acceptance: Articles display in data table

- [ ] 5.2 Update works list page
  - File: `frontend/app/pages/dashboard/works.vue`
  - Use DashboardTable component
  - Acceptance: Works display in data table

- [ ] 5.3 Update services list page
  - File: `frontend/app/pages/dashboard/services.vue`
  - Use DashboardTable component
  - Acceptance: Services display in data table

- [ ] 5.4 Update users list page
  - File: `frontend/app/pages/dashboard/users.vue`
  - Use DashboardTable component
  - Acceptance: Users display in data table

## 6. Form Components

- [ ] 6.1 Create DashboardFormLayout component
  - File: `frontend/app/components/dashboard/DashboardFormLayout.vue`
  - Consistent form spacing and structure
  - Acceptance: Forms have consistent layout

- [ ] 6.2 Update article create/edit form
  - File: `frontend/app/pages/dashboard/articles/new.vue`
  - File: `frontend/app/pages/dashboard/articles/[id].vue`
  - Use form layout component
  - Acceptance: Article forms use new layout

- [ ] 6.3 Add form validation feedback
  - Display validation errors below fields
  - Highlight invalid fields
  - Acceptance: Users see validation errors

## 7. Notifications System

- [ ] 7.1 Create DashboardNotificationsSlideover component
  - File: `frontend/app/components/dashboard/DashboardNotificationsSlideover.vue`
  - Add import for useUiStore
  - Acceptance: Notifications panel slides out

- [ ] 7.2 Add toast notification system
  - Use Nuxt UI toast composable
  - Success/error/info/warning variants
  - Acceptance: Toasts display on actions

- [ ] 7.3 Connect notification bell to slideover
  - Clicking bell opens notifications panel
  - Badge shows unread count
  - Acceptance: Bell button works

## 8. Theme & Styling

- [ ] 8.1 Implement dark mode toggle
  - Use @nuxtjs/color-mode module
  - Toggle button in header
  - Acceptance: Toggle switches theme

- [ ] 8.2 Verify Esperion colors in dark mode
  - Background: #0B1120
  - Text: #F8FAFC
  - Primary: #2B9EDB
  - Acceptance: Dark mode uses Esperion palette

- [ ] 8.3 Verify Esperion colors in light mode
  - Background: #FAFCFF
  - Text: #102B4E
  - Primary: #2B9EDB
  - Acceptance: Light mode uses Esperion palette

## 9. Testing & Cleanup

- [ ] 9.1 Remove duplicate dashboard pages
  - Delete `frontend/pages/dashboard/` (old location)
  - Keep only `frontend/app/pages/dashboard/`
  - Acceptance: No duplicate pages exist

- [ ] 9.2 Test all dashboard routes
  - Test: /dashboard, /dashboard/articles, /dashboard/works, etc.
  - Verify no 404 errors
  - Acceptance: All routes accessible

- [ ] 9.3 Test responsive breakpoints
  - Mobile (320px), Tablet (768px), Desktop (1920px)
  - Acceptance: Layout works at all sizes

- [ ] 9.4 Run TypeScript type check
  - Command: `npm run type-check`
  - Fix any type errors
  - Acceptance: No type errors

## 10. Documentation

- [ ] 10.1 Update AGENTS.md with new dashboard structure
  - Document new component locations
  - Acceptance: Documentation up to date

- [ ] 10.2 Verify Docker setup works
  - Build and run with docker-compose
  - Acceptance: Dashboard loads in Docker
