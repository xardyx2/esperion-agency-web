## 1. Reference preparation and shared dashboard foundations

- [ ] 1.1 Create a dedicated reference workspace under `frontend/reference/dashboard-template/` and store the approved upstream template references or copied source files from `nuxt-ui-templates/dashboard` there without mixing them into `frontend/app/`.
- [ ] 1.2 Define one canonical dashboard module map for navigation and shortcuts in shared frontend code (for example under `frontend/app/composables/` or `frontend/app/utils/`) so the shell and overview stop diverging.
- [ ] 1.3 Create reusable dashboard primitives under `frontend/app/components/dashboard/` for the new shell, panel/header structure, metric cards, section headers, content panels, filter bars, and common content sections, adapting selected upstream template structures when that is the fastest safe path.

## 2. Dashboard shell redesign

- [ ] 2.1 Rebuild `frontend/app/layouts/dashboard.vue` to provide a template-inspired shell with collapsible sidebar, richer header actions, responsive mobile behavior, and continued integration with auth logout, locale routing, and theme switching, using adapted upstream template code where helpful.
- [ ] 2.2 **Add Language Switcher to dashboard header** by integrating existing `LanguageSwitcher.vue` component into the top navbar right section (between notifications and theme toggle) with `variant="toggle"` and `size="sm"` for compact fit.
- [ ] 2.3 **Enhance User Menu** by adding avatar support (avatar URL or initials fallback), expanding dropdown items to include "My Profile" link, and consolidating user menu to navbar-only dropdown with simplified sidebar user display.
- [ ] 2.4 **Add Quick Create Menu** as "+ New" dropdown in navbar with links to create new Article, Work, Service, Client, and Media.
- [ ] 2.5 **Add "Visit Site" Link** as external link button in navbar or user menu that opens public site in new tab.
- [ ] 2.6 Replace the current placeholder-style overview in `frontend/app/pages/dashboard/index.vue` with a real dashboard landing page that uses the new shared layout primitives and no longer advertises unfinished internal statuses.
- [ ] 2.7 Ensure the redesigned shell exposes the active admin modules consistently, including grouped or secondary navigation where needed for settings-oriented sections.

## 3. Page migration to the shared admin composition system

- [ ] 3.1 Migrate data-heavy dashboard pages such as `frontend/app/pages/dashboard/articles.vue`, `frontend/app/pages/dashboard/works.vue`, `frontend/app/pages/dashboard/services.vue`, `frontend/app/pages/dashboard/clients.vue`, and `frontend/app/pages/dashboard/contact.vue` to the shared panel, filter, and table patterns.
- [ ] 3.2 Migrate form/detail-oriented dashboard pages such as `frontend/app/pages/dashboard/articles/new.vue`, `frontend/app/pages/dashboard/articles/[id].vue`, `frontend/app/pages/dashboard/works/new.vue`, and `frontend/app/pages/dashboard/users.vue` to the shared header, action, and form-section patterns.
- [ ] 3.3 Migrate secondary admin pages such as `frontend/app/pages/dashboard/analytics.vue`, `frontend/app/pages/dashboard/settings.vue`, `frontend/app/pages/dashboard/sessions.vue`, `frontend/app/pages/dashboard/api-docs.vue`, and `frontend/app/pages/dashboard/media.vue` so they follow the redesigned shell and page composition without changing their existing runtime contracts.

## 4. Brand and theme compliance

- [ ] 4.1 Audit the redesigned dashboard for Esperion token usage and update `frontend/app.config.ts`, `frontend/app/assets/css/main.css`, and `frontend/tailwind.config.ts` only as needed to support the new shell without introducing foreign palette values or template-specific hardcoded colors.
- [ ] 4.2 Verify the redesigned dashboard preserves readable light/dark theme behavior, consistent accent usage, and accessible contrast across shell chrome, widgets, tables, and forms.

## 5. Verification and regression coverage

- [ ] 5.1 Add or update dashboard-focused tests in `frontend/tests/components/` and `frontend/e2e/dashboard.spec.ts` to cover the redesigned shell, canonical navigation, and key module page rendering.
- [ ] 5.2 Run frontend verification (`npm run type-check`, targeted unit tests, and relevant Playwright dashboard coverage) and record any remaining page-level gaps that are outside this redesign scope.
- [ ] 5.3 Manually verify the redesigned dashboard on desktop and mobile in the Docker development workflow, confirming CSR behavior, auth-aware shell actions, theme switching, and reference-folder hygiene.

## 6. Advanced UI Features — Phase 1 (Quick Wins, P1)

### 6.1 Empty States Enhancement
- [ ] 6.1.1 Create `UDashboardEmptyState` component with illustration, headline, description, primary CTA, and secondary links
- [ ] 6.1.2 Implement enhanced empty state for Media page (first upload guidance with drag-and-drop zone)
- [ ] 6.1.3 Implement enhanced empty state for Articles page (create first article with tips)
- [ ] 6.1.4 Implement enhanced empty state for Works, Clients, Contact pages
- [ ] 6.1.5 Add quick tips section to each empty state with module-specific best practices
- [ ] 6.1.6 Add documentation and video tutorial links to empty states

