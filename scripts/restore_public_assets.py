from __future__ import annotations

import datetime
import hashlib
import json
import shutil
import urllib.request
from pathlib import Path


REPO_ROOT = Path(r"D:/Bisnis/esperion/esperion openspec")
PUBLIC_DIR = REPO_ROOT / "frontend" / "public"
GOV_DIR = PUBLIC_DIR / "asset-governance"
TMP_DIR = PUBLIC_DIR / "_source_downloads"


SOURCES = {
    "unsplash-hero": {
        "platform": "unsplash",
        "source_page_url": "https://unsplash.com/photos/1K9T5YiZ2WU",
        "download_url": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80",
        "license_url": "https://unsplash.com/license",
    },
    "pexels-team": {
        "platform": "pexels",
        "source_page_url": "https://www.pexels.com/photo/people-in-a-meeting-3183150/",
        "download_url": "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1600",
        "license_url": "https://www.pexels.com/license/",
    },
    "unsplash-abstract": {
        "platform": "unsplash",
        "source_page_url": "https://unsplash.com/photos/Q1p7bh3SHj8",
        "download_url": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
        "license_url": "https://unsplash.com/license",
    },
}


IMAGE_TARGETS = {
    "unsplash-hero": [
        "images/esperion-agency-hero.jpg",
        "images/about-esperion-agency.jpg",
        "images/contact-banner.jpg",
        "images/services-banner.jpg",
        "images/banner-1.jpg",
        "images/banner-2.jpg",
        "images/banner-3.jpg",
        "images/banners/hero-services.jpg",
        "images/banners/portfolio.jpg",
        "images/banners/lead-gen.jpg",
        "images/banners/trust.jpg",
        "images/banners/promo.jpg",
    ],
    "pexels-team": [
        "images/team.jpg",
        "images/office-exterior.jpg",
        "images/office-interior.jpg",
        "images/hero-service-development.jpg",
        "images/service-webdevelopment.jpg",
        "images/service-mobileappdevelopment.jpg",
        "images/service-uiuxdesign.jpg",
        "images/service-digitalmarketing.jpg",
        "images/service-ecommercesolutions.jpg",
        "images/service-consulting.jpg",
    ],
    "unsplash-abstract": [
        "works/gallery-1.jpg",
        "works/gallery-2.jpg",
        "works/gallery-3.jpg",
        "works/gallery-4.jpg",
    ],
}


def ensure_dirs() -> None:
    dirs = [
        PUBLIC_DIR / "images",
        PUBLIC_DIR / "images" / "banners",
        PUBLIC_DIR / "articles",
        PUBLIC_DIR / "works",
        PUBLIC_DIR / "placeholders" / "first-party",
        GOV_DIR,
        TMP_DIR,
    ]
    for directory in dirs:
        directory.mkdir(parents=True, exist_ok=True)


def download_sources() -> dict[str, Path]:
    downloaded: dict[str, Path] = {}
    for key, meta in SOURCES.items():
        dst = TMP_DIR / f"{key}.jpg"
        request = urllib.request.Request(
            meta["download_url"], headers={"User-Agent": "Mozilla/5.0"}
        )
        with urllib.request.urlopen(request) as response:
            dst.write_bytes(response.read())
        downloaded[key] = dst
    return downloaded


def copy_file(downloaded: dict[str, Path], source_key: str, relative_path: str) -> None:
    target = PUBLIC_DIR / relative_path
    target.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(downloaded[source_key], target)


def write_first_party_placeholders() -> None:
    founder_svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">'
        '<rect width="1200" height="1200" fill="#eef2f7"/>'
        '<circle cx="600" cy="420" r="180" fill="#c5cfdb"/>'
        '<rect x="300" y="650" width="600" height="320" rx="140" fill="#c5cfdb"/>'
        '<text x="600" y="1090" font-family="Arial, sans-serif" font-size="42" text-anchor="middle" fill="#3f4d63">'
        "first-party-founder-photo-required</text></svg>"
    )
    logo_svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600">'
        '<rect width="1200" height="600" fill="#f3f5f8"/>'
        '<rect x="120" y="120" width="960" height="360" rx="24" fill="none" stroke="#91a0b7" stroke-width="8" stroke-dasharray="18 12"/>'
        '<text x="600" y="300" font-family="Arial, sans-serif" font-size="52" text-anchor="middle" fill="#41506a">'
        "first-party-client-logo-required</text></svg>"
    )
    brand_svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="600" viewBox="0 0 1200 600">'
        '<rect width="1200" height="600" fill="#ecf0f4"/>'
        '<text x="600" y="300" font-family="Arial, sans-serif" font-size="54" text-anchor="middle" fill="#3a475e">'
        "official-brand-mark-required</text></svg>"
    )

    (
        PUBLIC_DIR / "placeholders" / "first-party" / "founder-identity-required.svg"
    ).write_text(founder_svg, encoding="utf-8")
    (
        PUBLIC_DIR / "placeholders" / "first-party" / "client-logo-required.svg"
    ).write_text(logo_svg, encoding="utf-8")
    (
        PUBLIC_DIR / "placeholders" / "first-party" / "brand-mark-required.svg"
    ).write_text(brand_svg, encoding="utf-8")


def checksum(path: Path) -> str:
    hasher = hashlib.sha256()
    with path.open("rb") as file_handle:
        for chunk in iter(lambda: file_handle.read(8192), b""):
            hasher.update(chunk)
    return hasher.hexdigest()


