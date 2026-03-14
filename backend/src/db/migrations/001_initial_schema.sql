-- Migration: 001_initial_schema.sql
-- Description: Create initial database schema for Esperion agency web

-- Users table (authentication & authorization)
DEFINE TABLE users SCHEMAFULL;
DEFINE FIELD email ON users TYPE string ASSERT string::is_email($value);
DEFINE FIELD password_hash ON users TYPE string;
DEFINE FIELD full_name ON users TYPE string;
DEFINE FIELD role ON users TYPE string DEFAULT 'editor';
DEFINE FIELD phone ON users TYPE option<string>;
DEFINE FIELD username ON users TYPE string;
DEFINE FIELD device_id ON users TYPE option<string>;
DEFINE FIELD created_at ON users TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON users TYPE datetime;

-- Articles table with translation mapping
DEFINE TABLE articles SCHEMAFULL;
DEFINE FIELD title ON articles TYPE string;
DEFINE FIELD slug_id ON articles TYPE string;
DEFINE FIELD slug_en ON articles TYPE string;
DEFINE FIELD content_id ON articles TYPE string;
DEFINE FIELD content_en ON articles TYPE string;
DEFINE FIELD excerpt_id ON articles TYPE option<string>;
DEFINE FIELD excerpt_en ON articles TYPE option<string>;
DEFINE FIELD category ON articles TYPE string;
DEFINE FIELD image ON articles TYPE option<string>;
DEFINE FIELD author ON articles TYPE record<users>;
DEFINE FIELD published ON articles TYPE bool DEFAULT false;
DEFINE FIELD published_at ON articles TYPE option<datetime>;
DEFINE FIELD translation_status ON articles TYPE string DEFAULT 'draft';
DEFINE FIELD created_at ON articles TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON articles TYPE datetime;

-- Works table (portfolio)
DEFINE TABLE works SCHEMAFULL;
DEFINE FIELD title ON works TYPE string;
DEFINE FIELD slug ON works TYPE string;
DEFINE FIELD description ON works TYPE string;
DEFINE FIELD service ON works TYPE string;
DEFINE FIELD platform ON works TYPE string;
DEFINE FIELD image ON works TYPE string;
DEFINE FIELD metrics ON works TYPE array;
DEFINE FIELD client_name ON works TYPE string;
DEFINE FIELD featured ON works TYPE bool DEFAULT false;
DEFINE FIELD created_at ON works TYPE datetime DEFAULT time::now();

-- Services table
DEFINE TABLE services SCHEMAFULL;
DEFINE FIELD title ON services TYPE string;
DEFINE FIELD slug ON services TYPE string;
DEFINE FIELD description ON services TYPE string;
DEFINE FIELD icon ON services TYPE option<string>;
DEFINE FIELD featured ON services TYPE bool DEFAULT false;
DEFINE FIELD display_order ON services TYPE int DEFAULT 0;

-- Clients table
DEFINE TABLE clients SCHEMAFULL;
DEFINE FIELD name ON clients TYPE string;
DEFINE FIELD logo ON clients TYPE string;
DEFINE FIELD testimonial ON clients TYPE option<string>;
DEFINE FIELD featured ON clients TYPE bool DEFAULT false;
DEFINE FIELD category ON clients TYPE option<string>;
DEFINE FIELD status ON clients TYPE string DEFAULT 'active';
DEFINE FIELD internal_notes ON clients TYPE option<string>;
DEFINE FIELD created_at ON clients TYPE datetime DEFAULT time::now();

-- Contact submissions table
DEFINE TABLE contact_submissions SCHEMAFULL;
DEFINE FIELD full_name ON contact_submissions TYPE string;
DEFINE FIELD company_name ON contact_submissions TYPE option<string>;
DEFINE FIELD service ON contact_submissions TYPE string;
DEFINE FIELD description ON contact_submissions TYPE string;
DEFINE FIELD email ON contact_submissions TYPE option<string>;
DEFINE FIELD phone ON contact_submissions TYPE option<string>;
DEFINE FIELD recaptcha_score ON contact_submissions TYPE option<float>;
DEFINE FIELD status ON contact_submissions TYPE string DEFAULT 'new';
DEFINE FIELD created_at ON contact_submissions TYPE datetime DEFAULT time::now();

-- Media library table
DEFINE TABLE media_library SCHEMAFULL;
DEFINE FIELD filename ON media_library TYPE string;
DEFINE FIELD path ON media_library TYPE string;
DEFINE FIELD alt_text ON media_library TYPE option<string>;
DEFINE FIELD year ON media_library TYPE int;
DEFINE FIELD month ON media_library TYPE int;
DEFINE FIELD type ON media_library TYPE string;
DEFINE FIELD size ON media_library TYPE int;
DEFINE FIELD webp_path ON media_library TYPE option<string>;
DEFINE FIELD original_path ON media_library TYPE string;
DEFINE FIELD uploaded_by ON media_library TYPE record<users>;
DEFINE FIELD created_at ON media_library TYPE datetime DEFAULT time::now();

