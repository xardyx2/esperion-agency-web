## Why

The Nuxt frontend container currently allows repository dependency manifests to diverge from the runtime `node_modules` volume, which caused the dev server to fail with `Could not load @vee-validate/nuxt. Is it installed?` even after the module was added correctly in the repo. The same container logs also show repeatable runtime noise from a missing Indonesian locale key and avoidable dependency warnings, so this change is needed to make local Nuxt startup reliable and log output actionable.

## What Changes

- Ensure the local frontend Docker development workflow synchronizes Bun dependencies into the runtime container before Nuxt starts when manifests or lockfiles change.
- Define a repeatable runtime verification flow so newly added Nuxt modules are visible inside the running frontend container, not just in the image or repository.
- Remove known log noise from the missing `footer.cookieSettings` Indonesian translation key.
- Decide and document how the project handles the `@vee-validate/nuxt` + `zod` warning path so startup logs reflect an intentional validation strategy.
- Reduce repetitive dev-time reload noise by documenting or configuring the current Scalar/Vite optimization behavior where appropriate.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `local-docker-deployment`: The frontend Docker dev workflow must guarantee that runtime dependencies match the current repository manifests before Nuxt loads modules.
- `frontend-dependency-health`: Dependency verification must cover container runtime startup and intentional handling of dependency-related warnings, not just manifest and lockfile consistency.
- `localization`: Locale message completeness must prevent known missing-key warnings for runtime-rendered UI strings such as footer settings links.

## Impact

- Frontend Docker development setup in `docker-compose.yml`, `frontend/Dockerfile.dev`, and related startup scripts
- Frontend dependency/runtime verification docs in `frontend/README.md` and adjacent operational documentation
- Frontend locale files under `frontend/i18n/locales/`
- Nuxt runtime configuration and optional dependency guidance in `frontend/nuxt.config.ts` and validation-related setup
- Local developer workflow for adding Nuxt modules and restarting or recreating containers
