# Dashboard Redesign Documentation

## Overview

The Esperion Dashboard has been redesigned to provide a modern, template-inspired admin experience while maintaining Esperion's brand identity through semantic design tokens.

## Architecture

### Component Library

#### Core Components

**UDashboardSection**
- Purpose: Content section wrapper with consistent styling
- Props: `title`, `description`, `icon`, `badge`, `class`
- Slots: `actions`, `header`, `footer`

**UDashboardEmptyState**
- Purpose: Enhanced empty states with actionable guidance
- Props: `icon`, `title`, `description`, `primaryAction`, `secondaryActions`, `tips`
- Features: Illustration, tips, CTAs

**UDashboardFilterBar**
- Purpose: Search and filter interface
- Props: `searchPlaceholder`, `filterOptions`, `showSearch`, `showFilters`
- Events: `search`, `update:filters`
- Features: Keyboard shortcut (`/`), clear filters

**UInlineEdit**
- Purpose: Quick field updates without navigation
- Props: `modelValue`, `type`, `placeholder`, `options`, `validate`
- Types: `text`, `select`, `toggle`, `textarea`
- Features: Click-to-edit, validation, keyboard shortcuts

**UDashboardCommandPalette**
- Purpose: Keyboard-first navigation
- Shortcut: `⌘K` / `Ctrl+K`
- Features: Recent items, fuzzy search, keyboard navigation

**UDashboardChart**
- Purpose: Data visualization wrapper
- Library: Apache ECharts
- Types: `line`, `bar`, `pie`, `area`, `funnel`
- Features: Dark/light theme support

### Design Tokens

All components use Esperion semantic design tokens:

```css
/* Background */
--es-bg-primary
--es-bg-secondary
--es-bg-tertiary

/* Text */
--es-text-primary
--es-text-secondary
--es-text-tertiary

/* Border */
--es-border

/* Accent */
--es-accent-primary
--es-accent-secondary

/* Status */
--es-success
--es-warning
--es-error
--es-info
```

## Features

### 1. Dashboard Shell

- **Collapsible Sidebar**: Responsive with mobile drawer
- **Header Actions**:
  - Language Switcher (ID/EN)
  - Quick Create Menu (+ New)
  - Visit Site Link
  - Theme Toggle
  - User Menu with Avatar

### 2. Navigation

- Command Palette: `⌘K` / `Ctrl+K`
- Canonical navigation map in `useDashboardNavigation`
- Grouped sections: Workspace, Content, System

### 3. Content Pages

All content pages use consistent patterns:
- Page Header with eyebrow, title, description
- Filter Bar with search
- Content Section with badge
- Empty State with tips

### 4. Auto-Save System

Three-tier save mechanism:
1. **Idle Save**: 2 seconds after typing stops
2. **Word Count**: Every 100 words
3. **Manual Save**: Highest priority

Composable: `useAutoSave.ts`

### 5. SEO Panel

Live SEO analysis with:
- Score ring (0-100)
- Focus keyword tracking
- Title/meta description editors
- SEO checklist
- Search preview

## Migration Guide

### Updating Existing Pages

1. **Import Components**
```vue
import UDashboardSection from '~/components/dashboard/UDashboardSection.vue'
import UDashboardEmptyState from '~/components/dashboard/UDashboardEmptyState.vue'
```

2. **Page Structure**
```vue
<template>
  <div class="space-y-6">
    <DashboardPageHeader
      eyebrow="Section"
      title="Page Title"
      description="Page description"
    />
    
    <UDashboardSection>
      <!-- Content -->
    </UDashboardSection>
  </div>
</template>
```

3. **Add Empty State**
```vue
<UDashboardEmptyState
  v-if="!items.length"
  icon="i-lucide-file"
  title="No items yet"
  description="Get started by creating your first item."
  :primary-action="{ label: 'Create', to: '/create', icon: 'i-lucide-plus' }"
  :tips="['Tip 1', 'Tip 2']"
/>
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘K` / `Ctrl+K` | Open Command Palette |
| `/` | Focus Search |
| `⌘1` / `Ctrl+1` | Single View Mode (Editor) |
| `⌘2` / `Ctrl+2` | Split View Mode (Editor) |
| `⌘Tab` / `Ctrl+Tab` | Switch Language (Editor) |
| `Escape` | Close Modals/Dropdowns |

## Testing

### Unit Tests

Components have comprehensive unit tests:
- `UDashboardSection.test.ts`
- `UDashboardEmptyState.test.ts`
- `UDashboardFilterBar.test.ts`
- `UInlineEdit.test.ts`

### E2E Tests

Dashboard redesign E2E tests in:
- `e2e/dashboard-redesign.spec.ts`

Run tests:
```bash
npm run test:unit
npm run test:e2e
```

## Best Practices

1. **Always use semantic tokens** - Never hardcode colors
2. **Support dark mode** - Test both themes
3. **Keyboard accessible** - All interactions keyboard-navigable
4. **Responsive** - Test mobile, tablet, desktop
5. **Loading states** - Show skeletons/spinners
6. **Error handling** - Clear error messages

## File Structure

```
frontend/
├── app/
│   ├── components/
│   │   └── dashboard/
│   │       ├── UDashboardSection.vue
│   │       ├── UDashboardFilterBar.vue
│   │       ├── UDashboardEmptyState.vue
│   │       ├── UDashboardCommandPalette.vue
│   │       ├── UDashboardBulkActionsToolbar.vue
│   │       ├── UDashboardChart.vue
│   │       ├── UInlineEdit.vue
│   │       ├── ContentEditor.vue
│   │       └── SEOPanel.vue
│   ├── composables/
│   │   ├── useDashboardNavigation.ts
│   │   └── useAutoSave.ts
│   └── pages/
│       └── dashboard/
│           ├── index.vue
│           ├── articles.vue
│           ├── works.vue
│           ├── services.vue
│           ├── clients.vue
│           ├── contact.vue
│           ├── users.vue
│           └── media.vue
├── tests/
│   └── components/
│       ├── UDashboardSection.test.ts
│       ├── UDashboardEmptyState.test.ts
│       ├── UDashboardFilterBar.test.ts
│       └── UInlineEdit.test.ts
└── e2e/
    └── dashboard-redesign.spec.ts
```

## Future Enhancements

### Planned Features

1. **Bulk Actions** - Checkbox selection, batch operations
2. **Saved Views** - Persist filter/sort preferences
3. **Smart Search** - Advanced operators, faceted filters
4. **Activity Feed** - Real-time updates via WebSocket
5. **Widget Customization** - Drag-drop dashboard widgets
6. **Revision History** - Content versioning
7. **Collaborative Editing** - Multi-user presence

### Backend Requirements

- Activity tracking API
- View persistence endpoints
- WebSocket/SSE infrastructure
- Revision storage
- Search indexing

## Support

For questions or issues:
1. Check component documentation
2. Review existing implementations
3. Consult design token reference
4. Run test suite for validation
