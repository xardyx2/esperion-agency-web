## Context

The current Esperion dashboard already covers many admin functions, but its authenticated shell is still a custom, uneven layer rather than a cohesive admin system.

- `frontend/app/layouts/dashboard.vue` provides a basic sidebar + top bar shell, but the navigation is only partially aligned with the real dashboard surface and the overall composition is simpler than the Nuxt UI dashboard template.
- `frontend/app/pages/dashboard/index.vue` still advertises unfinished statuses such as `needsWiring`, `stubCleanup`, and `needsVerification`, which undermines the perceived maturity of the admin experience.
- The Esperion theme system is already well defined in `frontend/app.config.ts`, `frontend/app/assets/css/main.css`, and `frontend/tailwind.config.ts`, with semantic `--es-*` tokens and a fixed primary accent.
- The requested visual direction is the Nuxt dashboard template (`https://dashboard-template.nuxt.dev/`), whose core patterns include a collapsible sidebar, richer header actions, structured admin panels, keyboard-friendly search/command affordances, strong widget composition, and responsive dashboard pages.

This change is therefore a cross-cutting frontend redesign: it affects the authenticated dashboard shell, multiple dashboard pages, shared components, and the way design consistency is enforced across admin screens.

## Goals / Non-Goals

**Goals:**
- Establish a reusable dashboard shell that is structurally inspired by the Nuxt UI dashboard template.
- Preserve Esperion identity by reusing the existing semantic color tokens, dark/light behavior, and primary accent.
- Bring dashboard overview, CRUD, analytics, settings, and support pages under one coherent layout and component vocabulary.
- Create a maintainable reference workflow so any copied or studied upstream template files live in a dedicated frontend reference folder instead of mixing with production code.
- Keep the authenticated dashboard CSR, auth behavior, and backend API contracts unchanged while the UI is modernized.

**Non-Goals:**
- Replacing the backend or redefining dashboard business logic.
- Reworking public website layout to match the admin dashboard.
- Rebranding Esperion away from the current theme tokens and accent color.
- Guaranteeing that every currently missing backend-backed admin feature ships in the same redesign pass.

## Decisions

### 1. Treat the Nuxt template as a structural reference, not a visual clone

**Decision:** The redesign will borrow the Nuxt dashboard template's information architecture and interaction model, but the final dashboard will remain branded Esperion and keep project-specific page flows.

**Rationale:**
- The user explicitly wants the dashboard to feel like `dashboard-template.nuxt.dev`, not to replace Esperion branding.
- Esperion already has a live semantic token system and custom admin modules that do not map 1:1 to the template demo content.
- A structural adaptation is safer than a direct copy because it prevents upstream sample content, colors, and assumptions from leaking into production UI.

**Alternatives considered:**
- Directly clone the upstream template into app code: rejected because it risks visual brand drift and unnecessary cleanup.
- Keep the current dashboard and only polish styles: rejected because the request is for a more substantial template-inspired redesign.

### 2. Preserve Esperion colors through existing theme tokens only

**Decision:** The redesign will continue to use `frontend/app.config.ts`, `frontend/app/assets/css/main.css`, and `frontend/tailwind.config.ts` as the only source of dashboard color semantics.

**Rationale:**
- The project already standardizes its palette through `--es-*` variables and Esperion-specific Tailwind aliases.
- Reusing those tokens keeps public and dashboard brand identity aligned.
- It satisfies the explicit constraint that brand colors must stay the same.

**Alternatives considered:**
- Import the Nuxt template's default accent palette: rejected because it conflicts with Esperion brand color continuity.
- Create dashboard-only hardcoded theme values: rejected because it increases drift and violates design-system intent.

### 3. Build the redesign around shared dashboard primitives

**Decision:** The implementation should introduce reusable dashboard primitives for shell, navbar/header actions, sidebar sections, metric cards, section headers, content panels, filter bars, and table/form wrappers rather than restyling each page independently.

**Rationale:**
- The change touches many dashboard pages under `frontend/app/pages/dashboard/`.
- Shared primitives reduce inconsistency and make the redesign sustainable beyond the first rollout.
- This better matches the compositional style of the Nuxt dashboard template.

