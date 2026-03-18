# Git Configuration for Nuxt Studio

This document explains the Git setup for Nuxt Studio compatibility and visual editing workflow.

## Overview

The Git configuration has been optimized for Nuxt Studio, enabling:
- ✅ Visual content editing with proper file handling
- ✅ Automatic content change detection and commits
- ✅ Git LFS for media file management
- ✅ Proper line ending handling across platforms

## Files & Configuration

### 1. `.gitattributes`

Location: Repository root

**Purpose:** Defines how Git handles different file types

**Key Features:**
- **Line Endings**: Normalizes text files to LF (Unix-style) for web compatibility
- **Git LFS**: Tracks large media files (images, videos, documents) via Git LFS
- **Export Settings**: Excludes sensitive files from Git archives
- **Nuxt Studio**: Marks content files for visual editing tracking

**Tracked with Git LFS:**
- Images: `.png`, `.jpg`, `.jpeg`, `.gif`, `.svg`, `.webp`, `.avif`, `.ico`, `.bmp`
- Videos: `.mp4`, `.webm`, `.mov`, `.avi`
- Audio: `.mp3`, `.wav`, `.ogg`
- Documents: `.pdf`, `.doc`, `.docx`, `.xls`, `.xlsx`, `.ppt`, `.pptx`
- Archives: `.zip`, `.tar`, `.gz`, `.rar`

### 2. `.gitignore` (Root)

Location: Repository root

**Nuxt Studio Specific Additions:**
```gitignore
# Nuxt Studio local state
.nuxt-studio/
.studio/
*.studio.json

# Visual editing drafts
.drafts/
*.draft.*

# Git LFS objects
.git/lfs/

# Content & Media
content/.index/
```

### 3. `frontend/.gitignore`

Location: `frontend/` directory

**Nuxt Studio Specific Additions:**
```gitignore
# Nuxt Studio local state
.nuxt-studio/
.studio/
*.studio.json

# Visual editing drafts
.drafts/
*.draft.*
```

### 4. Git Hooks

Location: `.git/hooks/`

#### Pre-commit Hook (`.git/hooks/pre-commit`)

**Purpose:** Runs quality checks before commits

**Features:**
- ESLint on staged TypeScript/Vue files
- TypeScript type checking via `nuxi typecheck`
- Large file detection (>1MB) with Git LFS suggestions
- **Nuxt Studio Mode**: Skip heavy checks when `NUXT_STUDIO_MODE=true`

**Skip Behavior:**
- Automatically skips if npm is not available
- Skips heavy checks in Nuxt Studio editing mode
- Non-blocking: continues even if checks fail (warnings only)

#### Post-commit Hook (`.git/hooks/post-commit`)

**Purpose:** Automatically commits content changes after a commit

**Features:**
- Detects content changes in:
  - `frontend/content/**/*`
  - `frontend/app/pages/**/*.vue`
  - `frontend/app/components/**/*.vue`
  - `frontend/app/layouts/**/*.vue`
  - `frontend/i18n/locales/*.json`
  - `*.md` and `*.mdx` files
- Creates auto-commits with message: `chore: auto-commit content changes from Nuxt Studio`
- Prevents duplicate auto-commits
- Respects `[skip-auto-commit]` flag in commit messages

**Environment Variables:**
- `SKIP_AUTO_COMMIT=true` - Disable auto-commit functionality
- `NUXT_STUDIO_MODE=true` - Enable Nuxt Studio editing mode

**How It Works:**
1. After you commit, the hook checks for content file changes
2. If content changes are detected, stages them automatically
3. Creates a follow-up commit with the auto-commit message
4. Skips if the last commit was already an auto-commit

## Usage

### Standard Workflow

```bash
# Make your changes
git add .
git commit -m "feat: add new feature"

# Post-commit hook will automatically:
# - Check for content changes
# - Create auto-commit if needed
```

### Nuxt Studio Visual Editing Mode

When editing content via Nuxt Studio:

```bash
# Enable Nuxt Studio mode (skip heavy checks)
export NUXT_STUDIO_MODE=true

# Make content changes
git add .
git commit -m "chore: update homepage content"

# Pre-commit hook skips heavy linting/type checking
# Post-commit hook handles content change tracking
```

