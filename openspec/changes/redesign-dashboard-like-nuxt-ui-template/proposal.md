## Why

The current dashboard is functionally broad but visually inconsistent, self-identifies unfinished areas, and does not yet deliver the polished admin experience the project needs. The user wants the dashboard refreshed to feel like the Nuxt UI dashboard template while preserving Esperion's brand colors and keeping any upstream reference material organized in a dedicated reference folder.

## Goals

- Redesign the authenticated dashboard shell and page patterns to match the clarity, density, and responsiveness of the Nuxt UI dashboard template.
- Preserve Esperion brand identity by continuing to use the existing `--es-*` tokens, `app.config.ts` primary color, and dark/light theme behavior.
- Replace inconsistent or placeholder dashboard presentation with one coherent admin experience across overview, CRUD, analytics, settings, and support pages.
- Keep any copied upstream template reference material isolated in a dedicated reference directory so production source stays clean.

## Non-Goals

- Rebranding Esperion away from its current sky-blue accent and semantic token system.
- Replacing existing backend APIs, auth flows, or dashboard rendering mode.
- Turning the dashboard into a generic clone of the upstream template without adapting it to Esperion content and modules.
- Shipping every missing backend feature in the same change if the immediate need is layout/system redesign first.

## What Changes

- Add a shared dashboard-admin experience capability that defines the expected shell, navigation, page header, content panel, stats widget, and responsive behavior for authenticated admin pages.
- Redesign the current dashboard layout and key dashboard pages to follow the Nuxt UI dashboard template's structure and interaction patterns while using Esperion design tokens.
- Normalize dashboard navigation so the shell exposes the real admin modules consistently instead of today's partial menu and ad hoc shortcuts.
- **Enhance dashboard header** with language switching (Indonesian/English), improved user menu with avatar support, quick create dropdown for content workflows, and "Visit Site" external link.
- **Add 10 advanced UI/UX enhancements** based on modern admin dashboard patterns (Linear, Stripe, Vercel): command palette (⌘K), bulk actions with multi-select, saved views/custom filters, inline editing, real-time activity feed, advanced data visualization, widget-based customization, smart search, enhanced empty states, and contextual help system.
- Define how selected upstream template assets or copied source files from `https://github.com/nuxt-ui-templates/dashboard` may be used as an approved acceleration path, with raw references stored under a dedicated reference folder for maintainability.
- Require verification that the redesigned dashboard keeps CSR behavior, theme switching, and brand-color compliance intact.

## Capabilities

### New Capabilities
- `dashboard-admin-experience`: Provide a cohesive, template-inspired authenticated dashboard shell and page-system for Esperion admin workflows, including responsive navigation, shared page composition patterns, and Esperion brand-token compliance.

### Modified Capabilities
- None.

## Impact

- Dashboard layout and navigation in `frontend/app/layouts/dashboard.vue` and related shared dashboard UI components.
- Dashboard pages under `frontend/app/pages/dashboard/` including overview, content CRUD, analytics, sessions, API docs, and settings.
- Theme and color-token integration in `frontend/app.config.ts`, `frontend/app/assets/css/main.css`, and `frontend/tailwind.config.ts`.
- Reference assets or copied upstream template files stored in a dedicated folder under the frontend workspace.
- Verification scope for dashboard UX, responsiveness, dark/light theme behavior, and Esperion brand-color preservation.
