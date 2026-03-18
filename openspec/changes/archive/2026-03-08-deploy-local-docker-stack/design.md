## Context

Esperion already contains a local Docker topology in `docker-compose.yml`, plus development Dockerfiles in `frontend/Dockerfile.dev`, `frontend/Dockerfile`, and `backend/Dockerfile`. The intended workflow is a 3-container local stack, but the implementation and documentation have drifted: comments still call the frontend Nuxt 4 even though `frontend/package.json` uses Nuxt 3.20.2, the SurrealDB runtime is pinned to `surrealdb/surrealdb:v1.5.6` while some OpenSpec context still says 3.x, and the database service currently runs in `memory` mode despite a named volume being defined.

The stack spans multiple modules and developer workflows, so it needs an explicit design before implementation. The goal is not to invent a new architecture, but to make the existing local Docker path deterministic, verifiable, and aligned with the repo's actual runtime contracts.

## Goals / Non-Goals

**Goals:**
- Standardize one local Docker development workflow with exactly three services: `frontend`, `backend`, and `database`.
- Ensure the frontend and backend use hot reload in-container and expose the correct host-accessible ports.
- Make environment-variable responsibilities explicit for container-to-container communication versus host-based commands.
- Resolve the persistence contradiction for SurrealDB so the local stack either truly persists data or clearly documents an intentionally ephemeral mode.
- Define verification steps that prove the deployed containers are the correct services and that hot reload works.
- Align OpenSpec and local deployment docs with the actual Docker/runtime truth in the repository.

**Non-Goals:**
- Production deployment redesign in `infrastructure/docker-compose.prod.yml` or staging deployment changes.
- Application feature work in Nuxt pages, Axum handlers, or SurrealDB schema beyond what is required to run the local stack.
- Replacing Docker Compose with Kubernetes, Tilt, Dev Containers, or another local orchestration tool.
- Broad authentication, API, or frontend architecture changes unrelated to local deployment correctness.

## Decisions

### 1. Use a single 3-service local topology as the source of truth

The local stack will be defined around the existing three services in `docker-compose.yml`: Nuxt frontend, Rust/Axum backend, and SurrealDB database. This keeps the change grounded in the repo's current entry point instead of introducing parallel local-compose files that would drift again.

**Rationale:** the user asked for the local Docker deployment "sesuai openspec" with three containers. The repo already has that shape, so the safest change is to tighten and verify it rather than introduce a competing stack.

**Alternatives considered:**
- Create a separate `docker-compose.dev.yml`: rejected for this change because it would add another source of truth before the main local stack is corrected.
- Keep mixed workflows (`docker compose up database` + host backend/frontend): rejected because it does not satisfy the explicit 3-container deployment goal.

### 2. Align version truth with runnable code, not stale prose

The change will treat `frontend/package.json`, `backend/Cargo.toml`, and the active compose image tags as authoritative. That means the local stack design targets Nuxt 3.x and SurrealDB 1.5.x compatibility, even if older docs or OpenSpec context still mention Nuxt 4 or SurrealDB 3.x.

**Rationale:** this is the only way to produce a deployable local stack without hidden version mismatches.

**Alternatives considered:**
- Follow the older Nuxt 4 / SurrealDB 3.x prose: rejected because it conflicts with the installed dependencies and known migration compatibility fixes.

### 3. Keep Docker-native service networking distinct from host-facing ports

The design will document two separate connection views:
- inside Docker network: services talk to `backend:8080` and `database:8000`
- from the host: developers reach frontend on `localhost:3000`, backend on the mapped host port, and database on its mapped host port

**Rationale:** the repo currently mixes host and container port assumptions across compose files and `.env` examples. Making both views explicit removes the most common source of failed local startup.

**Alternatives considered:**
- Use one port value everywhere: rejected because host mappings and container ports are intentionally different in the current stack.

### 4. Specify hot reload as an observable behavior, not just a command string

Frontend hot reload will be defined in terms of Nuxt dev server reachability, mounted source visibility, and browser-refresh/HMR behavior when files change. Backend hot reload will be defined in terms of `cargo-watch` detecting source changes, recompiling, and restarting the Axum server with new code active.

The implementation may continue using the current `cargo watch -s "cargo run"` or normalize to `cargo watch -x run`, but the design treats the requirement as "automatic rebuild and restart with visible logs" rather than a single magic string.

**Rationale:** the repo already shows functionally similar variants in docs versus Dockerfiles. Specifying the behavior prevents false failures caused by minor command-shape differences.

**Alternatives considered:**
- Lock the spec to one exact cargo-watch command immediately: deferred until implementation confirms which variant works best in this container image.

### 5. Require persistence semantics to match the documented mode

If the local stack claims persistent database behavior, the database container must use a persistent SurrealDB engine path backed by the named volume. If the team intentionally keeps `memory` mode for a faster ephemeral developer reset, the docs and verification steps must say that clearly and drop persistence claims.

**Rationale:** the current compose file defines a named volume and comments about persistence, but the actual command uses `memory`, which discards data on restart.

**Alternatives considered:**
- Leave the contradiction as-is and document around it: rejected because it makes verification meaningless.

### 6. Verification must prove both container identity and dev ergonomics

The change will consider the local stack correct only when verification can show:
- exactly three expected services are running
- each exposed endpoint is reachable
- frontend code changes trigger a live dev update
- backend code changes trigger automatic rebuild/restart
- the database mode matches the documented persistence expectation

**Rationale:** "docker compose up" alone is not enough evidence that the right stack was deployed or that hot reload actually works.

## Risks / Trade-offs

- [Docker Desktop file watching behaves differently across OSes] -> Document and, if needed, enable polling-oriented environment variables for local dev.
- [Rust rebuilds can be slow in containers] -> Keep scope focused on correctness and clear caching/volume strategy rather than over-optimizing the image in the same change.
- [Changing SurrealDB from memory to persistent storage may alter existing local developer expectations] -> Make persistence mode an explicit decision in docs and verification, with a rollback path.
- [Port changes may break existing personal `.env` files] -> Preserve current external ports where possible and document host-vs-container variables clearly.
- [Stale OpenSpec/project context may continue to mention old versions] -> Update the change artifacts and local deployment docs so implementation has a newer, evidence-based source of truth.

## Migration Plan

1. Audit the current local Docker files, env templates, and Docker-related docs against the intended 3-container development workflow.
2. Update compose and Dockerfile/dev configuration so the frontend, backend, and database all start with the expected images, commands, networking, and reload behavior.
3. Reconcile persistence and environment handling, especially database engine mode and host-versus-container connection settings.
4. Validate the stack by starting the containers locally, checking service reachability, and exercising hot reload in frontend and backend containers.
5. Update README/OpenSpec deployment documentation to match the verified behavior exactly.
6. If a change introduces regressions, roll back by restoring the previous compose/Dockerfile state and documenting which verification step failed.

## Open Questions

- Should the backend remain exposed as host `8081` -> container `8080`, or should the local stack normalize to host `8080` if that does not conflict with existing expectations?
- Should the local database default be persistent storage or intentionally ephemeral `memory` mode for easier resets?
- Do we want the main local compose file to absorb polling-oriented frontend settings now, or keep them as conditional guidance for Docker Desktop users only?
