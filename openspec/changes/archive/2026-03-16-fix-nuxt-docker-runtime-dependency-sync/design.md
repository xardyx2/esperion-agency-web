## Context

The current frontend development container binds `./frontend` onto `/app` while also using separate runtime volumes for `/app/node_modules` and `/app/.nuxt` in `docker-compose.yml`. That pattern keeps host and container dependencies isolated, but it also allows the runtime `node_modules` volume to drift behind the repository manifests when developers add new Nuxt modules on the host.

This drift surfaced directly in the Nuxt container logs:
- `Could not load @vee-validate/nuxt. Is it installed?`
- repeated `footer.cookieSettings` missing-key warnings for the Indonesian locale
- repeated dependency and optimization noise after adding Scalar and VeeValidate-related packages

The codebase now includes a runtime sync entrypoint in `frontend/docker-entrypoint.sh`, but the proposal needs to make this behavior an intentional, documented, and verifiable part of the local Docker workflow rather than a one-off patch.

## Goals / Non-Goals

**Goals:**
- Make frontend Docker startup deterministic when `package.json` or Bun lockfiles change.
- Ensure newly added Nuxt modules are available in the running frontend container without requiring manual investigation.
- Define how dependency-related startup warnings are handled so logs distinguish real failures from accepted optional-package behavior.
- Remove the known missing Indonesian footer translation warning from local Nuxt startup.
- Keep the fix compatible with the current bind-mount development workflow.

**Non-Goals:**
- Replacing Docker Compose with a different development orchestration stack.
- Redesigning the frontend rendering strategy, Nuxt module architecture, or validation approach.
- Solving every historical Nuxt/Vite warning in the repository.
- Changing production container behavior; this change is about local development reliability.

## Decisions

### 1. Keep the bind-mounted source tree, but make runtime dependency sync explicit

**Decision:** Preserve the existing `./frontend:/app` bind mount and `/app/node_modules` runtime volume, but require the frontend container to synchronize Bun dependencies before `nuxt dev` starts.

**Rationale:**
- The repository already relies on live code edits through the bind mount.
- The separate `node_modules` volume avoids host/container native-module mismatch.
- An entrypoint-time sync is the least disruptive way to guarantee runtime correctness when manifests change.

**Alternatives considered:**
- Remove the `node_modules` volume and use host dependencies: rejected because it risks platform mismatch and slower host-mounted installs.
- Require developers to rebuild on every dependency change with no runtime sync: rejected because it keeps the failure mode easy to hit and hard to diagnose.
- Move fully to image-only dependencies for dev: rejected because it slows everyday iteration and conflicts with the current mounted-source workflow.

### 2. Treat runtime startup verification as part of dependency health

**Decision:** Extend dependency-health verification to include container startup behavior, not just manifest/lockfile consistency.

**Rationale:**
- The observed failure occurred even though `package.json` and `nuxt.config.ts` were correct.
- For Nuxt modules, the real success criterion is that the running container can load the module and start the dev server.

**Alternatives considered:**
- Keep dependency health limited to repository files: rejected because it misses the exact failure seen in the logs.

### 3. Separate actionable runtime warnings from accepted optional warnings

**Decision:** The fix should explicitly classify which warnings must be removed now and which warnings require a deliberate project decision.

**Rationale:**
- The missing `footer.cookieSettings` locale key is a definite correctness issue and should be removed.
- The `@vee-validate/nuxt` / `zod` warning is more nuanced because the project may intentionally use a custom schema bridge rather than `@vee-validate/zod`.
- Proposal work should leave an audit trail instead of silently normalizing warning noise.

**Alternatives considered:**
- Silence every warning unconditionally: rejected because some warnings expose real configuration drift.
- Ignore warning cleanup entirely: rejected because the user asked for a proposal based on the actual container logs.

### 4. Keep the first implementation scoped to actionable local-dev fixes

**Decision:** The initial implementation should prioritize Docker runtime sync, log clarity, and locale completeness over broader workflow changes like Docker Compose Watch migration.

**Rationale:**
- The current failure is already reproducible and already has a low-risk local fix path.
- Compose Watch or other workflow modernization can remain a later enhancement if needed.

**Alternatives considered:**
- Switch immediately to Compose Watch or a new container strategy: rejected because it expands scope beyond the evidence-driven problem.

## Risks / Trade-offs

- **[Longer frontend startup]** → Running `bun install` during container startup increases boot time; mitigate by keeping `node_modules` on a dedicated volume so subsequent syncs are incremental.
- **[Runtime install failures become startup blockers]** → If dependency resolution fails, the frontend will stay down; mitigate with clear log output and documented recovery steps.
- **[Warning policy ambiguity]** → The VeeValidate/Zod warning may remain unless the team chooses between installing the official adapter or documenting the custom bridge; mitigate by making that decision explicit in tasks.
- **[Scope creep into general log cleanup]** → Container logs contain many non-blocking messages; mitigate by limiting the change to warnings tied directly to dependency sync and known missing locale keys.

## Migration Plan

1. Define the desired runtime dependency-sync behavior for the frontend dev container.
2. Update the Docker development spec and dependency-health spec to require runtime startup correctness.
3. Add or refine startup scripts, Docker config, and documentation to match that contract.
4. Fix the known missing locale key that currently pollutes container logs.
5. Verify the frontend container starts successfully after a dependency change and confirm that known missing-module errors no longer occur.

Rollback strategy:
- Revert the frontend startup script and Docker dev changes if startup-time installs prove too disruptive.
- Restore the prior Docker command flow while keeping the new documentation and specs for a follow-up implementation.

## Open Questions

- Should the project install `@vee-validate/zod` to satisfy the module warning, or should the custom Zod bridge remain the intentional path and be documented as such?
- Should the frontend dev workflow keep anonymous volumes for `/app/node_modules`, or should the change also formalize them as named volumes for easier debugging and reset procedures?
- Is Vite `optimizeDeps.include` for Scalar worth including in the first pass, or should it be left as follow-up noise reduction after the runtime-sync fix lands?
