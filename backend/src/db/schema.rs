/**
 * Database Schema Module
 *
 * Defines SurrealDB schema for Esperion project
 * Includes all table definitions, fields, and indexes
 *
 * Usage: Run these SQL statements to initialize database
 */

/// Full schema SQL for initialization
pub const INIT_SCHEMA_SQL: &str = r#"
-- ============================================
-- ESPERION DATABASE SCHEMA
-- ============================================

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
DEFINE FIELD publication_options ON articles TYPE string DEFAULT 'both';
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

-- Analytics funnels table
DEFINE TABLE analytics_funnels SCHEMAFULL;
DEFINE FIELD name ON analytics_funnels TYPE string;
DEFINE FIELD description ON analytics_funnels TYPE option<string>;
DEFINE FIELD steps ON analytics_funnels TYPE array;
DEFINE FIELD active ON analytics_funnels TYPE bool DEFAULT true;
DEFINE FIELD created_at ON analytics_funnels TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON analytics_funnels TYPE datetime DEFAULT time::now();

-- Backup jobs table
DEFINE TABLE backup_jobs SCHEMAFULL;
DEFINE FIELD status ON backup_jobs TYPE string;
DEFINE FIELD scopes ON backup_jobs TYPE array;
DEFINE FIELD reason ON backup_jobs TYPE option<string>;
DEFINE FIELD location ON backup_jobs TYPE option<string>;
DEFINE FIELD error ON backup_jobs TYPE option<string>;
DEFINE FIELD created_at ON backup_jobs TYPE datetime DEFAULT time::now();
DEFINE FIELD completed_at ON backup_jobs TYPE option<datetime>;

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

-- Alert rules table
DEFINE TABLE alert_rules SCHEMAFULL;
DEFINE FIELD name ON alert_rules TYPE string;
DEFINE FIELD signal_type ON alert_rules TYPE string;
DEFINE FIELD service ON alert_rules TYPE string;
DEFINE FIELD operator ON alert_rules TYPE string;
DEFINE FIELD threshold_value ON alert_rules TYPE float;
DEFINE FIELD severity ON alert_rules TYPE string;
DEFINE FIELD cooldown_minutes ON alert_rules TYPE int DEFAULT 5;
DEFINE FIELD enabled ON alert_rules TYPE bool DEFAULT true;
DEFINE FIELD created_at ON alert_rules TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON alert_rules TYPE datetime DEFAULT time::now();

-- Alert instances table
DEFINE TABLE alert_instances SCHEMAFULL;
DEFINE FIELD alert_key ON alert_instances TYPE string;
DEFINE FIELD rule_id ON alert_instances TYPE option<record<alert_rules>>;
DEFINE FIELD service ON alert_instances TYPE string;
DEFINE FIELD signal_type ON alert_instances TYPE string;
DEFINE FIELD observed_value ON alert_instances TYPE float;
DEFINE FIELD threshold_value ON alert_instances TYPE float;
DEFINE FIELD severity ON alert_instances TYPE string;
DEFINE FIELD state ON alert_instances TYPE string DEFAULT 'pending';
DEFINE FIELD message ON alert_instances TYPE string;
DEFINE FIELD fired_at ON alert_instances TYPE datetime DEFAULT time::now();
DEFINE FIELD resolved_at ON alert_instances TYPE option<datetime>;
DEFINE FIELD metadata ON alert_instances TYPE option<object>;

