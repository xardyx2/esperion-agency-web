## Context

The frontend already loads multiple analytics and pixel integrations, and it also fetches analytics configuration and sends tracking events through backend endpoints. Because the project may later consider a privacy-friendly analytics module, the immediate need is not “add another tracker,” but to map the current stack, identify overlap, and define governance for what should be collected and under what privacy expectations.

This change crosses frontend runtime config, client plugins, dashboard-managed analytics settings, and backend analytics endpoints.

## Goals / Non-Goals

**Goals:**
- Inventory the current analytics and pixel stack across frontend and backend boundaries.
- Classify trackers by purpose, ownership, and privacy risk.
- Define decision criteria for whether a privacy-friendly analytics module should be adopted.
- Prevent duplicate tracking and unclear consent expectations.

**Non-Goals:**
- Immediately replacing all existing analytics providers.
- Rewriting backend analytics reporting.
- Bundling unrelated security or SEO work into the analytics audit.

## Decisions

### 1. Audit before adding
The project should not adopt another analytics module until the current integrations and backend tracking flow are clearly understood. This change therefore starts with inventory and governance, not immediate adoption.

### 2. Separate tracker purpose from implementation detail
Trackers will be classified by function: operational analytics, marketing pixels, session insight tools, and potential privacy-friendly measurement. This makes it easier to identify overlap and redundant events.

### 3. Keep backend configuration as the coordination anchor
Because the dashboard and backend already manage analytics configuration and public tracking endpoints, any future frontend privacy-friendly module must integrate with that control plane rather than bypass it.

### 4. Define consent and exposure rules before module selection
Any candidate privacy-friendly module should be evaluated only after the project defines what data can be collected without consent, what requires opt-in, and what must be environment-gated.

## Risks / Trade-offs

- **[Risk] Duplicate event collection skews reporting** -> **Mitigation:** define tracker ownership and event responsibility before adding new integrations.
- **[Risk] Privacy tooling is added without policy clarity** -> **Mitigation:** require governance and consent criteria before adoption.
- **[Risk] Dashboard settings diverge from runtime behavior** -> **Mitigation:** map settings, public config, and client plugin responsibilities explicitly.

## Migration Plan

1. Inventory current tracker loading, settings, and endpoints.
2. Classify current integrations by purpose and privacy posture.
3. Define acceptance criteria for any future privacy-friendly analytics module.
4. If adoption is justified, spin follow-up implementation work from the audit outcomes.

Rollback is minimal because the initial phase is analysis and policy definition rather than immediate platform replacement.

## Open Questions

- Which current trackers are mandatory business requirements versus legacy carry-over?
- Is a privacy-friendly analytics layer intended to complement existing marketing pixels or replace some of them?
