## 1. Reference preparation and shared dashboard foundations

- [x] 1.1 Create a dedicated reference workspace under `frontend/reference/dashboard-template/` and store the approved upstream template references or copied source files from `nuxt-ui-templates/dashboard` there without mixing them into `frontend/app/`.
- [x] 1.2 Define one canonical dashboard module map for navigation and shortcuts in shared frontend code (for example under `frontend/app/composables/` or `frontend/app/utils/`) so the shell and overview stop diverging.
- [x] 1.3 Create reusable dashboard primitives under `frontend/app/components/dashboard/` for the new shell, panel/header structure, metric cards, section headers, content panels, filter bars, and common content sections, adapting selected upstream template structures when that is the fastest safe path.

## 2. Dashboard shell redesign

- [x] 2.1 Rebuild `frontend/app/layouts/dashboard.vue` to provide a template-inspired shell with collapsible sidebar, richer header actions, responsive mobile behavior, and continued integration with auth logout, locale routing, and theme switching, using adapted upstream template code where helpful.
- [x] 2.2 **Add Language Switcher to dashboard header** by integrating existing `LanguageSwitcher.vue` component into the top navbar right section (between notifications and theme toggle) with `variant="toggle"` and `size="sm"` for compact fit.
- [x] 2.3 **Enhance User Menu** by adding avatar support (avatar URL or initials fallback), expanding dropdown items to include "My Profile" link, and consolidating user menu to navbar-only dropdown with simplified sidebar user display.
- [x] 2.4 **Add Quick Create Menu** as "+ New" dropdown in navbar with links to create new Article, Work, Service, Client, and Media.
- [x] 2.5 **Add "Visit Site" Link** as external link button in navbar or user menu that opens public site in new tab.
- [x] 2.6 Replace the current placeholder-style overview in `frontend/app/pages/dashboard/index.vue` with a real dashboard landing page that uses the new shared layout primitives and no longer advertises unfinished internal statuses.
- [x] 2.7 Ensure the redesigned shell exposes the active admin modules consistently, including grouped or secondary navigation where needed for settings-oriented sections.

## 3. Page migration to the shared admin composition system

- [x] 3.1 Migrate data-heavy dashboard pages such as `frontend/app/pages/dashboard/articles.vue`, `frontend/app/pages/dashboard/works.vue`, `frontend/app/pages/dashboard/services.vue`, `frontend/app/pages/dashboard/clients.vue`, and `frontend/app/pages/dashboard/contact.vue` to the shared panel, filter, and table patterns.
- [x] 3.2 Migrate form/detail-oriented dashboard pages such as `frontend/app/pages/dashboard/articles/new.vue`, `frontend/app/pages/dashboard/articles/[id].vue`, `frontend/app/pages/dashboard/works/new.vue`, and `frontend/app/pages/dashboard/users.vue` to the shared header, action, and form-section patterns.
- [x] 3.3 Migrate secondary admin pages such as `frontend/app/pages/dashboard/analytics.vue`, `frontend/app/pages/dashboard/settings.vue`, `frontend/app/pages/dashboard/sessions.vue`, `frontend/app/pages/dashboard/api-docs.vue`, and `frontend/app/pages/dashboard/media.vue` so they follow the redesigned shell and page composition without changing their existing runtime contracts.

## 4. Brand and theme compliance

- [x] 4.1 Audit the redesigned dashboard for Esperion token usage and update `frontend/app.config.ts`, `frontend/app/assets/css/main.css`, and `frontend/tailwind.config.ts` only as needed to support the new shell without introducing foreign palette values or template-specific hardcoded colors.
- [x] 4.2 Verify the redesigned dashboard preserves readable light/dark theme behavior, consistent accent usage, and accessible contrast across shell chrome, widgets, tables, and forms.

## 5. Verification and regression coverage

- [x] 5.1 Add or update dashboard-focused tests in `frontend/tests/components/` and `frontend/e2e/dashboard.spec.ts` to cover the redesigned shell, canonical navigation, and key module page rendering.
- [ ] 5.2 Run frontend verification (`npm run type-check`, targeted unit tests, and relevant Playwright dashboard coverage) and record any remaining page-level gaps that are outside this redesign scope.
- [ ] 5.3 Manually verify the redesigned dashboard on desktop and mobile in the Docker development workflow, confirming CSR behavior, auth-aware shell actions, theme switching, and reference-folder hygiene.

## 6. Advanced UI Features — Phase 1 (Quick Wins, P1)

