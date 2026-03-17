# Advanced Article Editor Specification

## Overview

This specification defines a sophisticated multi-language article editor with advanced features: dual-pane split view, intelligent save mechanisms, offline editing support, live SEO scoring, and comprehensive revision history.

---

## 1. Editor Layout Modes

### 1.1 Split View Mode (Dual Pane)

Two-column layout with synchronized scrolling for bilingual editing:

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│  ← Back                    [Split ▼] [Save 💾] [Publish ▼]                Status  │
├────────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────┐  ┌─────────────────────────────────┐         │
│  │  🇮🇩 Indonesian (Primary)        │  │  🇬🇧 English (Translation)       │         │
│  │                                 │  │                                 │         │
│  │  [Title...                      │  │  [Title...                      │         │
│  │                                 │  │                                 │         │
│  │  ┌─────────────────────────┐    │  │  ┌─────────────────────────┐    │         │
│  │  │ Block Toolbar           │    │  │  │ Block Toolbar           │    │         │
│  │  └─────────────────────────┘    │  │  └─────────────────────────┘    │         │
│  │                                 │  │                                 │         │
│  │  Content blocks...              │  │  Translated content...          │         │
│  │                                 │  │                                 │         │
│  │  (Scroll syncs with right)     │  │  (Scroll syncs with left)      │         │
│  └─────────────────────────────────┘  └─────────────────────────────────┘         │
│                                                                                    │
│  🔄 Scroll Sync: ON                          💾 Last saved: 2 min ago             │
└────────────────────────────────────────────────────────────────────────────────────┘
```

**Features:**
- Two independent TipTap editor instances
- Synchronized scroll (percentage-based)
- Independent cursor positions (saved per language)
- Side-by-side comparison
- Tab key to switch focus between panes

### 1.2 Single View Mode (Tab Switching)

One editor with language tabs:

```
┌────────────────────────────────────────────────────────────────────────────────────┐
│  ← Back                    [Single ▼] [Save 💾] [Publish ▼]               Status  │
├────────────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │  [ 🇮🇩 Indonesian ] [ 🇬🇧 English ] [ AI Translate 🔄 ]                      │  │
│  │                                                                             │  │
│  │  [Title input...                                                            │  │
│  │                                                                             │  │
│  │  ┌─────────────────────────────────────────────────────────────────────┐    │  │
│  │  │ TipTap Editor - Single instance                                      │    │  │
│  │  │                                                                      │    │  │
│  │  │  Start writing or type '/' for blocks...                             │    │  │
│  │  │                                                                      │    │  │
│  │  └─────────────────────────────────────────────────────────────────────┘    │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────┘
```

**Features:**
- Single TipTap editor instance
- Language tab switching
- Cursor position preserved per language
- AI translation button (when viewing Indonesian)

### 1.3 View Mode Toggle

```typescript
// composables/useEditorView.ts
interface ViewModeConfig {
  mode: 'split' | 'single'
  activeLanguage: 'id' | 'en'
  showToolbar: boolean
  scrollSync: boolean
}

// Keyboard shortcuts
// Ctrl/Cmd + 1: Single view
// Ctrl/Cmd + 2: Split view
// Ctrl/Cmd + Tab: Switch active language (single view)
```

---

## 2. Advanced Save Mechanisms

### 2.1 Three Save Types

| Save Type | Trigger | Creates Revision | Priority |
|-----------|---------|------------------|----------|
| **Auto (Idle)** | 2 seconds no typing | ✅ Yes | Low |
| **Auto (Word Count)** | Every 100 words written | ✅ Yes | Medium |
| **Manual** | Ctrl+S or Save button | ✅ Yes | High |

### 2.2 Save Coordinator Architecture

```typescript
// services/save-coordinator.ts
type SaveType = 'auto_idle' | 'auto_word' | 'manual';

interface SaveMetadata {
  type: SaveType
  timestamp: Date
  wordCount: number
  authorId: string
  saveReason?: string // e.g., "100 words reached"
}

interface SaveRequest {
  id: string
  type: SaveType
  content: ArticleContent
  metadata: SaveMetadata
}

class SaveCoordinator {
  private pendingSave: SaveRequest | null = null
  private saveToken: string | null = null
  private wordCountCheckpoint = 0
  private readonly WORD_THRESHOLD = 100
  private idleTimer: NodeJS.Timeout | null = null
  private readonly IDLE_DELAY = 2000 // 2 seconds

  // Process content changes
  onContentChange(content: ArticleContent, wordCount: number) {
    // Reset idle timer
    this.resetIdleTimer(content)
    
    // Check word threshold
    if (wordCount - this.wordCountCheckpoint >= this.WORD_THRESHOLD) {
      this.queueSave('auto_word', content, wordCount)
      this.wordCountCheckpoint = wordCount
    }
  }

  // Manual save - always creates revision immediately
  manualSave(content: ArticleContent): Promise<void> {
    // Cancel any pending auto-save
    this.clearPending()
    
    // Generate token to invalidate concurrent saves
    this.saveToken = crypto.randomUUID()
    
    return this.executeSave('manual', content, this.saveToken)
  }

  private async executeSave(
    type: SaveType,
    content: ArticleContent,
    token: string
  ): Promise<void> {
    // Token validation - reject if superseded
    if (token !== this.saveToken) {
      throw new Error('Save superseded by newer operation')
    }

    // Perform save
    await this.persistToServer(type, content)
    
    // Clear token on success
    if (this.saveToken === token) {
      this.saveToken = null
    }
  }
}
```

### 2.3 Revision Metadata Structure

```typescript
interface Revision {
  id: string
  articleId: string
  content: {
    id: string // Indonesian content
    en: string // English content
  }
  metadata: {
    saveType: 'auto_idle' | 'auto_word' | 'manual'
    timestamp: Date
    wordCount: number
    authorId: string
    authorName: string
    saveReason?: string
  }
}
```

### 2.4 UI Indicators

```
┌─────────────────────────────────────────────────────────┐
│  Save Status Bar                                        │
├─────────────────────────────────────────────────────────┤
│  💾 Auto-save: ON    |    📝 Words: 245    |    ⏱️ 2s   │
│                                                         │
│  [● Saving...] → [✓ Saved] → [💤 Idle]                  │
│                                                         │
│  Last save: Manual - 2 minutes ago by John Doe          │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Offline Editing Support

### 3.1 Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│                    UI Layer (Vue)                       │
│              Pinia Store (offline-aware)                │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│              Service Worker (Background Sync)           │
│         - Intercepts fetch when offline                 │
│         - Queues changes for later sync                 │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│              IndexedDB (Primary Storage)                │
│   - pending_changes queue                               │
│   - article drafts with sync status                     │
│   - revision cache (last 20)                            │
└─────────────────────────────────────────────────────────┘
```

### 3.2 IndexedDB Schema

```typescript
// IndexedDB stores
interface OfflineDatabase {
  // Store 1: Pending changes queue
  pending_changes: {
    id: string
    articleId: string
    changeType: 'content_update' | 'revision_create'
    payload: unknown
    timestamp: Date
    retryCount: number
    status: 'pending' | 'syncing' | 'failed'
  }
  
  // Store 2: Article drafts
  article_drafts: {
    articleId: string
    content: { id: string; en: string }
    lastModified: Date
    syncStatus: 'synced' | 'pending' | 'conflict'
    serverVersionAt: Date | null
  }
  
  // Store 3: Revision cache (last 20)
  revision_cache: {
    articleId: string
    revisions: Revision[]
    lastFetched: Date
  }
}
```

### 3.3 Connection Status Detection

```typescript
// composables/useConnectionStatus.ts
export function useConnectionStatus() {
  const isOnline = ref(navigator.onLine)
  const connectionStatus = ref<'online' | 'offline' | 'syncing'>('online')
  
  // Network status events
  window.addEventListener('online', () => {
    isOnline.value = true
    connectionStatus.value = 'syncing'
    syncPendingChanges()
  })
  
  window.addEventListener('offline', () => {
    isOnline.value = false
    connectionStatus.value = 'offline'
  })
  
  // Heartbeat check
  setInterval(async () => {
    if (!navigator.onLine) {
      connectionStatus.value = 'offline'
      return
    }
    
    // Ping server
    try {
      await fetch('/api/health', { method: 'HEAD' })
      if (connectionStatus.value === 'offline') {
        connectionStatus.value = 'syncing'
        syncPendingChanges()
      }
    } catch {
      connectionStatus.value = 'offline'
    }
  }, 30000) // Every 30 seconds
}
```

### 3.4 Conflict Resolution Strategy

```typescript
enum ConflictResolution {
  SERVER_WINS = 'server_wins', // Default
  CLIENT_WINS = 'client_wins', // Manual override
  MERGE = 'merge'              // Future enhancement
}

async function resolveConflict(
  localDraft: ArticleDraft,
  serverArticle: Article
): Promise<ConflictResolution> {
  // Default strategy: Server wins
  if (serverArticle.updated_at > localDraft.lastModified) {
    return ConflictResolution.SERVER_WINS
  }
  return ConflictResolution.CLIENT_WINS
}
```

### 3.5 Notification System

```
┌─────────────────────────────────────────────────────────┐
│  Connection Status Notifications                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  🔴 OFFLINE MODE                                        │
│  Changes will be saved locally and synced when online   │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  🟢 ONLINE MODE                                         │
│  Syncing 3 pending changes...                           │
│  [==========>          ] 50%                            │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  ⚠️ SYNC CONFLICT                                       │
│  Server has newer version. Choose action:               │
│  [Use Server Version] [Use My Version] [Review Diff]    │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  ✅ SYNC COMPLETE                                       │
│  All changes synced successfully                        │
│  [Dismiss]                                              │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  ❌ SYNC FAILED                                         │
│  1 change failed to sync. Will retry automatically.     │
│  [Retry Now] [Review] [Dismiss]                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Live SEO Scoring

### 4.1 Hybrid Calculation Strategy

**Client-Side (Fast, Real-time):**
- Word count
- Heading structure
- Link count
- Image count
- Keyword presence

**API (Comprehensive, Debounced):**
- Readability score
- Keyword density analysis
- Meta description optimization
- Advanced content analysis

```typescript
// composables/useLiveSEO.ts
export function useLiveSEO() {
  const seoScore = ref(0)
  const scoreBreakdown = ref<SEOBreakdown>({})
  
  // Client-side calculation (immediate)
  function calculateBasicSEO(content: string): Partial<SEOScore> {
    const wordCount = content.split(/\s+/).filter(w => w.length > 0).length
    const headings = (content.match(/<h[1-6]/gi) || []).length
    const links = (content.match(/<a\s/gi) || []).length
    const images = (content.match(/<img\s/gi) || []).length
    
    return {
      wordCount: { score: Math.min(wordCount / 3, 100), weight: 0.15 },
      headings: { score: Math.min(headings / 3 * 100, 100), weight: 0.10 },
      links: { score: Math.min(links / 2 * 100, 100), weight: 0.10 },
      images: { score: images > 0 ? 100 : 50, weight: 0.10 }
    }
  }
  
  // Debounced API call (500ms)
  const debouncedApiCall = useDebounce(async (content: string) => {
    const apiResult = await $fetch('/api/v1/seo/calculate', {
      method: 'POST',
      body: { content }
    })
    
    // Merge results
    scoreBreakdown.value = {
      ...calculateBasicSEO(content),
      ...apiResult.breakdown
    }
    
    // Calculate weighted total
    seoScore.value = Object.values(scoreBreakdown.value)
      .reduce((sum, metric) => sum + (metric.score * metric.weight), 0)
    
  }, 500)
  
  return { seoScore, scoreBreakdown, updateContent: debouncedApiCall }
}
```

### 4.2 Live SEO Panel UI

```
┌─────────────────────────────────────────┐
│  🔍 SEO Score: 82/100 🟢                │
│  ━━━━━━━━━━━━━━━━━━●━━━━━━━ 82%         │
├─────────────────────────────────────────┤
│                                         │
│  📊 Live Metrics (real-time)            │
│  ─────────────────────────────────────  │
│  ✓ Word count: 245 words (15%)          │
│  ✓ Headings: 4 found (10%)              │
│  ✓ Links: 3 internal (10%)              │
│  ⚠️ Images: 2 found, 1 missing alt      │
│                                         │
│  📊 Analysis (updating...)              │
│  ─────────────────────────────────────  │
│  ⏳ Readability: calculating...         │
│  ⏳ Keyword density: calculating...     │
│  ⏳ Content quality: calculating...     │
│                                         │
│  [Refresh Analysis]                     │
└─────────────────────────────────────────┘
```

---

## 5. Revision History System

### 5.1 Backend Schema (SurrealDB)

```sql
-- Revisions table
DEFINE TABLE revisions SCHEMAFULL;
DEFINE FIELD article_id ON revisions TYPE record<articles>;
DEFINE FIELD content_id ON revisions TYPE string;
DEFINE FIELD content_en ON revisions TYPE string;
DEFINE FIELD metadata ON revisions TYPE object;
DEFINE FIELD metadata.save_type ON revisions TYPE string;
DEFINE FIELD metadata.word_count ON revisions TYPE int;
DEFINE FIELD metadata.author_id ON revisions TYPE record<users>;
DEFINE FIELD metadata.author_name ON revisions TYPE string;
DEFINE FIELD metadata.save_reason ON revisions TYPE option<string>;
DEFINE FIELD created_at ON revisions TYPE datetime DEFAULT time::now();

-- Index for efficient querying
DEFINE INDEX idx_revisions_article ON revisions FIELDS article_id;
DEFINE INDEX idx_revisions_created ON revisions FIELDS created_at DESC;
```

### 5.2 Revision Cleanup Strategy

```sql
-- Keep only last N revisions per article
LET $article_id = articles:abc123;
LET $keep_count = 100;

DELETE FROM revisions 
WHERE article_id = $article_id 
AND id NOT IN (
    SELECT id FROM revisions 
    WHERE article_id = $article_id 
    ORDER BY created_at DESC 
    LIMIT $keep_count
);
```

### 5.3 Revision Settings

```typescript
interface RevisionSettings {
  maxRevisionsPerArticle: number // Default: 100
  autoCleanup: boolean           // Default: true
  cleanupInterval: number        // Default: 7 days
}

// User can configure in Settings > Editor
// - Slider: 10, 50, 100, 250, 500 revisions
// - Toggle: Auto-cleanup on/off
```

### 5.4 Revision History UI

```
┌─────────────────────────────────────────────────────────┐
│  📚 Revision History                                    │
├─────────────────────────────────────────────────────────┤
│  Settings: Keep last 100 revisions [⚙️]                 │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │ 🔍 Search revisions...                          │    │
│  └─────────────────────────────────────────────────┘    │
│                                                         │
│  Today                                                  │
│  ─────────────────────────────────────────────────────  │
│  ● Manual save - 2:30 PM                               │
│    245 words • John Doe • "Before publishing"          │
│    [Restore] [Preview] [Compare]                       │
│                                                         │
│  ● Auto (word) - 2:15 PM                               │
│    200 words • John Doe • "200 words reached"          │
│    [Restore] [Preview] [Compare]                       │
│                                                         │
│  ● Auto (idle) - 2:05 PM                               │
│    150 words • John Doe                                │
│    [Restore] [Preview] [Compare]                       │
│                                                         │
│  Yesterday                                              │
│  ─────────────────────────────────────────────────────  │
│  ● Manual save - 5:00 PM                               │
│    100 words • John Doe • "End of day"                 │
│    [Restore] [Preview] [Compare]                       │
│                                                         │
│  [Load More...]                                         │
└─────────────────────────────────────────────────────────┘
```

### 5.5 Diff View

```
┌─────────────────────────────────────────────────────────┐
│  📊 Compare Revisions                                   │
├─────────────────────────────────────────────────────────┤
│  Left: Manual save - Today 2:30 PM                     │
│  Right: Auto (word) - Today 2:15 PM                    │
│                                                         │
│  ┌──────────────────┐  ┌──────────────────┐            │
│  │ [-] Removed      │  │ [+] Added        │            │
│  │                  │  │                  │            │
│  │  Lorem ipsum     │  │  Lorem ipsum     │            │
│  │  dolor sit amet  │  │  dolor sit amet  │            │
│  │ -consectetur     │  │ +consectetur     │            │
│  │ -adipiscing      │  │ +adipiscing elit │            │
│  │                  │  │                  │            │
│  └──────────────────┘  └──────────────────┘            │
│                                                         │
│  Stats: +45 words, -5 words, ~50 words changed         │
│                                                         │
│  [Restore Left] [Restore Right] [Cancel]               │
└─────────────────────────────────────────────────────────┘
```

---

## 6. Performance Optimization

### 6.1 Large Article Handling

```typescript
// composables/useVirtualEditor.ts
export function useVirtualEditor(maxVisibleNodes = 100) {
  const content = ref<string>('')
  const visibleRange = ref({ start: 0, end: maxVisibleNodes })
  
  // Split content into chunks
  const chunks = computed(() => {
    return splitIntoChunks(content.value, 500) // 500 words per chunk
  })
  
  // Only render visible chunks
  const visibleChunks = computed(() => {
    return chunks.value.slice(
      visibleRange.value.start,
      visibleRange.value.end
    )
  })
  
  return { visibleChunks, onScroll }
}
```

### 6.2 Web Worker Offloading

```typescript
// workers/content-analysis.worker.ts
self.onmessage = (e) => {
  const { content, operation } = e.data
  
  switch (operation) {
    case 'wordCount':
      const count = content.split(/\s+/).filter(w => w.length > 0).length
      self.postMessage({ type: 'wordCount', result: count })
      break
      
    case 'seoScore':
      const score = calculateSEOScore(content)
      self.postMessage({ type: 'seoScore', result: score })
      break
  }
}
```

### 6.3 Performance Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| Initial render | <100ms | Virtual scrolling, lazy load |
| Typing latency | <16ms (60fps) | Debounced saves, worker offloading |
| SEO update | <50ms | Client-side calc, 500ms debounce |
| Revision load | <200ms | Pagination (20 per page) |
| Memory usage | <100MB | Limited cache, aggressive cleanup |

---

## 7. Component Structure

```
frontend/app/components/dashboard/content/
├── ArticleEditor.vue                 # Main container
├── ArticleEditorToolbar.vue          # Top toolbar
├── ArticleEditorStatusBar.vue        # Save status bar
├── layout/
│   ├── SplitViewLayout.vue           # Dual pane layout
│   ├── SingleViewLayout.vue          # Single pane with tabs
│   └── ViewModeToggle.vue            # Split/Single toggle
├── editor/
│   ├── TipTapEditor.vue              # TipTap wrapper
│   ├── EditorPane.vue                # Individual editor pane
│   ├── SyncedScrollContainer.vue     # Scroll sync wrapper
│   └── LanguageTabs.vue              # ID/EN tabs
├── save/
│   ├── SaveCoordinator.ts            # Save logic service
│   ├── SaveStatusIndicator.vue       # Save status UI
│   └── WordCountDisplay.vue          # Word counter
├── revision/
│   ├── RevisionHistoryPanel.vue      # Revision list
│   ├── RevisionItem.vue              # Single revision
│   ├── RevisionDiff.vue              # Diff view
│   └── RevisionSettings.vue          # Settings modal
├── offline/
│   ├── OfflineManager.ts             # Offline logic
│   ├── ConnectionStatusBar.vue       # Online/offline indicator
│   ├── SyncNotification.vue          # Sync notifications
│   └── ConflictResolver.vue          # Conflict UI
└── seo/
    ├── LiveSEOPanel.vue              # Live SEO display
    ├── SEOScoreRing.vue              # Circular score
    └── SEOMetricsList.vue            # Metrics breakdown

frontend/app/composables/
├── useArticleEditor.ts               # Main editor composable
├── useSaveCoordinator.ts             # Save coordination
├── useOfflineEditing.ts              # Offline support
├── useLiveSEO.ts                     # Live SEO scoring
├── useRevisionHistory.ts             # Revision management
├── useScrollSync.ts                  # Scroll synchronization
├── useWordCounter.ts                 # Word count tracking
└── useConnectionStatus.ts            # Network status

frontend/app/stores/
└── articleEditor.ts                  # Pinia store
```

---

## 8. API Endpoints Required

### 8.1 Backend Endpoints (New)

```typescript
// POST /api/v1/articles/:id/revisions
// Create new revision

// GET /api/v1/articles/:id/revisions
// List revisions with pagination

// GET /api/v1/articles/:id/revisions/:revisionId
// Get specific revision

// POST /api/v1/articles/:id/revisions/:revisionId/restore
// Restore to revision

// POST /api/v1/articles/:id/revisions/compare
// Compare two revisions (diff)

// POST /api/v1/articles/:id/revisions/cleanup
// Clean up old revisions

// GET /api/v1/health
// Health check for connection status
```

### 8.2 IndexedDB Operations (Client-side)

```typescript
// OfflineDatabase operations
interface OfflineDatabase {
  pending_changes: {
    add(change: PendingChange): Promise<void>
    getAll(): Promise<PendingChange[]>
    remove(id: string): Promise<void>
    clear(): Promise<void>
  }
  
  article_drafts: {
    save(draft: ArticleDraft): Promise<void>
    get(articleId: string): Promise<ArticleDraft | null>
    updateSyncStatus(articleId: string, status: SyncStatus): Promise<void>
  }
  
  revision_cache: {
    cache(articleId: string, revisions: Revision[]): Promise<void>
    get(articleId: string): Promise<Revision[] | null>
  }
}
```

---

## 9. Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + S` | Manual save |
| `Ctrl/Cmd + 1` | Single view mode |
| `Ctrl/Cmd + 2` | Split view mode |
| `Ctrl/Cmd + Tab` | Switch language (single view) |
| `Ctrl/Cmd + Shift + ↑` | Scroll to top (sync both panes) |
| `Ctrl/Cmd + Shift + ↓` | Scroll to bottom (sync both panes) |
| `Ctrl/Cmd + R` | Show revision history |
| `Ctrl/Cmd + /` | Show keyboard shortcuts help |

---

## 10. Implementation Roadmap

### Phase 1 (Week 1-2): Core Editor
- [ ] Split view layout with dual panes
- [ ] Single view with tab switching
- [ ] Scroll synchronization
- [ ] Cursor position management
- [ ] View mode toggle

### Phase 2 (Week 3): Save System
- [ ] Save coordinator service
- [ ] Three save mechanisms
- [ ] Word count tracking
- [ ] Save status indicators
- [ ] Backend revision schema

### Phase 3 (Week 4): Offline Support
- [ ] IndexedDB setup
- [ ] Connection status detection
- [ ] Pending changes queue
- [ ] Auto-sync when online
- [ ] Conflict resolution UI

### Phase 4 (Week 5): Revision History
- [ ] Revision list UI
- [ ] Diff view
- [ ] Restore functionality
- [ ] Settings (max revisions)
- [ ] Cleanup logic

### Phase 5 (Week 6): Live SEO & Polish
- [ ] Live SEO calculation
- [ ] Real-time score updates
- [ ] Performance optimization
- [ ] Web workers
- [ ] E2E testing

---

*Advanced Article Editor Specification*
*Dual-view, multi-save, offline-capable, live SEO editor*

---

## 1. Editor Architecture

### 1.1 Layout Pattern (WordPress Gutenberg-Style)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  ← Back to Articles                    [Draft] [Preview] [Publish ▼]           │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌───────────────────────────────────────────┐  ┌──────────────────────────┐   │
│  │                                           │  │    📋 Document           │   │
│  │   Add title                               │  │    ───────────────────── │   │
│  │   [Title input field...    ]              │  │    Status: Draft ▼       │   │
│  │                                           │  │    Visibility: Public ▼  │   │
│  │   [Start writing or type '/' for blocks]  │  │    Publish: Immediately  │   │
│  │                                           │  │    ───────────────────── │   │
│  │   ┌─────────────────────────────────┐     │  │    ⭐ Featured Image     │   │
│  │   │   Block Toolbar                 │     │  │    [Upload/Select]       │   │
│  │   │   [B] [I] [Link] [Align] [...]  │     │  │    ───────────────────── │   │
│  │   └─────────────────────────────────┘     │  │    🏷️ Categories         │   │
│  │                                           │  │    [✓] Services          │   │
│  │   Content goes here...                    │  │    [ ] Portfolio         │   │
│  │   Rich text with blocks                   │  │    ───────────────────── │   │
│  │                                           │  │    🔖 Tags               │   │
│  │                                           │  │    [seo, tips, 2026 +]   │   │
│  │                                           │  └──────────────────────────┘   │
│  │                                           │  ┌──────────────────────────┐   │
│  │                                           │  │    🔍 SEO (RankMath)     │   │
│  │                                           │  │    ───────────────────── │   │
│  │                                           │  │    Score: 82/100 🟢       │   │
│  │                                           │  │                           │   │
│  │                                           │  │    Focus Keyword:         │   │
│  │                                           │  │    [jasa web development] │   │
│  │                                           │  │                           │   │
│  │                                           │  │    SEO Title:             │   │
│  │                                           │  │    [Jasa Web...      55]  │   │
│  │                                           │  │    ✓ Optimal length       │   │
│  │                                           │  │                           │   │
│  │                                           │  │    Meta Description:      │   │
│  │                                           │  │    [Kami menawarkan...   ]│   │
│  │                                           │  │    ⚠️ Too short           │   │
│  │                                           │  │                           │   │
│  │                                           │  │    URL:                   │   │
│  │                                           │  │    /jasa-web-development  │   │
│  │                                           │  │    ✓ URL contains keyword │   │
│  │                                           │  │                           │   │
│  │                                           │  │    📊 Analysis:           │   │
│  │                                           │  │    ✓ Title has keyword    │   │
│  │                                           │  │    ✓ Content has keyword  │   │
│  │                                           │  │    ✓ Internal links: 3    │   │
│  │                                           │  │    ⚠️ Images missing alt  │   │
│  │                                           │  │    ✓ Heading structure    │   │
│  │                                           │  │                           │   │
│  │                                           │  │    [Edit Snippet]         │   │
│  │                                           │  └──────────────────────────┘   │
│  └───────────────────────────────────────────┘                                 │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Component Structure

```
frontend/app/components/dashboard/content/
├── ContentEditor.vue                    # Main editor container
├── ContentEditorToolbar.vue             # Top action bar (back, status, actions)
├── ContentEditorSidebar.vue             # Right sidebar container
├── ContentEditorBlocks.vue              # Block-based content area
├── seo/
│   ├── SeoPanel.vue                     # Main SEO panel
│   ├── SeoScore.vue                     # Score display (0-100)
│   ├── SeoFocusKeyword.vue              # Focus keyword input
│   ├── SeoSnippetEditor.vue             # Title & meta description
│   ├── SeoAnalysis.vue                  # Checklist analysis
│   └── SeoSocialPreview.vue             # Facebook/Twitter preview
└── document/
    ├── DocumentPanel.vue                # Document settings
    ├── FeaturedImage.vue                # Featured image selector
    ├── CategoriesPanel.vue              # Categories checkboxes
    └── TagsPanel.vue                    # Tags input
```

---

## 2. Content Editor (Nuxt UI Editor)

### 2.1 Editor Configuration

```typescript
// composables/useContentEditor.ts
interface ContentEditorConfig {
  // Content
  title: Ref<string>
  content: Ref<string> // HTML/Markdown/JSON
  contentType: 'html' | 'markdown' | 'json'
  
  // Editor settings
  placeholder: string
  extensions: TipTapExtension[]
  
  // Blocks supported
  blocks: BlockType[]
}

interface BlockType {
  id: string
  name: string
  icon: string
  insert: (editor: Editor) => void
}

const defaultBlocks: BlockType[] = [
  { id: 'paragraph', name: 'Paragraph', icon: 'i-lucide-type', insert: (e) => e.chain().focus().setParagraph().run() },
  { id: 'heading-1', name: 'Heading 1', icon: 'i-lucide-heading-1', insert: (e) => e.chain().focus().toggleHeading({ level: 1 }).run() },
  { id: 'heading-2', name: 'Heading 2', icon: 'i-lucide-heading-2', insert: (e) => e.chain().focus().toggleHeading({ level: 2 }).run() },
  { id: 'heading-3', name: 'Heading 3', icon: 'i-lucide-heading-3', insert: (e) => e.chain().focus().toggleHeading({ level: 3 }).run() },
  { id: 'bullet-list', name: 'Bullet List', icon: 'i-lucide-list', insert: (e) => e.chain().focus().toggleBulletList().run() },
  { id: 'ordered-list', name: 'Numbered List', icon: 'i-lucide-list-ordered', insert: (e) => e.chain().focus().toggleOrderedList().run() },
  { id: 'blockquote', name: 'Quote', icon: 'i-lucide-quote', insert: (e) => e.chain().focus().toggleBlockquote().run() },
  { id: 'code-block', name: 'Code Block', icon: 'i-lucide-code', insert: (e) => e.chain().focus().toggleCodeBlock().run() },
  { id: 'image', name: 'Image', icon: 'i-lucide-image', insert: (e) => e.chain().focus().insertContent({ type: 'imageUpload' }).run() },
  { id: 'horizontal-rule', name: 'Divider', icon: 'i-lucide-minus', insert: (e) => e.chain().focus().setHorizontalRule().run() },
]
```

### 2.2 Slash Commands (/)

Typing `/` opens block inserter menu:

```
┌─────────────────────────────────────────┐
│  /par                                   │
├─────────────────────────────────────────┤
│  Basic Blocks                           │
│  ¶  Paragraph           [Enter]         │
│  H1 Heading 1                           │
│  H2 Heading 2                           │
│  • Bullet List                          │
│  1. Ordered List                        │
│                                         │
│  Media                                    │
│  🖼️  Image                               │
│  ── Horizontal Rule                     │
└─────────────────────────────────────────┘
```

### 2.3 Block Toolbar (Floating)

When block selected, show floating toolbar:

```
┌────────────────────────────────────────────────────────┐
│  ≡  ¶ Paragraph    [Turn into ▼]  [⋮]  [↑]  [↓]  [🗑️]  │
└────────────────────────────────────────────────────────┘
```

---

## 3. SEO Panel (RankMath-Style)

### 3.1 SEO Score System (Backend Integration)

**Important**: Backend sudah memiliki SEO scoring logic yang lengkap di `backend/src/handlers/seo_score.rs`. Frontend SEO Panel harus mengkonsumsi API ini.

**Backend Score Breakdown** (100 points max):

| Category | Max Points | Criteria |
|----------|------------|----------|
| **Content Quality** | 35 | Word count: 1000+ (35pts), 500+ (25pts), 300+ (15pts), <300 (5pts) |
| **On-Page SEO** | 25 | Title (5), Slug (5), Meta Description (5), Headings (5), Keywords (5) |
| **Readability** | 15 | Avg words/sentence: ≤20 (15pts), ≤25 (10pts), >25 (5pts) |
| **Internal Linking** | 10 | 3+ links (10pts), 1-2 links (5pts), 0 links (0pts) |
| **Technical SEO** | 10 | Image alt text (5), Mobile-friendly (5) |
| **Local SEO** | 5 | Contains "jakarta"/"indonesia" (5pts) |

**Grade System**:
- 90-100: Excellent 🟢
- 80-89: Good 🟢
- 70-79: Fair 🟡
- 60-69: Needs Improvement 🟠
- <60: Poor 🔴

**API Integration**:
```typescript
// POST /api/v1/seo/calculate
interface CalculateSeoScoreRequest {
  article_id: string
  title: string
  content: string
  meta_description?: string
  slug: string
}

// Response: SeoScoreResponse
interface SeoScoreResponse {
  article_id: string
  score: number        // 0-100
  max_score: 100
  grade: 'Excellent' | 'Good' | 'Fair' | 'Needs Improvement' | 'Poor'
  breakdown: {
    content_quality: number
    on_page_seo: number
    readability: number
    internal_linking: number
    technical_seo: number
    local_seo: number
  }
  suggestions: string[] // Dynamic tips from backend
}
```

**Frontend Score Calculation** (Real-time preview):
Frontend melakukan client-side calculation untuk real-time preview saat user type, tapi save ke backend saat:
- Auto-save (every 30s)
- Manual save
- Switch to SEO tab

```typescript
// Frontend calculation (mirrors backend logic)
const calculateSeoScore = (content: string, meta: SeoMeta): SeoScore => {
  const wordCount = content.split(/\s+/).filter(w => w.length > 0).length
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length
  const avgWordsPerSentence = sentences > 0 ? wordCount / sentences : 0
  const internalLinks = (content.match(/href="\//g) || []).length
  const hasAltText = content.includes('alt="') || content.includes("alt='")
  const hasH2 = content.includes('<h2>') || content.includes('##')
  const hasLocalKeyword = /jakarta|indonesia/i.test(content)
  
  // Calculate each category...
  return {
    score: breakdown.total(),
    grade: getGrade(breakdown.total()),
    breakdown,
    suggestions: generateSuggestions({ wordCount, hasH2, internalLinks, hasAltText })
  }
}
```

```typescript
interface SeoScore {
  total: number // 0-100
  category: 'bad' | 'ok' | 'good' | 'excellent' // <50, 50-70, 70-90, 90+
  factors: SeoFactor[]
}

interface SeoFactor {
  id: string
  name: string
  status: 'pass' | 'warning' | 'fail'
  message: string
  weight: number // Impact on score
}

// Score calculation
const calculateSeoScore = (content: string, meta: SeoMeta, keyword: string): SeoScore => {
  const factors: SeoFactor[] = [
    {
      id: 'title-length',
      name: 'SEO Title Length',
      status: meta.title.length >= 50 && meta.title.length <= 60 ? 'pass' : 'warning',
      message: meta.title.length < 50 ? 'Title is too short' : meta.title.length > 60 ? 'Title may be truncated' : 'Good length',
      weight: 10
    },
    {
      id: 'title-keyword',
      name: 'Focus Keyword in Title',
      status: meta.title.toLowerCase().includes(keyword.toLowerCase()) ? 'pass' : 'fail',
      message: 'Focus keyword should appear in title',
      weight: 15
    },
    {
      id: 'meta-description',
      name: 'Meta Description',
      status: meta.description.length >= 120 && meta.description.length <= 160 ? 'pass' : 'warning',
      message: 'Optimal length is 120-160 characters',
      weight: 10
    },
    {
      id: 'content-keyword',
      name: 'Focus Keyword in Content',
      status: content.toLowerCase().includes(keyword.toLowerCase()) ? 'pass' : 'fail',
      message: 'Keyword should appear in first 100 words',
      weight: 15
    },
    {
      id: 'keyword-density',
      name: 'Keyword Density',
      status: getKeywordDensity(content, keyword) >= 0.5 && getKeywordDensity(content, keyword) <= 2.5 ? 'pass' : 'warning',
      message: 'Optimal density: 0.5% - 2.5%',
      weight: 10
    },
    {
      id: 'url-keyword',
      name: 'URL Contains Keyword',
      status: meta.slug.includes(keyword.toLowerCase().replace(/\s+/g, '-')) ? 'pass' : 'warning',
      message: 'URL should contain focus keyword',
      weight: 10
    },
    {
      id: 'heading-structure',
      name: 'Heading Structure',
      status: hasProperHeadingStructure(content) ? 'pass' : 'warning',
      message: 'Should have H1, then H2/H3 hierarchy',
      weight: 10
    },
    {
      id: 'internal-links',
      name: 'Internal Links',
      status: countInternalLinks(content) >= 2 ? 'pass' : 'warning',
      message: 'Add at least 2 internal links',
      weight: 8
    },
    {
      id: 'image-alt',
      name: 'Images with Alt Text',
      status: imagesHaveAlt(content) ? 'pass' : 'warning',
      message: 'All images should have alt text',
      weight: 7
    },
    {
      id: 'content-length',
      name: 'Content Length',
      status: wordCount(content) >= 300 ? 'pass' : 'warning',
      message: 'Content should be at least 300 words',
      weight: 5
    }
  ]
  
  const passed = factors.filter(f => f.status === 'pass').length
  const score = Math.round((passed / factors.length) * 100)
  
  return {
    total: score,
    category: score < 50 ? 'bad' : score < 70 ? 'ok' : score < 90 ? 'good' : 'excellent',
    factors
  }
}
```

### 3.2 SEO Score Display

```
┌─────────────────────────────────────────┐
│  🔍 SEO                                  │
├─────────────────────────────────────────┤
│                                         │
│     ┌─────────┐                         │
│     │   82    │                         │
│     │  🟢     │  Good                   │
│     └─────────┘                         │
│                                         │
│  Focus Keyword:                         │
│  ┌─────────────────────────────────┐    │
│  │ jasa web development            │    │
│  └─────────────────────────────────┘    │
│  [+ Add Secondary Keyword]              │
│                                         │
│  ─────────────────────────────────────  │
│                                         │
│  SEO Title:                       55/60 │
│  ┌─────────────────────────────────┐    │
│  │ Jasa Web Development Terbaik... │ ✓  │
│  └─────────────────────────────────┘    │
│                                         │
│  Meta Description:               145/160│
│  ┌─────────────────────────────────┐    │
│  │ Kami menawarkan jasa web dev... │ ⚠️ │
│  └─────────────────────────────────┘    │
│  Add call-to-action for better CTR      │
│                                         │
│  URL Slug:                              │
│  ┌─────────────────────────────────┐    │
│  │ /jasa-web-development           │ ✓  │
│  └─────────────────────────────────┘    │
│                                         │
│  ─────────────────────────────────────  │
│  📊 Analysis                             │
│                                         │
│  ✓ Title has focus keyword              │
│  ✓ Meta description length good         │
│  ✓ Content has focus keyword            │
│  ✓ Keyword density: 1.2%                │
│  ✓ URL contains keyword                 │
│  ✓ Good heading structure               │
│  ✓ 3 internal links found               │
│  ⚠️ 2 images missing alt text            │
│     └─ Click to highlight images        │
│  ✓ Content: 450 words                   │
│                                         │
│  ─────────────────────────────────────  │
│  🔗 Schema                               │
│  Article ▼  [Configure]                 │
│                                         │
│  ─────────────────────────────────────  │
│  📱 Social                               │
│  [Facebook Preview] [Twitter Preview]   │
│                                         │
└─────────────────────────────────────────┘
```

### 3.3 Social Media Previews

```
┌─────────────────────────────────────────┐
│  📱 Facebook Preview                    │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ [Featured Image]                │    │
│  │                                 │    │
│  │                                 │    │
│  ├─────────────────────────────────┤    │
│  │ esperion.id                     │    │
│  │ Jasa Web Development Terbaik... │    │
│  │ Kami menawarkan jasa web dev... │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [Edit Facebook Data]                   │
│                                         │
└─────────────────────────────────────────┘
```

---

## 4. Document Settings Panel

### 4.1 Content Status

```typescript
interface DocumentSettings {
  status: 'draft' | 'pending' | 'published' | 'scheduled' | 'archived'
  visibility: 'public' | 'private' | 'password'
  password?: string
  publishDate: Date | null
  author: User
  slug: string
}
```

### 4.2 Featured Image

```
┌─────────────────────────────────────────┐
│  ⭐ Featured Image                      │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐    │
│  │                                 │    │
│  │      [Click to upload]          │    │
│  │         🖼️                      │    │
│  │                                 │    │
│  │      Drop image here            │    │
│  │      or click to browse         │    │
│  │                                 │    │
│  └─────────────────────────────────┘    │
│                                         │
│  [Set from Media Library]               │
│                                         │
│  Alt text:                              │
│  ┌─────────────────────────────────┐    │
│  │ Deskripsi gambar...             │    │
│  └─────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

### 4.3 Categories & Tags

```
┌─────────────────────────────────────────┐
│  🏷️ Categories                          │
├─────────────────────────────────────────┤
│                                         │
│  [✓] Services                           │
│  [✓] Portfolio                          │
│  [ ] Blog                               │
│  [✓] SEO                                │
│                                         │
│  [+ Add New Category]                   │
│                                         │
├─────────────────────────────────────────┤
│  🔖 Tags                                │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ seo, tips, 2026                 │    │
│  └─────────────────────────────────┘    │
│  Type and press Enter to add            │
│                                         │
│  Suggestions: web, marketing, design    │
│                                         │
└─────────────────────────────────────────┘
```

---

## 5. Auto-Save & Draft Management

### 5.1 Auto-Save Behavior

```typescript
// Auto-save every 30 seconds or on significant pause
interface AutoSaveConfig {
  interval: 30000 // ms
  onPause: true    // Save after user stops typing for 2s
  debounce: 2000   // ms
}

// Draft indicator
interface DraftStatus {
  isSaving: boolean
  lastSaved: Date | null
  hasUnsavedChanges: boolean
  revisionCount: number
}
```

### 5.2 UI Indicators

```
┌─────────────────────────────────────────────────────────┐
│  ← Back to Articles    Saving... 💾    [Preview] [Publish]
│                        Last saved: 2 min ago
└─────────────────────────────────────────────────────────┘
```

---

## 6. Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘/Ctrl + S` | Save draft |
| `⌘/Ctrl + P` | Preview |
| `⌘/Ctrl + Shift + P` | Publish |
| `⌘/Ctrl + K` | Insert link |
| `⌘/Ctrl + Shift + K` | Remove link |
| `⌘/Ctrl + /` | Show slash commands |
| `⌘/Ctrl + Shift + 1-6` | Heading 1-6 |
| `⌘/Ctrl + Shift + 7` | Numbered list |
| `⌘/Ctrl + Shift + 8` | Bullet list |
| `⌘/Ctrl + Shift + 9` | Quote |
| `⌘/Ctrl + Shift + 0` | Paragraph |
| `⌘/Ctrl + Shift + D` | Strike through |
| `Tab` | Indent list |
| `Shift + Tab` | Outdent list |

---

## 7. Implementation Tasks

### Phase 1: Editor Foundation
- [ ] Install `@nuxt/ui` Editor dependencies
- [ ] Create `ContentEditor.vue` with TipTap integration
- [ ] Implement slash commands (`/`)
- [ ] Add floating block toolbar
- [ ] Implement drag & drop block reordering
- [ ] Create title input field
- [ ] Add auto-save functionality

### Phase 2: Sidebar & Document Settings
- [ ] Create `ContentEditorSidebar.vue`
- [ ] Implement document status dropdown
- [ ] Add visibility settings
- [ ] Create featured image component
- [ ] Implement categories panel
- [ ] Create tags input with suggestions
- [ ] Add publish date picker

### Phase 3: SEO Panel
- [ ] Create `SeoPanel.vue` component
- [ ] Implement SEO score calculator
- [ ] Add focus keyword input
- [ ] Create snippet editor (title + meta)
- [ ] Add URL slug editor
- [ ] Implement SEO analysis checklist
- [ ] Create social media preview components
- [ ] Add schema markup selector

### Phase 4: Polish & Integration
- [ ] Connect to backend API
- [ ] Add revision history
- [ ] Implement content validation
- [ ] Add keyboard shortcuts
- [ ] Create empty state for new articles
- [ ] Add loading skeletons
- [ ] Test responsive layout
- [ ] Add E2E tests

---

## 8. API Endpoints Required

### Content Management
```typescript
// POST /api/v1/articles/:id/content
interface UpdateContentRequest {
  title: string
  content: string // HTML
  status: 'draft' | 'pending' | 'published' | 'scheduled'
  meta: {
    seoTitle?: string
    seoDescription?: string
    focusKeyword?: string
    slug: string
    featuredImage?: string
    categories: string[]
    tags: string[]
    schema?: string
    social?: {
      facebook?: { title?: string; description?: string; image?: string }
      twitter?: { title?: string; description?: string; image?: string }
    }
  }
}

// GET /api/v1/articles/:id/revisions
interface Revision {
  id: string
  createdAt: string
  author: User
  diff: ContentDiff
  seoScore: number
}

// POST /api/v1/articles/:id/revisions/:revisionId/restore
```

---

## 9. Dependencies

```json
{
  "dependencies": {
    "@nuxt/ui": "^3.0.0",
    "@tiptap/vue-3": "^2.x",
    "@tiptap/extension-placeholder": "^2.x",
    "@tiptap/extension-image": "^2.x",
    "@tiptap/extension-link": "^2.x",
    "@tiptap/extension-text-align": "^2.x",
    "@tiptap/extension-emoji": "^2.x",
    "@tiptap/extension-mention": "^2.x",
    "tiptap-extension-code-block-shiki": "^0.x"
  }
}
```

---

## 10. Success Metrics

| Metric | Target |
|--------|--------|
| Time to first keystroke | < 500ms |
| Auto-save latency | < 1s |
| SEO score calculation | < 100ms |
| Block insertion speed | < 100ms |
| Editor crash rate | < 0.1% |
| User content creation time | -30% vs old editor |
| SEO optimization rate | 80%+ articles score > 70 |

---

*Specification for Content Editor with SEO Integration*
*Based on Nuxt UI Editor (TipTap) + WordPress Gutenberg Layout + RankMath SEO*
