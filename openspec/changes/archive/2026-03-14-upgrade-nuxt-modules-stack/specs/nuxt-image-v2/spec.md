## ADDED Requirements

### Requirement: @nuxt/image v2.0.0 Support
The system SHALL support @nuxt/image version 2.0.0 with full TypeScript support and IPX v3 integration.

#### Scenario: Image configuration valid
- **WHEN** the system loads nuxt.config.ts
- **THEN** the image configuration SHALL NOT include deprecated screen sizes (xs, xxl)
- **AND** only sm, md, lg, xl, 2xl screen sizes SHALL be defined

#### Scenario: Custom provider uses defineProvider
- **WHEN** a custom image provider is configured
- **THEN** the provider SHALL use the defineProvider helper from @nuxt/image/runtime
- **AND** the provider SHALL have full TypeScript type inference

#### Scenario: Image rendering with valid sizes
- **WHEN** a page renders a <NuxtImg> component with sizes attribute
- **THEN** the sizes attribute SHALL only reference valid screen sizes (sm, md, lg, xl, 2xl)
- **AND** no deprecation warnings SHALL appear in console

#### Scenario: IPX v3 optimization
- **WHEN** images are optimized during build
- **THEN** IPX v3 SHALL handle sharp binary detection automatically
- **AND** WebP conversion SHALL work with configured quality settings

## MODIFIED Requirements

None - this is a new capability with only added requirements.

## REMOVED Requirements

None - this is a new capability.
