-- Migration: 007_migrations_tracking
-- Created: 2026-03-18
-- Description: Create migrations_tracking table for version control

DEFINE TABLE migrations_tracking SCHEMAFULL;

DEFINE FIELD version ON migrations_tracking TYPE string;
DEFINE FIELD name ON migrations_tracking TYPE string;
DEFINE FIELD applied_at ON migrations_tracking TYPE datetime;
DEFINE FIELD checksum ON migrations_tracking TYPE string;

-- Index for fast lookup
DEFINE INDEX migration_version ON migrations_tracking COLUMNS version;
