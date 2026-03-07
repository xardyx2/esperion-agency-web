-- Migration: 001_initial_schema_down.sql
-- Description: Drop all tables created in the initial schema migration

-- Remove indexes first
REMOVE INDEX idx_articles_slug_id ON articles;
REMOVE INDEX idx_articles_slug_en ON articles;
REMOVE INDEX idx_articles_published ON articles;
REMOVE INDEX idx_articles_category ON articles;
REMOVE INDEX idx_articles_translation_status ON articles;

REMOVE INDEX idx_works_slug ON works;
REMOVE INDEX idx_works_featured ON works;
REMOVE INDEX idx_works_service ON works;

REMOVE INDEX idx_services_slug ON services;
REMOVE INDEX idx_services_featured ON services;

REMOVE INDEX idx_clients_featured ON clients;
REMOVE INDEX idx_clients_status ON clients;

REMOVE INDEX idx_users_email ON users;
REMOVE INDEX idx_users_username ON users;

REMOVE INDEX idx_sessions_token ON sessions;
REMOVE INDEX idx_sessions_user ON sessions;
REMOVE INDEX idx_sessions_expires ON sessions;

REMOVE INDEX idx_translation_cache_source ON translation_cache;

REMOVE INDEX idx_analytics_events_type ON analytics_events;
REMOVE INDEX idx_analytics_events_session ON analytics_events;

-- Remove tables
REMOVE TABLE users;
REMOVE TABLE articles;
REMOVE TABLE works;
REMOVE TABLE services;
REMOVE TABLE clients;
REMOVE TABLE contact_submissions;
REMOVE TABLE media_library;
REMOVE TABLE sessions;
REMOVE TABLE activity_logs;
REMOVE TABLE translation_cache;
REMOVE TABLE analytics_events;
REMOVE TABLE token_blacklist;
REMOVE TABLE site_settings;