## ADDED Requirements

### Requirement: WebP Image Compression
The system SHALL use `@nuxt/image` to serve WebP compressed images with configurable quality settings.

#### Scenario: Image is displayed with WebP format
- **WHEN** an image is rendered using the image component
- **THEN** the system SHALL serve it in WebP format when supported by the browser

#### Scenario: WebP quality is configurable
- **WHEN** configuring image settings
- **THEN** the system SHALL allow setting WebP quality (e.g., 80) for optimal size/quality balance

#### Scenario: Responsive image sizes
- **WHEN** an image is rendered on different screen sizes
- **THEN** the system SHALL provide appropriate image sizes for each breakpoint (xs, sm, md, lg, xl, xxl)

#### Scenario: Fallback for unsupported browsers
- **WHEN** a browser does not support WebP
- **THEN** the system SHALL automatically fall back to the original image format

### Requirement: Image Component Wrapper
The system SHALL provide a reusable image component that wraps `<NuxtImg>` with Esperion Design System styling.

#### Scenario: Developer uses EsImage component
- **WHEN** a developer uses `<EsImage>` component
- **THEN** it SHALL provide WebP conversion, responsive sizes, and Esperion styling out of the box

#### Scenario: Image has proper loading behavior
- **WHEN** an image is rendered
- **THEN** it SHALL use lazy loading by default with optional eager loading for critical images
