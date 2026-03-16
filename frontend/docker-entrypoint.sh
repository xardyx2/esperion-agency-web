#!/bin/sh
set -eu

echo "[frontend] Syncing Bun dependencies..."
bun install --frozen-lockfile

echo "[frontend] Starting Nuxt dev server..."
exec bun run dev -- --host 0.0.0.0 --port 3000
