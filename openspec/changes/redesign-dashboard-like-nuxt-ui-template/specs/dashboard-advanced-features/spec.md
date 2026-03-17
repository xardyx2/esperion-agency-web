# Dashboard Advanced Features Specification

## Overview

This specification defines 10 advanced UI/UX enhancements for the Esperion admin dashboard, based on modern admin dashboard patterns from Linear, Stripe, Vercel, and other leading platforms. These features transform the dashboard from a basic CRUD interface into a powerful, professional admin experience.

---

## Table of Contents

1. [Command Palette](#1-command-palette)
2. [Bulk Actions](#2-bulk-actions)
3. [Saved Views](#3-saved-views)
4. [Inline Editing](#4-inline-editing)
5. [Activity Feed & Presence](#5-activity-feed--presence)
6. [Enhanced Empty States](#6-enhanced-empty-states)
7. [Data Visualization](#7-data-visualization)
8. [Widget Customization](#8-widget-customization)
9. [Smart Search](#9-smart-search)
10. [Contextual Help](#10-contextual-help)

---

## 1. Command Palette

### 1.1 Purpose

Provide keyboard-first navigation and action execution for power users, reducing mouse dependency and navigation friction.

### 1.2 Requirements

**R1.1** The dashboard SHALL provide a command palette accessible via `⌘K` (Mac) or `Ctrl+K` (Windows/Linux) keyboard shortcut.

**R1.2** The command palette SHALL display as an overlay modal centered on screen with search input and categorized results.

**R1.3** The command palette SHALL support the following command categories:
- **Navigation**: Go to specific pages (Analytics, Articles, Media, etc.)
- **Actions**: Execute actions (New Article, Toggle Theme, Logout)
- **Content**: Search and navigate to specific content items
- **Recent**: Quick access to recently visited pages

**R1.4** The command palette SHALL support keyboard navigation:
- `↑` / `↓` arrows to navigate results
- `Enter` to select/execute
- `Escape` to close
- `Cmd/Ctrl + K` to close and reopen

**R1.5** The command palette SHALL display keyboard shortcuts next to commands where applicable.

**R1.6** The command palette SHALL remember and display last 5-10 visited pages in "Recent" section.

**R1.7** The command palette SHALL support fuzzy search for better matching.

### 1.3 User Interface

```
┌─────────────────────────────────────────────────────────┐
│  ⌘K  Search commands, pages, actions...                 │
├─────────────────────────────────────────────────────────┤
│  NAVIGATION                                             │
│  📊 Go to Analytics              ⌘ G A                 │
│  📝 Go to Articles               ⌘ G B                 │
│  🎨 Go to Media                  ⌘ G M                 │
│                                                         │
│  ACTIONS                                                │
│  ➕ New Article                  ⌘ N A                 │
│  ➕ New Work                     ⌘ N W                 │
│  👤 New User                     ⌘ N U                 │
│                                                         │
│  RECENT                                                 │
│  📄 "Jasa Web Development" (edited 2h ago)             │
│  📊 Analytics Report (viewed 5h ago)                   │
└─────────────────────────────────────────────────────────┘
```

### 1.4 Implementation Details

**Component**: `frontend/app/components/dashboard/CommandPalette.vue`

**Keyboard shortcuts registry**:
```typescript
interface KeyboardShortcut {
  key: string
  description: string
  action: () => void | string
  category: 'navigation' | 'action' | 'content'
}
```

**Library options**:
- **kbar** (Vercel): Proven, extensible, good Nuxt compatibility
- **Custom implementation**: Full control, but more maintenance

**Recommendation**: Use kbar for proven foundation.

---

## 2. Bulk Actions

### 2.1 Purpose

Enable efficient batch operations on multiple items, reducing repetitive individual actions.

### 2.2 Requirements

**R2.1** All content list pages (Articles, Works, Clients, Media, Contact, Users) SHALL support checkbox-based multi-selection.

**R2.2** The first checkbox click SHALL reveal a sticky contextual action toolbar.

**R2.3** The toolbar SHALL display:
- Selection counter ("X of Y selected")
- "Select all on page" option
- "Select all N results" option (across pagination)
- Bulk action buttons relevant to the module
- Clear selection button

**R2.4** Selected rows SHALL be visually highlighted with distinct background color.

**R2.5** Selection SHALL persist across pagination (user-configurable preference).

**R2.6** The `Escape` key SHALL clear selection.

**R2.7** Shift+click SHALL select range of items.

### 2.3 User Interface

```
┌─────────────────────────────────────────────────────────────────┐
│  [✓] Select all                                                 │
├─────────────────────────────────────────────────────────────────┤
│  [✓] Article 1  [Draft]  [Edit] [Delete]                       │
│  [✓] Article 2  [Published] [Edit] [Delete]                    │
│  [ ] Article 3  [Published] [Edit] [Delete]                    │
│  [✓] Article 4  [Draft]  [Edit] [Delete]                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  ✓ 3 items selected  [×] Clear                                  │
│  [Bulk Actions ▼] [Delete (3)] [Export (3)]                    │
└─────────────────────────────────────────────────────────────────┘
```

### 2.4 Module-Specific Bulk Actions

| Module | Bulk Actions |
|--------|--------------|
| **Articles** | Delete, Publish/Unpublish, Export CSV, Change Category, Change Status |
| **Works** | Delete, Feature/Unfeature, Export |
| **Clients** | Delete, Feature/Unfeature, Export |
| **Media** | Delete, Download, Tag, Move to Folder |
| **Contact** | Change Status, Export, Assign to User |
| **Users** | Delete, Suspend/Activate, Change Role, Export |

---

## 3. Saved Views

### 3.1 Purpose

Allow users to save and quickly switch between filter + sort + column configurations for common workflows.

### 3.2 Requirements

**R3.1** All filterable list pages SHALL support saving named views.

**R3.2** A "view" SHALL capture:
- Current filter state (all active filters)
- Sort column and direction
- Visible columns (if column visibility is configurable)
- Pagination size

**R3.3** Views SHALL persist per-user in backend.

**R3.4** Users SHALL be able to:
- Save new views with custom name and description
- Update existing views
- Delete views
- Set one view as default for each page
- Switch between views via dropdown

**R3.5** Views SHALL be optionally shareable team-wide (admin-controlled).

**R3.6** Pre-saved views SHALL be provided for common use cases.

### 3.3 User Interface

```
┌─────────────────────────────────────────────────────────────────┐
│  Articles          [+ Save View]                                │
├─────────────────────────────────────────────────────────────────┤
│  Views: [All ▼] [Drafts] [Published] [Needs Translation] [+]   │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Draft Articles                                    [×]   │   │
│  │ Status: Draft • Category: All • Sort: Newest           │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 3.4 Pre-Saved Views

| Module | Pre-Saved Views |
|--------|-----------------|
| **Articles** | "Drafts", "Published", "Needs Translation", "Recent (7 days)" |
| **Contact** | "New Leads", "Qualified", "Needs Follow-up" |
| **Media** | "Large Files (>5MB)", "Unoptimized Images", "Unused Assets" |
| **Users** | "Admins", "Editors", "Inactive (30 days)" |

---

## 4. Inline Editing

### 4.1 Purpose

Enable quick field updates without navigating to full edit page, reducing workflow friction for simple changes.

### 4.2 Requirements

**R4.1** Simple, low-risk fields SHALL support click-to-edit inline.

**R4.2** Inline edit SHALL support:
- Text inputs (short text, titles, names)
- Select dropdowns (status, category, role)
- Toggle switches (boolean flags)
- Tags (add/remove)

**R4.3** Inline edit interaction:
- Click on field value → inline input appears
- Blur or Enter saves
- Escape cancels
- Immediate validation with error display

**R4.4** Successful save SHALL show toast notification with "Undo" link (5-second timeout).

**R4.5** Complex forms (5+ fields, rich text, file uploads) SHALL use full edit page or slide-out drawer.

### 4.3 Decision Framework

| Use Inline When | Use Modal/Drawer When |
|-----------------|----------------------|
| Simple, single-field edits | Complex, multi-field forms |
| Low-risk changes (typos, tags) | High-stakes edits (payments, permissions) |
| High-frequency, repetitive tasks | Infrequent, focused operations |

### 4.4 Inline-Editable Fields by Module

| Module | Inline-Editable Fields |
|--------|------------------------|
| **Articles** | Title, Category, Status, Tags |
| **Works** | Title, Featured toggle, Client |
| **Clients** | Name, Category, Featured toggle |
| **Services** | Name, Category, Price |
| **Users** | Role, Active toggle |
| **Contact** | Status (already implemented) |

---

## 5. Activity Feed & Presence

### 5.1 Purpose

Provide team visibility into what other admins are doing, prevent edit conflicts, and maintain audit trail.

### 5.2 Requirements

**R5.1** The dashboard SHALL display real-time activity feed showing recent admin actions.

**R5.2** Activity feed SHALL include events:
- Content created/updated/deleted
- Status changes
- User logins/logouts
- Settings changes
- Backup/restore operations

**R5.3** Presence indicators SHALL show:
- Number of users currently online
- Which pages other users are viewing
- Edit locks ("John is editing this article")

**R5.4** Activity feed SHALL support:
- Chronological ordering (newest first)
- Infinite scroll
- Filtering by event type and user
- Export for audit purposes

**R5.5** Real-time updates SHALL use WebSocket or Server-Sent Events (SSE).

**R5.6** Users SHALL have privacy control ("invisible mode" toggle).

### 5.3 User Interface

```
┌─────────────────────────────────────────────────────────────────┐
│  ACTIVE NOW                                                     │
│  👤 admin@esperion.com - Editing "Jasa Web Development"         │
│  👤 editor@esperion.com - Viewing Analytics                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  RECENT ACTIVITY                            [View All →]        │
├─────────────────────────────────────────────────────────────────┤
│  🕐 2 min ago   admin published "SEO Tips 2026"                 │
│  🕐 15 min ago  editor uploaded logo-client-5.png              │
│  🕐 1h ago      admin created user "marketing@client.com"      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Enhanced Empty States

### 6.1 Purpose

Transform "dead end" empty states into actionable guidance that educates users and drives feature adoption.

### 6.2 Requirements

**R6.1** All empty states SHALL include:
- Illustration or icon
- Headline explaining the state
- Description with context
- Primary CTA (next action)
- Secondary links (docs, tutorials)

**R6.2** Empty states SHALL be module-specific with relevant guidance.

**R6.3** First-time empty states SHALL include quick tips (2-3 bullet points).

**R6.4** Empty states SHALL link to relevant documentation and video tutorials.

**R6.5** "No results" from filtering SHALL suggest clearing filters or adjusting search.

### 6.3 UI Pattern

```
┌─────────────────────────────────────────────────────────────────┐
│  📷 Your Media Library is Empty                                 │
├─────────────────────────────────────────────────────────────────┤
│  Upload images, videos, and documents to build your media      │
│  library. These can be attached to articles, works, or         │
│  services.                                                      │
│                                                                 │
│  ┌─────────────────┐                                           │
│  │   Drag & Drop   │                                           │
│  │   files here    │                                           │
│  └─────────────────┘                                           │
│                                                                 │
│  📚 Quick Tips:                                                 │
│  • Optimize images before upload (max 5MB)                     │
│  • Use descriptive filenames for SEO                            │
│  • WebP format preferred                                        │
│                                                                 │
│  [📖 Read Guidelines]  [🎥 Watch Tutorial]                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Data Visualization

### 7.1 Purpose

Transform analytics from text-based metrics into visual insights for better decision-making.

### 7.2 Requirements

**R7.1** The Analytics page SHALL include interactive charts and graphs.

**R7.2** Visualizations SHALL include:
1. **Time series line chart**: Page views, sessions over time
2. **Funnel visualization**: Bar chart with conversion % between steps
3. **Geographic visualization**: User locations (country-level)
4. **Device breakdown**: Pie/donut chart (Desktop/Mobile/Tablet)
5. **Traffic sources**: Stacked bar or donut (Organic, Direct, Social, Referral)
6. **Top pages**: Horizontal bar chart with view counts

**R7.3** Charts SHALL support:
- Time range picker (7d, 30d, 90d, custom)
- "vs previous period" comparison toggle
- Hover tooltips
- Click-to-drill interactions
- Export (PNG, PDF, CSV)

**R7.4** Charts SHALL work in both light and dark themes.

### 7.2 Chart Library Options

| Library | Pros | Cons |
|---------|------|------|
| **Apache ECharts** | Feature-rich, good performance | Larger bundle size |
| **Chart.js** | Lightweight, easy to use | Less customizable |
| **Recharts** | React-focused, Nuxt compatible | Requires React wrapper |

**Recommendation**: Apache ECharts for comprehensive features.

---

## 8. Widget Customization

### 8.1 Purpose

Allow users to customize dashboard home with modules that matter most to their role.

### 8.2 Requirements

**R8.1** Dashboard home SHALL support draggable, resizable widget grid.

**R8.2** Grid system SHALL be 12-column responsive with snap-to-grid behavior.

**R8.3** Users SHALL be able to:
- Drag widgets to reorder
- Resize widgets (with min/max constraints)
- Add new widgets from library
- Remove widgets
- Toggle between "view" and "edit" mode
- Create multiple named dashboards
- Reset to default layout

**R8.4** Widget layouts SHALL persist per-user in backend.

### 8.3 Available Widgets

- Traffic overview (analytics summary)
- Recent articles/works/services
- Contact submissions queue
- Media library preview
- System health (uptime, backups, errors)
- SEO scores
- User activity feed
- Quick actions
- Content calendar

---

## 9. Smart Search

### 9.1 Purpose

Enable powerful, precise content discovery beyond simple text matching.

### 9.2 Requirements

**R9.1** Search SHALL support advanced operators:
- `"exact phrase"` - Quote matching
- `status:draft` - Field-value matching
- `category:services` - Category filter
- `author:admin` - Author filter
- `before:2026-01-01` / `after:2026-03-01` - Date ranges
- `views:>1000` / `views:<100` - Numeric comparisons

**R9.2** Search SHALL include faceted filters sidebar/dropdown.

**R9.3** Search SHALL display recent searches (last 5-10).

**R9.4** Search SHALL support scope limitation (specific content type or all).

**R9.5** Search results SHALL highlight matched terms.

---

## 10. Contextual Help

### 10.1 Purpose

Improve first-time user experience and feature adoption through in-context guidance.

### 10.2 Requirements

**R10.1** The dashboard SHALL include `?` or `ℹ️` help icons next to complex features.

**R10.2** Help tooltips SHALL appear on hover/click with explanation.

**R10.3** Keyboard shortcuts modal (`?` key) SHALL display all available shortcuts.

**R10.4** First-time visits to modules SHALL offer optional interactive tour.

**R10.5** Feature spotlight modals SHALL highlight underused features (dismissible).

**R10.6** "What's new" changelog SHALL appear after major updates.

---

## Implementation Phasing

### Phase 1 (Quick Wins, 1-2 weeks)
- Empty States Enhancement
- Contextual Help System

### Phase 2 (High Impact, 2-3 weeks)
- Command Palette
- Bulk Actions
- Data Visualization

### Phase 3 (Workflow Enhancement, 2-3 weeks)
- Saved Views
- Inline Editing
- Smart Search

### Phase 4 (Advanced, 3-4 weeks)
- Activity Feed & Presence
- Widget Customization

---

## Success Metrics

| Feature | Success Metric |
|---------|----------------|
| Command Palette | 40%+ of power users use ⌘K daily |
| Bulk Actions | 10x reduction in time for batch operations |
| Saved Views | 2/3 of users return to saved views monthly |
| Inline Editing | 5x faster for simple field updates |
| Activity Feed | Reduced edit conflicts, better team coordination |
| Empty States | 40% reduction in "how do I start?" support tickets |
| Data Viz | Increased time spent in Analytics page |
| Widget Custom | 2.5x increase in daily dashboard usage (IBM Cognos benchmark) |
| Smart Search | Reduced navigation clicks, faster content discovery |
| Contextual Help | 30% reduction in support tickets |

---

## Dependencies

### Existing Components
- `LanguageSwitcher.vue` ✅
- `ThemeToggle.vue` ✅
- `UDropdownMenu` ✅
- `UButton`, `UAvatar`, `UIcon` ✅

### New Components Required
- `CommandPalette.vue`
- `BulkActionsToolbar.vue`
- `SavedViewsDropdown.vue`
- `InlineEdit.vue`
- `ActivityFeed.vue`
- `EmptyState.vue`
- `Chart.vue` (wrapper)
- `WidgetGrid.vue`
- `HelpTooltip.vue`
- `ShortcutsModal.vue`

### Backend Requirements
- Activity tracking endpoints
- View persistence API
- Widget layout persistence
- Real-time WebSocket/SSE infrastructure

---

## Open Questions

1. **Chart library selection**: Final decision between ECharts, Chart.js, or Recharts?
2. **Real-time infrastructure**: WebSocket vs SSE vs polling for activity feed?
3. **Command palette**: kbar library or custom implementation?
4. **Widget grid library**: vue-grid-layout or custom solution?
5. **Backend priorities**: Which features require backend changes vs frontend-only?