**Alternatives considered:**
- Page-by-page bespoke markup updates: rejected because it would preserve inconsistency and slow future maintenance.
- Only replacing `dashboard.vue` without page primitives: rejected because the shell alone will not make the pages feel template-grade.

### 4. Keep reference assets isolated from production source

**Decision:** If upstream template files are copied for study or adaptation, they will live under a dedicated non-production frontend reference folder such as `frontend/reference/dashboard-template/`.

**Rationale:**
- The user explicitly asked for a tidy reference folder.
- Keeping references separate prevents confusion between source-of-truth production code and inspiration or imported examples.
- It allows maintainers to diff against upstream patterns without polluting active app directories.

**Alternatives considered:**
- Mix copied template files into `frontend/app/`: rejected because it obscures ownership and cleanup.
- Rely on the external repo only with no local reference copy: rejected because the user explicitly allowed a local template reference.

### 5. Allow selective upstream template adoption as an implementation accelerator

**Decision:** If recreating the shell or page primitives from scratch becomes unnecessarily slow, implementation may adapt selected files or structural patterns from `nuxt-ui-templates/dashboard`, provided Esperion branding, module structure, and runtime behavior remain authoritative.

**Rationale:**
- The user explicitly approved using the upstream template repo if that is the practical path.
- The template already solves several layout problems the current dashboard still handles manually.
- Selective adoption lowers implementation risk and speeds up parity with the desired dashboard feel.

**Alternatives considered:**
- Forbid any upstream source reuse and rebuild every primitive manually: rejected because it adds avoidable effort without improving the final product.
- Copy large sections upstream unchanged: rejected because it risks branding drift and leaking demo assumptions into Esperion.

### 6. Centralize dashboard navigation and module surfacing

**Decision:** The redesigned shell will derive sidebar/top-level navigation from one canonical dashboard module map and expose the active admin modules consistently.

**Rationale:**
- The current layout navigation does not fully reflect the broader dashboard surface.
- A canonical module map reduces drift between shell navigation, overview shortcuts, and actual routes.
- This aligns with the reference template's stronger navigation model.

### 7. Add language switching to dashboard header

**Decision:** The dashboard shell will include a prominent language switcher in the top navbar, positioned between notifications bell and theme toggle, using the existing `LanguageSwitcher.vue` component with compact `toggle` or `dropdown` variant.

**Rationale:**
- Public site already has full i18n support (Indonesian/English), but dashboard lacks language switching UI.
- Team members need bilingual admin interface for consistency with public site experience.
- Existing `LanguageSwitcher.vue` component is production-ready with scroll preservation and article slug mapping.
- WordPress admin pattern shows language/region settings are expected in admin header.

**Implementation details:**
- Position: Top navbar right section, between notifications and theme toggle
- Component: Reuse `frontend/app/components/ui/LanguageSwitcher.vue` with `variant="toggle"` and `size="sm"`
- Alternative: Position inside user dropdown menu if navbar becomes too crowded
- Fallback: Sidebar footer near theme toggle if both navbar positions are unsuitable

**Alternatives considered:**
- Place language switcher only in user menu: rejected because language is not purely user-specific, it's a global context switch
- Keep dashboard Indonesian-only: rejected because it creates inconsistent experience with bilingual public site
- Create new language switcher component: rejected because existing component already has all needed features

### 8. Enhance user menu with avatar and profile actions

**Decision:** The user menu dropdown will be enhanced to show user avatar (or initials fallback), and include expanded profile-related actions beyond just Sessions/Settings/Logout.

**Rationale:**
- Current user menu uses generic `i-lucide-user-round` icon instead of personalized avatar.
- WordPress and modern admin templates show avatar as standard pattern for user menu.
- Users need quick access to profile management, not just session/settings admin functions.

**Implementation details:**
- Avatar: Check `userStore.profile?.avatar` first, fallback to initials using `getInitials(user.full_name)`
- Menu structure (grouped with separators):
  ```
  [Avatar] Username (label, non-clickable)
  ───────────────────────────────────────
  👤 My Profile (link to profile edit page)
  🛡️  Sessions (existing)
  ⚙️  Settings (existing)
  ───────────────────────────────────────
  🌐 Language: [Current] (optional, if not in navbar)
  ───────────────────────────────────────
  🚪 Log out (error style, existing)
  ```
