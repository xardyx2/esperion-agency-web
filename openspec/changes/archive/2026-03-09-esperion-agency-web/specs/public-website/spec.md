## ADDED Requirements

### Requirement: Public Website ISR Rendering
The system SHALL render all public-facing pages using Incremental Static Regeneration (ISR) for optimal SEO and performance.

#### Scenario: Home page static generation
- **WHEN** a user requests the home page
- **THEN** the page SHALL be served as pre-rendered static HTML with revalidation every 60 seconds

#### Scenario: Our Works page static generation
- **WHEN** a user requests the works page
- **THEN** the page SHALL be served as pre-rendered static HTML with revalidation every 60 seconds

#### Scenario: Our Services page static generation
- **WHEN** a user requests the services page
- **THEN** the page SHALL be served as pre-rendered static HTML with revalidation every 60 seconds

#### Scenario: Articles page static generation
- **WHEN** a user requests the articles listing page
- **THEN** the page SHALL be served as pre-rendered static HTML with revalidation every 60 seconds

#### Scenario: About Us page static generation
- **WHEN** a user requests the about page
- **THEN** the page SHALL be served as pre-rendered static HTML with revalidation every 60 seconds

#### Scenario: Contact Us page static generation
- **WHEN** a user requests the contact page
- **THEN** the page SHALL be served as pre-rendered static HTML without caching for form submissions

### Requirement: Home Page Sections
The home page SHALL contain exactly 7 sections as specified in the requirements.

#### Scenario: Section 1 - Banner Slider
- **WHEN** user loads the home page
- **THEN** a banner slider with 5 slides SHALL be displayed at the top

#### Scenario: Section 2 - Who Are We
- **WHEN** user scrolls to section 2
- **THEN** a two-column layout with text (left) and image (right) SHALL be displayed

#### Scenario: Section 3 - Our Services Grid
- **WHEN** user scrolls to section 3
- **THEN** a 3-column x 2-row grid of service cards with images, titles, and descriptions SHALL be displayed
- **AND** clicking a card SHALL navigate to the service detail page

#### Scenario: Section 4 - Our Client Stats and Logos
- **WHEN** user scrolls to section 4
- **THEN** counting animations (10+ clients, 30+ campaigns) SHALL be displayed
- **AND** two carousels (7 logos each, left and right animation) SHALL display client logos

#### Scenario: Section 5 - Featured Works Slider
- **WHEN** user scrolls to section 5
- **THEN** a slider displaying maximum 5 work cards SHALL be shown
- **AND** each card SHALL have 2 columns (image left, content right) with metrics animations

#### Scenario: Section 6 - Articles Carousel
- **WHEN** user scrolls to section 6
- **THEN** a carousel displaying maximum 6 articles (3 visible at a time) SHALL be shown
- **AND** each article card SHALL have image, title, category, short description, and Read link
- **AND** a "See More" button SHALL navigate to the Articles page

#### Scenario: Section 7 - Call to Action
- **WHEN** user scrolls to section 7
- **THEN** an attractive quote with CTA button SHALL be displayed
- **AND** clicking the CTA SHALL navigate to the Contact Us page

### Requirement: Dark Mode Toggle
The system SHALL provide a light/dark mode toggle accessible from the navigation bar.

#### Scenario: Toggle light mode
- **WHEN** user clicks the theme toggle while in dark mode
- **THEN** the application SHALL switch to light mode using Esperion light color palette

#### Scenario: Toggle dark mode
- **WHEN** user clicks the theme toggle while in light mode
- **THEN** the application SHALL switch to dark mode using Esperion dark color palette

#### Scenario: Persist theme preference
- **WHEN** user selects a theme preference
- **THEN** the preference SHALL be persisted and restored on subsequent visits

### Requirement: Navigation Bar
The navigation bar SHALL be present on all public pages with consistent structure.

#### Scenario: Display navigation links
- **WHEN** user views any public page
- **THEN** the navbar SHALL display links: Home, Our Works, Our Service, Articles, About Us

#### Scenario: Display action buttons
- **WHEN** user views any public page
- **THEN** the navbar SHALL display theme toggle and "Contact Us" button at the far right

#### Scenario: Active page indication
- **WHEN** user is on a specific page
- **THEN** the corresponding navigation link SHALL be highlighted as active

### Requirement: Footer
The footer SHALL be present on all public pages with 4 columns.

#### Scenario: Column 1 - Company Info
- **WHEN** user views the footer
- **THEN** column 1 SHALL display company logo and short description

#### Scenario: Column 2 - Social Media
- **WHEN** user views the footer
- **THEN** column 2 SHALL display links to Instagram, Facebook, LinkedIn, TikTok, and X

#### Scenario: Column 3 - Contact Info
- **WHEN** user views the footer
- **THEN** column 3 SHALL display address, WhatsApp number, and email

#### Scenario: Column 4 - Quick Links
- **WHEN** user views the footer
- **THEN** column 4 SHALL display quick navigation links

### Requirement: Esperion Design System Compliance
All public pages SHALL strictly adhere to the Esperion Design System.

#### Scenario: Semantic color usage
- **WHEN** styling any component
- **THEN** semantic color classes (e.g., bg-esperion-light-bg) SHALL be used instead of hex codes

#### Scenario: 60-30-10 color distribution
- **WHEN** designing any page section
- **THEN** the 60-30-10 rule SHALL be applied (60% background, 30% surface/secondary, 10% accent)

#### Scenario: No hardcoded colors
- **WHEN** reviewing Vue templates
- **THEN** no hardcoded hex color values SHALL be present