## Why

The backend stack is running significantly outdated dependencies with SurrealDB 1.5.0 trailing **2 major versions** behind the current 3.0.4 release. This version gap blocks access to critical security patches, performance improvements (IPX v3, HNSW vector indexes), and modern features like GraphQL support and client-side transactions. Additionally, SurrealDB 1.x will eventually reach end-of-life, making migration mandatory. Upgrading now—while the database is manageable in size—allows for controlled migration with proper testing, rather than forced migration under time pressure later.

## What Changes

### Database: SurrealDB 1.5.0 → 3.0.4 [CRITICAL BREAKING]

**SQL Syntax Changes:**
- `UPDATE` no longer creates records → use `UPSERT` for create-or-update behavior
- `file://` storage deprecated → use `rocksdb://` or `surrealkv://`
- `DEFINE SCOPE` removed → use `DEFINE ACCESS TYPE RECORD`
- `SEARCH ANALYZER` → `FULLTEXT ANALYZER`
- `MTREE` index removed → use `HNSW` for vector search
- `<future>` type removed → use computed fields in `DEFINE FIELD`
- `LET $param` now required (previously implicit)

**Function Renames (40+):**
- `string::endsWith()` → `string::ends_with()`
- `duration::from::days` → `duration::from_days`
- `type::is::record` → `type::is_record`
- `meta::tb()` → `record::tb()`
- `rand::guid()` → `rand::id()`

**Authentication:**
- Auth enabled by default → use `--unauthenticated` for old behavior
- HTTP headers now require `surreal-` prefix

**Migration Path:**
```bash
# Step 1: Backup
surreal export backup.json

# Step 2: Fix data for 2.x
surreal fix rocksdb:mydata

# Step 3: Export with v3 compatibility
surreal export --v3 v3-export.json

# Step 4: Restore on 3.0.4
surreal import v3-export.json
```

### Web Framework: Axum 0.7.9 → 0.8.8 [BREAKING]

**Route Syntax Migration:**
```rust
// OLD (0.7):
.route("/users/:id", get(handler))
.route("/files/*path", get(catch_all))

// NEW (0.8):
.route("/users/{id}", get(handler))
.route("/files/{*path}", get(catch_all))
```

**Other Changes:**
- Remove `async_trait` macro (native async traits supported)
- `Option<Extractor>` behavior change (requires `OptionalFromRequestParts`)
- MSRV: Rust 1.80+

### Authentication: jsonwebtoken 9 → 10.3.0 [BREAKING]

- Must choose crypto backend explicitly:
  ```toml
  jsonwebtoken = { version = "10", features = ["aws_lc_rs"] }
  # OR
  jsonwebtoken = { version = "10", features = ["rust_crypto"] }
  ```
- MSRV: Rust 1.85.0
- Pem decoding requires `use_pem` feature

### Safe Updates (No Breaking Changes)

- **tokio**: 1.42.0 → 1.50.0
- **tower-http**: 0.5.2 → 0.6.8
- **utoipa**: 4.2.3 → 5.4.0
- **utoipa-scalar**: 0.1.0 → 0.3.0
- **chrono**: 0.4.38 → 0.4.44
- **image**: 0.25 → 0.25.10
- **lettre**: 0.11.3 → 0.11.19

### Infrastructure Updates

**Docker:**
- SurrealDB image: `surrealdb/surrealdb:v1.5.6` → `v3.0.4`
- Rust toolchain: Ensure 1.85+ for jsonwebtoken v10

## Capabilities

### New Capabilities
- `surrealdb-v3`: Access to GraphQL (stable), client-side transactions, computed fields, HNSW vector indexes
- `database-migration`: Automated migration tooling from 1.x to 3.x

### Modified Capabilities
- `api-routes`: Update Axum route syntax from `:param` to `{param}`
- `authentication`: Migrate jsonwebtoken to v10 with crypto backend
- `database-queries`: Update all SQL queries for v3 compatibility

## Impact

### Files Modified
- `backend/Cargo.toml` - Update all crate versions
- `backend/Cargo.lock` - Regenerate
- `backend/src/main.rs` - Update route definitions (Axum 0.8 syntax)
- `backend/src/handlers/*.rs` - Update any route-specific code
- `backend/src/db/migrations/*.sql` - Update SQL syntax for v3
- `backend/src/db/mod.rs` - Update connection strings
- `docker-compose.yml` - Update SurrealDB image tag

### Database Migration Required
**CRITICAL**: Database cannot be simply upgraded—migration required!

**Process:**
1. Export data from 1.5.x
2. Run `surreal fix` for 2.x compatibility
3. Export with `--v3` flag
4. Import into fresh 3.0.4 instance

### Testing Requirements
- All 13 API handlers
- Authentication flow (register, login, refresh, logout)
- Database CRUD operations
- Migration validation
- Docker compose full stack

### Rollback Strategy
- Full database backup before migration
- Docker volume snapshots
- Ability to revert to v1.5.6 image

## Goals

1. Upgrade SurrealDB from 1.5.0 to 3.0.4 with zero data loss
2. Migrate all SQL queries to v3 syntax
3. Update Axum routes to 0.8 syntax
4. Migrate jsonwebtoken to v10 with crypto backend
5. Maintain full API compatibility

## Non-Goals

1. Schema redesign (keep existing tables/fields)
2. New features beyond version upgrades
3. Frontend changes
4. API contract changes (endpoints remain same)