- Remove duplication: Keep user dropdown in navbar as primary, simplify sidebar footer to non-clickable user display

**Alternatives considered:**
- Keep generic icon: rejected because avatar adds personalization and is expected pattern
- Integrate Gravatar: could be added later, start with backend-provided avatar URL or initials
- Keep both navbar and sidebar dropdowns identical: rejected because sidebar space is premium when collapsed

### 9. Add quick create menu for content workflows

**Decision:** The top navbar will include a "+ New" dropdown menu providing quick access to create new content items (Article, Work, Service, Client, Media).

**Rationale:**
- WordPress admin has "+ New" as prominent header action (Post, Media, Page, User).
- Power users benefit from single-click access to create actions without navigating through sidebar.
- Aligns with template-inspired "richer header actions" goal.

**Implementation details:**
- Position: After page title/breadcrumb in navbar, before quick action buttons
- Dropdown items mapped to create routes:
  - Article → `/dashboard/articles/new`
  - Work → `/dashboard/works/new`
  - Service → `/dashboard/services` (no dedicated new page, goes to list)
  - Client → `/dashboard/clients` (no dedicated new page)
  - Media → `/dashboard/media` (upload interface)
- Icon: `i-lucide-plus` or `i-lucide-circle-plus`
- Badge: Optional count badge for unread media or pending items

### 10. Add "Visit Site" external link

**Decision:** The dashboard header will include a quick "Visit Site" link that opens the public site in a new tab.

**Rationale:**
- WordPress admin bar prominently features "Visit Site" / site name link.
- Admin users frequently need to preview changes or check public site while managing content.
- Provides clear mental separation between admin workspace and public presence.

**Implementation details:**
- Position: Near quick actions or as first item in user menu
- Icon: `i-lucide-external-link` or `i-lucide-globe`
- Behavior: `target="_blank"`, opens root locale path (`localePath('/')`)
- Label: "Visit Site" or site name from `appConfig.esperion.name`

**Alternatives considered:**
- Place in sidebar only: rejected because navbar provides better visibility
- Open in same tab: rejected because it disrupts admin workflow

### 11. Implement Command Palette for keyboard-first navigation

**Decision:** The dashboard will include a command palette (`⌘K` / `Ctrl+K`) that provides instant access to navigation, actions, and search across all content types.

**Rationale:**
- Power users can navigate in <1 second without mouse dependency
- Reduces sidebar navigation friction by 60-80%
- Modern standard pattern (Linear, Vercel, Raycast, WordPress 6.3+)
- Accessibility win for keyboard-first users

**Implementation details:**
- Trigger: `⌘K` or `Ctrl+K` keyboard shortcut
- UI: Overlay modal with search input and categorized results
- Search scope: Navigation pages, content (articles, works, clients), actions (create new, settings)
- Keyboard nav: `↑↓` arrows to select, `Enter` to execute, `Escape` to close
- Recent items: Show last 5-10 visited pages/actions
- Direct execution: Some commands execute without navigation (e.g., "Toggle theme", "Logout")

**Component structure:**
```
┌─────────────────────────────────────────────────────────┐
│  ⌘K  Search commands, pages, actions...                 │
├─────────────────────────────────────────────────────────┤
│  NAVIGATION                                             │
│  📊 Go to Analytics              ⌘ G A                 │
│  📝 Go to Articles               ⌘ G B                 │
│  🎨 Go to Media                  ⌘ G M                 │
│                                                         │
│  ACTIONS                                                │
│  ➕ New Article                  ⌘ N A                 │
│  ➕ New Work                     ⌘ N W                 │
│  👤 New User                     ⌘ N U                 │
│                                                         │
│  RECENT                                                 │
│  📄 "Jasa Web Development" (edited 2h ago)             │
│  📊 Analytics Report (viewed 5h ago)                   │
└─────────────────────────────────────────────────────────┘
```