### 6.1 Empty States Enhancement
- [x] 6.1.1 Create `UDashboardEmptyState` component with illustration, headline, description, primary CTA, and secondary links
- [x] 6.1.2 Implement enhanced empty state for Media page (first upload guidance with drag-and-drop zone)
- [x] 6.1.3 Implement enhanced empty state for Articles page (create first article with tips)
- [x] 6.1.4 Implement enhanced empty state for Works, Clients, Contact pages
- [x] 6.1.5 Add quick tips section to each empty state with module-specific best practices
- [x] 6.1.6 Add documentation and video tutorial links to empty states

### 6.2 Contextual Help System
- [x] 6.2.1 Create `UDashboardHelpTooltip` component for inline help
- [x] 6.2.2 Add help tooltips to Analytics page (funnel reporting, metrics explanation)
- [x] 6.2.3 Add help tooltips to Settings page (integrations, consent tiers)
- [x] 6.2.4 Implement keyboard shortcuts modal (`?` key) with searchable shortcut list
- [x] 6.2.5 Add feature spotlight modals for underused features (dismissible, reappears after N sessions)
- [x] 6.2.6 Create "What's new" changelog modal for post-update notifications

## 7. Advanced UI Features — Phase 2 (High Impact, P0)

### 7.1 Command Palette
- [x] 7.1.1 Research and select command palette library (kbar vs custom implementation)
- [x] 7.1.2 Create `UDashboardCommandPalette` component with overlay modal
- [x] 7.1.3 Implement keyboard shortcut (`⌘K` / `Ctrl+K`) trigger
- [x] 7.1.4 Add navigation commands (Go to Analytics, Articles, Media, etc.)
- [x] 7.1.5 Add action commands (New Article, New Work, Toggle Theme, Logout)
- [x] 7.1.6 Implement recent items section (last 5-10 visited pages)
- [x] 7.1.7 Add content search (articles, works, clients by title/name)
- [x] 7.1.8 Implement keyboard navigation (↑↓ arrows, Enter, Escape)
- [x] 7.1.9 Add fuzzy search for better matching
- [x] 7.1.10 Test across all pages and verify performance

### 7.2 Bulk Actions
- [x] 7.2.1 Create `UDashboardBulkActionsToolbar` component (sticky, shows on selection)
- [x] 7.2.2 Implement checkbox column for all list pages (Articles, Works, Clients, Media, Contact, Users)
- [x] 7.2.3 Add "Select all on page" and "Select all N results" functionality
- [x] 7.2.4 Implement selection counter ("X of Y selected")
- [x] 7.2.5 Add bulk actions for Articles (Delete, Publish/Unpublish, Export, Change Category)
- [x] 7.2.6 Add bulk actions for Media (Delete, Download, Tag)
- [x] 7.2.7 Add bulk actions for Clients (Delete, Feature/Unfeature, Export)
- [x] 7.2.8 Add bulk actions for Contact (Change Status, Export)
- [x] 7.2.9 Add bulk actions for Users (Delete, Suspend/Activate, Change Role, Export)
- [x] 7.2.10 Implement selection persistence across pagination (user preference)
- [ ] 7.2.11 Add keyboard shortcut for bulk selection (Shift+click for range) - [ALREADY IMPLEMENTED]
- [x] 7.2.12 Write E2E tests for bulk action workflows

### 7.3 Data Visualization
- [x] 7.3.1 Research and select chart library (Chart.js vs Apache ECharts vs Recharts)
- [x] 7.3.2 Create `UDashboardChart` wrapper component with common configuration

### 8.2 Inline Editing
- [x] 8.2.1 Create `UInlineEdit` component (text input, select, toggle variants)
- [x] 8.2.2 Implement click-to-edit interaction pattern
- [x] 8.2.3 Add immediate validation with error display
- [x] 8.2.4 Implement undo functionality with toast notification
- [x] 8.2.5 Add inline editing for Articles (title, category, status)
- [x] 8.2.6 Add inline editing for Works (title, featured toggle)
- [x] 8.2.7 Add inline editing for Clients (name, category, featured toggle)
- [x] 8.2.8 Add inline editing for Services (name, category, price)
- [x] 8.2.9 Add inline editing for Users (role, active toggle)
- [x] 8.2.10 Implement slide-out drawer for medium-complexity forms (hybrid approach)
- [x] 8.2.11 Add keyboard shortcuts for inline edit (Enter to save, Escape to cancel)
- [x] 8.2.12 Write E2E tests for inline editing workflows

