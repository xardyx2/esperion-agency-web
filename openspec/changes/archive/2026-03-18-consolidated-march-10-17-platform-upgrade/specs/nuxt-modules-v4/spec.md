## ADDED Requirements

### Requirement: @nuxt/image v2 migration
The system SHALL upgrade @nuxt/image from 1.11.0 to 2.0.0 and adapt to breaking changes.

#### Scenario: Screen size configuration
- **WHEN** configuring image screen sizes
- **THEN** the system SHALL remove deprecated xs (320px) and xxl (1536px) sizes
- **AND** use only standard Tailwind breakpoints

#### Scenario: IPX v3 compatibility
- **WHEN** processing images
- **THEN** the system SHALL use IPX v3 with improved sharp binary handling
- **AND** server-side image utilities SHALL be available in Nitro endpoints

#### Scenario: WebP optimization
- **WHEN** rendering images
- **THEN** the system SHALL use WebP format with configurable quality
- **AND** fallback to original format for unsupported browsers

### Requirement: @nuxt/ui v4 migration
The system SHALL upgrade @nuxt/ui from 3.3.7 to 4.5.1 with breaking change handling.

#### Scenario: Configuration key migration
- **WHEN** configuring Nuxt UI
- **THEN** the system SHALL change uiPro key to ui in app.config.ts
- **AND** update all references to the new key

#### Scenario: Component compatibility
- **WHEN** using Nuxt UI components
- **THEN** the system SHALL use v4 components with Reka UI + Tailwind Variants
- **AND** all 125+ unified components SHALL be accessible

#### Scenario: TypeScript support
- **WHEN** using TypeScript with Nuxt UI
- **THEN** the system SHALL have enhanced type support across all components
- **AND** auto-completion SHALL work for component props

### Requirement: @nuxt/eslint flat config migration
The system SHALL migrate ESLint from legacy config to flat config format.

#### Scenario: Configuration file migration
- **WHEN** configuring ESLint
- **THEN** the system SHALL create eslint.config.ts with flat config array
- **AND** remove legacy .eslintrc and .eslintrc.cjs files

#### Scenario: ESLint v9 compatibility
- **WHEN** running ESLint
- **THEN** the system SHALL use ESLint v9+ with flat config format
- **AND** all rules SHALL be compatible with v9

#### Scenario: Zero errors requirement
- **WHEN** linting the codebase
- **THEN** the system SHALL produce zero ESLint errors
- **AND** all warnings SHALL be either fixed or explicitly disabled with justification

### Requirement: @nuxtjs/i18n v10 migration
The system SHALL upgrade @nuxtjs/i18n from 9.5.6 to 10.2.3 with Vue I18n v11.

#### Scenario: Lazy loading removal
- **WHEN** configuring i18n
- **THEN** the system SHALL remove lazy: true option (now default behavior)
- **AND** translations SHALL load automatically when needed

#### Scenario: Bundle optimization removal
- **WHEN** configuring i18n
- **THEN** the system SHALL remove bundle.optimizeTranslationDirective option
- **AND** use default optimization behavior

#### Scenario: HMR configuration rename
- **WHEN** configuring i18n HMR
- **THEN** the system SHALL rename experimental.hmr to hmr
- **AND** hot reload SHALL work for translation files

### Requirement: @nuxtjs/color-mode v4 migration
The system SHALL upgrade @nuxtjs/color-mode from 3.5.2 to 4.0.0.

#### Scenario: Configuration simplification
- **WHEN** configuring color mode
- **THEN** the system SHALL remove hid option
- **AND** remove classSuffix default value configuration

#### Scenario: Nuxt 3+ compatibility
- **WHEN** using color mode
- **THEN** the system SHALL require Nuxt 3+ (Nuxt 2 support dropped)
- **AND** dark/light mode toggling SHALL work correctly

## MODIFIED Requirements

### Requirement: i18n configuration structure
**FROM**: Configuration with lazy loading and bundle optimization options
**TO**: Configuration without deprecated options (lazy is default, bundle.optimizeTranslationDirective removed)

#### Scenario: Minimal configuration
- **WHEN** configuring i18n in nuxt.config.ts
- **THEN** the configuration SHALL NOT include lazy or bundle.optimizeTranslationDirective
- **AND** the system SHALL use Vue I18n v11 defaults

### Requirement: ESLint configuration format
**FROM**: Legacy .eslintrc configuration files
**TO**: Flat config format in eslint.config.ts

#### Scenario: Configuration loading
- **WHEN** ESLint loads configuration
- **THEN** it SHALL read from eslint.config.ts
- **AND** ignore any .eslintrc files

### Requirement: Color mode configuration
**FROM**: Configuration with hid and classSuffix options
**TO**: Simplified configuration without these options

#### Scenario: Color mode initialization
- **WHEN** the app initializes
- **THEN** color mode SHALL work without explicit hid or classSuffix configuration
- **AND** system preference detection SHALL work

## REMOVED Requirements

None - configuration options are deprecated, not requirements.
