-- Migration: 002_add_user_sessions_down.sql
-- Description: Remove additional indexes and constraints added in the sessions enhancement migration

-- Remove the added indexes
REMOVE INDEX idx_sessions_device_id ON sessions;
REMOVE INDEX idx_sessions_created_at ON sessions;
REMOVE INDEX idx_sessions_ip_address ON sessions;
REMOVE INDEX idx_sessions_user_status ON sessions;

-- Note that we cannot remove fields in SurrealDB, so the status field will remain
-- This is a limitation in SurrealDB for now