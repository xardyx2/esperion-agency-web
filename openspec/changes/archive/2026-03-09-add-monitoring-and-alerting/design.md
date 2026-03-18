## Context

The repository already contains foundational pieces that can support monitoring and alerting, but they are not wired into a real operational flow yet:
- Backend has `site_settings` storage (`backend/src/db/schema.rs`) that can persist operational config.
- Frontend dashboard settings page still uses placeholder/static fields (`frontend/app/pages/dashboard/settings.vue`).
- Infrastructure monitoring placeholder exists (`infrastructure/monitoring/uptime-kuma.yaml`) but is not integrated with runtime alert routing.

This design defines an implementation that satisfies monitoring coverage (uptime, errors, performance), configurable alert routing, and real settings-backed dashboard behavior.

## Goals / Non-Goals

**Goals:**
- Provide real monitoring signal coverage for uptime, application error, and request/performance metrics.
- Add configurable alert routing with threshold-based triggering and supported notification channels.
- Replace placeholder monitoring settings in dashboard with real read/write configuration and current integration status.
- Keep implementation aligned with existing stack patterns (Nuxt dashboard + Axum handlers + SurrealDB schema/migrations).

**Non-Goals:**
- Building a full observability platform with long-term metrics warehousing.
- Reworking unrelated dashboard settings (analytics/pixels, backup, public content).
- Replacing existing email provider architecture.

## Decisions

### 1) Monitoring integration via provider adapters

**Decision:** Implement monitoring via adapter interfaces for three signal classes:
- Uptime: external uptime source (Uptime Kuma integration endpoint)
- Errors: Sentry ingestion/state checks
- Performance: application-level metrics endpoint (latency/error-rate summaries) plus optional synthetic uptime probe latency

**Rationale:** Keeps integrations explicit and swappable while avoiding hard-coding one vendor into handlers.

**Alternatives considered:**
- Single-vendor lock-in for all signal classes: rejected due to flexibility and migration risk.
- Fully in-house monitoring stack: rejected for initial scope/time; too much operational overhead for this change.

### 2) Configuration persistence in `site_settings` with namespaced keys

**Decision:** Persist monitoring and alert config in existing `site_settings` table using namespaced keys such as:
- `monitoring.integrations`
- `monitoring.thresholds`
- `monitoring.destinations`
- `monitoring.enabled_services`

**Rationale:** Reuses existing schema and avoids premature table sprawl for mostly document-shaped configuration.

**Alternatives considered:**
- New `monitoring_settings` table: deferred; useful if config query patterns become complex.

### 3) Add explicit alert domain tables (rules, instances, deliveries)

**Decision:** Add dedicated SurrealDB tables for alert lifecycle instead of a single event blob table:
- `alert_rules`: threshold definitions and routing metadata.
- `alert_instances`: fired/resolved lifecycle records with idempotency key.
- `alert_deliveries`: per-channel delivery attempts, retry state, and terminal outcome.

Proposed fields:
- `alert_rules`: `name`, `signal_type`, `service`, `window_seconds`, `operator`, `threshold_value`, `severity`, `enabled`, `destinations`, `created_at`, `updated_at`.
- `alert_instances`: `alert_key` (unique), `rule_id`, `service`, `observed_value`, `state`, `fired_at`, `resolved_at`, `acknowledged_by`, `silenced_until`, `metadata`.
- `alert_deliveries`: `instance_id`, `channel`, `destination`, `attempt_count`, `last_error`, `next_retry_at`, `delivery_status`, `created_at`, `updated_at`.

**Rationale:** This model gives strong auditability, robust retries, and idempotent state transitions that are hard to maintain in one denormalized table.

**Alternatives considered:**
- Single `alert_events` table: rejected due to weak idempotency and limited retry/audit clarity.
- Logging-only approach: rejected because it is hard to query for dashboard/history and verification.

### 4) Backend API surface for settings, status, and test delivery

**Decision:** Add authenticated dashboard APIs under `/api/v1/monitoring`:
- `GET /api/v1/monitoring/settings` (load current config and integration states)
- `PUT /api/v1/monitoring/settings` (update thresholds/destinations/services)
- `GET /api/v1/monitoring/status` (uptime/error/perf summarized state)
- `GET /api/v1/monitoring/alerts` (recent alert events)
- `POST /api/v1/monitoring/alerts/test` (trigger controlled test alert)