-- Alert delivery attempts table
DEFINE TABLE alert_deliveries SCHEMAFULL;
DEFINE FIELD instance_id ON alert_deliveries TYPE record<alert_instances>;
DEFINE FIELD channel ON alert_deliveries TYPE string;
DEFINE FIELD destination ON alert_deliveries TYPE string;
DEFINE FIELD attempt_count ON alert_deliveries TYPE int DEFAULT 0;
DEFINE FIELD delivery_status ON alert_deliveries TYPE string DEFAULT 'pending';
DEFINE FIELD last_error ON alert_deliveries TYPE option<string>;
DEFINE FIELD next_retry_at ON alert_deliveries TYPE option<datetime>;
DEFINE FIELD created_at ON alert_deliveries TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON alert_deliveries TYPE datetime DEFAULT time::now();

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Articles indexes
DEFINE INDEX idx_articles_slug_id ON articles FIELDS slug_id;
DEFINE INDEX idx_articles_slug_en ON articles FIELDS slug_en;
DEFINE INDEX idx_articles_published ON articles FIELDS published;
DEFINE INDEX idx_articles_category ON articles FIELDS category;
DEFINE INDEX idx_articles_translation_status ON articles FIELDS translation_status;
DEFINE INDEX idx_articles_publication_options ON articles FIELDS publication_options;

-- Works indexes
DEFINE INDEX idx_works_slug ON works FIELDS slug;
DEFINE INDEX idx_works_featured ON works FIELDS featured;
DEFINE INDEX idx_works_service ON works FIELDS service;

-- Services indexes
DEFINE INDEX idx_services_slug ON services FIELDS slug;
DEFINE INDEX idx_services_featured ON services FIELDS featured;

-- Clients indexes
DEFINE INDEX idx_clients_featured ON clients FIELDS featured;
DEFINE INDEX idx_clients_status ON clients FIELDS status;

-- Users indexes
DEFINE INDEX idx_users_email ON users FIELDS email UNIQUE;
DEFINE INDEX idx_users_username ON users FIELDS username UNIQUE;

-- Sessions indexes
DEFINE INDEX idx_sessions_token ON sessions FIELDS token UNIQUE;
DEFINE INDEX idx_sessions_user ON sessions FIELDS user_id;
DEFINE INDEX idx_sessions_expires ON sessions FIELDS expires_at;

-- Translation cache indexes
DEFINE INDEX idx_translation_cache_source ON translation_cache FIELDS source_text, source_lang, target_lang;

-- Analytics indexes
DEFINE INDEX idx_analytics_events_type ON analytics_events FIELDS event_type, created_at;
DEFINE INDEX idx_analytics_events_session ON analytics_events FIELDS session_id;
DEFINE INDEX idx_analytics_funnels_active ON analytics_funnels FIELDS active;

-- Backup indexes
DEFINE INDEX idx_backup_jobs_created_at ON backup_jobs FIELDS created_at;

-- Site settings indexes
DEFINE INDEX idx_site_settings_key ON site_settings FIELDS key UNIQUE;

-- Alert indexes
DEFINE INDEX idx_alert_rules_service ON alert_rules FIELDS service;
DEFINE INDEX idx_alert_rules_signal ON alert_rules FIELDS signal_type;
DEFINE INDEX idx_alert_instances_key ON alert_instances FIELDS alert_key UNIQUE;
DEFINE INDEX idx_alert_instances_state ON alert_instances FIELDS state;
DEFINE INDEX idx_alert_instances_service ON alert_instances FIELDS service;
DEFINE INDEX idx_alert_deliveries_instance ON alert_deliveries FIELDS instance_id;
DEFINE INDEX idx_alert_deliveries_status ON alert_deliveries FIELDS delivery_status;

-- ============================================
-- INITIAL DATA (Seed Data)
-- ============================================

-- Default admin user (password: admin123 - CHANGE IMMEDIATELY!)
-- Password hash is for 'admin123' using Argon2
-- You should generate a new hash for production
-- DEFINE USER admin ON DATABASE PASSWORD 'admin123' ROLES OWNER;

-- Default services
-- These will be inserted via backend API on first run

"#;

/// Get schema as string
pub fn get_schema() -> String {
    INIT_SCHEMA_SQL.to_string()
}

/// Get table list
pub const TABLES: &[&str] = &[
    "users",
    "articles",
    "works",
    "services",
    "clients",
    "contact_submissions",
    "media_library",
    "sessions",
    "activity_logs",
    "translation_cache",
    "analytics_events",
    "analytics_funnels",
    "backup_jobs",
    "token_blacklist",
    "site_settings",
    "alert_rules",
    "alert_instances",
    "alert_deliveries",
];
