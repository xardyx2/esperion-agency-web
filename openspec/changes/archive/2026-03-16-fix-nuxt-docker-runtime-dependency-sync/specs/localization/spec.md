## ADDED Requirements

### Requirement: Active Locale Files SHALL Include Referenced Footer Settings Keys
The active locale files used by the frontend i18n runtime SHALL define all footer settings keys referenced by runtime-rendered components.

#### Scenario: Footer cookie settings key exists in Indonesian locale
- **WHEN** the frontend renders the footer under the Indonesian locale
- **THEN** the active Indonesian locale file SHALL provide a `footer.cookieSettings` translation key
- **AND** the runtime SHALL NOT emit a missing-key warning for that key

#### Scenario: Footer cookie settings key exists in English locale
- **WHEN** the frontend renders the footer under the English locale
- **THEN** the active English locale file SHALL provide a `footer.cookieSettings` translation key

### Requirement: Runtime Locale Source SHALL Be Unambiguous
The frontend localization setup SHALL make it clear which locale tree is authoritative for runtime translation keys.

#### Scenario: Duplicate locale trees do not cause runtime drift
- **WHEN** the repository contains multiple locale directories
- **THEN** the runtime configuration and maintenance workflow SHALL identify the authoritative locale source used by Nuxt
- **AND** newly added translation keys SHALL be maintained in that authoritative source