### 8.3 Smart Search
- [x] 8.3.1 Enhance search input with advanced syntax support
- [x] 8.3.2 Implement search operators (`"exact phrase"`, `status:draft`, `category:services`, `author:admin`, `before:`, `after:`, `views:>`, `views:<`)
- [x] 8.3.4 Implement recent searches display (last 5-10)
- [x] 8.3.12 Optimize search performance with debouncing

## 9. Advanced UI Features — Phase 4 (Advanced, P2-P3)

### 9.1 Activity Feed & Presence
- [x] 9.1.1 Research real-time tech options (WebSocket vs SSE vs polling)
- [x] 9.1.3 Create `UDashboardActivityFeed` component
- [x] 9.1.5 Add activity feed to Dashboard home (recent activity widget)
- [x] 9.1.6 Create dedicated Activity page with filtering
- [x] 9.1.7 Implement presence indicators (users online, viewing same page)
- [x] 9.1.8 Add edit locks ("John is editing this article" warning)
- [ ] 9.1.9 Implement activity feed infinite scroll
- [ ] 9.1.10 Add privacy controls ("invisible mode" toggle)
- [ ] 9.1.11 Write integration tests for real-time updates
- [ ] 9.1.12 Test performance under concurrent user load

### 9.2 Widget Customization
- [ ] 9.2.1 Research drag-and-drop grid library (vue-grid-layout, etc.)
- [x] 9.2.2 Create `UDashboardWidgetGrid` component
- [x] 9.2.3 Implement 12-column responsive grid system
- [x] 9.2.4 Add drag handles for widget reordering
- [x] 9.2.5 Implement resize handles with min/max constraints
- [x] 9.2.6 Add "Customize mode" toggle (view vs edit)
- [x] 9.2.7 Create widget library (Traffic, Recent Articles, Contact Queue, Media Preview, System Health, SEO Scores, Activity Feed, Quick Actions, Calendar)
- [x] 9.2.8 Implement "Add Widget" modal with widget preview
- [ ] 9.2.9 Add widget persistence per-user in backend
- [ ] 9.2.10 Implement multiple named dashboards per user
- [ ] 9.2.11 Add "Reset to default" functionality
- [ ] 9.2.12 Test responsive behavior at all breakpoints
- [x] 9.2.13 Verify widgets work in dark mode

## 10. Technical Debt & Performance

- [x] 10.1 Fix Media page (currently hardcoded mock data, no API integration, non-functional upload button)
- [ ] 10.2 Optimize bundle size for chart libraries and command palette
- [x] 10.3 Implement lazy loading for large lists (virtual scrolling)
- [x] 10.4 Add loading skeletons for all async components
- [x] 10.5 Implement error boundaries for widget failures
- [x] 10.6 Add performance monitoring (page load time, chart render time)
- [ ] 10.7 Optimize for mobile (test all features at mobile breakpoints)
- [ ] 10.8 Ensure all new features are accessible (keyboard nav, screen reader, ARIA labels)

## 11. Documentation & Training

- [x] 11.1 Create admin user guide (PDF/online docs)
- [x] 11.4 Create changelog for dashboard improvements
- [ ] 11.2 Record video tutorials for key features (command palette, bulk actions, saved views)
- [ ] 11.3 Add in-app help links to documentation
- [ ] 11.5 Train internal team on new features
- [ ] 11.6 Gather user feedback after 2 weeks of usage

## 12. Advanced Article Editor (P0 Priority - 6 Weeks)

### 12.1 Phase 1: Core Editor with Dual View (Week 1-2)

#### Editor Layout Infrastructure
- [x] 12.1.1 Create `ArticleEditor.vue` main container
- [x] 12.1.2 Create `SplitViewLayout.vue` with dual panes
- [x] 12.1.3 Create `SingleViewLayout.vue` with language tabs
- [x] 12.1.4 Create `ViewModeToggle.vue` component (Split/Single buttons)
- [x] 12.1.5 Implement `useScrollSync.ts` composable for synchronized scrolling
- [x] 12.1.6 Add percentage-based scroll synchronization between panes
- [x] 12.1.7 Implement cursor position saving per language
- [x] 12.1.8 Create `LanguageTabs.vue` for single view switching
- [x] 12.1.9 Add keyboard shortcuts: Ctrl/Cmd+1 (single), Ctrl/Cmd+2 (split)
- [x] 12.1.10 Add keyboard shortcut: Ctrl/Cmd+Tab (switch language in single view)