### 6.2 Contextual Help System
- [ ] 6.2.1 Create `UDashboardHelpTooltip` component for inline help
- [ ] 6.2.2 Add help tooltips to Analytics page (funnel reporting, metrics explanation)
- [ ] 6.2.3 Add help tooltips to Settings page (integrations, consent tiers)
- [ ] 6.2.4 Implement keyboard shortcuts modal (`?` key) with searchable shortcut list
- [ ] 6.2.5 Add feature spotlight modals for underused features (dismissible, reappears after N sessions)
- [ ] 6.2.6 Create "What's new" changelog modal for post-update notifications

## 7. Advanced UI Features — Phase 2 (High Impact, P0)

### 7.1 Command Palette
- [ ] 7.1.1 Research and select command palette library (kbar vs custom implementation)
- [ ] 7.1.2 Create `UDashboardCommandPalette` component with overlay modal
- [ ] 7.1.3 Implement keyboard shortcut (`⌘K` / `Ctrl+K`) trigger
- [ ] 7.1.4 Add navigation commands (Go to Analytics, Articles, Media, etc.)
- [ ] 7.1.5 Add action commands (New Article, New Work, Toggle Theme, Logout)
- [ ] 7.1.6 Implement recent items section (last 5-10 visited pages)
- [ ] 7.1.7 Add content search (articles, works, clients by title/name)
- [ ] 7.1.8 Implement keyboard navigation (↑↓ arrows, Enter, Escape)
- [ ] 7.1.9 Add fuzzy search for better matching
- [ ] 7.1.10 Test across all pages and verify performance

### 7.2 Bulk Actions
- [ ] 7.2.1 Create `UDashboardBulkActionsToolbar` component (sticky, shows on selection)
- [ ] 7.2.2 Implement checkbox column for all list pages (Articles, Works, Clients, Media, Contact, Users)
- [ ] 7.2.3 Add "Select all on page" and "Select all N results" functionality
- [ ] 7.2.4 Implement selection counter ("X of Y selected")
- [ ] 7.2.5 Add bulk actions for Articles (Delete, Publish/Unpublish, Export, Change Category)
- [ ] 7.2.6 Add bulk actions for Media (Delete, Download, Tag)
- [ ] 7.2.7 Add bulk actions for Clients (Delete, Feature/Unfeature, Export)
- [ ] 7.2.8 Add bulk actions for Contact (Change Status, Export)
- [ ] 7.2.9 Add bulk actions for Users (Delete, Suspend/Activate, Change Role, Export)
- [ ] 7.2.10 Implement selection persistence across pagination (user preference)
- [ ] 7.2.11 Add keyboard shortcut for bulk selection (Shift+click for range)
- [ ] 7.2.12 Write E2E tests for bulk action workflows

### 7.3 Data Visualization
- [ ] 7.3.1 Research and select chart library (Chart.js vs Apache ECharts vs Recharts)
- [ ] 7.3.2 Create `UDashboardChart` wrapper component with common configuration
- [ ] 7.3.3 Implement time series line chart for Analytics (page views, sessions over time)
- [ ] 7.3.4 Add time range picker (7d, 30d, 90d, custom)
- [ ] 7.3.5 Implement funnel visualization chart (bar chart with conversion %)
- [ ] 7.3.6 Add geographic visualization (country-level map or list)
- [ ] 7.3.7 Implement device breakdown pie/donut chart
- [ ] 7.3.8 Add traffic sources stacked bar or donut chart
- [ ] 7.3.9 Implement top pages horizontal bar chart
- [ ] 7.3.10 Add "vs previous period" comparison toggle with % change indicators
- [ ] 7.3.11 Implement chart export (PNG, PDF, CSV)
- [ ] 7.3.12 Add hover tooltips and click-to-drill interactions
- [ ] 7.3.13 Verify charts work in dark mode
- [ ] 7.3.14 Test performance with large datasets

## 8. Advanced UI Features — Phase 3 (Workflow Enhancement, P1-P2)

### 8.1 Saved Views
- [ ] 8.1.1 Create `UDashboardSavedViews` component with dropdown switcher
- [ ] 8.1.2 Implement "Save View" functionality (captures filter + sort + column state)
- [ ] 8.1.3 Add view naming and description input
- [ ] 8.1.4 Implement view persistence per-user in backend
- [ ] 8.1.5 Add view management (edit name, update filters, delete, reorder)
- [ ] 8.1.6 Implement "Set as default" for each page
- [ ] 8.1.7 Add pre-saved views for Articles ("Drafts", "Published", "Needs Translation")
- [ ] 8.1.8 Add pre-saved views for Contact ("New Leads", "Qualified", "Needs Follow-up")
- [ ] 8.1.9 Add pre-saved views for Media ("Large Files", "Unoptimized Images")
- [ ] 8.1.10 Add pre-saved views for Users ("Admins", "Editors", "Inactive")
- [ ] 8.1.11 Implement optional team-shared views (shareable across users)
- [ ] 8.1.12 Write unit tests for view state management

