#!/bin/sh
# Development startup script for Rust backend with hot reload
# Ensures linker environment variables are available for cargo-watch spawned processes

export CARGO_TARGET_X86_64_UNKNOWN_LINUX_MUSL_LINKER=clang
export RUSTFLAGS="-C link-arg=-fuse-ld=lld"

echo "Starting development server with hot reload..."
echo "Using linker: clang + lld"

cargo watch --poll -x run
