## Why

AI assistants often hallucinate or provide outdated information about package versions because they rely on training data rather than live file inspection. After upgrading dependencies (e.g., @nuxt/image 1.x → 2.x), AI might incorrectly answer "1.x" when asked about current versions. This creates confusion and potential errors when asking AI for help with version-specific issues. Establishing a version tracking system with AI-friendly documentation ensures accurate, real-time version information.

## What Changes

### Documentation Files

**ESPERION_VERSIONS.md** - Single source of truth for all stack versions
- Table of frontend dependencies with current versions
- Table of backend crates with current versions
- Docker image versions
- Last updated timestamp and author
- Links to package.json and Cargo.toml

**README.md Updates**
- Add version badges section
- Link to ESPERION_VERSIONS.md
- Quick version check commands

### Package.json Scripts

**Frontend Scripts** (package.json)
- `versions:check` - Show all dependency versions
- `versions:frontend` - Quick frontend version check
- `versions:backend` - Call backend version check

**Backend Scripts** (if applicable via Cargo.toml)
- Version reporting for key crates

### AI Context Template

**.ai-context.md** - Template for AI interactions
- Reminder to check files before answering version questions
- Commands to extract current versions
- Warning about outdated training data

## Capabilities

### New Capabilities
- `version-tracking`: Centralized version documentation system
- `ai-context-management`: Anti-hallucination measures for AI assistants
- `version-verification`: Automated version checking scripts

### Modified Capabilities
- `documentation`: Updates to README.md with version section

## Impact

### Files Created
- `ESPERION_VERSIONS.md` - Version registry
- `.ai-context.md` - AI interaction guidelines

### Files Modified
- `README.md` - Add version badges and links
- `frontend/package.json` - Add version check scripts

### Processes
- After every dependency upgrade, update ESPERION_VERSIONS.md
- Before asking AI about versions, check documentation
- Use scripts instead of memory for version queries

### Benefits
- Accurate version information from AI assistants
- Single source of truth for all stack versions
- Faster debugging with version context
- Prevents outdated advice from AI

## Goals

1. Create ESPERION_VERSIONS.md with accurate current versions
2. Add version check scripts to package.json
3. Update README.md with version badges
4. Document AI interaction best practices
5. Establish "check files first" culture

## Non-Goals

1. Automatic version updates (manual documentation)
2. Version pinning enforcement
3. Breaking change detection
4. Dependency vulnerability scanning
