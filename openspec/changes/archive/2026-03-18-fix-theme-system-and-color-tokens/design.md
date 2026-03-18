## Context

The public frontend currently mixes three theme layers: semantic CSS variables in `frontend/app/assets/css/main.css`, legacy `esperion-*` Tailwind tokens in `frontend/tailwind.config.ts`, and `es-*` semantic utility classes used directly across public pages. Theme state is also controlled by both `useColorMode()` and `useUiStore`, while the visible UI mostly depends on classes that do not clearly map back to a single generated token source.

The audit shows four concrete issues that must be resolved together:
- the light/dark toggle changes state but does not visibly retheme the public UI;
- valid public palette values already exist in `main.css`, but legacy token families still coexist;
- some public classes such as `bg-es-bg-inverse` appear undefined;
- the repo needs an explicit final rule for what stays, what is deprecated, and what drives generation.

### Explicit Migration Map

#### Retain as canonical
- Light mode: `--es-bg-primary`, `--es-bg-secondary`, `--es-bg-tertiary`, `--es-text-primary`, `--es-text-secondary`, `--es-text-tertiary`, `--es-text-inverse`, `--es-border`, `--es-accent-primary`, `--es-accent-primary-hover`, `--es-accent-secondary`, `--es-success`, `--es-warning`, `--es-error`, `--es-info`
- Dark mode: `--es-bg-primary-dark`, `--es-bg-secondary-dark`, `--es-bg-tertiary-dark`, `--es-text-primary-dark`, `--es-text-secondary-dark`, `--es-text-tertiary-dark`, `--es-text-inverse-dark`, `--es-border-dark`, `--es-accent-primary-dark`, `--es-accent-primary-hover-dark`, `--es-accent-secondary-dark`, `--es-success-dark`, `--es-warning-dark`, `--es-error-dark`, `--es-info-dark`

#### Deprecate and migrate away
- `esperion-light-bg`
- `esperion-light-surface`
- `esperion-light-text-primary`
- `esperion-light-text-secondary`
- `esperion-light-border`
- `esperion-dark-bg`
- `esperion-dark-surface`
- `esperion-dark-text-primary`
- `esperion-dark-text-secondary`
- `esperion-dark-border`
- `esperion-primary`

#### Undefined or unverified tokens that must be created or removed
- `bg-es-bg-inverse`
- `dark:bg-es-bg-inverse-dark`

#### Current legacy usage hotspots to migrate
- `frontend/app/pages/[...all].vue`
- `frontend/app/pages/privacy-policy.vue`
- `frontend/app/pages/terms-of-service.vue`
- `frontend/app/components/ui/LanguageSwitcher.vue`
- `frontend/app/components/ui/LanguagePrompt.vue`
- `frontend/app/components/ui/EsButton.vue`
- `frontend/app/components/ui/EsCard.vue`
- `frontend/app/composables/useEsperionTheme.ts`

## Goals / Non-Goals

**Goals:**
- Choose one final source of truth for public theme tokens and public-mode state.
- Preserve the valid semantic Esperion palette already expressed as `--es-*` variables.
- Define the canonical light-mode and dark-mode tokens that public pages SHALL use.
- Define which token families are valid to keep, which aliases are temporary, and which legacy names must be removed or migrated.
- Ensure public templates, shared UI, and theme state all converge on one predictable contract.

**Non-Goals:**
- Rewriting brand copy or localization strategy.
- Fixing route/detail-page behavior.
- Restoring image assets.
- Replacing all dashboard styling in the same change unless it shares the public theme contract.

## Decisions

### Decision: Final source of truth = semantic CSS variables in `frontend/app/assets/css/main.css`
- Chosen source of truth: the `--es-*` semantic token family in `frontend/app/assets/css/main.css`.
- Rationale: it already contains the complete public palette, matches the class family used by most current public templates, and cleanly expresses light/dark pairs without hardcoded hex in templates.
- Alternatives considered:
  - Keep `esperion-*` Tailwind config as canonical: rejected because most public pages no longer use that vocabulary and it would require a reverse migration.
  - Let page templates define their own semantic class sets ad hoc: rejected because it would preserve drift.

