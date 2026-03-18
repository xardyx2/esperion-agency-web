## Purpose

Define the migration to @nuxt/ui v4.5.1 with proper configuration and Esperion Design System integration.

## Overview

This capability upgrades the UI framework to @nuxt/ui v4.5.1, replacing the previous UI configuration structure while maintaining visual consistency with the Esperion Design System.

## Requirements

### Requirement: @nuxt/ui v4.5.1 Support
The system SHALL support @nuxt/ui version 4.5.1 as the primary UI component library.

#### Scenario: Package installation
- **WHEN** dependencies are installed via npm
- **THEN** @nuxt/ui@4.5.1 SHALL be present in package.json and node_modules

#### Scenario: Module registration
- **WHEN** the application starts
- **THEN** @nuxt/ui SHALL be registered in nuxt.config.ts modules array without errors

### Requirement: App Config Uses "ui" Key
The system SHALL use the "ui" key in app.config.ts for UI configuration, not the deprecated "uiPro" key.

#### Scenario: App config structure
- **WHEN** reviewing app.config.ts
- **THEN** UI configuration SHALL be under the `ui` key, not `uiPro`

#### Scenario: No deprecation warnings
- **WHEN** the application starts in development mode
- **THEN** no console warnings about "uiPro is deprecated" SHALL appear

### Requirement: Component Rendering Integrity
All existing UI components SHALL render correctly with @nuxt/ui v4.5.1.

#### Scenario: Component visual verification
- **WHEN** any page containing UI components is loaded
- **THEN** all components SHALL render without visual regressions or missing styles

#### Scenario: Component functionality
- **WHEN** interactive UI components are used (buttons, forms, modals, etc.)
- **THEN** they SHALL respond to user interactions as expected without JavaScript errors

### Requirement: Esperion Design System Color Preservation
Esperion Design System colors SHALL be preserved and correctly applied across all UI components.

#### Scenario: Primary color application
- **WHEN** components use the primary color variant
- **THEN** Esperion primary color #2B9EDB SHALL be applied consistently

#### Scenario: Dark mode color consistency
- **WHEN** dark mode is active
- **THEN** all Esperion Design System colors SHALL maintain proper contrast and visual hierarchy

## Acceptance Criteria

- No uiPro deprecation warnings in console during app startup
- All 27 pages load without UI-related errors in browser console
- Components render with Esperion primary color #2B9EDB in both light and dark modes
- Dark mode transitions complete smoothly without visual glitches
- App config uses "ui" key for all UI configuration

## Implementation Notes

### Key Files
- `frontend/nuxt.config.ts` - Module registration
- `frontend/app.config.ts` - UI configuration with "ui" key
- `frontend/app/assets/css/main.css` - Esperion Design System tokens

### Migration Considerations
- Replace all `uiPro` references with `ui` in configuration files
- Verify component API compatibility with v4.5.1
- Test all 27 pages for visual and functional integrity