### 8.2 Inline Editing
- [ ] 8.2.1 Create `UInlineEdit` component (text input, select, toggle variants)
- [ ] 8.2.2 Implement click-to-edit interaction pattern
- [ ] 8.2.3 Add immediate validation with error display
- [ ] 8.2.4 Implement undo functionality with toast notification
- [ ] 8.2.5 Add inline editing for Articles (title, category, status)
- [ ] 8.2.6 Add inline editing for Works (title, featured toggle)
- [ ] 8.2.7 Add inline editing for Clients (name, category, featured toggle)
- [ ] 8.2.8 Add inline editing for Services (name, category, price)
- [ ] 8.2.9 Add inline editing for Users (role, active toggle)
- [ ] 8.2.10 Implement slide-out drawer for medium-complexity forms (hybrid approach)
- [ ] 8.2.11 Add keyboard shortcuts for inline edit (Enter to save, Escape to cancel)
- [ ] 8.2.12 Write E2E tests for inline editing workflows

### 8.3 Smart Search
- [ ] 8.3.1 Enhance search input with advanced syntax support
- [ ] 8.3.2 Implement search operators (`"exact phrase"`, `status:draft`, `category:services`, `author:admin`, `before:`, `after:`, `views:>`, `views:<`)
- [ ] 8.3.3 Add faceted filters sidebar/dropdown for common filters
- [ ] 8.3.4 Implement recent searches display (last 5-10)
- [ ] 8.3.5 Add search scope limiter (specific content type or all)
- [ ] 8.3.6 Implement search term highlighting in results
- [ ] 8.3.7 Add syntax hints dropdown in search input
- [ ] 8.3.8 Implement search for Articles (title, slug, category, author, status)
- [ ] 8.3.9 Implement search for Works (title, client, service)
- [ ] 8.3.10 Implement search for Clients (name, category, contact person)
- [ ] 8.3.11 Add search analytics (track popular searches, zero-result queries)
- [ ] 8.3.12 Optimize search performance with debouncing

## 9. Advanced UI Features — Phase 4 (Advanced, P2-P3)

### 9.1 Activity Feed & Presence
- [ ] 9.1.1 Research real-time tech options (WebSocket vs SSE vs polling)
- [ ] 9.1.2 Create backend activity tracking endpoints
- [ ] 9.1.3 Create `UDashboardActivityFeed` component
- [ ] 9.1.4 Implement activity event types (content created/updated/deleted, status changes, logins, settings changes)
- [ ] 9.1.5 Add activity feed to Dashboard home (recent activity widget)
- [ ] 9.1.6 Create dedicated Activity page with filtering
- [ ] 9.1.7 Implement presence indicators (users online, viewing same page)
- [ ] 9.1.8 Add edit locks ("John is editing this article" warning)
- [ ] 9.1.9 Implement activity feed infinite scroll
- [ ] 9.1.10 Add privacy controls ("invisible mode" toggle)
- [ ] 9.1.11 Write integration tests for real-time updates
- [ ] 9.1.12 Test performance under concurrent user load

### 9.2 Widget Customization
- [ ] 9.2.1 Research drag-and-drop grid library (vue-grid-layout, etc.)
- [ ] 9.2.2 Create `UDashboardWidgetGrid` component
- [ ] 9.2.3 Implement 12-column responsive grid system
- [ ] 9.2.4 Add drag handles for widget reordering
- [ ] 9.2.5 Implement resize handles with min/max constraints
- [ ] 9.2.6 Add "Customize mode" toggle (view vs edit)
- [ ] 9.2.7 Create widget library (Traffic, Recent Articles, Contact Queue, Media Preview, System Health, SEO Scores, Activity Feed, Quick Actions, Calendar)
- [ ] 9.2.8 Implement "Add Widget" modal with widget preview
- [ ] 9.2.9 Add widget persistence per-user in backend
- [ ] 9.2.10 Implement multiple named dashboards per user
- [ ] 9.2.11 Add "Reset to default" functionality
- [ ] 9.2.12 Test responsive behavior at all breakpoints
- [ ] 9.2.13 Verify widgets work in dark mode

## 10. Technical Debt & Performance

- [ ] 10.1 Fix Media page (currently hardcoded mock data, no API integration, non-functional upload button)
- [ ] 10.2 Optimize bundle size for chart libraries and command palette
- [ ] 10.3 Implement lazy loading for large lists (virtual scrolling)
- [ ] 10.4 Add loading skeletons for all async components
- [ ] 10.5 Implement error boundaries for widget failures
- [ ] 10.6 Add performance monitoring (page load time, chart render time)
- [ ] 10.7 Optimize for mobile (test all features at mobile breakpoints)
- [ ] 10.8 Ensure all new features are accessible (keyboard nav, screen reader, ARIA labels)

## 11. Documentation & Training

- [ ] 11.1 Create admin user guide (PDF/online docs)
- [ ] 11.2 Record video tutorials for key features (command palette, bulk actions, saved views)
- [ ] 11.3 Add in-app help links to documentation
- [ ] 11.4 Create changelog for dashboard improvements
- [ ] 11.5 Train internal team on new features
- [ ] 11.6 Gather user feedback after 2 weeks of usage
