## ADDED Requirements

### Requirement: Dark mode toggle
The system SHALL provide a toggle for switching between light and dark themes.

#### Scenario: Toggle displays
- **WHEN** dashboard header renders
- **THEN** theme toggle button displays (sun/moon icon)

#### Scenario: Toggle switches theme
- **WHEN** user clicks theme toggle
- **THEN** dashboard switches between light and dark mode

#### Scenario: Theme persists
- **WHEN** user refreshes page
- **THEN** selected theme persists across sessions

### Requirement: System preference detection
The system SHALL detect and respect user's system color scheme preference.

#### Scenario: System preference applied
- **WHEN** user has dark mode set at OS level
- **THEN** dashboard loads in dark mode by default

### Requirement: Color theme customization
The system SHALL use Esperion Design System colors in both light and dark modes.

#### Scenario: Light mode colors
- **WHEN** dashboard is in light mode
- **THEN** colors use Esperion palette: background #FAFCFF, text #102B4E, primary #2B9EDB

#### Scenario: Dark mode colors
- **WHEN** dashboard is in dark mode
- **THEN** colors use Esperion palette: background #0B1120, text #F8FAFC, primary #2B9EDB

#### Scenario: Nuxt UI integration
- **WHEN** theme changes
- **THEN** Nuxt UI components (buttons, cards, inputs) adapt to selected theme
