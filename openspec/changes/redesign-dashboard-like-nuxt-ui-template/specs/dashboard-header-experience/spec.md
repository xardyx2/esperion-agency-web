# Dashboard Header Experience Specification

## Overview

This specification defines the enhanced dashboard header experience for the Esperion admin dashboard, including language switching, user menu enhancements, quick create functionality, and external site access.

## Requirements

### 1. Language Switcher

#### 1.1 Position
- **Primary location**: Top navbar right section
- **Placement**: Between notifications bell button and theme toggle
- **Responsive behavior**: 
  - Desktop (`xl`): Always visible in navbar
  - Mobile (`< xl`): May be moved to user dropdown menu or hidden behind overflow menu

#### 1.2 Component
- **Use existing**: `frontend/app/components/ui/LanguageSwitcher.vue`
- **Variant**: `toggle` (compact button) or `dropdown` (if space allows)
- **Size**: `sm` (compact for navbar fit)
- **Flags**: `showFlags="true"` for visual language indicator

#### 1.3 Behavior
- **Languages**: Indonesian (`id`) and English (`en`)
- **Default**: Indonesian (matches site default)
- **Persistence**: Language preference stored in cookie via `@nuxtjs/i18n`
- **Navigation**: Uses `setLocale()` from `useI18n()` composable
- **URL strategy**: Prefix-based (`/id/dashboard`, `/en/dashboard`)

#### 1.4 Integration Points
- **i18n config**: `frontend/nuxt.config.ts` i18n module settings
- **Locale path**: `useLocalePath()` for all internal navigation
- **Translation keys**: Add `dashboard.header.languageSwitcher.*` keys if needed

---

### 2. User Menu Enhancement

#### 2.1 Avatar Display

**Current state:**
```vue
<UIcon name="i-lucide-user-round" class="h-4 w-4" />
```

**Enhanced state:**
```vue
<UAvatar 
  v-if="user?.avatar"
  :src="user.avatar" 
  :alt="user.full_name || user.username"
  size="sm"
/>
<UAvatar 
  v-else
  :text="getInitials(user?.full_name || user.username)"
  size="sm"
/>
```

**Avatar source priority:**
1. `userStore.profile?.avatar` - Backend-provided avatar URL
2. `authStore.user?.avatar` - Auth response avatar field
3. Initials from `user.full_name` or `user.username`
4. Fallback to generic user icon

**Initials generation:**
```typescript
function getInitials(name?: string): string {
  if (!name) return 'U'
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
```

#### 2.2 Menu Structure

**Grouped dropdown menu items:**

```typescript
const userMenuItems = computed<DropdownMenuItem[][]>(() => [
  // Group 1: User Info (label, non-clickable)
  [
    {
      type: 'label',
      label: `${user.full_name || user.username}`,
      description: user.role || 'authenticated',
      icon: 'i-lucide-user-round'
    }
  ],
  
  // Group 2: Profile & Settings
  [
    {
      label: 'My Profile',
      icon: 'i-lucide-user-cog',
      to: localePath('/dashboard/users/profile') // or current user edit page
    },
    {
      label: 'Sessions',
      icon: 'i-lucide-shield-check',
      to: localePath('/dashboard/sessions')
    },
    {
      label: 'Settings',
      icon: 'i-lucide-settings-2',
      to: localePath('/dashboard/settings')
    }
  ],
  
  // Group 3: Language (optional, if not in navbar)
  [
    {
      type: 'label',
      label: 'Language'
    },
    {
      label: 'Bahasa Indonesia',
      icon: locale.value === 'id' ? 'i-lucide-check' : undefined,
      onSelect: () => setLocale('id'),
      class: locale.value === 'id' ? 'bg-es-accent-primary/10' : undefined
    },
    {
      label: 'English',
      icon: locale.value === 'en' ? 'i-lucide-check' : undefined,
      onSelect: () => setLocale('en'),
      class: locale.value === 'en' ? 'bg-es-accent-primary/10' : undefined
    }
  ],
  
  // Group 4: Logout
  [
    {
      label: 'Log out',
      icon: 'i-lucide-log-out',
      color: 'error',
      onSelect: async () => {
        await logout()
      }
    }
  ]
])
```

#### 2.3 Menu Consolidation

**Navbar (primary):**
- Full dropdown with all menu items
- Avatar + username display
- Always accessible

**Sidebar footer (simplified):**
- Non-clickable user display when sidebar expanded
- Shows avatar/initials + username (truncated)
- No dropdown when sidebar collapsed
- Clicking navigates to user profile or opens navbar menu

