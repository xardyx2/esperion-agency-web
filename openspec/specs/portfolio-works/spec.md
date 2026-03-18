# Portfolio Works Specification

## Purpose

This specification defines the portfolio works capabilities for the Esperion agency web platform, including works display, filtering, and management.

## Requirements

### Requirement: Our Works Page - Public View
The system SHALL display a portfolio page showcasing completed works on the public website.

#### Scenario: Banner section display
- **WHEN** visitor navigates to /our-works
- **THEN** a banner section with page title and description SHALL be displayed at the top

#### Scenario: Filter by service
- **WHEN** visitor clicks a service filter button
- **THEN** only works matching that service SHALL be displayed
- **AND** the active filter SHALL be visually highlighted

#### Scenario: Filter by platform
- **WHEN** visitor selects a platform from the dropdown
- **THEN** only works matching that platform SHALL be displayed

#### Scenario: Combined filters
- **WHEN** visitor selects both service and platform filters
- **THEN** only works matching both criteria SHALL be displayed

#### Scenario: Clear filters
- **WHEN** visitor clicks "Clear All" button
- **THEN** all filters SHALL be reset
- **AND** all works SHALL be displayed

#### Scenario: Works grid layout
- **WHEN** visitor views the works section
- **THEN** works SHALL be displayed in a 2-column grid
- **AND** 3 rows SHALL be visible per page (6 works total)

#### Scenario: Work card content
- **WHEN** visitor views a work card
- **THEN** the card SHALL display:
  - Work image
  - Client name
  - Service type
  - Platform
  - Brief description
  - Key metrics (if available)

#### Scenario: Pagination
- **WHEN** there are more than 6 works
- **THEN** a "See More" button SHALL be displayed at the bottom
- **AND** clicking it SHALL load the next page of works

#### Scenario: Empty filter result
- **WHEN** no works match the selected filters
- **THEN** a message "No works found for this selection" SHALL be displayed

### Requirement: Work Detail Page - Public View
The system SHALL display detailed information for each work project.

#### Scenario: Navigate to detail
- **WHEN** visitor clicks on a work card
- **THEN** the work detail page SHALL open at /works/:slug

#### Scenario: Detail page content
- **WHEN** visitor views the work detail page
- **THEN** the page SHALL display:
  - Full-size hero image
  - Client name
  - Service category
  - Platform(s) used
  - Project description
  - Challenge/Solution/Result sections
  - Metrics achieved (with animations)
  - Related works section

#### Scenario: Metrics display
- **WHEN** visitor scrolls to the metrics section
- **THEN** counting animations SHALL play for each metric
- **AND** metrics SHALL include: Purchase, ROAS, Followers, Reach (as applicable)

#### Scenario: Related works
- **WHEN** visitor views the related works section
- **THEN** up to 4 related works SHALL be displayed
- **AND** clicking a related work SHALL navigate to that work's detail page

### Requirement: Our Works - Home Page Section
The system SHALL display featured works on the home page section 5.

#### Scenario: Featured works slider
- **WHEN** visitor scrolls to section 5 on home page
- **THEN** a slider with maximum 5 featured works SHALL be displayed

#### Scenario: Featured work card layout
- **WHEN** visitor views a featured work card
- **THEN** the card SHALL have 2 columns:
  - Left: Work image
  - Right: Client name, service type, platform, description, 4 metrics with animations

#### Scenario: Slider navigation
- **WHEN** visitor clicks next/prev buttons
- **THEN** the slider SHALL move to the next/previous work
- **AND** the slider SHALL loop from last to first

#### Scenario: Auto-play slider
- **WHEN** visitor does not interact with the slider
- **THEN** the slider SHALL auto-advance every 5 seconds
- **AND** auto-play SHALL pause on hover

### Requirement: Works Management - Dashboard
The system SHALL provide a dashboard interface for managing portfolio works.

#### Scenario: View all works
- **WHEN** admin navigates to Dashboard > Works
- **THEN** a table of all works SHALL be displayed
- **AND** each row SHALL show: title, client, service, platform, featured status, actions

