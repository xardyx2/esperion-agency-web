## Purpose

Define explicit, reviewable rules so public Esperion pages stay aligned with brand voice, vocabulary, and trust signaling.

## Requirements

### Requirement: Visible Public Copy SHALL Follow the Esperion Brand Strategy
The system SHALL evaluate public brand compliance using visible page content as well as metadata, and public-facing copy SHALL follow the declared Esperion language and voice strategy.

#### Scenario: Page metadata and visible copy are reviewed together
- **WHEN** a public page is evaluated for brand compliance
- **THEN** visible headings, body copy, CTAs, and metadata SHALL reflect one coherent public brand language strategy

### Requirement: Public Design-System Vocabulary SHALL Be Consistent
The system SHALL use one consistent public design-system vocabulary for semantic styling and SHALL not treat mixed legacy/current token naming as compliant brand behavior.

#### Scenario: Public page mixes token vocabularies
- **WHEN** a public page or component mixes legacy and current token families in the active public brand layer
- **THEN** the implementation SHALL be classified as non-compliant until it is aligned with the final public design-system vocabulary

### Requirement: Placeholder Trust Content SHALL Not Represent Real Esperion Identity
The system SHALL not present placeholder founder, team, author, client, or other trust-signaling content as if it were validated real Esperion identity data.

#### Scenario: Public trust section contains placeholder identities
- **WHEN** a public page contains placeholder names, portraits, or credibility claims in a trust-signaling section
- **THEN** the content SHALL be replaced with validated first-party information, reframed as non-identity illustrative content, or removed

### Requirement: Public Brand Compliance SHALL Be Reviewable Against Explicit Criteria
The system SHALL maintain an explicit brand-compliance checklist that can be used to review public pages consistently.

#### Scenario: Maintainer reviews a public page for brand fit
- **WHEN** a maintainer reviews a public page for Esperion brand compliance
- **THEN** the review SHALL use explicit criteria for voice, language consistency, trust content, and design-system vocabulary instead of ad hoc judgment alone
