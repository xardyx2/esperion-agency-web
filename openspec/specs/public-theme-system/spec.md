## Purpose

Define and enforce a single canonical public theme system with valid semantic tokens and one authoritative mode controller.

## Overview

The theme system manages dark/light mode switching using Nuxt Color Mode pattern with CSS variables and class-based theming.

## Requirements

### Requirement: Canonical Public Theme Token Set
The system SHALL define one canonical public theme token set using the `--es-*` semantic palette, with light and dark token pairs documented and preserved as the only supported public palette.

#### Scenario: Light mode token inventory
- **WHEN** maintainers review the public theme contract
- **THEN** light mode SHALL be defined by the canonical `--es-*` tokens for background, surface, text, border, accent, and semantic states

#### Scenario: Dark mode token inventory
- **WHEN** maintainers review the public theme contract
- **THEN** dark mode SHALL be defined by the canonical `--es-*-dark` token pairs for background, surface, text, border, accent, and semantic states

### Requirement: Legacy Token Migration Policy
The system SHALL treat the legacy `esperion-*` token family as deprecated for public-page theming and SHALL require each legacy token to be either migrated to the canonical `es-*` vocabulary or removed after compatibility is no longer needed.

#### Scenario: Legacy token found in public implementation
- **WHEN** a public page or shared public component still references an `esperion-*` token
- **THEN** the token SHALL be classified as either a temporary migration alias or a removal candidate

#### Scenario: Undefined token found in public implementation
- **WHEN** a public page references a semantic token that is not part of the canonical inventory
- **THEN** the token SHALL be explicitly defined in the canonical set or replaced with a valid canonical token before the change is considered complete

### Requirement: Single Public Theme Controller
The system SHALL use one authoritative public theme controller for mode state, class application, and persistence.

#### Scenario: Public theme toggle changes mode
- **WHEN** a user toggles dark/light mode from the public navigation
- **THEN** the authoritative theme controller SHALL update the active mode and persist the preference without relying on a second independent theme owner

#### Scenario: Secondary theme state exists
- **WHEN** a second theme store or controller is discovered in the public theme path
- **THEN** it SHALL be removed from authority or refactored to consume the authoritative mode instead of owning a separate public state

### Requirement: Public Theme Utilities Resolve Canonical Tokens
The system SHALL guarantee that the public `es-*` theme classes used in templates resolve to the canonical semantic palette in both light and dark mode.

#### Scenario: Public page uses semantic utility classes
- **WHEN** a public page uses `bg-es-*`, `text-es-*`, or `border-es-*` classes with dark-mode variants
- **THEN** those classes SHALL resolve to valid canonical tokens in the generated frontend styling output

#### Scenario: User changes theme mode
- **WHEN** the active mode changes from light to dark or dark to light
- **THEN** public pages SHALL visibly switch their theme colors according to the canonical palette

### Requirement: System Preference Detection
The system SHALL detect the user's system preference using the `prefers-color-scheme: dark` media query and apply the corresponding theme mode when no user preference is stored.

#### Scenario: System preference detection active
- **WHEN** a user visits the site for the first time without a stored preference
- **THEN** the system SHALL check `window.matchMedia('(prefers-color-scheme: dark)')` and apply the matching theme

### Requirement: User Preference Persistence
The system SHALL persist the user's theme preference in localStorage and restore it on subsequent visits.

#### Scenario: Preference stored on toggle
- **WHEN** a user toggles the theme mode
- **THEN** the preference SHALL be stored under the key `nuxt-color-mode`

#### Scenario: Preference values
- **WHEN** reading the stored preference
- **THEN** valid values SHALL be `system`, `light`, or `dark`, with `system` as the fallback

### Requirement: CSS Variable-Based Theming
The system SHALL use CSS variables for theme tokens, enabling instantaneous theme switches without JavaScript re-renders.

#### Scenario: Light mode CSS variables
- **WHEN** light mode is active (default)
- **THEN** the `:root` element SHALL define:
  - `--es-bg: #FAFCFF`
  - `--es-text: #102B4E`
  - `--es-text-secondary: #475569`
  - `--es-border: #E2E8F0`
  - `--es-accent-primary: #2B9EDB`

#### Scenario: Dark mode CSS variables
- **WHEN** dark mode is active
- **THEN** the `:root.dark` selector SHALL define:
  - `--es-bg: #0B1120`
  - `--es-text: #F8FAFC`
  - `--es-text-secondary: #94A3B8`
  - `--es-border: #1E293B`
  - `--es-accent-primary: #2B9EDB`

### Requirement: Smooth Theme Transitions
The system SHALL provide smooth visual transitions when switching between theme modes.

#### Scenario: Background transition
- **WHEN** the theme mode changes
- **THEN** the body background-color SHALL transition smoothly over 0.3 seconds

### Requirement: SSR and Hydration Support
The system SHALL support server-side rendering with proper class application to prevent flash of unstyled content (FOUC).

#### Scenario: Pre-hydration class application
- **WHEN** the page is rendered on the server
- **THEN** the appropriate theme class (`.dark`, `.light`, or `.system`) SHALL be applied to the `<html>` element before hydration

#### Scenario: No FOUC on page load
- **WHEN** a user loads a page
- **THEN** the correct theme SHALL be visible immediately without a flash of incorrect colors

### Requirement: Keyboard Accessibility
The system SHALL ensure the theme toggle is fully keyboard accessible.

#### Scenario: Toggle focusable
- **WHEN** a user navigates using keyboard
- **THEN** the theme toggle SHALL be reachable via Tab key and activatable via Enter or Space

## Implementation Notes

### Key Files
- `frontend/app/composables/useTheme.ts` - Theme state management
- `frontend/app/assets/css/main.css` - CSS variables and transitions
- `frontend/app/app.vue` - Initial class application before hydration

### Waterfall Logic
1. Check `localStorage.getItem('nuxt-color-mode')` - if exists, use it
2. If not, check `window.matchMedia('(prefers-color-scheme: dark)').matches`
3. Apply `.dark` or `.light` class to `<html>` element
4. Update CSS variables via class selector

## Acceptance Criteria
- Dark mode toggles without JS re-renders (CSS class change only)
- Transition completes smoothly over 0.3s
- No console errors on theme change
- Works identically on client and server renders
- User preference persists across page refreshes
