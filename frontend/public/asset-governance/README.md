# Public Asset Governance

## Status Enum
- `stock-final`: Stock-eligible asset already restored and approved for production use.
- `first-party-placeholder`: Temporary explicit placeholder for identity/truth-claim assets awaiting originals.
- `first-party-final`: Stakeholder-provided original first-party asset approved for production.
- `missing`: Asset reference intentionally tracked as unresolved.

## Source Logging Rules
Each stock asset entry must include: local path, source platform, source page URL, original asset URL, source file name, license URL, download date, checksum SHA-256, and fingerprint.

## Format and Optimization Minimum
- Naming: descriptive kebab-case per domain path.
- Preferred formats: JPEG/WebP for photos, SVG for vector placeholders/brand marks.
- Sizing target: hero images <= 1600px width, thumbnails <= 1200px width, avoid oversized originals.
- Compression target: visually acceptable with moderate compression for public delivery.

## Compliance Rules
- No hotlinking for restored public assets.
- Client logos, founder identities, and official brand marks are first-party-only and must not be replaced with stock imagery.
- First-party gaps must remain explicitly tracked in `first-party-required.json`.

## License Reference URLs
- Unsplash: https://unsplash.com/license
- Pexels: https://www.pexels.com/license/
- Pixabay: https://pixabay.com/service/license-summary/

Not legal advice. Verify usage against latest provider terms before release.
