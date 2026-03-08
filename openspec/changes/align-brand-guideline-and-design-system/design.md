## Context

Esperion's public surfaces currently present one brand in fragments: Indonesian SEO metadata but English visible copy, `es-*` tokens in many modern public pages but `esperion-*` tokens in legal and language surfaces, and placeholder founders/authors/trust content in places where credibility matters. The existing `esperion-agency-web` spec also refers to token vocabulary that no longer matches much of the implementation.

This change creates the governance layer for public brand compliance so that theme, routing, and asset fixes can converge on one brand standard instead of four separate interpretations.

Scope guardrail: this change is intentionally limited to visible copy, placeholder trust content, and consistency of the public design-system vocabulary. It is not a blanket instruction to clean every unrelated public-page defect.

## Goals / Non-Goals

**Goals:**
- Define measurable public brand-guideline compliance criteria.
- Align visible public copy direction with Esperion's intended voice and language posture.
- Standardize the public design-system vocabulary used in templates and specs.
- Remove placeholder trust content from brand-critical public areas or classify it for replacement.
- Align future spec language with the final public design-system vocabulary.

**Non-Goals:**
- Rebuilding theme-state mechanics.
- Fixing route/data behavior.
- Restoring asset files themselves.
- Rewriting backend domain models except where public brand compliance depends on displayed fields.
- General visual cleanup that is not directly tied to copy, trust content, or vocabulary consistency.

## Decisions

### Decision: Public brand compliance is evaluated on visible content, not only metadata
- SEO/meta localization alone is not sufficient for brand compliance.
- Public page headings, body copy, CTA labels, trust sections, and other visible UI text must follow the declared public brand language strategy.
- Rationale: the current repo already shows Indonesian metadata with English UI, which proves metadata alone is not a useful proxy.

### Decision: Public design-system vocabulary must converge on one semantic family
- The public brand/design contract must use one shared token vocabulary, aligned with the final theme decision rather than continuing to mix `es-*` and `esperion-*` names.
- Legacy token names may only survive as migration aids, not as the ongoing public brand language.

### Decision: Placeholder trust content is a brand defect, not just sample content
- Founder identities, authors, and similar trust-signaling content cannot remain as obvious placeholders if the page presents them as real Esperion information.
- Such content must either be replaced with validated real data, reframed as generic/non-identity content, or removed from the trust claim surface.

### Decision: Spec terminology must be synchronized with the final public vocabulary
- Future public-facing specs should refer to the same token and brand vocabulary that the implementation actually uses.
- Rationale: the current drift between spec examples and implementation names makes compliance reviews ambiguous.

## Risks / Trade-offs

- [Visible copy alignment may require stakeholder input] -> Separate policy/governance decisions from final copy polish where needed.
- [Token vocabulary alignment depends on theme decisions] -> Treat this change as downstream-compatible with the canonical theme-token direction.
- [Removing placeholder trust content can temporarily reduce content density] -> Prefer honest minimal content over fabricated credibility.
- [Brand and SEO goals may not always align word-for-word] -> Define a clear primary language strategy and keep metadata/UI consistent with it.
- [Scope can sprawl into unrelated public cleanup] -> Accept only work tied directly to visible copy, placeholder trust content, or design-system vocabulary consistency.

## Migration Plan

1. Define the final public brand compliance checklist.
2. Audit public pages and components against visible copy, trust content, and design-system vocabulary.
3. Reclassify placeholder trust content into replace, reframe, or remove categories.
4. Align spec language with the final public design-system vocabulary.
5. Use the checklist as a gating standard for follow-up implementation changes.

## Open Questions

- What is the final public language stance: Indonesian-first with English support, or bilingual parity by route?
- Which trust-signaling sections already have approved real content available from stakeholders?
- Should legal and language UI surfaces be brought into full public-brand review in the same wave as marketing pages, or immediately after theme alignment?