#### TipTap Editor Setup
- [ ] 12.1.11 Install `@nuxt/ui` Editor dependencies (TipTap, extensions)
- [ ] 12.1.12 Add vite.optimizeDeps for prosemirror packages in `nuxt.config.ts`
- [ ] 12.1.13 Create `TipTapEditor.vue` wrapper component
- [ ] 12.1.14 Configure TipTap extensions: StarterKit, Image, Link, Placeholder
- [ ] 12.1.15 Add slash commands (`/`) for block insertion
- [ ] 12.1.16 Implement floating bubble toolbar for text formatting
- [ ] 12.1.17 Add block drag handle for reordering
- [ ] 12.1.18 Configure dark mode support for editor
- [ ] 12.1.19 Create `SyncedScrollContainer.vue` for split view
- [ ] 12.1.20 Add resize handle for adjustable pane widths

#### State Management
- [ ] 12.1.21 Create `articleEditor.ts` Pinia store
- [ ] 12.1.22 Define state: content (id/en), viewMode, activeLanguage
- [ ] 12.1.23 Define state: cursorPositions, scrollPositions
- [ ] 12.1.24 Add getters for combined content, word counts
- [ ] 12.1.25 Add actions for language switching
- [ ] 12.1.26 Add actions for view mode switching with state preservation
- [ ] 12.1.27 Implement content change tracking

### 12.2 Phase 2: Save System with Revision History (Week 3)

#### Save Coordinator
- [ ] 12.2.1 Create `SaveCoordinator.ts` service
- [ ] 12.2.2 Implement idle detection (2 seconds no typing)
- [ ] 12.2.3 Implement word count tracking (save every 100 words)
- [ ] 12.2.4 Implement manual save (Ctrl+S / button)
- [ ] 12.2.5 Add token-based save coordination (prevent conflicts)
- [ ] 12.2.6 Implement save priority: manual > word-count > idle
- [ ] 12.2.7 Add save metadata: type, timestamp, word count, author
- [ ] 12.2.8 Create `useSaveCoordinator.ts` composable
- [ ] 12.2.9 Add save status tracking (idle/saving/saved/error)

#### Revision History - Backend
- [ ] 12.2.10 Create SurrealDB `revisions` table schema
- [ ] 12.2.11 Add fields: article_id, content_id, content_en, metadata
- [ ] 12.2.12 Add metadata fields: save_type, word_count, author_id, author_name
- [ ] 12.2.13 Create indexes for efficient querying
- [ ] 12.2.14 Add API endpoint: POST /api/v1/articles/:id/revisions
- [ ] 12.2.15 Add API endpoint: GET /api/v1/articles/:id/revisions (paginated)
- [ ] 12.2.16 Add API endpoint: GET /api/v1/articles/:id/revisions/:revisionId
- [ ] 12.2.17 Add API endpoint: POST /api/v1/articles/:id/revisions/:id/restore
- [ ] 12.2.18 Add API endpoint: POST /api/v1/articles/:id/revisions/compare
- [ ] 12.2.19 Add API endpoint: POST /api/v1/articles/:id/revisions/cleanup
- [ ] 12.2.20 Implement revision cleanup logic (keep last 100)

#### Revision History - Frontend
- [ ] 12.2.21 Create `RevisionHistoryPanel.vue` component
- [ ] 12.2.22 Create `RevisionItem.vue` for individual revision display
- [ ] 12.2.23 Add revision grouping by date (Today, Yesterday, etc.)
- [ ] 12.2.24 Show revision metadata: type, timestamp, word count, author
- [ ] 12.2.25 Add "Restore" button per revision
- [ ] 12.2.26 Add "Preview" button for revision preview
- [ ] 12.2.27 Add "Compare" button for diff view
- [ ] 12.2.28 Create `RevisionDiff.vue` for side-by-side comparison
- [ ] 12.2.29 Add diff statistics: +words, -words, ~changed
- [ ] 12.2.30 Create `RevisionSettings.vue` for max revisions config
- [ ] 12.2.31 Add settings: max revisions slider (10, 50, 100, 250, 500)
- [ ] 12.2.32 Add settings: auto-cleanup toggle
- [ ] 12.2.33 Implement revision search/filter

#### UI Components
- [ ] 12.2.34 Create `SaveStatusIndicator.vue` component
- [ ] 12.2.35 Create `WordCountDisplay.vue` component
- [ ] 12.2.36 Create `ArticleEditorStatusBar.vue` with save info
- [ ] 12.2.37 Add "Last saved" timestamp display
- [ ] 12.2.38 Add save type indicator (Manual/Auto) with icon