**Implementation:**
```vue
<!-- Sidebar footer: simplified -->
<div v-if="!collapsed" class="flex items-center gap-3 px-3 py-2">
  <UAvatar :src="user?.avatar" :text="getInitials(user?.name)" size="xs" />
  <div class="min-w-0 flex-1">
    <p class="truncate text-sm font-medium">{{ user?.full_name }}</p>
    <p class="truncate text-xs text-es-text-secondary">{{ user?.role }}</p>
  </div>
</div>

<!-- Navbar: full dropdown -->
<UDropdownMenu :items="userMenuItems" :content="{ align: 'end' }">
  <UButton color="neutral" variant="ghost">
    <template #leading>
      <UAvatar :src="user?.avatar" :text="getInitials(user?.name)" size="sm" />
    </template>
    <span class="hidden lg:inline">{{ user?.full_name }}</span>
  </UButton>
</UDropdownMenu>
```

---

### 3. Quick Create Menu

#### 3.1 Position
- **Location**: Top navbar, after page title/breadcrumb
- **Alternative**: In header right section before quick action buttons
- **Responsive**: Hidden on mobile, visible from `md` breakpoint

#### 3.2 Component
- **Type**: `UDropdownMenu` with `+` icon button
- **Icon**: `i-lucide-plus` or `i-lucide-circle-plus`
- **Label**: "New" or hidden (icon-only with tooltip)

#### 3.3 Menu Items

```typescript
const quickCreateItems = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: 'Article',
      icon: 'i-lucide-file-text',
      to: localePath('/dashboard/articles/new'),
      shortcut: ['G', 'A']
    },
    {
      label: 'Work',
      icon: 'i-lucide-briefcase-business',
      to: localePath('/dashboard/works/new'),
      shortcut: ['G', 'W']
    },
    {
      label: 'Service',
      icon: 'i-lucide-panels-top-left',
      to: localePath('/dashboard/services'),
      hint: 'No dedicated create page'
    },
    {
      label: 'Client',
      icon: 'i-lucide-users-round',
      to: localePath('/dashboard/clients'),
      hint: 'No dedicated create page'
    },
    {
      label: 'Media',
      icon: 'i-lucide-images',
      to: localePath('/dashboard/media'),
      hint: 'Upload interface'
    }
  ]
])
```

#### 3.4 Behavior
- **Keyboard shortcut**: `N` to open (when not in input field)
- **Tracking**: Optional analytics on create action frequency
- **Permissions**: Hide items user doesn't have permission to create

---

### 4. Visit Site Link

#### 4.1 Position
- **Primary**: Top navbar right section, after quick actions
- **Alternative**: First item in user menu dropdown
- **Icon**: Standalone button with `i-lucide-external-link` or `i-lucide-globe`

#### 4.2 Component
```vue
<UButton
  color="neutral"
  variant="ghost"
  :to="localePath('/')"
  target="_blank"
  external
  :aria-label="'Visit public site'"
>
  <template #leading>
    <UIcon name="i-lucide-globe" class="h-4 w-4" />
  </template>
  <span class="hidden lg:inline">Visit Site</span>
</UButton>
```

#### 4.3 Behavior
- **Target**: Opens in new tab (`target="_blank"`)
- **URL**: Root locale path (respects current language)
- **Tooltip**: "Visit public site" or site name
- **Badge**: Optional "Live" badge for production environment indicator

---

## Layout Specification

