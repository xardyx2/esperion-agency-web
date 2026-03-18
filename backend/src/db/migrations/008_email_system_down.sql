-- Rollback Email System Migration
-- Drops email tables created in migration 008

DELETE FROM email_templates;
DELETE FROM email_logs;
DELETE FROM email_settings;

REMOVE TABLE email_settings;
REMOVE TABLE email_templates;
REMOVE TABLE email_logs;