### Decision: Valid tokens to retain
- Light mode tokens to retain as canonical:
  - `--es-bg-primary`, `--es-bg-secondary`, `--es-bg-tertiary`
  - `--es-text-primary`, `--es-text-secondary`, `--es-text-tertiary`, `--es-text-inverse`
  - `--es-border`
  - `--es-accent-primary`, `--es-accent-primary-hover`, `--es-accent-secondary`
  - `--es-success`, `--es-warning`, `--es-error`, `--es-info`
- Dark mode tokens to retain as canonical:
  - `--es-bg-primary-dark`, `--es-bg-secondary-dark`, `--es-bg-tertiary-dark`
  - `--es-text-primary-dark`, `--es-text-secondary-dark`, `--es-text-tertiary-dark`, `--es-text-inverse-dark`
  - `--es-border-dark`
  - `--es-accent-primary-dark`, `--es-accent-primary-hover-dark`, `--es-accent-secondary-dark`
  - `--es-success-dark`, `--es-warning-dark`, `--es-error-dark`, `--es-info-dark`
- Rationale: these map directly to the audited Esperion light/dark palette and already cover the 60-30-10 split.

### Decision: Legacy tokens to remove or migrate
- Token family to deprecate and migrate away from:
  - `esperion-light-bg`
  - `esperion-light-surface`
  - `esperion-light-text-primary`
  - `esperion-light-text-secondary`
  - `esperion-light-border`
  - `esperion-dark-bg`
  - `esperion-dark-surface`
  - `esperion-dark-text-primary`
  - `esperion-dark-text-secondary`
  - `esperion-dark-border`
  - `esperion-primary`
- Migration rule: these names may exist only as short-lived compatibility aliases during refactor; final public templates and specs SHALL use the `es-*` semantic vocabulary only.
- Invalid or unverified tokens such as `bg-es-bg-inverse` / `dark:bg-es-bg-inverse-dark` must either be formally defined in the canonical token set or replaced with valid retained tokens. They must not stay as undocumented classes.

### Decision: Single theme controller = `useColorMode()`
- Final state owner for theme mode: `@nuxtjs/color-mode` via `useColorMode()`.
- `frontend/app/stores/ui.ts` theme state becomes non-authoritative and must be removed from the public theme path or refactored to consume the canonical mode instead of owning its own copy.
- Rationale: `useColorMode()` already integrates with the Nuxt module and is what the public navigation actually uses.
- Alternative considered: keep dual controllers and synchronize them. Rejected because synchronization preserves unnecessary coupling and duplicate persistence.

### Decision: Token generation must be derived from the canonical semantic palette
- Public utility classes must resolve from the canonical `--es-*` palette, whether through Tailwind-compatible generation, CSS utilities, or a documented alias layer.
- The implementation must verify generated support for the classes that public pages actually use, especially `bg-es-*`, `text-es-*`, `border-es-*`, and `dark:*` variants.
- Rationale: the core bug is not just state but the break between state, generated utilities, and rendered classes.

## Risks / Trade-offs

- [Tailwind v4 compatibility may differ from the repo's current assumptions] -> Verify generation strategy before migration and treat generated `es-*` classes as an explicit acceptance criterion.
- [Shared components may still depend on legacy `esperion-*` names] -> Allow a temporary alias layer only during migration, then remove it before closing the change.
- [Removing the orphaned store path may expose hidden dashboard dependencies] -> Audit actual consumers before deleting anything and keep public scope primary.
- [Undocumented inverse tokens may be used in multiple pages] -> Inventory every `es-*` token in templates and decide per token: retain, alias, or replace.

## Migration Plan

1. Inventory every active public theme class and map it to a canonical `--es-*` token.
2. Decide the exact generation strategy that makes `es-*` utilities valid under the current frontend stack.
3. Migrate or alias any remaining `esperion-*` public usage to canonical `es-*` names.
4. Remove the public theme dependency on `useUiStore` as an independent mode controller.
5. Verify dark/light mode visually changes the public UI and persists through reload.

## Open Questions

- Does any dashboard-only surface still require the `esperion-*` vocabulary long enough to justify a temporary compatibility alias?
- Should `bg-es-bg-inverse` become a first-class canonical token, or should all current usages be rewritten to existing retained tokens?
- Is Tailwind generation best handled through direct semantic utilities, CSS custom utilities, or a hybrid mapping layer under the current Nuxt/Tailwind toolchain?
