## ADDED Requirements

### Requirement: @nuxt/ui v4.5.1 Support
The system SHALL support @nuxt/ui version 4.5.1 with unified components and Reka UI integration.

#### Scenario: App config uses ui key
- **WHEN** the system loads app.config.ts
- **THEN** the configuration SHALL use "ui" key (not "uiPro")
- **AND** all Nuxt UI Pro components SHALL be available

#### Scenario: Components render with Esperion colors
- **WHEN** any Nuxt UI component renders
- **THEN** the primary color SHALL be #2B9EDB (Esperion sky blue)
- **AND** the Esperion Design System color palette SHALL be applied

#### Scenario: Dark mode transition works
- **WHEN** user toggles between light and dark mode
- **THEN** all Nuxt UI components SHALL transition smoothly
- **AND** the Esperion dark mode colors SHALL be applied (#0B1120 background)

#### Scenario: All pages load without UI errors
- **WHEN** any of the 27 pages loads
- **THEN** no console errors related to Nuxt UI SHALL appear
- **AND** all interactive components (buttons, modals, dropdowns) SHALL function

## MODIFIED Requirements

None - this is a new capability with only added requirements.

## REMOVED Requirements

None - this is a new capability.
