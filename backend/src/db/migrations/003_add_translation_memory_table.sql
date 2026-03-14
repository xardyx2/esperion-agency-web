-- Migration: 003_add_translation_memory_table.sql
-- Description: Add translation memory table to store human-reviewed translations

-- Translation memory table (for storing approved human translations)
DEFINE TABLE translation_memory SCHEMAFULL;
DEFINE FIELD source_text ON translation_memory TYPE string;
DEFINE FIELD translated_text ON translation_memory TYPE string;
DEFINE FIELD source_lang ON translation_memory TYPE string;
DEFINE FIELD target_lang ON translation_memory TYPE string;
DEFINE FIELD approved ON translation_memory TYPE bool DEFAULT false;
DEFINE FIELD reviewer_id ON translation_memory TYPE option<record<users>>;
DEFINE FIELD version ON translation_memory TYPE int DEFAULT 1;
DEFINE FIELD notes ON translation_memory TYPE option<string>;
DEFINE FIELD created_at ON translation_memory TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON translation_memory TYPE datetime;

-- Index for efficient lookup of translation memory entries
DEFINE INDEX idx_translation_memory_lookup ON translation_memory FIELDS source_text, source_lang, target_lang;
DEFINE INDEX idx_translation_memory_approved ON translation_memory FIELDS approved;