### 12.3 Phase 3: Offline Editing Support (Week 4)

#### IndexedDB Setup
- [ ] 12.3.1 Create IndexedDB database schema
- [ ] 12.3.2 Create `pending_changes` object store
- [ ] 12.3.3 Create `article_drafts` object store
- [ ] 12.3.4 Create `revision_cache` object store
- [ ] 12.3.5 Implement IndexedDB service with CRUD operations
- [ ] 12.3.6 Add transactions for data integrity

#### Offline Manager
- [ ] 12.3.7 Create `OfflineManager.ts` service
- [ ] 12.3.8 Implement connection status detection (navigator.onLine)
- [ ] 12.3.9 Add heartbeat ping every 30 seconds for accurate status
- [ ] 12.3.10 Implement `useConnectionStatus.ts` composable
- [ ] 12.3.11 Add pending changes queue management
- [ ] 12.3.12 Implement `useOfflineEditing.ts` composable
- [ ] 12.3.13 Add draft saving to IndexedDB on content change
- [ ] 12.3.14 Implement draft retrieval on page load

#### Service Worker Sync
- [ ] 12.3.15 Configure Service Worker for background sync
- [ ] 12.3.16 Register sync tags for article changes
- [ ] 12.3.17 Implement fetch interception when offline
- [ ] 12.3.18 Queue failed requests for retry
- [ ] 12.3.19 Auto-trigger sync when connection restored

#### Conflict Resolution
- [ ] 12.3.20 Implement conflict detection logic
- [ ] 12.3.21 Default strategy: server wins (configurable)
- [ ] 12.3.22 Create `ConflictResolver.vue` component
- [ ] 12.3.23 Show conflict notification with options
- [ ] 12.3.24 Add "Use Server Version" button
- [ ] 12.3.25 Add "Use My Version" button
- [ ] 12.3.26 Add "Review Diff" button (future enhancement)
- [ ] 12.3.27 Implement version comparison logic

#### Notification System
- [ ] 12.3.28 Create `ConnectionStatusBar.vue` component
- [ ] 12.3.29 Show offline mode notification (red banner)
- [ ] 12.3.30 Show online mode + syncing notification (blue banner)
- [ ] 12.3.31 Show sync complete notification (green banner)
- [ ] 12.3.32 Show sync conflict notification (yellow banner)
- [ ] 12.3.33 Show sync failed notification (red banner with retry)
- [ ] 12.3.34 Add sync progress indicator (count of pending changes)
- [ ] 12.3.35 Create `SyncNotification.vue` component

### 12.4 Phase 4: Live SEO Scoring (Week 5)

#### Client-Side SEO Calculation
- [ ] 12.4.1 Create `useLiveSEO.ts` composable
- [ ] 12.4.2 Implement word count calculation (fast)
- [ ] 12.4.3 Implement heading structure analysis
- [ ] 12.4.4 Implement link count (internal/external)
- [ ] 12.4.5 Implement image count and alt text check
- [ ] 12.4.6 Implement keyword presence check
- [ ] 12.4.7 Add weighted scoring for client-side metrics

#### API Integration
- [ ] 12.4.8 Use existing POST /api/v1/seo/calculate endpoint
- [ ] 12.4.9 Implement debounced API calls (500ms)
- [ ] 12.4.10 Merge client-side and API results
- [ ] 12.4.11 Cache API results to prevent duplicate calls
- [ ] 12.4.12 Handle API errors gracefully (show cached/last known)

#### SEO Panel UI
- [ ] 12.4.13 Create `LiveSEOPanel.vue` component
- [ ] 12.4.14 Create `SEOScoreRing.vue` for circular progress
- [ ] 12.4.15 Add live score display (0-100)
- [ ] 12.4.16 Add color coding: green >80, yellow 60-80, red <60
- [ ] 12.4.17 Create `SEOMetricsList.vue` component
- [ ] 12.4.18 Show client metrics: word count, headings, links, images
- [ ] 12.4.19 Show API metrics: readability, keyword density, content quality
- [ ] 12.4.20 Add loading indicator for API-calculated metrics
- [ ] 12.4.21 Add "Refresh Analysis" button
- [ ] 12.4.22 Implement real-time updates on content change

### 12.5 Phase 5: Document Settings & Polish (Week 5-6)

#### Document Settings Panel
- [ ] 12.5.1 Create `DocumentPanel.vue` component
- [ ] 12.5.2 Add status selector: Draft, Published, Archived
- [ ] 12.5.3 Add visibility selector: Public, Private, Password
- [ ] 12.5.4 Add publish date picker
- [ ] 12.5.5 Add author display (read-only)
- [ ] 12.5.6 Add slug editor with auto-generate from title

