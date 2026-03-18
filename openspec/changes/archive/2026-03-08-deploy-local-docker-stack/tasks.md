## 1. Audit And Normalize Local Docker Inputs

- [x] 1.1 Audit `docker-compose.yml`, `frontend/Dockerfile.dev`, `frontend/Dockerfile`, `backend/Dockerfile`, `frontend/package.json`, and env templates to record the current local 3-container workflow, version truth, port mappings, and known mismatches. Expected outcome: a single implementation checklist exists for service names, commands, ports, and persistence assumptions.
- [x] 1.2 Decide and document the intended local database mode (persistent volume-backed storage or explicitly ephemeral memory mode) based on `docker-compose.yml` and developer workflow needs. Acceptance criteria: the chosen mode is consistent with the compose command and future docs.

## 2. Correct Docker Compose And Container Definitions

- [x] 2.1 Update `docker-compose.yml` so the local stack runs exactly the expected `frontend`, `backend`, and `database` services with verified images, startup commands, and service dependencies. Acceptance criteria: compose configuration reflects the intended 3-container stack without stale version comments.
- [x] 2.2 Update `frontend/Dockerfile.dev` and, if needed, `frontend/Dockerfile` so Nuxt development binds correctly for container access and supports hot reload in local Docker. Acceptance criteria: frontend dev server settings align with the compose workflow and host access on port 3000.
- [x] 2.3 Update `backend/Dockerfile` so the backend development container exposes a clear hot-reload path for Axum using cargo-watch and matches the documented local workflow. Acceptance criteria: backend container command supports automatic rebuild/restart on source changes.
- [x] 2.4 Reconcile root and backend env templates (`.env.example`, `backend/.env.example`, and related docs if needed) so host-vs-container connection values are unambiguous. Acceptance criteria: developers can tell which DB/API values apply inside Docker and which apply from the host.

## 3. Align Documentation With Verified Local Behavior

- [x] 3.1 Update `README.md` and any Docker-specific local setup docs to describe the verified local startup command, the 3 expected containers, host ports, and persistence behavior. Acceptance criteria: the docs match the compose and Dockerfile behavior exactly.
- [x] 3.2 Fix stale local deployment wording in related docs or comments that still claim outdated runtime versions or contradictory Docker behavior. Acceptance criteria: Nuxt and SurrealDB version references relevant to local Docker are consistent with `frontend/package.json`, `backend/Cargo.toml`, and compose images.

## 4. Verify Local Deployment And Hot Reload

- [x] 4.1 Start the local Docker stack and verify that exactly three expected services are running and reachable on their documented host ports. Acceptance criteria: frontend, backend, and database all start successfully and expose the expected endpoints.
- [x] 4.2 Exercise frontend hot reload by changing a frontend source file and confirming the in-container development server reflects the change without manual restart. Acceptance criteria: file change is detected and the development UI updates.
- [x] 4.3 Exercise backend hot reload by changing a Rust source file and confirming the backend container rebuilds/restarts automatically with visible logs. Acceptance criteria: source change triggers rebuild behavior without manual container restart.
- [x] 4.4 Re-check database behavior after restart to confirm it matches the documented persistence mode, then record the verification outcome in the updated docs/OpenSpec notes. Acceptance criteria: restart behavior matches the chosen persistent or ephemeral design.
