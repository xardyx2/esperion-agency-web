-- Migration: 004_add_publication_options_to_articles.sql
-- Description: Add publication options field to control content language visibility

-- Add publication_options field to articles table to control language visibility
DEFINE FIELD publication_options ON articles TYPE string DEFAULT 'both';

-- Add index for improved queries
DEFINE INDEX idx_articles_publication_options ON articles FIELDS publication_options;
