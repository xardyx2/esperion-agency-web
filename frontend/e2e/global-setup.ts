import type { FullConfig } from '@playwright/test'

async function globalSetup(_config: FullConfig): Promise<void> {
  // Authentication bootstrap is handled in spec-level hooks.
}

export default globalSetup