**Rationale:** Separates config management from operational reads and supports verification workflows.

**Alternatives considered:**
- Extending generic settings endpoint only: rejected due to weak separation and poor discoverability.

### 5) Alert delivery channels and routing engine

**Decision:** Implement channel adapters with routing policy from persisted config:
- Email channel (reuse existing email service)
- Webhook channel (Slack/Discord/Teams via generic webhook payload)

Routing behavior:
- Evaluate threshold crossings in a backend scheduled job (not in UI/request path).
- Use idempotency keys (`rule_id + window + service + severity`) and cooldown windows to avoid duplicates.
- Persist lifecycle states (`pending`, `firing`, `acknowledged`, `resolved`, `delivery_failed`, `silenced`).
- Retry transient delivery failures with bounded exponential backoff + jitter and persist each attempt in `alert_deliveries`.

**Rationale:** Covers immediate operational needs and maps to requirement for configurable destinations.

**Alternatives considered:**
- Email-only MVP: rejected because requirement explicitly expects configurable channels.

### 6) Frontend dashboard settings replacement and validation

**Decision:** Replace placeholder monitoring section in dashboard settings with a real monitoring panel that:
- Fetches integration status + current thresholds/destinations from API.
- Validates destination payloads (email format, webhook URL).
- Persists updates via `PUT /api/v1/monitoring/settings`.
- Supports sending a test alert from UI.

**Rationale:** Directly satisfies spec requirement that settings reflect real integrations rather than placeholders.

**Alternatives considered:**
- Keep static form and rely on env variables only: rejected because no runtime configurability or truthfulness.

### 7) Security, validation, and operational safeguards

**Decision:**
- Restrict monitoring routes to authenticated admin/editor roles according to current auth middleware patterns.
- Validate threshold ranges and destination schema server-side; reject partial-invalid writes atomically.
- Redact secrets/tokens in API responses and logs.

**Rationale:** Monitoring settings can impact incident response and may include sensitive integration details.

**Alternatives considered:**
- Client-side-only validation: rejected; insufficient for integrity/security.

## Risks / Trade-offs

- **[Risk] Provider API instability or outage** -> **Mitigation:** adapter timeouts, fallback status as `degraded`, and explicit health fields in status response.
- **[Risk] Alert storms from noisy thresholds** -> **Mitigation:** cooldown + deduplication keys by service/signal/severity.
- **[Risk] Misconfigured destinations cause silent failures** -> **Mitigation:** destination validation + test-alert endpoint + delivery status tracking in `alert_deliveries`.
- **[Risk] Migration drift** -> **Mitigation:** add migration SQL and register it in `backend/src/db/migrations/mod.rs` before rollout.
- **[Risk] UI overclaims integration health** -> **Mitigation:** frontend displays backend-reported integration state only, not assumed defaults.

## Migration Plan

1. Add DB migrations for `alert_rules`, `alert_instances`, and `alert_deliveries` with indexes (including unique index on `alert_key`).
2. Register migration version in `backend/src/db/migrations/mod.rs`.
3. Implement backend models/services/handlers for monitoring config, status polling, alert routing, and async delivery retry processing.
4. Wire new monitoring routes in `backend/src/main.rs` with existing middleware/auth flow.
5. Replace dashboard placeholder settings block with API-backed monitoring settings UI.
6. Add verification:
   - Backend tests for threshold evaluation, deduplication, and delivery retry behavior.
   - Frontend tests for settings load/save/test-alert flow.
   - End-to-end check that triggered condition produces persisted `alert_instance` and channel delivery attempts.
7. Rollback strategy:
   - Disable monitoring via config flags.
   - Keep previous settings page fallback hidden behind feature gate if needed.
   - Rollback DB migration if deployment must revert before data dependency is established.

## Open Questions

- Which notification channels are officially approved for phase-1 beyond email and generic webhook?
- What are default threshold values per service (uptime SLA, error-rate, p95 latency) for initial rollout?
- Should Sentry DSN and Uptime provider credentials be environment-only or partially managed in encrypted settings?
- What retention period is required for `alert_events` (for ops review and compliance)?