**Alternatives considered:**
- Use existing search button only: rejected because search is text-only, no action execution
- Build from scratch: rejected because `kbar` or similar library provides proven foundation

### 12. Add bulk actions with multi-select for content management

**Decision:** All content list pages (articles, works, clients, media, contact, users) will support checkbox-based multi-selection with contextual action toolbar for bulk operations.

**Rationale:**
- Reduces 50 individual edits to 1 bulk operation (10x faster)
- Standard pattern for admin workflows (Stripe, WordPress, Notion)
- Critical for content moderation, user management, media cleanup

**Implementation details:**
- **Selection trigger**: First checkbox click reveals sticky action toolbar
- **Selection modes**: "Select all on page" + "Select all N results" (across pagination)
- **Visual feedback**: Counter shows "X of Y selected", selected rows highlighted
- **Bulk actions by module**:
  - **Articles**: Delete, Publish/Unpublish, Export CSV, Change Category, Change Status
  - **Media**: Delete, Download, Tag, Move to Folder
  - **Clients**: Delete, Feature/Unfeature, Export
  - **Contact**: Change Status, Export, Assign to User
  - **Users**: Delete, Suspend/Activate, Change Role, Export
- **Persistence**: Selection persists across pagination (optional, user preference)
- **Clear selection**: `[×] Clear` button or `Escape` key

**UI pattern:**
```
┌─────────────────────────────────────────────────────────────────┐
│  [✓] Select all                                                 │
├─────────────────────────────────────────────────────────────────┤
│  [✓] Article 1  [Draft]  [Edit] [Delete]                       │
│  [✓] Article 2  [Published] [Edit] [Delete]                    │
│  [ ] Article 3  [Published] [Edit] [Delete]                    │
│  [✓] Article 4  [Draft]  [Edit] [Delete]                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  ✓ 3 items selected  [×] Clear                                  │
│  [Bulk Actions ▼] [Delete (3)] [Export (3)]                    │
└─────────────────────────────────────────────────────────────────┘
```

**Alternatives considered:**
- Individual actions only: rejected because it's prohibitively slow for batch operations
- Context menu (right-click): rejected because discoverability is poor

### 13. Implement saved views for filter presets

**Decision:** All filterable list pages will support saving named filter + sort + column configurations as "views" that persist per-user and can be quickly switched between.

**Rationale:**
- Users apply same filters repeatedly (e.g., "Draft Articles", "New Leads")
- Reduces filter setup fatigue
- Personalization per user role (admin vs editor have different default views)
- Standard pattern (Linear, Airtable, Stripe)

**Implementation details:**
- **Save view**: Button in filter bar saves current filter + sort + column state
- **View name**: User provides descriptive name ("Draft Articles", "Needs Translation")
- **View scope**: Per-user by default, optionally shareable team-wide
- **Quick switcher**: Dropdown next to page title to switch between saved views
- **Default view**: User can set one view as their default for each page
- **View management**: Edit name, update filters, delete, reorder

