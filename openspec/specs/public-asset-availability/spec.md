## Purpose

Ensure all public-facing asset references resolve locally and that stock versus first-party asset usage follows explicit governance.

## Requirements

### Requirement: Local Availability of Referenced Public Assets
The system SHALL ensure that every public asset referenced by visible public pages, SEO metadata, and schema metadata is available from the locally hosted public asset structure.

#### Scenario: Public page references an image
- **WHEN** a public page, metadata field, or schema field references a local asset path
- **THEN** the corresponding asset SHALL exist in the local public asset structure at a resolvable path

### Requirement: Stock Eligibility Policy
The system SHALL classify missing public assets into stock-eligible and first-party-only categories before replacement work begins.

#### Scenario: Missing asset is generic illustrative content
- **WHEN** a missing asset represents a generic hero, article thumbnail, or non-identity illustrative visual
- **THEN** the asset MAY be replaced with approved stock imagery under the documented sourcing policy

#### Scenario: Missing asset represents a first-party truth claim
- **WHEN** a missing asset represents a client logo, official brand mark, founder identity, team identity, or claimed real proof asset
- **THEN** the asset SHALL be treated as first-party-only and SHALL NOT be replaced with stock imagery

### Requirement: Approved Stock Source Mapping
The system SHALL define which stock sources are preferred for each eligible asset category.

#### Scenario: Hero or editorial image needs replacement
- **WHEN** a stock-eligible hero banner or article thumbnail needs replacement
- **THEN** the sourcing workflow SHALL choose from the approved source categories and record the selected local replacement path

#### Scenario: Illustrative placeholder needs replacement
- **WHEN** a stock-eligible abstract or illustrative placeholder needs replacement
- **THEN** the sourcing workflow SHALL prefer a source category that minimizes accidental trademark or identity risk

### Requirement: No Hotlinking for Replacement Assets
The system SHALL download approved stock assets and host them locally rather than hotlinking third-party URLs into the public website.

#### Scenario: Approved stock asset is selected
- **WHEN** a stock asset is approved for use on the public site
- **THEN** the asset SHALL be downloaded, stored locally, and referenced through the local public asset structure

### Requirement: Stock Asset Licensing and Source Traceability
The system SHALL keep source and licensing traceability for every approved stock asset used on the public site.

#### Scenario: Stock asset is accepted for public use
- **WHEN** a stock asset is selected from Unsplash, Pexels, Pixabay, or another approved source
- **THEN** the implementation SHALL record the source platform, source URL, and intended usage classification before the asset is considered production-ready

#### Scenario: Asset category is first-party-only
- **WHEN** an asset belongs to a first-party-only category such as client logos, official brand marks, or real founder identity imagery
- **THEN** the workflow SHALL reject stock substitution regardless of source availability

### Requirement: Public Asset Naming and Optimization
The system SHALL apply consistent naming and size-optimization rules to restored public assets before they are committed.

#### Scenario: New local asset is added
- **WHEN** a replacement or restored public asset is added to the local public structure
- **THEN** the file SHALL use a descriptive kebab-case name and SHALL be optimized for its intended display use before completion

### Requirement: SEO and Schema Image Coverage
The system SHALL apply the same availability and replacement rules to Open Graph, Twitter, and schema image references.

#### Scenario: Metadata image is missing
- **WHEN** an Open Graph, Twitter, or schema image reference does not resolve to an approved asset
- **THEN** the metadata reference SHALL be updated to a verified locally hosted asset before the change is complete