#### Featured Image
- [ ] 12.5.7 Create `FeaturedImage.vue` component
- [ ] 12.5.8 Add upload from computer
- [ ] 12.5.9 Add "Select from Media Library"
- [ ] 12.5.10 Show image preview with remove button
- [ ] 12.5.11 Add alt text input field

#### Categories & Tags
- [ ] 12.5.12 Create `CategoriesPanel.vue` with checkboxes
- [ ] 12.5.13 Fetch categories from API
- [ ] 12.5.14 Support category hierarchy
- [ ] 12.5.15 Add "+ Add New Category" button
- [ ] 12.5.16 Create `TagsPanel.vue` with input
- [ ] 12.5.17 Add tag suggestions as user types
- [ ] 12.5.18 Show tags as removable chips

#### Performance Optimization
- [ ] 12.5.19 Implement virtual scrolling for large articles
- [ ] 12.5.20 Add chunk-based content rendering (500 words per chunk)
- [ ] 12.5.21 Create content analysis Web Worker
- [ ] 12.5.22 Offload word count to Web Worker
- [ ] 12.5.23 Offload SEO calculation to Web Worker
- [ ] 12.5.24 Limit revision cache in memory (max 20)
- [ ] 12.5.25 Implement aggressive cleanup for unused data

#### Editor Enhancements
- [ ] 12.5.26 Add word count display in toolbar
- [ ] 12.5.27 Add reading time estimation
- [ ] 12.5.28 Add undo/redo buttons
- [ ] 12.5.29 Add fullscreen editing mode
- [ ] 12.5.30 Add distraction-free mode (hide sidebar)
- [ ] 12.5.31 Add keyboard shortcuts help modal (Ctrl/Cmd+/)

### 12.6 Testing & Documentation (Week 6)

#### E2E Tests
- [ ] 12.6.1 Write test: Create new article with editor
- [ ] 12.6.2 Write test: Edit existing article
- [ ] 12.6.3 Write test: Switch between split/single view
- [ ] 12.6.4 Write test: Synchronized scrolling in split view
- [ ] 12.6.5 Write test: Auto-save on idle (2 seconds)
- [ ] 12.6.6 Write test: Auto-save every 100 words
- [ ] 12.6.7 Write test: Manual save creates revision
- [ ] 12.6.8 Write test: View revision history
- [ ] 12.6.9 Write test: Restore to previous revision
- [ ] 12.6.10 Write test: Compare two revisions
- [ ] 12.6.11 Write test: Offline mode detection
- [ ] 12.6.12 Write test: Offline changes saved to IndexedDB
- [ ] 12.6.13 Write test: Auto-sync when back online
- [ ] 12.6.14 Write test: Conflict resolution
- [ ] 12.6.15 Write test: Live SEO score updates
- [ ] 12.6.16 Write test: Block operations (add, delete, reorder)

#### Unit Tests
- [ ] 12.6.17 Test SaveCoordinator logic
- [ ] 12.6.18 Test word count calculation
- [ ] 12.6.19 Test scroll synchronization
- [ ] 12.6.20 Test SEO score calculation
- [ ] 12.6.21 Test IndexedDB operations
- [ ] 12.6.22 Test connection status detection

#### Documentation
- [ ] 12.6.23 Create editor usage guide
- [ ] 12.6.24 Document keyboard shortcuts
- [ ] 12.6.25 Document save mechanisms
- [ ] 12.6.26 Document offline editing
- [ ] 12.6.27 Document revision history
- [ ] 12.6.28 Document SEO best practices
- [ ] 12.6.29 Create video tutorial for content editor
- [ ] 12.6.30 Add inline help tooltips

#### Nuxt UI Editor Setup
- [ ] 12.1.1 Install `@nuxt/ui` Editor dependencies (TipTap, extensions)
- [ ] 12.1.2 Add vite.optimizeDeps for prosemirror packages in `nuxt.config.ts`
- [ ] 12.1.3 Create `ContentEditor.vue` container component with Nuxt UI Editor
- [ ] 12.1.4 Implement title input field (separate from editor content)
- [x] 12.1.5 Configure TipTap extensions: StarterKit, Image, Link, Placeholder
- [x] 12.1.6 Add slash commands (`/`) for block insertion
- [x] 12.1.7 Implement floating bubble toolbar for text formatting
- [x] 12.1.8 Add drag handle for block reordering
- [x] 12.1.9 Configure dark mode support for editor
- [x] 12.1.10 Add keyboard shortcuts documentation