def build_stock_entries() -> list[dict[str, str]]:
    targets = set()
    for values in IMAGE_TARGETS.values():
        targets.update(values)
    targets.update(f"articles/article-{index}.jpg" for index in range(1, 13))
    targets.update(f"works/work-{index}.jpg" for index in range(1, 13))

    entries: list[dict[str, str]] = []
    for relative_path in sorted(targets):
        source_key = "unsplash-abstract"
        if relative_path in IMAGE_TARGETS["unsplash-hero"] or relative_path.startswith(
            "articles/"
        ):
            source_key = "unsplash-hero"
        elif relative_path in IMAGE_TARGETS["pexels-team"] or relative_path.startswith(
            "works/work-"
        ):
            source_key = "pexels-team"

        source_meta = SOURCES[source_key]
        absolute_path = PUBLIC_DIR / relative_path
        digest = checksum(absolute_path)
        file_name = Path(source_meta["download_url"].split("?")[0]).name

        entries.append(
            {
                "local_path": f"/{relative_path}",
                "status": "stock-final",
                "category": "public-asset",
                "source_platform": source_meta["platform"],
                "source_page_url": source_meta["source_page_url"],
                "original_asset_url": source_meta["download_url"],
                "source_file_name": file_name,
                "license_url": source_meta["license_url"],
                "download_date": datetime.date.today().isoformat(),
                "checksum_sha256": digest,
                "fingerprint": digest[:16],
                "format": absolute_path.suffix.replace(".", ""),
                "optimization_profile": "web-medium",
                "usage_surface": "public-page-or-seo",
            }
        )
    return entries


def build_first_party_missing() -> list[dict[str, str]]:
    entries: list[dict[str, str]] = []
    for index in range(1, 4):
        entries.append(
            {
                "requested_final_path": f"/founders/founder-{index}.jpg",
                "status": "missing",
                "placeholder_path": "/placeholders/first-party/founder-identity-required.svg",
                "reason": "founder identity requires stakeholder-provided original",
            }
        )
    for index in range(1, 9):
        entries.append(
            {
                "requested_final_path": f"/logos/client-{index}.png",
                "status": "missing",
                "placeholder_path": "/placeholders/first-party/client-logo-required.svg",
                "reason": "client logo requires stakeholder-provided original",
            }
        )
    entries.append(
        {
            "requested_final_path": "/images/logo.svg",
            "status": "missing",
            "placeholder_path": "/placeholders/first-party/brand-mark-required.svg",
            "reason": "official brand mark requires stakeholder-provided original",
        }
    )
    entries.append(
        {
            "requested_final_path": "/logo.png",
            "status": "missing",
            "placeholder_path": "/placeholders/first-party/brand-mark-required.svg",
            "reason": "official brand mark requires stakeholder-provided original",
        }
    )
    return entries


def write_governance_files(
    stock_entries: list[dict[str, str]], first_party_missing: list[dict[str, str]]
) -> None:
    status_enum = [
        "stock-final",
        "first-party-placeholder",
        "first-party-final",
        "missing",
    ]

    inventory_assets = [
        {
            "path": entry["local_path"],
            "status": "stock-final",
            "policy": "stock-eligible",
        }
        for entry in stock_entries
    ]
    inventory_assets.extend(
        [
            {
                "path": "/placeholders/first-party/founder-identity-required.svg",
                "status": "first-party-placeholder",
                "policy": "first-party-only",
            },
            {
                "path": "/placeholders/first-party/client-logo-required.svg",
                "status": "first-party-placeholder",
                "policy": "first-party-only",
            },
            {
                "path": "/placeholders/first-party/brand-mark-required.svg",
                "status": "first-party-placeholder",
                "policy": "first-party-only",
            },
        ]
    )
    inventory_assets.extend(
        [
            {
                "path": entry["requested_final_path"],
                "status": "missing",
                "policy": "first-party-only",
            }
            for entry in first_party_missing
        ]
    )

    (GOV_DIR / "stock-source-log.json").write_text(
        json.dumps(
            {"version": 1, "status_enum": status_enum, "entries": stock_entries},
            indent=2,
        ),
        encoding="utf-8",
    )
    (GOV_DIR / "asset-inventory.json").write_text(
        json.dumps(
            {"version": 1, "status_enum": status_enum, "assets": inventory_assets},
            indent=2,
        ),
        encoding="utf-8",
    )
    (GOV_DIR / "first-party-required.json").write_text(
        json.dumps({"version": 1, "pending": first_party_missing}, indent=2),
        encoding="utf-8",
    )

    readme = """# Public Asset Governance

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
"""
    (GOV_DIR / "README.md").write_text(readme, encoding="utf-8")


def main() -> None:
    ensure_dirs()
    downloaded = download_sources()

    for source_key, paths in IMAGE_TARGETS.items():
        for path in paths:
            copy_file(downloaded, source_key, path)

    for index in range(1, 13):
        copy_file(downloaded, "unsplash-hero", f"articles/article-{index}.jpg")
        copy_file(downloaded, "pexels-team", f"works/work-{index}.jpg")

    write_first_party_placeholders()

    stock_entries = build_stock_entries()
    first_party_missing = build_first_party_missing()
    write_governance_files(stock_entries, first_party_missing)

    shutil.rmtree(TMP_DIR, ignore_errors=True)
    print("Asset restoration artifacts created successfully")


if __name__ == "__main__":
    main()
