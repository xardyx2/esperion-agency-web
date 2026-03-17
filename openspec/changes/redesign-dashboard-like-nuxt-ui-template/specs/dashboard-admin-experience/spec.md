## ADDED Requirements

### Requirement: Template-Inspired Authenticated Dashboard Shell
The authenticated Esperion dashboard SHALL provide a shared admin shell inspired by the Nuxt dashboard template, including a collapsible sidebar, a structured page header, and a dedicated content panel layout.

#### Scenario: Desktop dashboard shell is rendered consistently
- **WHEN** an authenticated user opens any primary dashboard route
- **THEN** the page SHALL render inside one shared dashboard shell with a persistent sidebar, a page-level header area, and a bounded content body

#### Scenario: Mobile dashboard shell remains usable
- **WHEN** an authenticated user opens the dashboard on a narrow viewport
- **THEN** the sidebar SHALL remain accessible through a mobile-friendly toggle or drawer interaction without blocking access to page content

### Requirement: Dashboard Navigation SHALL Use One Canonical Module Map
The dashboard shell SHALL expose the active admin modules from one canonical navigation source rather than relying on divergent sidebar, shortcut, or page-local link lists.

#### Scenario: Sidebar and shortcuts reflect the same module inventory
- **WHEN** a maintainer reviews the redesigned dashboard navigation
- **THEN** the shell SHALL expose a consistent set of primary admin destinations for the active dashboard modules

#### Scenario: Nested or secondary admin sections are discoverable
- **WHEN** a dashboard area contains related sub-sections such as settings-oriented pages
- **THEN** the shell SHALL present those sections through a structured secondary navigation or equivalent grouped interaction instead of ad hoc links

### Requirement: Dashboard Visuals SHALL Preserve Esperion Brand Tokens
The redesigned dashboard SHALL preserve Esperion brand identity by using the existing semantic design-token system and approved light/dark theme behavior instead of introducing a foreign template palette.

#### Scenario: Dashboard uses Esperion primary accent
- **WHEN** the redesigned shell and page components render interactive accents such as highlights, badges, active states, or primary actions
- **THEN** those accents SHALL resolve through Esperion's approved semantic tokens and primary color configuration

#### Scenario: Dashboard supports dark and light themes consistently
- **WHEN** a user toggles between light and dark mode in the redesigned dashboard
- **THEN** the shell and page components SHALL preserve readability, contrast, and hierarchy using the existing Esperion theme token model

### Requirement: Dashboard Pages SHALL Use Shared Composition Patterns
Dashboard pages SHALL use a common composition system for overview widgets, data-heavy screens, and edit forms so the admin experience feels coherent across modules.

#### Scenario: Overview and analytics pages use reusable panel patterns
- **WHEN** a dashboard page presents KPIs, charts, summaries, or status widgets
- **THEN** the page SHALL use shared card, toolbar, and content-panel patterns consistent with the dashboard shell

#### Scenario: CRUD pages use reusable admin patterns
- **WHEN** a dashboard page presents filters, tables, forms, or detail actions
- **THEN** the page SHALL use shared section headers, action areas, and content containers instead of isolated page-specific layout patterns

### Requirement: Template References SHALL Be Isolated From Production Source
Any copied upstream template assets or study materials used for the redesign SHALL live in a dedicated frontend reference directory and SHALL NOT be treated as production source by default.

#### Scenario: Upstream template files are stored locally for reference
- **WHEN** maintainers keep local copies of template files, screenshots, or extracted examples from the upstream Nuxt dashboard template
- **THEN** those materials SHALL be stored under a dedicated reference folder separate from the active application source tree

#### Scenario: Selected upstream structures are adapted into production code
- **WHEN** implementation reuses selected shell or page-structure ideas from the upstream template repository to accelerate delivery
- **THEN** the adapted production code SHALL align with Esperion branding, active module needs, and current runtime behavior instead of shipping upstream demo assumptions unchanged

#### Scenario: Production app avoids unresolved sample content
- **WHEN** the redesigned dashboard is reviewed for readiness
- **THEN** production routes and components SHALL NOT depend on leftover upstream demo branding, sample data, or placeholder template content

### Requirement: Dashboard Redesign SHALL Preserve Existing Runtime Model
The dashboard redesign SHALL preserve the existing authenticated runtime model, including client-rendered dashboard routes and integration with current auth and theme behavior.

#### Scenario: Dashboard remains client-rendered
- **WHEN** the redesigned dashboard routes are configured
- **THEN** the authenticated dashboard pages SHALL continue to use the established CSR rendering model for `/dashboard/**`

#### Scenario: Existing auth-aware shell actions still work
- **WHEN** an authenticated user uses shell-level actions such as theme switching, user menu access, or logout
- **THEN** the redesigned dashboard SHALL continue to integrate with the existing auth and UI state flows rather than replacing them with incompatible behavior