#### Auto-Save System
- [ ] 12.1.11 Implement auto-save composable (`useAutoSave`)
- [ ] 12.1.12 Auto-save every 30 seconds
- [ ] 12.1.13 Auto-save on pause after 2 seconds of no typing
- [ ] 12.1.14 Show "Saving..." / "Saved" indicator in toolbar
- [ ] 12.1.15 Handle offline state with retry queue

### 12.2 Phase 2: Sidebar & Document Settings (Week 2-3)

#### Layout Implementation
- [ ] 12.2.1 Create Gutenberg-style layout (editor left, sidebar right)
- [ ] 12.2.2 Make sidebar collapsible on mobile
- [ ] 12.2.3 Create sticky toolbar with back button, status, actions
- [ ] 12.2.4 Add responsive breakpoints (sidebar hides below 1024px)

#### Document Panel
- [ ] 12.2.5 Create `DocumentPanel.vue` component
- [ ] 12.2.6 Add status dropdown (Draft, Pending, Published, Scheduled, Archived)
- [ ] 12.2.7 Implement visibility selector (Public, Private, Password)
- [ ] 12.2.8 Add publish date picker with "Immediately" option
- [ ] 12.2.9 Show author selector (current user default)
- [ ] 12.2.10 Add slug editor with auto-generate from title

#### Featured Image
- [ ] 12.2.11 Create `FeaturedImage.vue` component
- [ ] 12.2.12 Add upload from computer option
- [ ] 12.2.13 Add "Select from Media Library" option
- [ ] 12.2.14 Show image preview with remove button
- [ ] 12.2.15 Add alt text input field

#### Categories & Tags
- [ ] 12.2.16 Create `CategoriesPanel.vue` with checkboxes
- [ ] 12.2.17 Fetch categories from backend API
- [ ] 12.2.18 Support category hierarchy (indent subcategories)
- [ ] 12.2.19 Add "+ Add New Category" button (opens modal)
- [ ] 12.2.20 Create `TagsPanel.vue` with comma-separated input
- [ ] 12.2.21 Add tag suggestions as user types
- [ ] 12.2.22 Show tags as removable chips

### 12.3 Phase 3: SEO Panel Integration (Week 3-4)

#### SEO Panel UI
- [ ] 12.3.1 Create `SeoPanel.vue` component
- [ ] 12.3.2 Display SEO score with circular progress indicator
- [ ] 12.3.3 Show grade badge (Excellent, Good, Fair, etc.)
- [ ] 12.3.4 Add color coding (green >80, yellow 60-80, red <60)
- [ ] 12.3.5 Create score breakdown accordion (6 categories)

#### Focus Keyword
- [ ] 12.3.6 Add focus keyword input field
- [ ] 12.3.7 Show keyword density indicator
- [ ] 12.3.8 Highlight keyword occurrences in content
- [ ] 12.3.9 Add "+ Add Secondary Keyword" option

#### Snippet Editor
- [ ] 12.3.10 Create SEO title input with character counter (50-60 optimal)
- [ ] 12.3.11 Create meta description textarea (120-160 optimal)
- [ ] 12.3.12 Add URL slug editor with validation
- [ ] 12.3.13 Show Google search result preview
- [ ] 12.3.14 Add "Edit Snippet" toggle for advanced editing

#### SEO Analysis Checklist
- [ ] 12.3.15 Display 10+ SEO factors with pass/warning/fail icons
- [ ] 12.3.16 Show dynamic suggestions from backend
- [ ] 12.3.17 Highlight failing items in red
- [ ] 12.3.18 Add "Fix" links that scroll to relevant field
- [ ] 12.3.19 Real-time recalculation on content/meta changes

#### Social Previews
- [ ] 12.3.20 Create `SocialPreviewFacebook.vue` component
- [ ] 12.3.21 Create `SocialPreviewTwitter.vue` component
- [ ] 12.3.22 Show image, title, description in card format
- [ ] 12.3.23 Add toggle to customize social metadata separately
- [ ] 12.3.24 Add social image uploader

#### Schema Markup
- [ ] 12.3.25 Add schema type selector (Article, BlogPosting, etc.)
- [ ] 12.3.26 Show schema configuration button

### 12.4 Phase 4: Backend API Integration (Week 4-5)