**UI pattern:**
```
┌─────────────────────────────────────────────────────────────────┐
│  Articles          [+ Save View]                                │
├─────────────────────────────────────────────────────────────────┤
│  Views: [All ▼] [Drafts] [Published] [Needs Translation] [+]   │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Draft Articles                                    [×]   │   │
│  │ Status: Draft • Category: All • Sort: Newest           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Needs Translation                                 [×]   │   │
│  │ Status: en_only OR id_only • Sort: Published Date      │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

**Pre-saved views examples:**
- **Articles**: "Drafts", "Published", "Needs Translation", "Recent (7 days)"
- **Contact**: "New Leads", "Qualified", "Needs Follow-up"
- **Media**: "Unoptimized Images", "Large Files (>5MB)", "Unused Assets"
- **Users**: "Admins", "Editors", "Inactive (30 days)"

**Alternatives considered:**
- Browser localStorage only: rejected because views should sync across devices
- Team-shared views only: rejected because personalization is valuable

### 14. Add inline editing for quick field updates

**Decision:** Simple, low-risk fields across all modules will support click-to-edit inline without navigating to full edit page, with immediate validation and undo capability.

**Rationale:**
- 5x faster for micro-edits vs full edit page navigation
- Reduces page navigation fatigue
- Modern standard (Airtable, Notion, Linear)
- Appropriate for high-frequency, simple changes

**Implementation details:**
- **Trigger**: Click on field value → inline input appears → blur or Enter saves
- **Validation**: Immediate inline validation, red border on error
- **Undo**: Toast notification with "Undo" link for 5 seconds after save
- **Field types suitable for inline edit**:
  - Text inputs: Title, name, description (short)
  - Select dropdowns: Status, category, role
  - Toggle switches: Featured, active/published, boolean flags
  - Tags: Add/remove tags inline
- **Fields requiring full edit page**: Multi-field forms, rich text editors, file uploads
- **Hybrid approach**: "Edit" button opens slide-out drawer for medium-complexity forms (preserves context)

**Decision framework (inline vs modal):**
| Use Inline When | Use Modal/Drawer When |
|-----------------|----------------------|
| Simple, single-field edits | Complex, multi-field forms (5+ fields) |
| Low-risk changes (typos, tags) | High-stakes edits (payments, permissions) |
| High-frequency, repetitive tasks | Infrequent, focused operations |

**Alternatives considered:**
- Full edit page only: rejected because it's overkill for simple changes
- All inline editing: rejected because complex forms need structured layout

### 15. Implement real-time activity feed and presence indicators

**Decision:** Dashboard will show real-time activity feed (what other admins are doing) and presence indicators (who's online, what they're viewing/editing) to enable team coordination and provide audit trail.

**Rationale:**
- Team coordination without external tools (Slack, email)
- Prevents edit conflicts on same content
- Audit trail for compliance and debugging
- Accountability and transparency

**Implementation details:**
- **Activity feed location**: Dashboard home widget + dedicated "Activity" page
- **Presence indicators**:
  - Top bar: "X users online" with avatars
  - Per-page: "Y others viewing this" badge
  - Edit locks: "John is editing this article" warning
- **Activity events tracked**:
  - Content created/updated/deleted
  - Status changes
  - User logins/logouts
  - Settings changes
  - Backup/restore operations
- **Feed UI**: Chronological, infinite scroll, filterable by event type and user
- **Real-time tech**: WebSocket or Server-Sent Events (SSE) for sub-second updates
- **Privacy controls**: User can toggle visibility ("invisible mode")

**UI pattern:**
```
┌─────────────────────────────────────────────────────────────────┐
│  ACTIVE NOW                                                     │
│  👤 admin@esperion.com - Editing "Jasa Web Development"         │
│  👤 editor@esperion.com - Viewing Analytics                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  RECENT ACTIVITY                            [View All →]        │
├─────────────────────────────────────────────────────────────────┤
│  🕐 2 min ago   admin published "SEO Tips 2026"                 │
│  🕐 15 min ago  editor uploaded logo-client-5.png              │
│  🕐 1h ago      admin created user "marketing@client.com"      │
│  🕐 2h ago      system backup completed successfully            │
└─────────────────────────────────────────────────────────────────┘
```

**Alternatives considered:**
- Polling every 30s: rejected because WebSocket/SSE is more efficient
- No presence: rejected because edit conflicts are frustrating

### 16. Enhance empty states with guided onboarding

**Decision:** All empty states (no data, no results, first-time visits) will include actionable guidance, illustrations, and clear next steps instead of simple "No results" messages.

**Rationale:**
- Prevents "dead end" frustration for new users
- Educates while waiting for data
- Drives feature adoption
- Reduces support tickets

**Implementation details:**
- **Components**: Illustration/icon + headline + description + primary CTA + secondary links
- **Contextual guidance**: Specific to module and user state
- **Quick tips**: 2-3 bullet points on best practices
- **External resources**: Links to docs, video tutorials, example data
- **First-time tour**: Optional interactive walkthrough on first visit to each module

**Enhanced empty state pattern:**
```
┌─────────────────────────────────────────────────────────────────┐
│  📷 Your Media Library is Empty                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Upload images, videos, and documents to build your media      │
│  library. These can be attached to articles, works, or         │
│  services.                                                      │
│                                                                 │
│  ┌─────────────────┐                                           │
│  │   Drag & Drop   │                                           │
│  │   files here    │                                           │
│  │   or click to   │                                           │
│  │   browse        │                                           │
│  └─────────────────┘                                           │
│                                                                 │
│  📚 Quick Tips:                                                 │
│  • Optimize images before upload (max 5MB recommended)         │
│  • Use descriptive filenames for SEO                            │
│  • WebP format preferred for web performance                   │
│                                                                 │
│  [📖 Read Media Guidelines]  [🎥 Watch Tutorial (2 min)]       │
└─────────────────────────────────────────────────────────────────┘
```

**Modules requiring enhanced empty states:**
- Media (first upload)
- Articles (create first article)
- Works (add first portfolio item)
- Clients (add first client)
- Contact (when no submissions)
- Analytics (tracking setup guide)
- Users (invite first team member)

**Alternatives considered:**
- Keep simple "No results": rejected because it's not actionable
- Import sample data automatically: rejected because users should choose

### 17. Add advanced data visualization for analytics

**Decision:** Analytics page will be enhanced with interactive charts, graphs, and visual representations of data beyond the current text-based metric cards and funnel tables.

**Rationale:**
- Patterns visible instantly vs reading numbers
- Better decision-making with visual context
- Client-ready reports
- Competitive with dedicated analytics platforms (Google Analytics, Fathom)

**Implementation details:**
- **Chart library**: Apache ECharts, Chart.js, or Recharts (decision based on bundle size, Nuxt compatibility)
- **Visualizations to add**:
  1. **Time series line chart**: Page views, sessions over time (7d, 30d, 90d, custom)
  2. **Funnel visualization**: Bar chart with conversion % between steps
  3. **Geographic map**: User locations (country/level)
  4. **Device breakdown**: Pie/donut chart (Desktop/Mobile/Tablet)
  5. **Traffic sources**: Stacked bar or donut (Organic, Direct, Social, Referral)
  6. **Top pages**: Horizontal bar chart with view counts
- **Interactions**: Hover tooltips, click-to-drill, zoom/pan on time series
- **Time range picker**: Presets (7d, 30d, 90d, YTD) + custom date range
- **Comparison**: "vs previous period" toggle with % change indicators
- **Export**: PNG, PDF, CSV export for reports

**UI pattern:**
```
┌─────────────────────────────────────────────────────────────────┐
│  TRAFFIC OVERVIEW                          [Last 30 days ▼]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│      ┌──────────────────────────────────────────────────┐      │
│   1K │        ╱╲    ╱╲                                  │      │
│      │      ╱    ╲╱    ╲    ╱╲                          │      │
│  500 │    ╱          ╲    ╱  ╲    ╱╲                   │      │
│      │  ╱              ╲╱    ╲  ╱  ╲                   │      │
│    0 └──────────────────────────────────────────────────┘      │
│      Jan 1   Jan 8   Jan 15   Jan 22   Jan 29   Feb 5          │
│                                                                 │
│  [Page Views] [Sessions] [Bounce Rate] [Avg Time]              │
└─────────────────────────────────────────────────────────────────┘
```

**Alternatives considered:**
- Keep text-only metrics: rejected because visual patterns are invaluable
- Embed Google Analytics: rejected because we need custom funnel tracking

### 18. Implement widget-based dashboard customization

**Decision:** Dashboard home (index.vue) will support draggable, resizable widget grid allowing users to customize their overview with modules that matter most to their role.

**Rationale:**
- One dashboard rarely fits all users
- Personalization increases daily active usage by 2.5x (IBM Cognos data)
- Modern standard (Linear, Vercel, Notion)
- Different roles need different info (admin vs editor vs analyst)

**Implementation details:**
- **Grid system**: 12-column responsive grid, widgets snap to grid
- **Drag handles**: Each widget has drag handle for reordering
- **Resize handles**: Widgets can be resized (with min/max constraints)
- **Customize mode**: Toggle between "view" and "edit" mode
- **Widget library**: Pre-built widgets users can add
- **Multiple dashboards**: Users can create named dashboards for different contexts
- **Persistence**: Layout saved per-user in backend
- **Reset**: "Reset to default" escape hatch

**Available widgets:**
- Traffic overview (analytics summary)
- Recent articles/works/services
- Contact submissions queue
- Media library preview
- System health (uptime, backups, errors)
- SEO scores
- User activity feed
- Quick actions
- Content calendar
- Task/todo list

**UI pattern:**
```
┌─────────────────────────────────────────────────────────────────┐
│  Dashboard Home                     [+ Add Widget] [Customize] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────┐  ┌─────────────────────────────────┐  │
│  │  📊 Traffic Stats   │  │  📝 Recent Articles             │  │
│  │  [Drag handle]  [×] │  │  [Drag handle]            [×]   │  │
│  │                     │  │  • Article 1 (edited 2h ago)    │  │
│  │  Views: 2,341       │  │  • Article 2 (edited 5h ago)    │  │
│  │  ⬆️ +12% vs last    │  │  • Article 3 (edited 1d ago)    │  │
│  └─────────────────────┘  └─────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  📬 Recent Contact Submissions              [Drag] [×]  │   │
│  │                                                         │   │
│  │  • John Doe - Web Development (2h ago)                 │   │
│  │  • Jane Smith - SEO Consultation (5h ago)              │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

