# Client Showcase Specification

## Purpose

This specification defines the client showcase capabilities for the Esperion agency web platform, including client stats display, logo carousels, and testimonial management.

## Requirements

### Requirement: Client Stats Section - Home Page
The system SHALL display client statistics with counting animations on the home page section 4.

#### Scenario: Stats display
- **WHEN** visitor scrolls to section 4 on home page
- **THEN** two stat counters SHALL be displayed:
  - "10+ Clients" (or actual count)
  - "30+ Campaigns" (or actual count)

#### Scenario: Counting animation
- **WHEN** the stats section comes into viewport
- **THEN** the numbers SHALL animate from 0 to final value
- **AND** the animation SHALL use VueUse useCountDown or similar
- **AND** animation duration SHALL be 2 seconds

#### Scenario: Trigger on scroll
- **WHEN** visitor scrolls to the section
- **THEN** the counting animation SHALL trigger once
- **AND** the animation SHALL NOT replay on subsequent scrolls

### Requirement: Client Logos Carousel - Home Page
The system SHALL display two client logo carousels on the home page section 4.

#### Scenario: Dual carousel layout
- **WHEN** visitor views the client logos section
- **THEN** two rows of carousels SHALL be displayed:
  - Top row: 7 logos animating to the left
  - Bottom row: 7 logos animating to the right

#### Scenario: Left animation
- **WHEN** the top carousel loads
- **THEN** logos SHALL continuously scroll to the left
- **AND** the animation SHALL be smooth and infinite
- **AND** animation speed SHALL be 30 seconds per cycle

#### Scenario: Right animation
- **WHEN** the bottom carousel loads
- **THEN** logos SHALL continuously scroll to the right
- **AND** the animation SHALL be smooth and infinite
- **AND** animation speed SHALL be 30 seconds per cycle

#### Scenario: Logo display
- **WHEN** visitor views a logo
- **THEN** the logo SHALL be displayed in grayscale by default
- **AND** on hover, the logo SHALL transition to full color

#### Scenario: Responsive carousel
- **WHEN** viewport width is less than 768px
- **THEN** the carousel SHALL show 3 logos at a time
- **WHEN** viewport width is between 768px and 1024px
- **THEN** the carousel SHALL show 5 logos at a time
- **WHEN** viewport width is greater than 1024px
- **THEN** the carousel SHALL show 7 logos at a time

#### Scenario: Pause on hover
- **WHEN** visitor hovers over a carousel
- **THEN** the animation SHALL pause
- **AND** resume when hover ends

### Requirement: Client Logos Management - Dashboard
The system SHALL provide a dashboard interface for managing client logos.

#### Scenario: View all clients
- **WHEN** admin navigates to Dashboard > Clients
- **THEN** a list of all clients SHALL be displayed
- **AND** each row SHALL show: name, logo, featured status, actions

#### Scenario: Add new client
- **WHEN** admin clicks "Add New Client"
- **THEN** a form SHALL open with fields:
  - Name (required)
  - Logo upload (required)
  - Testimonial (optional)
  - Website URL (optional)
  - Featured toggle
  - Display order (number)

#### Scenario: Upload client logo
- **WHEN** admin uploads a logo
- **THEN** the image SHALL be stored in local storage
- **AND** a preview SHALL be displayed
- **AND** the logo SHALL be auto-optimized for web

#### Scenario: Edit existing client
- **WHEN** admin clicks "Edit" on a client
- **THEN** the client form SHALL load with existing data
- **AND** admin SHALL be able to modify all fields

#### Scenario: Delete client
- **WHEN** admin clicks "Delete" on a client
- **THEN** a confirmation dialog SHALL appear
- **AND** confirming SHALL permanently delete the client and logo

#### Scenario: Toggle featured status
- **WHEN** admin toggles the "Featured" switch
- **THEN** the client SHALL be marked as featured
- **AND** featured clients SHALL appear in the home page carousel

#### Scenario: Reorder clients
- **WHEN** admin changes the display order number
- **THEN** clients SHALL be sorted by this order
- **AND** the carousels SHALL reflect the new order

### Requirement: Client Schema Validation
The system SHALL enforce strict schema validation for clients.

#### Scenario: Name validation
- **WHEN** client is saved
- **THEN** name SHALL be required, max 100 characters

#### Scenario: Logo validation
- **WHEN** client is saved with a logo
- **THEN** logo SHALL be required for featured clients
- **AND** only image files (svg, png, webp, jpg) SHALL be accepted
- **AND** maximum file size SHALL be 1MB
- **AND** minimum dimension SHALL be 100x100 pixels