#### Scenario: Create new work
- **WHEN** admin clicks "Add New Work"
- **THEN** a form SHALL open with fields:
  - Title (required)
  - Slug (auto-generated)
  - Client name (required)
  - Service (dropdown)
  - Platform (dropdown)
  - Description (rich text)
  - Images (multiple upload)
  - Metrics (repeatable fields)
  - Featured toggle

#### Scenario: Edit existing work
- **WHEN** admin clicks "Edit" on a work
- **THEN** the work form SHALL load with existing data
- **AND** admin SHALL be able to modify all fields

#### Scenario: Delete work
- **WHEN** admin clicks "Delete" on a work
- **THEN** a confirmation dialog SHALL appear
- **AND** confirming SHALL permanently delete the work

#### Scenario: Toggle featured status
- **WHEN** admin toggles the "Featured" switch
- **THEN** the work SHALL be marked as featured or not
- **AND** featured works SHALL appear in the home page slider

#### Scenario: Reorder featured works
- **WHEN** admin drags and drops featured works
- **THEN** the order SHALL be saved
- **AND** the home page slider SHALL reflect the new order

### Requirement: Work Schema Validation
The system SHALL enforce strict schema validation for works.

#### Scenario: Title validation
- **WHEN** work is saved
- **THEN** title SHALL be required, max 200 characters

#### Scenario: Slug validation
- **WHEN** work is saved
- **THEN** slug SHALL be required, unique, URL-safe format

#### Scenario: Client name validation
- **WHEN** work is saved
- **THEN** client name SHALL be required, max 100 characters

#### Scenario: Service validation
- **WHEN** work is saved
- **THEN** service SHALL be required
- **AND** SHALL be one of the predefined services

#### Scenario: Platform validation
- **WHEN** work is saved
- **THEN** platform SHALL be required
- **AND** SHALL be one of: Shopee, Tokopedia, Instagram, TikTok, Facebook, Google, Other

#### Scenario: Metrics validation
- **WHEN** work is saved with metrics
- **THEN** each metric SHALL have:
  - Label (required, e.g., "Purchase", "ROAS")
  - Value (required, number)
  - Suffix (optional, e.g., "+", "%", "K")

### Requirement: Image Management for Works
The system SHALL handle work images with local storage.

#### Scenario: Upload work images
- **WHEN** admin uploads images for a work
- **THEN** images SHALL be stored in local storage
- **AND** multiple images SHALL be supported
- **AND** a preview grid SHALL be displayed

#### Scenario: Set hero image
- **WHEN** multiple images are uploaded
- **THEN** admin SHALL be able to select one as the hero/main image
- **AND** the hero image SHALL be displayed on the work card

#### Scenario: Image validation
- **WHEN** admin uploads files
- **THEN** only image files (jpg, jpeg, png, webp) SHALL be accepted
- **AND** maximum file size SHALL be 5MB per image
- **AND** maximum 10 images per work

#### Scenario: Reorder images
- **WHEN** admin drags and drops images in the preview
- **THEN** the order SHALL be saved
- **AND** the first image SHALL be used as the card thumbnail

### Requirement: Works API Endpoints
The system SHALL provide RESTful API endpoints for works.

#### Scenario: GET /api/works
- **WHEN** a GET request is made to /api/works
- **THEN** all published works SHALL be returned
- **AND** query params for service and platform filters SHALL be supported

#### Scenario: GET /api/works/:slug
- **WHEN** a GET request is made to /api/works/:slug
- **THEN** the work detail SHALL be returned
- **AND** 404 SHALL be returned if not found

#### Scenario: GET /api/works/featured
- **WHEN** a GET request is made to /api/works/featured
- **THEN** only featured works SHALL be returned
- **AND** results SHALL be ordered by featured_order

#### Scenario: POST /api/works (auth required)
- **WHEN** an authenticated admin makes a POST request
- **THEN** a new work SHALL be created
- **AND** the created work SHALL be returned

#### Scenario: PUT /api/works/:id (auth required)
- **WHEN** an authenticated admin makes a PUT request
- **THEN** the work SHALL be updated
- **AND** the updated work SHALL be returned

#### Scenario: DELETE /api/works/:id (auth required)
- **WHEN** an authenticated admin makes a DELETE request
- **THEN** the work SHALL be deleted
- **AND** 204 No Content SHALL be returned