#### API Integration
- [ ] 12.4.1 Connect to `POST /api/v1/seo/calculate` for real-time scoring
- [ ] 12.4.2 Implement debounced API calls (500ms)
- [ ] 12.4.3 Cache score results in Pinia store
- [ ] 12.4.4 Connect article save/update endpoints
- [ ] 12.4.5 Save SEO metadata with article content
- [ ] 12.4.6 Fetch existing SEO score on page load
- [ ] 12.4.7 Handle API errors with user-friendly messages

#### Revision History
- [ ] 12.4.8 Add "Revisions" section to sidebar
- [ ] 12.4.9 Show revision list with timestamps
- [ ] 12.4.10 Add "Preview" and "Restore" buttons per revision
- [ ] 12.4.11 Show diff between current and selected revision
- [ ] 12.4.12 Add "Compare" mode for two revisions

### 12.5 Phase 5: Polish & Advanced Features (Week 5-6)

#### Block Enhancements
- [ ] 12.5.1 Add custom block types (Callout, Table, Embed)
- [ ] 12.5.2 Implement image alignment options
- [ ] 12.5.3 Add image caption support
- [ ] 12.5.4 Create link card/embed block
- [ ] 12.5.5 Add table block with cell editing

#### Editor Improvements
- [ ] 12.5.6 Add word count display in toolbar
- [ ] 12.5.7 Add reading time estimation
- [ ] 12.5.8 Implement undo/redo buttons
- [ ] 12.5.9 Add fullscreen editing mode
- [ ] 12.5.10 Create distraction-free writing mode (hide sidebar)

#### Validation & Feedback
- [ ] 12.5.11 Add required field validation
- [ ] 12.5.12 Show error states for empty title/content
- [ ] 12.5.13 Add "Publish" button validation
- [ ] 12.5.14 Show success toast on save/publish
- [ ] 12.5.15 Add confirmation dialog for navigate away with unsaved changes

#### Accessibility
- [ ] 12.5.16 Add ARIA labels to all editor controls
- [ ] 12.5.17 Ensure keyboard navigation works in sidebar
- [ ] 12.5.18 Add focus management for modals
- [ ] 12.5.19 Test with screen reader
- [ ] 12.5.20 Ensure color contrast meets WCAG 2.1

### 12.6 Testing & Documentation

#### E2E Tests
- [ ] 12.6.1 Write test: Create new article with editor
- [ ] 12.6.2 Write test: Edit existing article
- [ ] 12.6.3 Write test: Auto-save functionality
- [ ] 12.6.4 Write test: SEO score calculation
- [ ] 12.6.5 Write test: Block operations (add, delete, reorder)
- [ ] 12.6.6 Write test: Sidebar interactions
- [ ] 12.6.7 Write test: Publish workflow
- [ ] 12.6.8 Write test: Revision restore

#### Unit Tests
- [ ] 12.6.9 Test SEO score calculation logic
- [ ] 12.6.10 Test auto-save composable
- [ ] 12.6.11 Test slash command filtering
- [ ] 12.6.12 Test validation functions

#### Documentation
- [ ] 12.6.13 Create editor usage guide
- [ ] 12.6.14 Document SEO best practices
- [ ] 12.6.15 Add inline help tooltips to SEO panel
- [ ] 12.6.16 Create video tutorial for content editor

### 12.7 Component Structure

```
frontend/app/components/dashboard/content/
├── ContentEditor.vue                    # Main container
├── ContentEditorToolbar.vue             # Top action bar
├── ContentEditorSidebar.vue             # Right sidebar
├── blocks/
│   ├── BlockEditor.vue                  # Block-based content
│   ├── SlashCommandMenu.vue             # / command palette
│   ├── BlockToolbar.vue                 # Floating toolbar
│   └── DragHandle.vue                   # Block reorder handle
├── document/
│   ├── DocumentPanel.vue                # Document settings
│   ├── StatusSelector.vue               # Draft/Published/etc
│   ├── FeaturedImage.vue                # Image upload/selector
│   ├── CategoriesPanel.vue              # Category checkboxes
│   └── TagsPanel.vue                    # Tags input
└── seo/
    ├── SeoPanel.vue                     # Main SEO container
    ├── SeoScore.vue                     # Score display
    ├── SeoScoreBreakdown.vue            # Category breakdown
    ├── SeoFocusKeyword.vue              # Focus keyword input
    ├── SeoSnippetEditor.vue             # Title/meta/slug
    ├── SeoAnalysis.vue                  # Checklist
    ├── SeoSocialPreview.vue             # FB/Twitter cards
    └── SeoSchemaSelector.vue            # Schema markup
```