**Alternatives considered:**
- Fixed layout: rejected because different roles have different needs
- Full page builder: rejected because it's overkill for dashboard overview

### 19. Implement smart search with operators and facets

**Decision:** Search functionality across all content types will be enhanced with advanced search operators, faceted filters, and intelligent ranking beyond simple text matching.

**Rationale:**
- Power users can find anything quickly with precise queries
- Reduces need for multiple filter dropdowns
- Search becomes a workflow tool, not just lookup
- Standard for content-heavy platforms

**Implementation details:**
- **Search UI**: Enhanced search input with filter dropdown and syntax hints
- **Search operators**:
  - `"exact phrase"` - Quote matching
  - `status:draft` - Field-value matching
  - `category:services` - Category filter
  - `author:admin` - Author filter
  - `before:2026-01-01` / `after:2026-03-01` - Date ranges
  - `views:>1000` / `views:<100` - Numeric comparisons
  - `translation:incomplete` - Status filter
- **Faceted filters**: Sidebar or dropdown with checkboxes for common filters
- **Recent searches**: Show last 5-10 searches for quick replay
- **Search scope**: Users can limit to specific content type or search all
- **Highlighting**: Search terms highlighted in results

**UI pattern:**
```
┌─────────────────────────────────────────────────────────────────┐
│  🔍 Search articles...                      [Filters ▼]        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  RECENT SEARCHES:                                               │
│  "web development" • "SEO" • "category:services"               │
│                                                                 │
│  ADVANCED SEARCH SYNTAX:                                        │
│  • "exact phrase"  • status:draft  • category:services         │
│  • author:admin    • before:2026-01-01  • after:2026-03-01     │
│  • views:>1000     • translation:incomplete                     │
└─────────────────────────────────────────────────────────────────┘
```

