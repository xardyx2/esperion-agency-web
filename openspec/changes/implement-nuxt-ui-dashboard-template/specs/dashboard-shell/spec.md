## ADDED Requirements

### Requirement: Dashboard layout structure
The system SHALL provide a consistent dashboard layout with header, sidebar, and content areas following Nuxt UI Dashboard template patterns.

#### Scenario: Layout renders correctly
- **WHEN** user navigates to any dashboard page
- **THEN** the layout displays with header at top, sidebar on left, and content area on right

#### Scenario: Layout is responsive
- **WHEN** user views dashboard on mobile device
- **THEN** sidebar collapses into hamburger menu and content area takes full width

#### Scenario: Dark mode support
- **WHEN** user toggles dark mode or system preference is dark
- **THEN** layout colors switch to dark theme with Esperion color palette

### Requirement: Dashboard header component
The system SHALL provide a dashboard header with user profile, notifications button, and theme toggle.

#### Scenario: Header displays user info
- **WHEN** authenticated user views dashboard
- **THEN** header displays user name and avatar

#### Scenario: Header navigation works
- **WHEN** user clicks notification bell icon
- **THEN** notifications panel slides out from right

### Requirement: Dashboard sidebar component
The system SHALL provide a collapsible sidebar with navigation links to all dashboard sections.

#### Scenario: Sidebar navigation visible
- **WHEN** user views dashboard on desktop
- **THEN** sidebar displays navigation links: Dashboard, Articles, Works, Services, Users, Settings

#### Scenario: Sidebar collapses
- **WHEN** user clicks collapse button
- **THEN** sidebar shrinks to icon-only mode

#### Scenario: Active route highlighted
- **WHEN** user is on /dashboard/articles page
- **THEN** Articles link in sidebar is visually highlighted as active
