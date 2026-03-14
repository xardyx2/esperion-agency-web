# BACKEND GUIDE

## OVERVIEW

Rust/Axum API server with SurrealDB 1.5.0, exact version pinning, and 6 email provider abstraction.

## STRUCTURE

```text
backend/
├── src/
│   ├── main.rs              # Entry point, build_router(), migration CLI
│   ├── lib.rs               # Library exports
│   ├── handlers/            # API handlers (17 modules)
│   ├── services/            # Business logic (email, translation, image)
│   ├── models/              # Data models
│   ├── middleware/          # Auth, CORS
│   └── db/                  # Schema, migrations
├── tests/                   # Integration tests
├── Cargo.toml               # Exact version pins
└── .env.example             # Environment template
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Server startup and routes | `backend/src/main.rs` | `build_router()` wires all routes |
| HTTP handlers | `backend/src/handlers/` | Auth, articles, media, contact, etc. |
| Models | `backend/src/models/` | Shared request and domain types |
| Services | `backend/src/services/` | Email (6 providers), translation, image processing |
| Database bootstrapping | `backend/src/db/` | Connection, schema, migrations |
| Migration registry | `backend/src/db/migrations/mod.rs` | Versions 1.0.0 and 1.1.0 only |

## CONVENTIONS

- Treat `backend/Cargo.toml` and code as version source of truth
- Use migration CLI paths wired in `backend/src/main.rs`
- Explicit error handling — avoid `unwrap()` in production paths
- Exact version pinning for critical deps (Axum, SurrealDB, Tokio)
- Handler vs service boundary: handlers handle HTTP, services handle business logic

## ANTI-PATTERNS (THIS PROJECT)

- Never trust older docs without checking code
- Never assume all SQL files are active — verify in `migrations/mod.rs`
- Never update handler status docs from audit files alone
- Never place test files in `src/` — use `tests/` directory
- Never mix handler and service concerns (e.g., `analytics.rs` in handlers)

## UNIQUE STYLES

- 6 email provider abstraction: SMTP, SendGrid, Mailgun, SES, Postmark, SMTP2GO
- High-security Argon2: 64MB memory cost, 3 iterations, parallelism 4
- File-based SurrealDB persistence: `file:/data/esperion.db`
- Nightly Rust in Docker (not stable)
- 7d JWT access token / 30d refresh token strategy
- Migrations only register versions 1.0.0 and 1.1.0 despite `003_*` and `004_*` existing

## COMMANDS

```bash
# Development (Docker only)
docker-compose up -d backend

# Build
cargo build --release

# Run migrations
cargo run -- migrate
cargo run -- migrate-status
cargo run -- migrate-rollback -v 1.0.0

# Testing
cargo test
cargo test -- --nocapture        # Show output
cargo test auth_tests            # Specific test suite
```

## NOTES

- Migration manager registers only 1.0.0 and 1.1.0 — `003_*` and `004_*` SQL files exist but are inactive
- Email service constructed at startup in `main.rs`
- 50+ `unwrap()` calls found — mostly in tests, but 6+ in production code (`user_management.rs`)
- `routes/mod.rs` is a stub — routes registered inline in `build_router()`
- Rust version drift: `1.75` (ci.yml) vs `1.80` (ci-cd.yml) vs nightly (Dockerfile)