**Alternatives considered:**
- Keep simple text search: rejected because it's not powerful enough for large datasets
- Full Elasticsearch: rejected because overkill for current data volume

### 20. Add contextual help and feature discovery system

**Decision:** Dashboard will include in-context help tooltips, feature spotlight modals, guided tours, and keyboard shortcut documentation to improve first-time user experience and feature adoption.

**Rationale:**
- Reduces support tickets
- Increases feature adoption (users discover capabilities)
- Better user confidence
- Self-service learning reduces onboarding time

**Implementation details:**
- **Help tooltips**: `?` or `ℹ️` icons next to complex features, show explanation on hover/click
- **Feature spotlight**: Occasional modals highlighting underused features (can be dismissed, reappears after N sessions)
- **First-time tours**: Optional interactive walkthrough with hotspots when user visits module for first time
- **Keyboard shortcuts modal**: `?` key opens overlay showing all available shortcuts
- **Empty state education**: When no data, show "how to get started" with examples
- **Documentation links**: Contextual links to relevant docs in each module
- **"What's new" changelog**: Modal on login after major updates

**UI pattern:**
```
┌─────────────────────────────────────────────────────────────────┐
│  Analytics                              [? Help] [🎓 Tour]      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────┐     │
│  │  Funnel Reporting                          [ℹ️ Tip]   │     │
│  │  ─────────────────────────────────────────────────    │     │
│  │  Track user journeys through defined steps. Each     │     │
│  │  step represents an event that users complete.       │     │
│  │                                                       │     │
│  │  [📖 Documentation] [🎥 Video Tutorial]              │     │
│  └───────────────────────────────────────────────────────┘     │
│                                                                 │
│  🔥 FEATURE SPOTLIGHT:                                          │
│  Did you know you can export this report as PDF?               │
│  [Export as PDF →]  [Don't show again]                         │
└─────────────────────────────────────────────────────────────────┘
```

