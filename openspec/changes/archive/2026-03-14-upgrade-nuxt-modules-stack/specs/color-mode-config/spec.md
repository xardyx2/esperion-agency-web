## ADDED Requirements

None - this capability modifies existing requirements.

## MODIFIED Requirements

### Requirement: Color Mode Configuration
The color mode configuration SHALL work without deprecated options from v3, using only v4-compatible settings.

#### Scenario: Configuration without hid option
- **WHEN** the system loads nuxt.config.ts
- **THEN** the colorMode configuration SHALL NOT include "hid" option
- **AND** no deprecation warning SHALL appear

#### Scenario: Configuration without classSuffix
- **WHEN** the system loads nuxt.config.ts
- **THEN** the colorMode configuration SHALL NOT rely on default classSuffix
- **AND** explicit classSuffix MAY be set if needed

#### Scenario: System color mode detection
- **WHEN** user first visits the site
- **THEN** the system SHALL detect system color mode preference
- **AND** apply light or dark mode accordingly

#### Scenario: Color mode toggle works
- **WHEN** user toggles color mode
- **THEN** the entire UI SHALL switch between light and dark
- **AND** preference SHALL be persisted (cookie or localStorage)
- **AND** Esperion Design System colors SHALL apply correctly

#### Scenario: Nuxt 3+ compatibility only
- **WHEN** the application runs
- **THEN** color mode SHALL work with Nuxt 3.x and 4.x
- **AND** Nuxt 2/Bridge support is not required

## REMOVED Requirements

### Requirement: colorMode hid option
**Reason**: Option removed in @nuxtjs/color-mode v4
**Migration**: Remove "hid" from colorMode configuration in nuxt.config.ts

### Requirement: colorMode classSuffix default
**Reason**: Default removed in @nuxtjs/color-mode v4
**Migration**: Either omit classSuffix or set explicit value if needed
