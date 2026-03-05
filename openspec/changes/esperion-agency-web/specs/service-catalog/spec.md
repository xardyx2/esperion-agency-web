## ADDED Requirements

### Requirement: Our Services Page - Public View
The system SHALL display a services page showcasing all offered services on the public website.

#### Scenario: Banner section display
- **WHEN** visitor navigates to /our-services
- **THEN** a banner section with page title and description SHALL be displayed at the top

#### Scenario: Services grid layout
- **WHEN** visitor scrolls to section 2
- **THEN** services SHALL be displayed in a 3-column x 2-row grid (6 services total)
- **AND** each service card SHALL have consistent height

#### Scenario: Service card content
- **WHEN** visitor views a service card
- **THEN** the card SHALL display:
  - Service icon/image
  - Service title
  - Short description (max 150 characters)
  - "Learn More" link/button

#### Scenario: Service card hover effect
- **WHEN** visitor hovers over a service card
- **THEN** the card SHALL have a subtle lift animation
- **AND** a shadow effect SHALL appear

#### Scenario: Navigate to service detail
- **WHEN** visitor clicks "Learn More" or the card
- **THEN** the visitor SHALL be navigated to /our-services/:slug

### Requirement: Service Detail Page - Public View
The system SHALL display detailed information for each service.

#### Scenario: Navigate to detail
- **WHEN** visitor clicks on a service from the services page
- **THEN** the service detail page SHALL open at /our-services/:slug

#### Scenario: Detail page content
- **WHEN** visitor views the service detail page
- **THEN** the page SHALL display:
  - Hero section with service title and icon
  - Full service description
  - Key features/benefits list
  - Process/how it works section
  - Related works showcase
  - CTA to contact for this service

#### Scenario: Related works
- **WHEN** visitor views the related works section
- **THEN** works matching this service SHALL be displayed
- **AND** clicking a work SHALL navigate to the work detail page

#### Scenario: CTA for service
- **WHEN** visitor clicks the CTA button
- **THEN** visitor SHALL be navigated to /contact-us
- **AND** the service field SHALL be pre-selected

### Requirement: Our Services - Home Page Section
The system SHALL display services on the home page section 3.

#### Scenario: Services grid on home
- **WHEN** visitor scrolls to section 3 on home page
- **THEN** a 3-column x 2-row grid of service cards SHALL be displayed

#### Scenario: Service card on home
- **WHEN** visitor views a home service card
- **THEN** the card SHALL display:
  - Service image/icon
  - Service title
  - Short description (truncated if needed)

#### Scenario: Navigate from home
- **WHEN** visitor clicks a service card on home page
- **THEN** visitor SHALL be navigated to the service detail page

### Requirement: Services Management - Dashboard
The system SHALL provide a dashboard interface for managing services.

#### Scenario: View all services
- **WHEN** admin navigates to Dashboard > Services
- **THEN** a list/table of all services SHALL be displayed
- **AND** each row SHALL show: title, slug, featured status, actions

#### Scenario: Create new service
- **WHEN** admin clicks "Add New Service"
- **THEN** a form SHALL open with fields:
  - Title (required)
  - Slug (auto-generated)
  - Description (required, rich text)
  - Short description (optional, auto-truncated)
  - Icon/image upload
  - Featured toggle
  - Display order (number)

#### Scenario: Edit existing service
- **WHEN** admin clicks "Edit" on a service
- **THEN** the service form SHALL load with existing data
- **AND** admin SHALL be able to modify all fields

#### Scenario: Delete service
- **WHEN** admin clicks "Delete" on a service
- **THEN** a confirmation dialog SHALL appear
- **AND** confirming SHALL permanently delete the service

#### Scenario: Toggle featured status
- **WHEN** admin toggles the "Featured" switch
- **THEN** the service SHALL be marked as featured
- **AND** featured services SHALL appear on the home page

#### Scenario: Reorder services
- **WHEN** admin changes the display order number
- **THEN** services SHALL be sorted by this order
- **AND** the public pages SHALL reflect the new order

