## ADDED Requirements

### Requirement: Footer displays 3-state theme toggle
The footer SHALL display a theme toggle component with three states: Auto, Light, and Dark in the Contact Info column.

#### Scenario: User selects light mode
- **WHEN** user clicks "Light" option on theme toggle
- **THEN** the page renders in light theme and preference is saved to localStorage

#### Scenario: User selects dark mode
- **WHEN** user clicks "Dark" option on theme toggle
- **THEN** the page renders in dark theme and preference is saved to localStorage

#### Scenario: User selects auto mode
- **WHEN** user clicks "Auto" option on theme toggle
- **THEN** the page theme follows system preference and updates when system theme changes

#### Scenario: Theme preference persists across sessions
- **WHEN** user selects a theme preference and refreshes the browser
- **THEN** the selected theme preference is restored on page load

### Requirement: Footer displays language switcher
The footer SHALL display a language switcher component in the Contact Info column allowing users to switch between Indonesian (id) and English (en).

#### Scenario: User switches language from footer
- **WHEN** user clicks language switcher in footer
- **THEN** the page locale changes and content reloads in selected language

#### Scenario: Language preference persists
- **WHEN** user switches to Indonesian and navigates to another page
- **THEN** the new page loads in Indonesian locale

#### Scenario: Language switcher shows current selection
- **WHEN** user views the footer on an English page
- **THEN** the language switcher displays "EN" as active and "ID" as available option

### Requirement: Footer displays social media icons
The footer SHALL display social media icons for Instagram, Facebook, TikTok, LinkedIn, and X with proper brand-appropriate styling.

#### Scenario: Social icons render with correct branding
- **WHEN** user views the footer
- **THEN** all five social media icons display with brand-appropriate colors on hover

#### Scenario: Social icon links navigate correctly
- **WHEN** user clicks Instagram icon
- **THEN** browser opens Esperion Instagram profile in new tab

#### Scenario: Social icons display tooltips
- **WHEN** user hovers over LinkedIn icon
- **THEN** tooltip displays "LinkedIn" text

### Requirement: Footer controls layout structure
The footer SHALL organize controls in the Contact Info column with theme toggle above language switcher, followed by social media icons.

#### Scenario: Controls display in correct order
- **WHEN** user scrolls to footer
- **THEN** theme toggle appears first, then language switcher, then social icons

#### Scenario: Controls are accessible on mobile
- **WHEN** user views footer on mobile device (viewport < 768px)
- **THEN** all footer controls remain visible and tappable with minimum 44px touch targets
