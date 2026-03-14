#!/bin/bash
# Backend Version Check Script
# Run from backend directory: ./scripts/version-check.sh

echo "=== Esperion Backend Version Check ==="
echo ""

echo "Rust Version:"
rustc --version
echo ""

echo "Cargo Version:"
cargo --version
echo ""

echo "=== Direct Dependencies ==="
cargo tree --depth=1
echo ""

echo "=== Outdated Dependencies ==="
if command -v cargo-outdated &> /dev/null; then
    cargo outdated
else
    echo "cargo-outdated not installed. Install with: cargo install cargo-outdated"
fi
echo ""

echo "=== Version Report Generated ==="
echo "Save to file: cargo tree --depth=1 > ../version-report-backend.txt"
