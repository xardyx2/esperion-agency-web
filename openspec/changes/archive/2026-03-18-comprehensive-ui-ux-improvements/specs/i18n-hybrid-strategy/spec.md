## ADDED Requirements

### Requirement: English locale provides full translation
The English locale SHALL provide 100% translated content for all user-facing text including navigation, footers, buttons, labels, and page content.

#### Scenario: User views site in English
- **WHEN** user switches locale to English
- **THEN** all visible text displays in English with no untranslated content

#### Scenario: User navigates English pages
- **WHEN** user browses multiple pages in English locale
- **THEN** all page titles, headings, body content, and UI elements remain in English

### Requirement: Indonesian locale uses hybrid translation strategy
The Indonesian locale SHALL use a hybrid approach where descriptions and explanatory content are in Indonesian while service names, technical terms, and brand names remain in English.

#### Scenario: User views service descriptions in Indonesian
- **WHEN** user switches locale to Indonesian on service pages
- **THEN** service descriptions display in Indonesian while service titles remain in English

#### Scenario: User views technical content in Indonesian
- **WHEN** user views technical documentation or feature lists in Indonesian locale
- **THEN** explanatory text is in Indonesian while technical terms like "API", "SEO", "UI/UX" remain in English

#### Scenario: User views brand and company names in Indonesian
- **WHEN** user views any page in Indonesian locale
- **THEN** brand names (Esperion, social media platform names) remain in English

### Requirement: i18n configuration supports both locales
The application SHALL configure @nuxtjs/i18n with Indonesian (id) and English (en) locales with proper language codes and default locale settings.

#### Scenario: User accesses Indonesian locale via URL
- **WHEN** user navigates to /id/... paths
- **THEN** content renders in Indonesian locale

#### Scenario: User accesses English locale via URL
- **WHEN** user navigates to /en/... paths
- **THEN** content renders in English locale

#### Scenario: Default locale loads correctly
- **WHEN** user visits root domain without locale prefix
- **THEN** default locale (Indonesian) loads automatically

### Requirement: Language switcher integrates with i18n system
The language switcher component SHALL integrate with @nuxtjs/i18n to enable seamless locale switching while preserving current page route.

#### Scenario: User switches from Indonesian to English
- **WHEN** user clicks language switcher from ID to EN on /id/about page
- **THEN** browser navigates to /en/about with all content translated

#### Scenario: User switches from English to Indonesian
- **WHEN** user clicks language switcher from EN to ID on /en/services page
- **THEN** browser navigates to /id/services with hybrid translation applied

### Requirement: SEO metadata translates per locale
Page SEO metadata including title, description, and keywords SHALL translate according to current locale.

#### Scenario: User shares English page on social media
- **WHEN** page is in English locale
- **THEN** Open Graph title and description display in English

#### Scenario: Search engine indexes Indonesian page
- **WHEN** page is in Indonesian locale
- **THEN** meta title and description use Indonesian text with English technical terms per hybrid strategy

### Requirement: Form validation messages translate
Form validation error messages SHALL display in the current locale language.

#### Scenario: User submits invalid form in English
- **WHEN** user triggers validation error on English locale
- **THEN** error messages display in English

#### Scenario: User submits invalid form in Indonesian
- **WHEN** user triggers validation error on Indonesian locale
- **THEN** error messages display in Indonesian

### Requirement: Date and number formats adapt to locale
Date displays and number formatting SHALL adapt to locale conventions (Indonesian: DD/MM/YYYY, English: configurable).

#### Scenario: User views dates in Indonesian locale
- **WHEN** user views article publish dates or project completion dates in Indonesian
- **THEN** dates display in DD/MM/YYYY format

#### Scenario: User views dates in English locale
- **WHEN** user views dates in English locale
- **THEN** dates display in locale-appropriate format (e.g., MM/DD/YYYY or YYYY-MM-DD)