### Disable Auto-commit Temporarily

```bash
# Skip auto-commit for next commit
export SKIP_AUTO_COMMIT=true
git commit -m "feat: major refactoring"

# Re-enable auto-commit
unset SKIP_AUTO_COMMIT
```

### Use Skip Flag in Commit Message

```bash
# Add [skip-auto-commit] flag
git commit -m "feat: large refactoring [skip-auto-commit]"
```

## Git LFS Setup

If not already installed, install Git LFS:

```bash
# Install Git LFS globally
git lfs install

# Track large file patterns (already configured in .gitattributes)
git lfs track "*.png"
git lfs track "*.jpg"
git lfs track "*.mp4"

# Verify LFS tracking
git lfs ls-files

# Check LFS status
git lfs status
```

## Platform-Specific Notes

### Windows

- Line endings are automatically converted to CRLF on checkout
- All commits use LF line endings (consistent across platforms)
- Git hooks use bash (Git Bash on Windows)

### macOS/Linux

- Native LF line ending support
- Git hooks execute with system bash

## Troubleshooting

### Hook Not Executing

**Problem:** Git hooks not running on commit

**Solution:**
```bash
# Ensure hooks are executable (Unix-like systems)
chmod +x .git/hooks/pre-commit
chmod +x .git/hooks/post-commit

# On Windows, ensure Git Bash is available
```

### Large Files Not Using LFS

**Problem:** Large files committed without LFS

**Solution:**
```bash
# Check LFS tracking
git lfs ls-files

# Re-track specific file types
git lfs track "*.png"

# Migrate existing files to LFS
git lfs migrate import --include="*.png,*.jpg"
```

### Auto-commit Creating Too Many Commits

**Problem:** Multiple auto-commits in a row

**Solution:**
```bash
# Disable auto-commit temporarily
export SKIP_AUTO_COMMIT=true

# Or use skip flag in commit message
git commit -m "chore: content updates [skip-auto-commit]"
```

### Line Ending Issues

**Problem:** Mixed line endings causing diff noise

**Solution:**
```bash
# Normalize line endings in repository
git add --renormalize .
git commit -m "chore: normalize line endings"

# Configure Git for consistent line endings
git config --global core.autocrlf input  # macOS/Linux
git config --global core.autocrlf true   # Windows
```

## Best Practices

1. **Always use Git LFS for media files** - Prevents repository bloat
2. **Keep content and code separate** - Use content/ directory for editable content
3. **Review auto-commits** - Check what content changes were detected
4. **Use skip flags wisely** - Only skip auto-commit when necessary
5. **Test hooks locally** - Verify hooks work before team-wide rollout

## Integration with Nuxt Studio

Nuxt Studio requires specific Git configurations for visual editing:

1. **Content Files**: Must be tracked in Git for version control
2. **Media Files**: Use Git LFS for efficient storage
3. **Line Endings**: Consistent LF for web compatibility
4. **Auto-commits**: Enable smooth content editing workflow

### Nuxt Studio Workflow

1. Connect Nuxt Studio to Git repository
2. Enable visual editing for content files
3. Make changes in Nuxt Studio visual editor
4. Git hooks automatically handle commits
5. Changes are versioned and can be reviewed

## Security Notes

- `.env` files are gitignored (never commit secrets)
- `.gitattributes` excludes sensitive files from exports
- Git hooks are local (not shared via Git for security)
- Team members should install hooks individually

## Team Setup

To share this Git configuration with your team:

```bash
# Document hook installation in README
# Team members run:

# 1. Install Git LFS
git lfs install

# 2. Copy hooks to .git/hooks/ (or use husky/simple-git-hooks)
# 3. Make hooks executable
chmod +x .git/hooks/pre-commit
chmod +x .git/hooks/post-commit
```

**Note:** Git hooks cannot be versioned for security reasons. Consider using tools like Husky or simple-git-hooks for shared hook configurations.

## Related Documentation

- [Nuxt Studio Documentation](https://nuxt.studio)
- [Git LFS Documentation](https://git-lfs.com)
- [Git Hooks Documentation](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)

---

**Last Updated:** 2026-03-18  
**Tasks Completed:** 1.11, 1.12
