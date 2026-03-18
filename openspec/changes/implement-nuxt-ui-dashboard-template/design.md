## Context

The current Esperion Dashboard uses a custom layout structure that lacks the polish and consistency of modern dashboard interfaces. The Nuxt UI Dashboard template (https://dashboard-template.nuxt.dev/) provides a production-ready, accessible, and responsive dashboard foundation built on top of @nuxt/ui. This template includes proven patterns for navigation, data display, forms, and responsive layouts that align with current UX best practices.

Current dashboard pain points:
- Inconsistent spacing and typography
- Limited mobile responsiveness
- No standardized component patterns
- Manual dark mode implementation
- Ad-hoc layout structure

## Goals / Non-Goals

**Goals:**
- Implement Nuxt UI Dashboard template as the foundation for Esperion Dashboard
- Achieve professional, modern dashboard appearance matching https://dashboard-template.nuxt.dev/
- Ensure full responsiveness (mobile, tablet, desktop)
- Integrate Esperion Design System colors (#2B9EDB primary)
- Provide consistent component patterns for all dashboard pages
- Support dark/light mode with system preference detection
- Maintain existing backend API compatibility

**Non-Goals:**
- No backend API changes required
- No database schema changes
- No changes to public-facing website (only dashboard)
- No changes to authentication flow
- No third-party dashboard service integration (self-hosted only)

## Decisions

### 1. Use Nuxt UI Dashboard Template from GitHub
**Decision**: Download and adapt the official Nuxt UI Dashboard template from https://github.com/nuxt-ui-templates/dashboard to `reference/dashboard-template/`

**Rationale**: 
- Official template maintained by Nuxt UI team
- Built with best practices and accessibility in mind
- Uses Nuxt UI components which are already in the project
- Easy to customize with Esperion branding

**Alternative Considered**: Build from scratch - rejected due to time and maintenance overhead

### 2. Two-Phase Implementation Approach
**Decision**: Implement in two phases - Phase 1: Layout shell and navigation, Phase 2: Individual page components

**Rationale**:
- Allows incremental deployment and testing
- Reduces risk of breaking existing functionality
- Easier code review process

### 3. Custom Color Theme Integration
**Decision**: Override Nuxt UI default theme with Esperion Design System colors

**Implementation**:
```typescript
// app.config.ts
export default defineAppConfig({
  ui: {
    primary: 'sky', // #2B9EDB closest match
    colors: {
      sky: {
        50: '#f0f9ff',
        100: '#e0f2fe',
        500: '#2B9EDB', // Esperion primary
        600: '#0284c7',
        // ... rest of scale
      }
    }
  }
})
```

### 4. Keep Existing Pinia Stores
**Decision**: Reuse existing auth, user, and ui stores

**Rationale**: Stores already have proper structure and API integration. Only UI store needs minor updates for new dashboard features.

### 5. Component Structure Pattern
**Decision**: Follow Nuxt UI Dashboard component hierarchy:
```
app/
├── layouts/
│   └── dashboard.vue (main layout shell)
├── components/
│   └── dashboard/
│       ├── DashboardSidebar.vue
│       ├── DashboardHeader.vue
│       ├── DashboardMetrics.vue
│       └── DashboardTable.vue
├── pages/
│   └── dashboard/
│       ├── index.vue (overview)
│       ├── articles.vue
│       ├── works.vue
│       └── ...
```

## Risks / Trade-offs

**Risk**: Template may have dependencies that conflict with current project
→ Mitigation: Review package.json differences, pin versions if needed, test in Docker

**Risk**: Template components may use different prop APIs than current components
→ Mitigation: Create wrapper components for smooth migration, update gradually

**Risk**: Dark mode implementation may conflict with existing color-mode setup
→ Mitigation: Use Nuxt UI's built-in color-mode module, test both modes thoroughly

**Trade-off**: Using template means some design flexibility is constrained by template structure
→ Acceptance: Template patterns are well-designed and industry-standard; customization still possible within bounds

**Trade-off**: Initial bundle size may increase due to new components
→ Mitigation: Use lazy loading for dashboard components, code splitting by route

## Migration Plan

1. **Phase 1: Setup and Layout**
   - Download template to `reference/dashboard-template/`
   - Create new `app/layouts/dashboard.vue` with template structure
   - Implement sidebar navigation with existing routes
   - Test layout renders without errors

2. **Phase 2: Dashboard Home**
   - Migrate dashboard index page with metric cards
   - Connect to existing API endpoints
   - Implement responsive grid layouts

3. **Phase 3: Content Pages**
   - Migrate articles, works, services pages
   - Implement data tables with sorting/filtering
   - Add form layouts for create/edit operations

4. **Phase 4: Polish**
   - Fine-tune Esperion color integration
   - Test all responsive breakpoints
   - Verify dark mode works correctly
   - Run full test suite

**Rollback Strategy**: Keep old dashboard pages in backup branch, can revert within 5 minutes if critical issues arise.

## Open Questions

- Should we keep the existing dashboard pages at `frontend/pages/dashboard/` as backup during transition?
- Which metric cards are most important to show on dashboard home? (Current: articles count, works count, etc.)
- Do we need real-time notifications or batched updates sufficient?
- Should we implement the TradingView widget integration now or defer to future change?
