## ADDED Requirements

### Requirement: Nuxt-Delivered Pages Use Explicit Security Hardening
Nuxt-delivered pages SHALL apply an explicit frontend security hardening policy for browser-facing responses.

#### Scenario: Security policy is defined for public pages
- **WHEN** the frontend runtime is configured for production page delivery
- **THEN** page responses SHALL use an explicit security policy for browser-facing protections rather than relying on unspecified defaults

#### Scenario: Security policy is defined for dashboard shell
- **WHEN** the authenticated dashboard shell is served by Nuxt
- **THEN** the dashboard page delivery SHALL use the same hardening approach adjusted for authenticated workflows where required

### Requirement: Third-Party Integrations Are Allowlisted Deliberately
The frontend hardening policy SHALL explicitly account for required third-party scripts and embeds.

#### Scenario: Required analytics scripts remain allowed
- **WHEN** the security policy is applied to pages that load approved analytics integrations
- **THEN** those integrations SHALL remain functional only through explicitly defined allowances

#### Scenario: Required embeds remain allowed
- **WHEN** the security policy is applied to pages that use reCAPTCHA or Google Maps embeds
- **THEN** those embeds SHALL remain functional only through explicitly defined allowances

### Requirement: Frontend Security Policy Has A Verification Workflow
The frontend hardening configuration SHALL be validated against public and dashboard behavior before adoption.

#### Scenario: Public page validation is performed
- **WHEN** security hardening is introduced or updated
- **THEN** the verification flow SHALL confirm that public pages, embeds, and navigation still work correctly

#### Scenario: Dashboard validation is performed
- **WHEN** security hardening is introduced or updated
- **THEN** the verification flow SHALL confirm that login, refresh, and authenticated dashboard requests still work correctly
