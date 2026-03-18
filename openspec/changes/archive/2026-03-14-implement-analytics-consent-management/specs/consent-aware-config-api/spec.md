# consent-aware-config-api Specification

## Purpose
Filter analytics tracker configuration based on user consent preferences, ensuring only consented trackers are exposed to the frontend.

## ADDED Requirements

### Requirement: Public Config Filters by Consent
The public analytics configuration endpoint SHALL filter tracker IDs based on user consent preferences.

#### Scenario: User consents to Analytics tier
- **WHEN** a user has consented to Analytics tier
- **THEN** the public config SHALL include GA4 measurement ID (if configured)

#### Scenario: User rejects Functional tier
- **WHEN** a user has not consented to Functional tier
- **THEN** the public config SHALL exclude Clarity project ID and GTM container ID

#### Scenario: User rejects Marketing tier
- **WHEN** a user has not consented to Marketing tier
- **THEN** the public config SHALL exclude all marketing pixel IDs (Meta, TikTok, LinkedIn)

#### Scenario: No consent provided
- **WHEN** no consent header is present and consent is required
- **THEN** the public config SHALL return only Essential tier trackers (backend only)

### Requirement: Config Indicates Consent Requirements
The public config response SHALL include metadata about consent requirements and effective tiers.

#### Scenario: Consent is required
- **WHEN** the backend has consent_required enabled
- **THEN** the public config SHALL include consent_required: true and current tier states

#### Scenario: Consent is disabled
- **WHEN** the backend has consent_required disabled
- **THEN** the public config SHALL include consent_required: false and all configured trackers

### Requirement: Consent Header Parsing
The backend SHALL parse consent preferences from X-Consent-Preferences header or query parameter.

#### Scenario: Valid consent header received
- **WHEN** the request includes valid X-Consent-Preferences header (Base64 JSON)
- **THEN** the system SHALL decode and apply the consent preferences

#### Scenario: Invalid consent data
- **WHEN** the consent header cannot be parsed
- **THEN** the system SHALL treat it as no consent provided

### Requirement: Consent Audit Logging (Optional)
The system MAY log consent choices for regulatory audit trail.

#### Scenario: User consent saved
- **WHEN** a user saves consent preferences via optional endpoint
- **THEN** the system SHALL persist timestamp and tier selections to analytics_consent_logs table

## MODIFIED Requirements

(None - this is a new capability)

## REMOVED Requirements

(None - this is a new capability)
