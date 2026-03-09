# PROJECT KNOWLEDGE BASE

## OVERVIEW

- Repo focus: Esperion agency web platform with Nuxt frontend, Rust backend, and an active OpenSpec change.
- Real workflow anchor: `openspec/changes/esperion-agency-web/`, not the mixed legacy memory or audit layers.

## STRUCTURE

```text
.
|- frontend/       Nuxt app, unit tests, Playwright
|- backend/        Rust/Axum API, migrations, services
|- openspec/       Active change and workflow config
|- memory-bank/    Derived handoff docs
|- .sisyphus/      Historical plans and audits
|- .opencode/      OpenCode commands and skills
|- .cline/         Legacy Cline skills
|- .qwen/          Legacy Qwen commands and skills
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Current implementation scope | `openspec/changes/esperion-agency-web/tasks.md` | Checkbox truth for active work |
| Workflow context | `openspec instructions apply --change "esperion-agency-web" --json` | Prefer CLI over hand-written summaries |
| Frontend behavior | `frontend/` | Use `frontend/package.json` and `frontend/nuxt.config.ts` as ground truth |
| Backend behavior | `backend/` | `backend/src/main.rs` wires routes and startup |
| Project memory | `memory-bank/` | Derived context, keep aligned with code |

## CODE MAP

- `frontend/app/pages/` public and dashboard page tree
- `frontend/app/stores/` Pinia state
- `backend/src/handlers/` API handlers
- `backend/src/services/` email, translation, image logic
- `backend/src/db/migrations/mod.rs` migration registry

## CONVENTIONS

- Prefer OpenSpec CLI output and code over README status blurbs.
- Vue uses `script setup` with TypeScript.
- Avoid `any` in TypeScript.
- Avoid hardcoded hex colors in Vue templates; use semantic classes.
- Rust production paths should avoid unchecked `unwrap()` usage.

## ANTI-PATTERNS

- Do not treat `.sisyphus/` or `.clinememory/` as the primary task tracker.
- Do not assume duplicated agent configs under `.cline/`, `.qwen/`, and `.opencode/` are synchronized.
- Do not let `%TEMP%/OpenSpec/`, `.nuxt/`, or `frontend/.nuxt/` pollute normal codebase searches.
- Do not trust a single progress number without checking OpenSpec CLI output.

## UNIQUE STYLES

- This repo has overlapping legacy agent systems; keep new guidance centralized and repo-specific.
- Favor small factual docs updates over broad historical rewrites.

## COMMANDS

```bash
openspec list --json
openspec instructions apply --change "esperion-agency-web" --json
npm run dev
npm run test:unit
npm run test:e2e
cargo run
cargo test
cargo run -- migrate-status
```

## MANDATORY: DOCKER-ONLY DEVELOPMENT

**CRITICAL RULE: ALWAYS use Docker for development. NEVER run locally.**

### Why Docker?
- ✅ Consistent environment across team
- ✅ Port 3000 always available (no conflicts)
- ✅ All services (frontend, backend, database) connected
- ✅ No local dependency issues
- ✅ Production-like environment

### How to Run

```bash
# Start all services (frontend + backend + database)
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f frontend
docker-compose logs -f backend

# Restart frontend only
docker-compose restart frontend

# Rebuild frontend
docker-compose up -d --build frontend
```

### Access URLs
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8081/api/v1
- **SurrealDB:** http://localhost:8002

### Anti-Patterns (DO NOT DO)
- ❌ `npm run dev` outside Docker
- ❌ `cd frontend && npm install` locally
- ❌ Running backend with `cargo run` locally
- ❌ Direct database access outside Docker network

### Troubleshooting

**Port conflicts:**
```bash
# Stop all containers
docker-compose down

# Remove orphaned containers
docker-compose down --remove-orphans

# Start fresh
docker-compose up -d
```

**Stale build:**
```bash
# Rebuild frontend with fresh node_modules
docker-compose up -d --build frontend
```

## NOTES

- Current docs drift: some prose files still say Nuxt 4 and SurrealDB 3.x, while manifests show Nuxt 3.20.2 and surrealdb 1.5.0.
- Create new subdirectory guidance only where the local domain is distinct; see `frontend/AGENTS.md`, `backend/AGENTS.md`, and `openspec/AGENTS.md`.
