## Why

The current dashboard implementation lacks a modern, professional appearance that matches industry standards for agency CMS interfaces. The Nuxt UI Dashboard template (https://dashboard-template.nuxt.dev/) provides a proven, production-ready design system with consistent spacing, typography, and component patterns that will significantly improve user experience and visual appeal. Implementing this template will provide a solid foundation for the Esperion Dashboard with responsive layouts, dark mode support, and accessible components out of the box.

## What Changes

- Replace current dashboard layout with Nuxt UI Dashboard template structure
- Implement new dashboard shell with collapsible sidebar navigation
- Add responsive header with user profile, notifications, and theme toggle
- Create dashboard home page with metric cards and recent activity sections
- Implement data table components for CRUD operations (articles, works, services, users)
- Add form layouts with validation for content creation/editing
- Integrate Esperion Design System colors (primary: #2B9EDB) into Nuxt UI theme
- **BREAKING**: Remove legacy dashboard pages from `frontend/pages/dashboard/` (duplicate files)
- **BREAKING**: Restructure dashboard routes to use new layout system

## Capabilities

### New Capabilities
- `dashboard-shell`: Core dashboard layout with sidebar, header, and content areas
- `dashboard-navigation`: Collapsible navigation with active state management
- `dashboard-metrics`: Metric cards and KPI display components
- `dashboard-data-tables`: Sortable, filterable tables for content management
- `dashboard-forms`: Form layouts with validation for content editing
- `dashboard-notifications`: Toast notifications and alerts system
- `dashboard-theme`: Dark/light mode toggle with system preference detection

### Modified Capabilities
- `dashboard-layout`: Update existing layout to use Nuxt UI Dashboard patterns
- `content-management`: Enhance with new table and form components

## Impact

- **Frontend**: Complete overhaul of dashboard pages and components
- **Backend**: No changes required (API endpoints remain same)
- **Database**: No schema changes
- **Dependencies**: Uses existing @nuxt/ui, adds dashboard-specific patterns
- **Performance**: Improved with lazy-loaded components and optimized rendering
- **Accessibility**: WCAG 2.1 AA compliance via Nuxt UI components
- **Mobile**: Full responsive support for tablet and mobile devices
