-- Migration rollback: 004_add_publication_options_to_articles_down.sql
-- Description: Remove publication options field from articles table

-- Remove the index
REMOVE INDEX idx_articles_publication_options ON articles;

-- Remove the field definition from schema
-- Note: In SurrealDB, we can't directly drop a field, so we'll remove the definition 
-- to ensure future records won't have the field, but existing records will retain the data

DEFINE FIELD publication_options ON articles TYPE option<string>;

-- To clean up existing values in a separate manual step if needed:
-- UPDATE articles SET publication_options = none;