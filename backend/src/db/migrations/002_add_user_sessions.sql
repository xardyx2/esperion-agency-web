-- Migration: 002_add_user_sessions.sql
-- Description: Add additional indexes and constraints to enhance user sessions functionality

-- Add additional indexes for better session management
DEFINE INDEX idx_sessions_device_id ON sessions FIELDS device_id;
DEFINE INDEX idx_sessions_created_at ON sessions FIELDS created_at;
DEFINE INDEX idx_sessions_ip_address ON sessions FIELDS ip_address;

-- Add field for session status if needed
DEFINE FIELD status ON sessions TYPE string DEFAULT 'active';

-- Add indexes for faster queries on session fields
DEFINE INDEX idx_sessions_user_status ON sessions FIELDS user_id, status;
