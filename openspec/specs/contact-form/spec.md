# Contact Form Specification

## Purpose

This specification defines the contact form capabilities for the Esperion agency web platform, including form validation, reCAPTCHA integration, and submission management.

## Requirements

### Requirement: Contact Form Display
The system SHALL display a contact form on the Contact Us page for visitor inquiries.

#### Scenario: Form visibility
- **WHEN** visitor navigates to /contact-us
- **THEN** a contact form SHALL be displayed in the left column
- **AND** company contact information SHALL be displayed in the right column

#### Scenario: Form fields
- **WHEN** visitor views the form
- **THEN** the following fields SHALL be visible:
  - Full Name (required)
  - Company Name (optional)
  - Service (dropdown with "Etc" option)
  - Description (textarea, required)
  - Email (required, for response)
  - Phone (optional)

#### Scenario: Service dropdown options
- **WHEN** visitor clicks the Service dropdown
- **THEN** the following options SHALL be displayed:
  - Digital Advertising
  - Marketplace Marketing
  - Social Media Marketing
  - Search Engine Optimization
  - Consultant
  - Web & Mobile Development
  - Etc (Other)

### Requirement: Form Validation
The system SHALL validate all form inputs before submission.

#### Scenario: Full Name validation
- **WHEN** visitor submits the form without a full name
- **THEN** an error "Full Name is required" SHALL be displayed
- **AND** the form SHALL NOT submit

#### Scenario: Email validation
- **WHEN** visitor enters an invalid email format
- **THEN** an error "Please enter a valid email address" SHALL be displayed
- **AND** the form SHALL NOT submit

#### Scenario: Email required
- **WHEN** visitor submits the form without an email
- **THEN** an error "Email is required" SHALL be displayed
- **AND** the form SHALL NOT submit

#### Scenario: Description validation
- **WHEN** visitor submits without a description
- **THEN** an error "Please describe your inquiry" SHALL be displayed
- **AND** the form SHALL NOT submit

#### Scenario: Description length validation
- **WHEN** visitor enters a description longer than 2000 characters
- **THEN** an error "Description must be less than 2000 characters" SHALL be displayed
- **AND** the form SHALL NOT submit

#### Scenario: Real-time validation
- **WHEN** visitor enters valid data in a field
- **THEN** the field SHALL show a valid state (green border or checkmark)
- **AND** error messages SHALL be cleared

### Requirement: reCAPTCHA v3 Integration
The system SHALL integrate Google reCAPTCHA v3 for spam protection.

#### Scenario: reCAPTCHA badge display
- **WHEN** visitor loads the Contact Us page
- **THEN** the reCAPTCHA v3 badge SHALL be visible at the bottom right
- **AND** the text "Protected by reCAPTCHA" with Google Privacy Policy link SHALL be displayed

#### Scenario: reCAPTCHA token generation
- **WHEN** visitor interacts with the page
- **THEN** a reCAPTCHA token SHALL be generated in the background
- **AND** the token SHALL be included in the form submission

#### Scenario: reCAPTCHA verification success
- **WHEN** the reCAPTCHA score is above the threshold (0.5)
- **THEN** the form submission SHALL proceed normally
- **AND** the submission SHALL be saved to the database

#### Scenario: reCAPTCHA verification failure
- **WHEN** the reCAPTCHA score is below the threshold (0.5)
- **THEN** the form submission SHALL be rejected
- **AND** a message "Unable to process your submission. Please try again." SHALL be displayed
- **AND** the submission SHALL NOT be saved

#### Scenario: reCAPTCHA key missing
- **WHEN** reCAPTCHA site key is not configured
- **THEN** a warning SHALL be logged
- **AND** form submission SHALL proceed without reCAPTCHA (development mode)

### Requirement: Form Submission
The system SHALL process and store contact form submissions.

#### Scenario: Successful submission
- **WHEN** visitor submits a valid form with passing reCAPTCHA
- **THEN** the submission SHALL be saved to the contact_submissions table
- **AND** a success message "Thank you for contacting us. We will get back to you soon." SHALL be displayed
- **AND** the form SHALL be cleared
- **AND** the visitor SHALL be redirected to the home page after 3 seconds

