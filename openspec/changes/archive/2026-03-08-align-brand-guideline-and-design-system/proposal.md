## Why

The public website currently mixes Indonesian SEO metadata with English visible copy, uses both `es-*` and `esperion-*` design-token families, and still ships placeholder identities in trust-sensitive sections. This change is needed now because Esperion cannot claim brand-guideline compliance while public pages use split voice, split token language, and inconsistent design-system decisions.

### Problem Summary
- Visible public copy does not consistently follow the Esperion brand voice direction.
- Brand/system tokens are split between legacy and newer naming schemes.
- Some public pages still use placeholder founder names, authors, and generic trust content.
- Spec language and implementation language have already drifted apart.

### End Goal
- Public pages communicate one Esperion voice, one design-system vocabulary, and one credible presentation standard.
- Brand fit can be reviewed against explicit criteria instead of ad hoc visual judgment.

## What Changes

- Define brand-guideline compliance criteria for public-page copy, trust content, and semantic styling.
- Align public design-system vocabulary so brand-facing pages stop mixing legacy and current token language.
- Normalize page-level content expectations for tone, language strategy, and non-placeholder trust sections.
- Clarify how public specs should refer to final design-system terminology.
- Keep this change focused on visible copy, placeholder trust content, and vocabulary consistency rather than using it as a catch-all site cleanup.

### Scope
- Public brand voice, visible copy direction, and design-system naming consistency.
- Placeholder trust content on public pages.
- Spec/design documentation alignment for public brand compliance.

### Not Included
- Theme engine rewiring.
- Routing/detail-page behavior fixes.
- Stock image sourcing and asset restoration.
- Backend content model redesign beyond what public brand consistency requires.
- Generic cleanup of every unrelated public-page issue.

### Risks / Dependencies
- Depends on the final theme/token direction so brand language does not reintroduce deprecated classes.
- May require staged rollout if copy alignment and trust-content cleanup depend on stakeholder-provided real content.
- Can affect both design review and SEO review if visible content and metadata are rebalanced.

### Recommended Implementation Order
1. `fix-theme-system-and-color-tokens` - set the final public token vocabulary.
2. `fix-public-routing-and-detail-pages` - make sure public journeys and detail sources are correct.
3. `restore-missing-public-assets` - restore the visuals and metadata assets used by the corrected journeys.
4. `align-brand-guideline-and-design-system` - finish visible copy, trust presentation, and design-system vocabulary alignment without expanding into unrelated cleanup.

## Capabilities

### New Capabilities
- `public-brand-compliance`: define measurable brand-guideline expectations for public content and design-system language.

### Modified Capabilities
- None.

## Impact

- Affected code/content: public page templates under `frontend/app/pages/`, navigation/footer/language UI, public copy sources such as `frontend/app/content/brand-voice.ts`, and relevant OpenSpec documents under `openspec/changes/`.
- Affected systems: brand consistency reviews, copywriting standards, design-system naming, public trust presentation.
- This change provides the governance layer for the other public-facing remediation work.
