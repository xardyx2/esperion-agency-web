## ADDED Requirements

### Requirement: Selected Forms SHALL Use a Shared Validation Workflow
The system SHALL provide a shared client-side validation workflow for the initial migration set of forms: login, registration, contact, and at least one dashboard CRUD form.

#### Scenario: Authentication form blocks invalid submission
- **WHEN** a user submits the login or registration form with invalid or missing required data
- **THEN** the form SHALL display inline validation feedback before the request is sent

#### Scenario: Contact form preserves guided validation
- **WHEN** a visitor enters invalid contact form data or leaves required fields empty
- **THEN** the form SHALL present field-level guidance and SHALL NOT submit until the invalid fields are corrected

#### Scenario: Dashboard form uses the same validation pattern
- **WHEN** an editor or admin opens the first dashboard form included in scope
- **THEN** that form SHALL use the same validation lifecycle for touched state, inline errors, and submit blocking as the public/auth forms

### Requirement: Validation Feedback SHALL Remain Consistent and Localized
Shared validation SHALL preserve user-friendly messages and the locale-aware behavior already expected by the application.

#### Scenario: Localized validation messages remain visible
- **WHEN** a user triggers a validation error on a localized form
- **THEN** the error text SHALL render in the active locale using the project's existing translation strategy

#### Scenario: Submit state remains explicit
- **WHEN** a valid form is submitted
- **THEN** the form SHALL expose a loading state and SHALL prevent duplicate submission until the request completes