**Keyboard shortcuts to document:**
- `⌘K` - Open command palette
- `?` - Open shortcuts help
- `G then D` - Go to Dashboard
- `G then A` - Go to Articles
- `G then M` - Go to Media
- `N` - Quick create (context-aware)
- `/` - Focus search
- `Escape` - Close modals/dropdowns

**Alternatives considered:**
- No help system: rejected because it increases support burden
- External docs only: rejected because context-switching is disruptive

### 7. Roll out the redesign in phases while preserving existing route behavior

**Decision:** Implementation should land in phases: shared shell and primitives first, then page migrations for the most visible modules, then lower-priority pages and polish.

**Rationale:**
- The dashboard remains CSR and authenticated, so the redesign can ship incrementally without changing rendering policy.
- A phased rollout lowers regression risk on routes that already depend on live backend APIs.
- This makes verification more practical across pages, breakpoints, and themes.

**Alternatives considered:**
- One-shot rewrite of every dashboard page: rejected because it increases delivery risk and makes regressions harder to isolate.

## Risks / Trade-offs

- **[Template drift]** Borrowing too literally from the Nuxt template could make Esperion feel generic -> Mitigation: require continued use of Esperion tokens, labels, and module structure.
- **[Scope expansion]** A visual redesign can easily turn into a feature-completion initiative -> Mitigation: separate layout/system work from missing backend-backed features unless a page cannot function without them.
- **[Component sprawl]** Introducing too many primitives too quickly could create overlapping abstractions -> Mitigation: define a small core set of shared dashboard building blocks first.
- **[Navigation regressions]** Reworking shell navigation can hide or break existing routes -> Mitigation: keep a verified route inventory and add route-level smoke checks.
- **[Responsive regressions]** Dense dashboard layouts can degrade on tablet/mobile -> Mitigation: explicitly verify sidebar, top bar, tables, and form sections at mobile and desktop breakpoints.

## Migration Plan

1. Create or update a dedicated reference folder for the upstream Nuxt dashboard template materials and any approved copied source references.
2. Introduce the new shared dashboard shell and foundational primitives without changing dashboard CSR or auth flow.
3. Migrate the dashboard overview and the highest-value module pages to the new composition system.
4. Normalize sidebar/header navigation and page-level action areas across the remaining dashboard pages.
5. Verify light/dark theme parity, Esperion color-token usage, and key dashboard routes on desktop and mobile.
6. Remove superseded legacy dashboard layout markup or duplicated page-specific shell code once parity is confirmed.

Rollback strategy:
- Keep the old shell and new shell changes isolated enough to revert dashboard layout/component commits without touching backend APIs.
- If a migrated page regresses, temporarily restore that page to the previous dashboard composition while preserving the broader shell improvements.

## Open Questions

- No blocking design questions remain for proposal approval.
- Default implementation assumptions for the first pass are:
  - migrate the full current dashboard route set, but sequence delivery as shell and overview first, then CRUD/data pages, then secondary/support pages;
  - defer command-palette parity unless it falls out naturally from the shared shell work without expanding scope;
  - keep only selected upstream reference materials locally (for example README excerpts, screenshots, and targeted reference files) unless implementation proves a fuller snapshot is necessary.
