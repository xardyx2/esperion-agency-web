-- Migration rollback: 003_add_translation_memory_table_down.sql
-- Description: Remove translation memory table (rollback of migration 003)

-- Remove the indexes first
REMOVE INDEX idx_translation_memory_lookup ON translation_memory;
REMOVE INDEX idx_translation_memory_approved ON translation_memory;

-- Remove the translation_memory table
REMOVE TABLE translation_memory;