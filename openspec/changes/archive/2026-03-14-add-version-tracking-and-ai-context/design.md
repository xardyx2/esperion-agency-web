## Context

AI assistants like Claude rely on training data that may not reflect the current state of a project's dependencies. When package versions are upgraded (e.g., @nuxt/image 1.x to 2.x), AI can provide outdated information or hallucinate about current versions. This creates confusion and potentially incorrect advice. A centralized version tracking system that serves as a "single source of truth" ensures AI and developers always reference accurate, real-time version information from files rather than memory.

## Goals / Non-Goals

**Goals:**
1. Create ESPERION_VERSIONS.md as the single source of truth for all dependency versions
2. Add version check scripts for real-time verification
3. Update README.md with version documentation and badges
4. Establish AI interaction guidelines that prioritize file inspection
5. Create maintainable documentation that updates with each dependency change

**Non-Goals:**
1. Automatic version extraction (manual documentation approach)
2. Version pinning or enforcement
3. Breaking change detection automation
4. Security vulnerability scanning
5. Dependency update automation

## Decisions

### Decision: Use Markdown for Version Registry
**Rationale:** Markdown is human-readable, displays well in GitHub, and is easily parsed by AI. JSON would be harder for humans to edit, while plain text lacks structure. The table format in Markdown works perfectly for dependency listings.

### Decision: Manual Updates After Each Dependency Change
**Rationale:** While automated extraction is possible, manual updates ensure conscious documentation of changes and provide a moment to verify versions. This also creates a human-readable changelog of when versions changed.

### Decision: Separate AI Context File (.ai-context.md)
**Rationale:** Keeping AI interaction guidelines separate from README.md keeps the README clean and focused on project information. The .ai-context.md file serves as a clear contract with AI assistants about how to interact with the codebase.

### Decision: Use bun/cargo Commands for Verification
**Rationale:** Using standard package manager commands (`bun pm ls`, `cargo tree`) ensures the information is always current and doesn't require custom tooling. These commands are universally understood and reliable.

### Decision: Include Last Updated Timestamp
**Rationale:** Adding a timestamp and author to ESPERION_VERSIONS.md makes it immediately obvious when the information was last verified, helping AI and developers assess whether it might be outdated.

## Migration Plan

### Phase 1: Create ESPERION_VERSIONS.md
1. Extract current versions from `frontend/package.json`
2. Extract current versions from `backend/Cargo.toml`
3. Extract Docker image versions from `docker-compose.yml`
4. Create markdown table with all versions
5. Add instructions for updating
6. Add verification commands

### Phase 2: Update README.md
1. Add version badges section near the top
2. Add link to ESPERION_VERSIONS.md
3. Add quick version check command examples
4. Document the "check files first" approach

### Phase 3: Add Package.json Scripts
1. Add `versions:check` script to frontend/package.json
2. Add `versions:frontend` script
3. Add `versions:backend` script (calls backend check)
4. Test all scripts work correctly

### Phase 4: Create .ai-context.md
1. Document AI interaction best practices
2. List version check commands for AI to use
3. Add reminder about training data limitations
4. Document file locations for version info

### Phase 5: Verification
1. Run all version check scripts
2. Verify ESPERION_VERSIONS.md is accurate
3. Test AI queries with new context
4. Document the workflow

## Risks / Trade-offs

**[Documentation becomes outdated]** → Add update step to PR checklist, use pre-commit hooks as reminder, include timestamp to show age

**[AI still hallucinates despite documentation]** → Make .ai-context.md very explicit about checking files, add verification commands that AI must run

**[Maintenance overhead]** → Keep format simple, automate verification commands but not extraction, update only when versions change

**[Developers forget to update]** → Make it part of PR template, add check in CI to verify versions match between package.json and ESPERION_VERSIONS.md

## Open Questions

1. Should we automate version extraction with a script that runs post-install?
2. Should we include node and bun versions in the registry?
3. How detailed should the AI context file be?
4. Should we include a "version check" GitHub Action?