### Desktop Layout (≥1280px)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  UDashboardNavbar                                                        │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ [≡] Page Title    [+ New▼] [Visit Site] [🌐 ID▼] [🔔] [🌙] [👤▼] │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
```

**Element order (left to right in right section):**
1. Quick Create dropdown (`+ New`)
2. Visit Site button
3. Language Switcher
4. Notifications button
5. Theme Toggle
6. User Menu dropdown

### Mobile Layout (<1280px)

```
┌──────────────────────────────────────────────────────────────────────────┐
│  UDashboardNavbar                                                        │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ [≡] Page Title                               [🔔] [🌙] [👤▼]      │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
```

**Responsive behavior:**
- Quick Create: Hidden (access via sidebar navigation)
- Visit Site: Hidden (access via user menu or sidebar)
- Language Switcher: Moved inside user dropdown menu
- Notifications, Theme, User Menu: Always visible

---

## Translation Requirements

### New Translation Keys

Add to `frontend/i18n/locales/id.json` and `en.json`:

```json
{
  "dashboard": {
    "header": {
      "languageSwitcher": {
        "label": "Bahasa",
        "tooltip": "Ganti bahasa dashboard"
      },
      "quickCreate": {
        "label": "Baru",
        "tooltip": "Buat konten baru",
        "article": "Artikel",
        "work": "Portfolio",
        "service": "Layanan",
        "client": "Klien",
        "media": "Media"
      },
      "visitSite": {
        "label": "Kunjungi Situs",
        "tooltip": "Buka situs publik di tab baru"
      },
      "userMenu": {
        "myProfile": "Profil Saya",
        "sessions": "Sesi Aktif",
        "settings": "Pengaturan",
        "language": "Bahasa",
        "logout": "Keluar"
      }
    }
  }
}
```

---

## Accessibility Requirements

### Keyboard Navigation

- **Tab order**: Logical left-to-right flow in navbar
- **Enter/Space**: Activate buttons, open dropdowns
- **Escape**: Close open dropdowns
- **Arrow keys**: Navigate within dropdown menus

### ARIA Labels

- Language Switcher: `aria-label="Select language"`
- Quick Create: `aria-label="Create new content"`
- Visit Site: `aria-label="Visit public site (opens in new tab)"`
- User Menu: `aria-label="User menu"`
- Notifications: `aria-label="Notifications, {count} unread"`

### Screen Reader Announcements

- Language change: Announce new active language
- Dropdown open/close: Announce menu state
- Unread notifications: Announce count on focus

---

## Testing Requirements

### Unit Tests

1. **Language Switcher**
   - Renders correct current language
   - Calls `setLocale()` on selection
   - Preserves locale across navigation

2. **User Menu**
   - Displays avatar when available
   - Shows initials fallback when no avatar
   - All menu items render with correct links
   - Logout calls `authStore.logout()` and redirects

3. **Quick Create**
   - All menu items present
   - Links resolve to correct routes
   - Keyboard shortcut opens menu

### E2E Tests (Playwright)

1. **Language switching flow**
   ```typescript
   test('switches dashboard language', async ({ page }) => {
     await page.goto('/dashboard')
     await page.click('[data-testid="language-switcher"]')
     await page.click('[data-testid="lang-en"]')
     await expect(page).toHaveURL('/en/dashboard')
     await expect(page.locator('[data-testid="dashboard-title"]'))
       .toContainText('Dashboard') // English title
   })
   ```

2. **User menu flow**
   ```typescript
   test('user menu navigation', async ({ page }) => {
     await page.goto('/dashboard')
     await page.click('[data-testid="user-menu"]')
     await page.click('[data-testid="menu-sessions"]')
     await expect(page).toHaveURL('/dashboard/sessions')
   })
   ```

3. **Quick create flow**
   ```typescript
   test('quick create article', async ({ page }) => {
     await page.goto('/dashboard')
     await page.click('[data-testid="quick-create"]')
     await page.click('[data-testid="create-article"]')
     await expect(page).toHaveURL('/dashboard/articles/new')
   })
   ```

---

## Implementation Checklist

- [ ] Add Language Switcher to navbar (`LanguageSwitcher.vue` with `variant="toggle"`, `size="sm"`)
- [ ] Add avatar support to user menu (check `user.avatar`, fallback to initials)
- [ ] Create `getInitials()` utility function
- [ ] Expand user menu items (add "My Profile", optional language submenu)
- [ ] Consolidate user menu (navbar = full dropdown, sidebar = simplified display)
- [ ] Add Quick Create dropdown menu with all content types
- [ ] Add Visit Site button with external link behavior
- [ ] Add translation keys to `id.json` and `en.json`
- [ ] Update responsive behavior for mobile breakpoints
- [ ] Add keyboard shortcuts (N for new create, Escape to close dropdowns)
- [ ] Add ARIA labels for accessibility
- [ ] Write unit tests for new components
- [ ] Write E2E tests for user flows
- [ ] Verify dark mode compatibility
- [ ] Verify mobile responsive layout
- [ ] Test with screen reader (basic accessibility check)

---

## Dependencies

### Existing Components
- `frontend/app/components/ui/LanguageSwitcher.vue` ✅
- `frontend/app/components/ui/ThemeToggle.vue` ✅
- `@nuxt/ui` components: `UDropdownMenu`, `UButton`, `UAvatar`, `UIcon` ✅

### Required Updates
- `frontend/app/layouts/dashboard.vue` - Main integration point
- `frontend/i18n/locales/id.json` - Indonesian translations
- `frontend/i18n/locales/en.json` - English translations
- `frontend/app/stores/user.ts` - Avatar field (if not already present)
- `frontend/app/composables/useDashboardNavigation.ts` - Quick create items

---

## Success Criteria

1. **Language Switcher**: User can switch between Indonesian and English from any dashboard page
2. **User Avatar**: User sees personalized avatar or initials in menu
3. **Quick Create**: User can create new content in ≤2 clicks from any dashboard page
4. **Visit Site**: User can open public site in new tab with one click
5. **Responsive**: All features work correctly on desktop, tablet, and mobile breakpoints
6. **Accessible**: Keyboard navigation works, ARIA labels present, screen reader compatible
7. **Themed**: Dark/light mode compatibility verified
8. **Tested**: Unit and E2E tests passing

---

## Open Questions

1. **Avatar backend support**: Does current `user` model include `avatar` field? If not, add to backend schema?
2. **Profile page**: Is there an existing user profile edit page, or does it need to be created?
3. **Permissions**: Should quick create items be hidden based on user role, or show to all authenticated users?
4. **Language in user menu**: Include language selector in user dropdown as backup, or navbar-only?
