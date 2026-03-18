-- Migration: 006_translation_memory
-- Created: 2026-03-18
-- Description: Create translation_memory table for storing approved translations

DEFINE TABLE translation_memory SCHEMAFULL;

DEFINE FIELD source_text ON translation_memory TYPE string;
DEFINE FIELD translated_text ON translation_memory TYPE string;
DEFINE FIELD source_lang ON translation_memory TYPE string;
DEFINE FIELD target_lang ON translation_memory TYPE string;
DEFINE FIELD approved ON translation_memory TYPE bool DEFAULT false;
DEFINE FIELD approved_at ON translation_memory TYPE option<datetime>;
DEFINE FIELD approved_by ON translation_memory TYPE option<record<users>>;
DEFINE FIELD use_count ON translation_memory TYPE int DEFAULT 0;
DEFINE FIELD created_at ON translation_memory TYPE datetime DEFAULT time::now();

-- Indexes for fast lookup
DEFINE INDEX translation_lookup ON translation_memory COLUMNS source_text, source_lang, target_lang;
DEFINE INDEX approved_translations ON translation_memory COLUMNS approved WHERE approved = true;
