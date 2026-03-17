#!/bin/sh
set -e

echo "[frontend] Syncing Bun dependencies..."
bun install

echo "[frontend] Starting Nuxt dev server..."
bun run dev -- --host 0.0.0.0 --port 3000
