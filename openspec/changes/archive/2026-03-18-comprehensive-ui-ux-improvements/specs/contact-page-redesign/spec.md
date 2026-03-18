## ADDED Requirements

### Requirement: Contact page displays 3-column layout
The contact page SHALL display a 3-section layout with contact form on the left, contact information and address on the right, and Google Maps embedded at the bottom.

#### Scenario: User views contact page on desktop
- **WHEN** user navigates to /contact-us on desktop viewport (≥ 1024px)
- **THEN** page displays form column on left, info column on right, and maps section spanning full width below both columns

#### Scenario: User views contact page on tablet
- **WHEN** user navigates to /contact-us on tablet viewport (≥ 768px and < 1024px)
- **THEN** page displays form and info columns side-by-side with maps section below

#### Scenario: User views contact page on mobile
- **WHEN** user navigates to /contact-us on mobile viewport (< 768px)
- **THEN** page stacks form, info, and maps sections vertically in that order

### Requirement: Contact form section functionality
The contact form section SHALL include fields for name, email, subject, and message with validation and submission handling.

#### Scenario: User submits valid contact form
- **WHEN** user fills all required fields with valid data and clicks submit
- **THEN** form displays success message and backend receives contact submission

#### Scenario: User submits form with invalid email
- **WHEN** user enters invalid email format and clicks submit
- **THEN** form displays inline validation error and prevents submission

#### Scenario: User submits form with missing required fields
- **WHEN** user leaves required fields empty and clicks submit
- **THEN** form highlights missing fields with error messages and prevents submission

#### Scenario: Form submission shows loading state
- **WHEN** user clicks submit button
- **THEN** submit button displays loading indicator and becomes disabled until response arrives

### Requirement: Contact information section displays company details
The contact information section SHALL display Esperion company contact details including email, phone, and business hours.

#### Scenario: User views contact info
- **WHEN** user views the contact information section
- **THEN** email address displays as clickable mailto link, phone displays as clickable tel link, and business hours show operating days and times

#### Scenario: User clicks email link
- **WHEN** user clicks email address in contact info
- **THEN** default email client opens with Esperion email pre-filled in recipient field

### Requirement: Contact page displays physical address
The contact page SHALL display Esperion's physical address in the contact information section.

#### Scenario: User views address
- **WHEN** user views the contact information section
- **THEN** full street address, city, province, and postal code display with proper formatting

### Requirement: Google Maps integration
The contact page SHALL embed Google Maps showing Esperion's location at the bottom of the page.

#### Scenario: User views map on desktop
- **WHEN** user scrolls to maps section on desktop
- **THEN** interactive Google Map displays with marker at Esperion location with minimum height of 400px

#### Scenario: User interacts with map
- **WHEN** user clicks and drags on embedded map
- **THEN** map pans smoothly and allows zoom controls

#### Scenario: Map displays on mobile
- **WHEN** user views maps section on mobile device
- **THEN** map renders with touch-friendly controls and full width

### Requirement: Contact form success feedback
The contact form SHALL display appropriate success and error feedback after submission.

#### Scenario: Form submission succeeds
- **WHEN** backend returns 200 OK after form submission
- **THEN** success message displays "Thank you for contacting us. We will respond within 24 hours." and form resets

#### Scenario: Form submission fails
- **WHEN** backend returns error status after form submission
- **THEN** error message displays "Submission failed. Please try again later." and form preserves user input
