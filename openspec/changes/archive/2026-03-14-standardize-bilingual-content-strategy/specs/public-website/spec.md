## ADDED Requirements

### Requirement: Indonesian Bilingual Content Strategy

The Indonesian (id) language version of the public website SHALL implement a hybrid bilingual strategy where technical and professional terms remain in English, while descriptive content is translated to Indonesian.

#### Scenario: Indonesian user views service offerings
- **WHEN** an Indonesian user navigates to the Services page
- **THEN** service names display in English (e.g., "Web Development", "UI/UX Design")
- **AND** service descriptions display in Indonesian

#### Scenario: Indonesian user views navigation
- **WHEN** an Indonesian user views the main navigation
- **THEN** navigation items display in English (e.g., "Home", "Services", "Portfolio", "Contact")
- **AND** aria labels and accessibility text display in Indonesian

#### Scenario: Indonesian user interacts with CTAs
- **WHEN** an Indonesian user sees call-to-action buttons
- **THEN** CTA text displays in English (e.g., "Get Started", "Contact Us", "Learn More")
- **AND** button functionality remains consistent with English version

#### Scenario: Indonesian user fills contact form
- **WHEN** an Indonesian user views the contact form
- **THEN** form labels display in Indonesian (e.g., "Nama Lengkap", "Email")
- **AND** service options in dropdown display in English (e.g., "Web Development", "Digital Marketing")

#### Scenario: Indonesian user reads page content
- **WHEN** an Indonesian user reads page descriptions and body content
- **THEN** all descriptive text displays in Indonesian
- **AND** technical terminology embedded in content remains in English

### Requirement: Content Consistency Across Contexts

The same content elements SHALL display consistently regardless of page location or context.

#### Scenario: Service name consistency
- **WHEN** "Web Development" service appears in footer
- **AND** "Web Development" service appears in contact form
- **AND** "Web Development" service appears in works filter
- **THEN** all instances display the identical text "Web Development"
- **AND** no variations like "Pengembangan Web" or "Web Dev" are used

#### Scenario: Navigation consistency
- **WHEN** "Services" appears in main navigation
- **AND** "Services" appears in footer quick links
- **AND** "Services" appears in breadcrumb
- **THEN** all instances display "Services" (English)
- **AND** no Indonesian translation like "Layanan" is used

### Requirement: Platform and Technology Names

Platform names, technology stack names, and industry-standard tools SHALL remain in English across all language versions.

#### Scenario: Platform names in Indonesian version
- **WHEN** an Indonesian user views platform/technology references
- **THEN** names like "WordPress", "Shopify", "React", "Next.js" remain in English
- **AND** no translations like "WordPers" or "Reaksi" are used

#### Scenario: Tool names in Indonesian version
- **WHEN** an Indonesian user sees references to analytics/marketing tools
- **THEN** names like "Google Analytics", "HubSpot", "Facebook Ads" remain in English
- **AND** tool names appear exactly as their official brand names

### Requirement: Technical Acronyms

Industry-standard acronyms SHALL remain in English without translation.

#### Scenario: Marketing acronyms
- **WHEN** an Indonesian user encounters marketing terminology
- **THEN** acronyms like "SEO", "PPC", "CRM", "B2B", "B2C" remain in English
- **AND** no expanded translations like "Optimasi Mesin Pencari" are used

#### Scenario: Technical acronyms
- **WHEN** an Indonesian user encounters technical terminology
- **THEN** acronyms like "API", "SaaS", "UI", "UX" remain in English
- **AND** no translations like "Antarmuka Pengguna" are used

### Requirement: English Version Unchanged

The English (en) language version SHALL remain 100% English with no changes required.

#### Scenario: English user experience
- **WHEN** a user views the English version
- **THEN** all content displays in English exactly as before
- **AND** no Indonesian terms appear in English version
- **AND** service names, navigation, and CTAs remain unchanged
