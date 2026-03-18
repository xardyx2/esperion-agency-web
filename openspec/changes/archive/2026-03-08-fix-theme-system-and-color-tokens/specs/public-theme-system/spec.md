## ADDED Requirements

### Requirement: Canonical Public Theme Token Set
The system SHALL define one canonical public theme token set using the `--es-*` semantic palette, with light and dark token pairs documented and preserved as the only supported public palette.

#### Scenario: Light mode token inventory
- **WHEN** maintainers review the public theme contract
- **THEN** light mode SHALL be defined by the canonical `--es-*` tokens for background, surface, text, border, accent, and semantic states

#### Scenario: Dark mode token inventory
- **WHEN** maintainers review the public theme contract
- **THEN** dark mode SHALL be defined by the canonical `--es-*-dark` token pairs for background, surface, text, border, accent, and semantic states

### Requirement: Legacy Token Migration Policy
The system SHALL treat the legacy `esperion-*` token family as deprecated for public-page theming and SHALL require each legacy token to be either migrated to the canonical `es-*` vocabulary or removed after compatibility is no longer needed.

#### Scenario: Legacy token found in public implementation
- **WHEN** a public page or shared public component still references an `esperion-*` token
- **THEN** the token SHALL be classified as either a temporary migration alias or a removal candidate

#### Scenario: Undefined token found in public implementation
- **WHEN** a public page references a semantic token that is not part of the canonical inventory
- **THEN** the token SHALL be explicitly defined in the canonical set or replaced with a valid canonical token before the change is considered complete

### Requirement: Single Public Theme Controller
The system SHALL use one authoritative public theme controller for mode state, class application, and persistence.

#### Scenario: Public theme toggle changes mode
- **WHEN** a user toggles dark/light mode from the public navigation
- **THEN** the authoritative theme controller SHALL update the active mode and persist the preference without relying on a second independent theme owner

#### Scenario: Secondary theme state exists
- **WHEN** a second theme store or controller is discovered in the public theme path
- **THEN** it SHALL be removed from authority or refactored to consume the authoritative mode instead of owning a separate public state

### Requirement: Public Theme Utilities Resolve Canonical Tokens
The system SHALL guarantee that the public `es-*` theme classes used in templates resolve to the canonical semantic palette in both light and dark mode.

#### Scenario: Public page uses semantic utility classes
- **WHEN** a public page uses `bg-es-*`, `text-es-*`, or `border-es-*` classes with dark-mode variants
- **THEN** those classes SHALL resolve to valid canonical tokens in the generated frontend styling output

#### Scenario: User changes theme mode
- **WHEN** the active mode changes from light to dark or dark to light
- **THEN** public pages SHALL visibly switch their theme colors according to the canonical palette