### Requirement: Service Schema Validation
The system SHALL enforce strict schema validation for services.

#### Scenario: Title validation
- **WHEN** service is saved
- **THEN** title SHALL be required, max 100 characters

#### Scenario: Slug validation
- **WHEN** service is saved
- **THEN** slug SHALL be required, unique, URL-safe format
- **AND** SHALL be auto-generated from title if not provided

#### Scenario: Description validation
- **WHEN** service is saved
- **THEN** description SHALL be required, minimum 50 characters

#### Scenario: Short description validation
- **WHEN** service is saved
- **THEN** short description SHALL be optional
- **AND** if not provided, SHALL be auto-generated from first 150 characters of description

#### Scenario: Icon/image validation
- **WHEN** service is saved with an icon/image
- **THEN** only image files (svg, png, webp) SHALL be accepted
- **AND** maximum file size SHALL be 2MB

### Requirement: Default Services
The system SHALL include 6 default services as specified in requirements.

#### Scenario: Initial services seeding
- **WHEN** the application is first installed
- **THEN** the following 6 services SHALL be created:
  1. Digital Advertising
  2. Marketplace Marketing
  3. Social Media Marketing
  4. Search Engine Optimization
  5. Consultant
  6. Development Web & Mobile

#### Scenario: Service descriptions
- **WHEN** default services are seeded
- **THEN** each service SHALL have a meaningful description
- **AND** each service SHALL have an appropriate icon

### Requirement: Services API Endpoints
The system SHALL provide RESTful API endpoints for services.

#### Scenario: GET /api/services
- **WHEN** a GET request is made to /api/services
- **THEN** all services SHALL be returned
- **AND** results SHALL be ordered by display_order

#### Scenario: GET /api/services/:slug
- **WHEN** a GET request is made to /api/services/:slug
- **THEN** the service detail SHALL be returned
- **AND** 404 SHALL be returned if not found

#### Scenario: GET /api/services?featured=true
- **WHEN** a GET request is made with featured=true param
- **THEN** only featured services SHALL be returned

#### Scenario: POST /api/services (auth required)
- **WHEN** an authenticated admin makes a POST request
- **THEN** a new service SHALL be created
- **AND** the created service SHALL be returned

#### Scenario: PUT /api/services/:id (auth required)
- **WHEN** an authenticated admin makes a PUT request
- **THEN** the service SHALL be updated
- **AND** the updated service SHALL be returned

#### Scenario: DELETE /api/services/:id (auth required)
- **WHEN** an authenticated admin makes a DELETE request
- **THEN** the service SHALL be deleted
- **AND** 204 No Content SHALL be returned

### Requirement: Service Icon Management
The system SHALL handle service icons with local storage.

#### Scenario: Upload service icon
- **WHEN** admin uploads an icon for a service
- **THEN** the image SHALL be stored in local storage
- **AND** a preview SHALL be displayed

#### Scenario: Icon aspect ratio
- **WHEN** an icon is uploaded
- **THEN** the image SHALL be cropped/resized to square aspect ratio
- **AND** minimum dimension SHALL be 64x64 pixels

#### Scenario: Replace icon
- **WHEN** admin uploads a new icon for an existing service
- **THEN** the old icon SHALL remain in storage
- **AND** the new icon SHALL replace the old one in the service record

### Requirement: Service Display Options
The system SHALL provide flexible display options for services.

#### Scenario: Grid view
- **WHEN** visitor views the services page
- **THEN** services SHALL be displayed in a 3-column grid by default

#### Scenario: List view (future)
- **WHEN** a list view option is implemented
- **THEN** services SHALL be displayed in a vertical list
- **AND** each item SHALL show icon, title, and short description

#### Scenario: Featured highlight
- **WHEN** a service is marked as featured
- **THEN** the service card SHALL have a visual indicator (badge or border)
- **AND** featured services SHALL appear first in the list