-- Sessions table (user sessions)
DEFINE TABLE sessions SCHEMAFULL;
DEFINE FIELD user_id ON sessions TYPE record<users>;
DEFINE FIELD device_id ON sessions TYPE string;
DEFINE FIELD token ON sessions TYPE string;
DEFINE FIELD expires_at ON sessions TYPE datetime;
DEFINE FIELD ip_address ON sessions TYPE option<string>;
DEFINE FIELD user_agent ON sessions TYPE option<string>;
DEFINE FIELD created_at ON sessions TYPE datetime DEFAULT time::now();

-- Activity logs table (audit trail)
DEFINE TABLE activity_logs SCHEMAFULL;
DEFINE FIELD user_id ON activity_logs TYPE record<users>;
DEFINE FIELD action ON activity_logs TYPE string;
DEFINE FIELD entity ON activity_logs TYPE string;
DEFINE FIELD entity_id ON activity_logs TYPE option<string>;
DEFINE FIELD details ON activity_logs TYPE option<object>;
DEFINE FIELD ip_address ON activity_logs TYPE option<string>;
DEFINE FIELD created_at ON activity_logs TYPE datetime DEFAULT time::now();

-- Translation cache table (for caching AI translations)
DEFINE TABLE translation_cache SCHEMAFULL;
DEFINE FIELD source_text ON translation_cache TYPE string;
DEFINE FIELD translated_text ON translation_cache TYPE string;
DEFINE FIELD source_lang ON translation_cache TYPE string;
DEFINE FIELD target_lang ON translation_cache TYPE string;
DEFINE FIELD content_type ON translation_cache TYPE string;
DEFINE FIELD version ON translation_cache TYPE int DEFAULT 1;
DEFINE FIELD created_at ON translation_cache TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON translation_cache TYPE datetime;

-- Analytics events table (custom analytics)
DEFINE TABLE analytics_events SCHEMAFULL;
DEFINE FIELD event_type ON analytics_events TYPE string;
DEFINE FIELD user_id ON analytics_events TYPE option<record<users>>;
DEFINE FIELD session_id ON analytics_events TYPE option<string>;
DEFINE FIELD page_url ON analytics_events TYPE string;
DEFINE FIELD referrer ON analytics_events TYPE option<string>;
DEFINE FIELD country ON analytics_events TYPE option<string>;
DEFINE FIELD language ON analytics_events TYPE option<string>;
DEFINE FIELD device_type ON analytics_events TYPE option<string>;
DEFINE FIELD metadata ON analytics_events TYPE option<object>;
DEFINE FIELD created_at ON analytics_events TYPE datetime DEFAULT time::now();

-- Token blacklisting table for revoked refresh tokens
DEFINE TABLE token_blacklist SCHEMAFULL;
DEFINE FIELD token ON token_blacklist TYPE string;
DEFINE FIELD invalidated_at ON token_blacklist TYPE datetime DEFAULT time::now();
DEFINE FIELD expires_at ON token_blacklist TYPE datetime;

-- Site settings table
DEFINE TABLE site_settings SCHEMAFULL;
DEFINE FIELD key ON site_settings TYPE string;
DEFINE FIELD value ON site_settings TYPE any;
DEFINE FIELD type ON site_settings TYPE string;
DEFINE FIELD updated_by ON site_settings TYPE option<record<users>>;
DEFINE FIELD updated_at ON site_settings TYPE datetime DEFAULT time::now();

-- Indexes for performance
DEFINE INDEX idx_articles_slug_id ON articles FIELDS slug_id;
DEFINE INDEX idx_articles_slug_en ON articles FIELDS slug_en;
DEFINE INDEX idx_articles_published ON articles FIELDS published;
DEFINE INDEX idx_articles_category ON articles FIELDS category;
DEFINE INDEX idx_articles_translation_status ON articles FIELDS translation_status;

DEFINE INDEX idx_works_slug ON works FIELDS slug;
DEFINE INDEX idx_works_featured ON works FIELDS featured;
DEFINE INDEX idx_works_service ON works FIELDS service;

DEFINE INDEX idx_services_slug ON services FIELDS slug;
DEFINE INDEX idx_services_featured ON services FIELDS featured;

DEFINE INDEX idx_clients_featured ON clients FIELDS featured;
DEFINE INDEX idx_clients_status ON clients FIELDS status;

DEFINE INDEX idx_users_email ON users FIELDS email UNIQUE;
DEFINE INDEX idx_users_username ON users FIELDS username UNIQUE;

DEFINE INDEX idx_sessions_token ON sessions FIELDS token UNIQUE;
DEFINE INDEX idx_sessions_user ON sessions FIELDS user_id;
DEFINE INDEX idx_sessions_expires ON sessions FIELDS expires_at;

DEFINE INDEX idx_translation_cache_source ON translation_cache FIELDS source_text, source_lang, target_lang;

DEFINE INDEX idx_analytics_events_type ON analytics_events FIELDS event_type, created_at;
DEFINE INDEX idx_analytics_events_session ON analytics_events FIELDS session_id;