#### Scenario: Submission data storage
- **WHEN** a submission is saved
- **THEN** the following data SHALL be stored:
  - full_name
  - company_name (nullable)
  - service
  - description
  - email (nullable)
  - phone (nullable)
  - created_at (timestamp)
  - recaptcha_score

#### Scenario: Server error handling
- **WHEN** the backend returns an error during submission
- **THEN** an error message "Unable to submit your request. Please try again later." SHALL be displayed
- **AND** the form data SHALL be preserved for retry

#### Scenario: Duplicate submission prevention
- **WHEN** visitor clicks the submit button multiple times
- **THEN** only one submission SHALL be processed
- **AND** the submit button SHALL be disabled after the first click
- **AND** a loading indicator SHALL be displayed

### Requirement: Contact Information Display
The system SHALL display company contact information on the Contact Us page.

#### Scenario: Contact details visibility
- **WHEN** visitor views the Contact Us page
- **THEN** the right column SHALL display:
  - Company address
  - WhatsApp number (clickable)
  - Email address (clickable)
  - Office hours (optional)

#### Scenario: Social media links
- **WHEN** visitor views the contact section
- **THEN** social media icons SHALL be displayed:
  - Instagram
  - Facebook
  - LinkedIn
  - TikTok
  - X (Twitter)
- **AND** clicking an icon SHALL open the social media page in a new tab

#### Scenario: Click-to-action links
- **WHEN** visitor clicks the WhatsApp number
- **THEN** a WhatsApp chat SHALL open in a new tab

#### Scenario: Email click action
- **WHEN** visitor clicks the email address
- **THEN** the default email client SHALL open with a new message

### Requirement: Admin Dashboard - Contact Submissions
The system SHALL provide an admin interface to view contact submissions.

#### Scenario: View submissions list
- **WHEN** admin navigates to Dashboard > Contact Submissions
- **THEN** a table of all submissions SHALL be displayed
- **AND** each row SHALL show: name, company, service, email, date

#### Scenario: View submission details
- **WHEN** admin clicks on a submission
- **THEN** a modal or detail view SHALL display all submission data
- **AND** the full description SHALL be visible

#### Scenario: Filter by service
- **WHEN** admin selects a service filter
- **THEN** only submissions for that service SHALL be displayed

#### Scenario: Mark as contacted
- **WHEN** admin marks a submission as contacted
- **THEN** the status SHALL be updated to "contacted"
- **AND** the submission SHALL be visually distinguished from new submissions

#### Scenario: Export submissions
- **WHEN** admin clicks "Export"
- **THEN** a CSV file with all submissions SHALL be downloaded

### Requirement: Service Dropdown Configuration
The system SHALL allow dynamic configuration of service options.

#### Scenario: Default services
- **WHEN** the application is first installed
- **THEN** the default 6 services plus "Etc" SHALL be available in the dropdown

#### Scenario: Add custom service
- **WHEN** admin adds a new service via dashboard
- **THEN** the new service SHALL appear in the contact form dropdown

#### Scenario: Disable service
- **WHEN** admin disables a service
- **THEN** the service SHALL no longer appear in the dropdown
- **AND** existing submissions with that service SHALL remain unchanged

### Requirement: Accessibility Compliance
The contact form SHALL comply with accessibility standards.

#### Scenario: Keyboard navigation
- **WHEN** user navigates using Tab key
- **THEN** all form fields SHALL be focusable in order
- **AND** the submit button SHALL be reachable

#### Scenario: Screen reader support
- **WHEN** a screen reader is used
- **THEN** all form fields SHALL have proper labels
- **AND** error messages SHALL be announced

#### Scenario: Focus indicators
- **WHEN** a field receives focus
- **THEN** a visible focus indicator SHALL be displayed
- **AND** the indicator SHALL meet WCAG contrast requirements

#### Scenario: Error announcement
- **WHEN** form validation fails
- **THEN** error messages SHALL be associated with their fields via aria-describedby
- **AND** screen readers SHALL announce the errors
