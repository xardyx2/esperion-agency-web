## ADDED Requirements

None - this capability modifies existing requirements.

## MODIFIED Requirements

### Requirement: i18n Configuration Structure
The i18n configuration SHALL work without deprecated options from v9, using only v10-compatible settings.

#### Scenario: Configuration without lazy option
- **WHEN** the system loads nuxt.config.ts
- **THEN** the i18n configuration SHALL NOT include "lazy" option
- **AND** lazy loading SHALL still occur (now default behavior)

#### Scenario: Configuration without bundle.optimizeTranslationDirective
- **WHEN** the system loads nuxt.config.ts
- **THEN** the i18n configuration SHALL NOT include "bundle.optimizeTranslationDirective"
- **AND** no deprecation warning SHALL appear

#### Scenario: hmr option renamed
- **WHEN** hot module replacement is configured
- **THEN** "experimental.hmr" SHALL be renamed to "hmr"
- **AND** HMR SHALL work for translation files

#### Scenario: Indonesian and English support
- **WHEN** the application initializes
- **THEN** the system SHALL support Indonesian (id) and English (en) locales
- **AND** the default locale SHALL be Indonesian

#### Scenario: Language switching
- **WHEN** user switches from /id/ to /en/ route
- **THEN** all content SHALL display in English
- **AND** URL prefix SHALL change correctly

#### Scenario: Browser language detection
- **WHEN** user visits root path
- **THEN** the system SHALL detect browser language
- **AND** redirect to appropriate locale (/id/ or /en/)
- **AND** use cookie "i18n_redirected" for persistence

## REMOVED Requirements

### Requirement: i18n lazy option
**Reason**: Option removed in @nuxtjs/i18n v10, now default behavior
**Migration**: Remove "lazy: true" from nuxt.config.ts

### Requirement: bundle.optimizeTranslationDirective
**Reason**: Option removed in @nuxtjs/i18n v10
**Migration**: Remove "bundle.optimizeTranslationDirective" from nuxt.config.ts
