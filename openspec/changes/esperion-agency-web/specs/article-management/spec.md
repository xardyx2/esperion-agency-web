# Article Management Specification

## ADDED Requirements

### Requirement: Translation Mapping for Multi-language Articles

The system SHALL support translation mapping between Indonesian and English articles to enable proper language switching with URL preservation.

#### Schema Definition

```sql
-- Articles table with translation mapping
DEFINE TABLE articles SCHEMAFULL;

-- Core fields
DEFINE FIELD title ON articles TYPE string;
DEFINE FIELD slug_id ON articles TYPE string;  -- Indonesian slug
DEFINE FIELD slug_en ON articles TYPE string;  -- English slug
DEFINE FIELD content_id ON articles TYPE string;  -- Indonesian content
DEFINE FIELD content_en ON articles TYPE string;  -- English content
DEFINE FIELD excerpt_id ON articles TYPE option<string>;  -- Indonesian excerpt
DEFINE FIELD excerpt_en ON articles TYPE option<string>;  -- English excerpt

-- Metadata
DEFINE FIELD category ON articles TYPE string;
DEFINE FIELD image ON articles TYPE option<string>;
DEFINE FIELD author ON articles TYPE record<users>;
DEFINE FIELD published ON articles TYPE bool DEFAULT false;
DEFINE FIELD published_at ON articles TYPE option<datetime>;

-- Translation status
DEFINE FIELD translation_status ON articles TYPE string DEFAULT 'draft';
-- Values: 'draft', 'id_only', 'en_only', 'complete'

-- Timestamps
DEFINE FIELD created_at ON articles TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON articles TYPE datetime;

-- Indexes for performance
DEFINE INDEX idx_slug_id ON articles FIELDS (slug_id);
DEFINE INDEX idx_slug_en ON articles FIELDS (slug_en);
DEFINE INDEX idx_translation_status ON articles FIELDS (translation_status);
```

#### Translation Status Values

| Status | Description | URL Access |
|--------|-------------|------------|
| `draft` | Neither translation complete | Not accessible |
| `id_only` | Only Indonesian available | `/id/articles/slug-id` |
| `en_only` | Only English available | `/en/articles/slug-en` |
| `complete` | Both translations complete | Both URLs accessible |

#### Language Switching Behavior

```
┌─────────────────────────────────────────────────────────────┐
│  LANGUAGE SWITCHING FLOW                                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  User on /id/articles/apa-itu-agency                        │
│           ↓                                                 │
│  Click language switcher (EN)                               │
│           ↓                                                 │
│  Lookup article by slug_id = "apa-itu-agency"               │
│           ↓                                                 │
│  Get slug_en from database                                  │
│           ↓                                                 │
│  If slug_en exists:                                         │
│    → Redirect to /en/articles/{slug_en}                     │
│  Else:                                                      │
│    → Show toast: "English version not available"            │
│    → Stay on current page                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Requirement: Auto-generate Slug from Title

The system SHALL auto-generate URL-safe slugs from titles with manual override capability.

#### Slug Generation Rules

1. **Lowercase conversion**: All characters converted to lowercase
2. **Special character handling**:
   - Indonesian: `é` → `e`, `á` → `a`, `ñ` → `n`
   - Spaces → hyphens (`-`)
   - Multiple hyphens → single hyphen
3. **Uniqueness**: Append `-1`, `-2`, etc. if slug exists
4. **Manual override**: Authors can edit auto-generated slug

#### Examples

| Title | Auto-generated Slug |
|-------|---------------------|
| `Apa Itu Agency` | `apa-itu-agency` |
| `Tips SEO untuk Pemula` | `tips-seo-untuk-pemula` |
| `Strategi Digital Marketing 2026` | `strategi-digital-marketing-2026` |
| `What Is Digital Marketing` | `what-is-digital-marketing` |

### Requirement: Translation Workflow

The system SHALL support a translation workflow for content authors.

#### Workflow States

```
┌─────────────────────────────────────────────────────────────┐
│  TRANSLATION WORKFLOW                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Create Indonesian Article                               │
│     → translation_status = 'id_only'                        │
│     → Accessible at: /id/articles/{slug_id}                 │
│                                                             │
│  2. Request Translation (optional)                          │
│     → Click "Translate to English" button                   │
│     → Auto-generate English draft using Alibaba AI          │
│     → translation_status = 'en_draft'                       │
│                                                             │
│  3. Edit English Translation (manual)                       │
│     → Review and edit auto-translated content               │
│     → Add manual improvements                               │
│                                                             │
│  4. Publish English Version                                 │
│     → translation_status = 'complete'                       │
│     → Accessible at: /en/articles/{slug_en}                 │
│     → Language switcher enabled                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Requirement: Language Switcher with URL Mapping

The language switcher component SHALL map URLs correctly between languages.

#### Implementation

```typescript
// frontend/app/components/ui/LanguageSwitcher.vue

async function switchLanguage(newLang: 'id' | 'en') {
  const currentSlug = route.params.slug as string
  const currentLang = route.params.locale as 'id' | 'en' || 'id'
  
  // Fetch article with translation mapping
  const article = await $fetch(`/api/v1/articles/by-slug/${currentSlug}`)
  
  // Get target slug
  const targetSlug = newLang === 'id' 
    ? article.slug_id 
    : article.slug_en
  
  // Redirect if translation exists
  if (targetSlug) {
    await navigateTo(`/${newLang}/articles/${targetSlug}`)
  } else {
    // Show error: translation not available
    showToast({
      title: 'Translation not available',
      message: `This article is not available in ${newLang === 'id' ? 'Indonesian' : 'English'}`,
      type: 'warning'
    })
  }
}
```

### Requirement: API Endpoints for Translation

The system SHALL provide API endpoints for translation-related operations.

#### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/articles/by-slug/:slug` | Get article by any slug (id or en) |
| GET | `/api/v1/articles/:id/translations` | Get all translations for an article |
| POST | `/api/v1/articles/:id/translate` | Auto-translate using Alibaba AI |
| PUT | `/api/v1/articles/:id/translation-status` | Update translation status |

#### Response Format

```json
// GET /api/v1/articles/by-slug/apa-itu-agency
{
  "id": "article_123",
  "title": "Apa Itu Agency",
  "slug_id": "apa-itu-agency",
  "slug_en": "what-is-agency",
  "content_id": "...",
  "content_en": "...",
  "translation_status": "complete",
  "available_languages": ["id", "en"]
}
```

## Scenarios

### Scenario: User shares Indonesian article to foreign friend

- **WHEN** User A shares `/id/articles/apa-itu-agency` to User B (English speaker)
- **AND** User B opens the link
- **AND** User B's browser language is English
- **THEN** Language prompt shows after 5 seconds
- **AND** Prompt says "This article is available in English"
- **WHEN** User B clicks "View in English"
- **THEN** User B is redirected to `/en/articles/what-is-agency`

### Scenario: Translation not available

- **WHEN** User clicks language switcher
- **AND** Target language translation doesn't exist
- **THEN** Toast shows "Translation not available"
- **AND** User stays on current page
- **AND** Badge shows "Available in: Indonesian"

### Scenario: Auto-generate English translation

- **WHEN** Author clicks "Translate to English"
- **AND** Article has Indonesian content
- **THEN** Alibaba AI generates English draft
- **AND** English fields are populated
- **AND** Status changes to 'en_draft'
- **AND** Author can review and edit

## Open Questions

1. Should auto-translation be triggered on article creation or manual trigger only?
2. Should there be a review workflow before publishing translations?
3. How to handle translation updates when original content changes?