#### Scenario: Testimonial validation
- **WHEN** client is saved with a testimonial
- **THEN** testimonial SHALL be optional
- **AND** maximum length SHALL be 500 characters

#### Scenario: Website URL validation
- **WHEN** client is saved with a website URL
- **THEN** URL SHALL be optional
- **AND** SHALL be validated as a proper URL format

### Requirement: Client Stats Configuration
The system SHALL allow configuration of client statistics.

#### Scenario: View stats settings
- **WHEN** admin navigates to Dashboard > Settings > Client Stats
- **THEN** the stats configuration form SHALL be displayed

#### Scenario: Update client count
- **WHEN** admin updates the client count
- **THEN** the displayed count SHALL be updated
- **AND** the home page SHALL reflect the new count after cache revalidation

#### Scenario: Update campaign count
- **WHEN** admin updates the campaign count
- **THEN** the displayed count SHALL be updated
- **AND** the home page SHALL reflect the new count after cache revalidation

#### Scenario: Auto-count from database
- **WHEN** admin enables auto-count
- **THEN** the stats SHALL be calculated from actual database records
- **AND** manual overrides SHALL be disabled

### Requirement: Client Testimonials
The system SHALL support optional testimonials for clients.

#### Scenario: Add testimonial
- **WHEN** admin adds a testimonial to a client
- **THEN** the testimonial SHALL be stored with the client record
- **AND** SHALL be available for display on demand

#### Scenario: Display testimonial (future)
- **WHEN** a testimonial display feature is implemented
- **THEN** testimonials SHALL be shown on a dedicated section or page
- **AND** SHALL include client name and logo

### Requirement: Client API Endpoints
The system SHALL provide RESTful API endpoints for clients.

#### Scenario: GET /api/clients
- **WHEN** a GET request is made to /api/clients
- **THEN** all featured clients SHALL be returned
- **AND** results SHALL be ordered by display_order

#### Scenario: GET /api/clients/stats
- **WHEN** a GET request is made to /api/clients/stats
- **THEN** client statistics SHALL be returned:
  - total_clients count
  - total_campaigns count

#### Scenario: GET /api/clients/logos
- **WHEN** a GET request is made to /api/clients/logos
- **THEN** only client logos (id, name, logo_url) SHALL be returned
- **AND** results SHALL be split into two arrays for dual carousel

#### Scenario: POST /api/clients (auth required)
- **WHEN** an authenticated admin makes a POST request
- **THEN** a new client SHALL be created
- **AND** the created client SHALL be returned

#### Scenario: PUT /api/clients/:id (auth required)
- **WHEN** an authenticated admin makes a PUT request
- **THEN** the client SHALL be updated
- **AND** the updated client SHALL be returned

#### Scenario: DELETE /api/clients/:id (auth required)
- **WHEN** an authenticated admin makes a DELETE request
- **THEN** the client SHALL be deleted
- **AND** 204 No Content SHALL be returned

### Requirement: Carousel Animation Performance
The carousels SHALL be optimized for performance.

#### Scenario: Smooth animation
- **WHEN** carousels are animating
- **THEN** animation SHALL use CSS transforms (not left/top properties)
- **AND** animation SHALL run at 60fps
- **AND** no jank or stuttering SHALL occur

#### Scenario: Lazy loading
- **WHEN** the carousel section is not in viewport
- **THEN** logo images SHALL NOT be loaded
- **AND** images SHALL load when section approaches viewport

#### Scenario: Image optimization
- **WHEN** logos are uploaded
- **THEN** logos SHALL be automatically optimized
- **AND** WebP format SHALL be preferred
- **AND** appropriate sizes SHALL be generated for responsive display

### Requirement: Accessibility for Client Showcase
The client showcase section SHALL be accessible.

#### Scenario: Screen reader support
- **WHEN** a screen reader is used
- **THEN** the stats section SHALL be announced as "statistics"
- **AND** each logo SHALL have alt text with client name

#### Scenario: Keyboard navigation
- **WHEN** user navigates with keyboard
- **THEN** carousel controls (if any) SHALL be focusable
- **AND** focus SHALL be visible

#### Scenario: Reduced motion
- **WHEN** user has prefers-reduced-motion enabled
- **THEN** counting animation SHALL be instant (no animation)
- **AND** carousel animation SHALL be disabled or significantly slowed
