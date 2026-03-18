-- Migration: 004_backup_history
-- Created: 2026-03-18
-- Description: Create backup_history table for tracking backups

DEFINE TABLE backup_history SCHEMAFULL;

DEFINE FIELD type ON backup_history TYPE string;
DEFINE FIELD scope ON backup_history TYPE string;
DEFINE FIELD path ON backup_history TYPE string;
DEFINE FIELD created_at ON backup_history TYPE datetime;
DEFINE FIELD encrypted ON backup_history TYPE bool DEFAULT false;
DEFINE FIELD size_bytes ON backup_history TYPE int;
DEFINE FIELD status ON backup_history TYPE string DEFAULT 'pending';
DEFINE FIELD error_message ON backup_history TYPE option<string>;

-- Indexes
DEFINE INDEX backup_date ON backup_history COLUMNS created_at;
DEFINE INDEX backup_status ON backup_history COLUMNS status;
