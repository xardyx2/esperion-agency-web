-- Migration: 005_user_sessions
-- Created: 2026-03-18
-- Description: Create user_sessions table for analytics tracking

DEFINE TABLE user_sessions SCHEMAFULL;

DEFINE FIELD session_id ON user_sessions TYPE string;
DEFINE FIELD user_id ON user_sessions TYPE option<record<users>>;
DEFINE FIELD entry_point ON user_sessions TYPE string;
DEFINE FIELD page_views ON user_sessions TYPE int DEFAULT 0;
DEFINE FIELD events ON user_sessions TYPE array;
DEFINE FIELD conversion ON user_sessions TYPE bool DEFAULT false;
DEFINE FIELD started_at ON user_sessions TYPE datetime;
DEFINE FIELD ended_at ON user_sessions TYPE option<datetime>;
DEFINE FIELD ip_address ON user_sessions TYPE option<string>;
DEFINE FIELD user_agent ON user_sessions TYPE option<string>;

-- Indexes
DEFINE INDEX session_lookup ON user_sessions COLUMNS session_id;
DEFINE INDEX user_sessions ON user_sessions COLUMNS user_id;
