@echo off
REM Backend Version Check Script (Windows)
REM Run from backend directory: scripts\version-check.bat

echo === Esperion Backend Version Check ===
echo.

echo Rust Version:
rustc --version
echo.

echo Cargo Version:
cargo --version
echo.

echo === Direct Dependencies ===
cargo tree --depth=1
echo.

echo === Outdated Dependencies ===
where cargo-outdated >nul 2>&1
if %errorlevel% equ 0 (
    cargo outdated
) else (
    echo cargo-outdated not installed. Install with: cargo install cargo-outdated
)
echo.

echo === Version Report Generated ===
echo Save to file: cargo tree --depth=1 > ..\version-report-backend.txt
