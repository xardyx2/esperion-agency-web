## ADDED Requirements

### Requirement: Hybrid bilingual approach for Indonesian
The system SHALL implement a hybrid content strategy for the Indonesian locale where professional/technical terms remain in English while descriptive content is translated.

#### Scenario: Service name retention
- **WHEN** displaying service names in Indonesian locale
- **THEN** the system SHALL keep them in English (Web Development, UI/UX Design, Digital Marketing)
- **AND** translate only the descriptive text

#### Scenario: Platform and technology names
- **WHEN** displaying platform or technology names
- **THEN** the system SHALL keep them in English (WordPress, Shopify, React, Google Analytics)
- **AND** these SHALL never be translated

#### Scenario: Industry acronyms
- **WHEN** displaying industry acronyms
- **THEN** the system SHALL keep them in English (SEO, PPC, CRM, API, SaaS)
- **AND** these SHALL be treated as proper nouns

#### Scenario: Navigation and CTAs
- **WHEN** displaying navigation menus or call-to-action buttons
- **THEN** the system SHALL keep them in English (Home, Services, Portfolio, Get Started)
- **AND** follow international agency conventions

#### Scenario: Page content translation
- **WHEN** displaying page descriptions and paragraphs
- **THEN** the system SHALL translate to Indonesian
- **AND** maintain the hybrid pattern with English service names

#### Scenario: Form labels and validation
- **WHEN** displaying form labels and validation messages
- **THEN** the system SHALL translate to Indonesian (Nama Lengkap, Email, Nomor Telepon)
- **AND** provide clear Indonesian error messages

### Requirement: English locale 100% English
The system SHALL ensure the English locale uses 100% English throughout.

#### Scenario: Full English content
- **WHEN** the user selects English locale
- **THEN** all content SHALL be in English
- **AND** there SHALL be no Indonesian text mixed in

### Requirement: Translation consistency across contexts
The system SHALL ensure service names are consistent across all contexts (footer, forms, filters, dashboard).

#### Scenario: Service name consistency check
- **WHEN** a service name appears anywhere in the UI
- **THEN** it SHALL use the same language version as defined in the strategy
- **AND** there SHALL be no variation (e.g., "UI/UX Design" vs "Desain UI/UX")

#### Scenario: Cross-page verification
- **WHEN** navigating between pages
- **THEN** service names SHALL remain consistent
- **AND** users SHALL not see different translations on different pages

## MODIFIED Requirements

### Requirement: Indonesian translation approach
**FROM**: Mixed translations with inconsistent service naming
**TO**: Hybrid approach with strategic English retention

#### Scenario: Service card display
- **WHEN** displaying a service card in Indonesian locale
- **THEN** the title SHALL remain in English (e.g., "Web Development")
- **AND** the description SHALL be in Indonesian (e.g., "Jasa Web Development profesional untuk bisnis Anda")

## REMOVED Requirements

None - this is a refinement of existing localization.
