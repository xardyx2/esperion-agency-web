pub mod analytics;
pub mod article;
pub mod backup;
pub mod client;
pub mod contact;
pub mod email;
pub mod email_log;
pub mod email_settings;
pub mod email_template;
pub mod media;
pub mod monitoring;
pub mod recaptcha;
pub mod seo_score;
pub mod service;
/**
 * Data Models Module
 *
 * Contains all data models organized by feature:
 * - user: User account model
 * - article: Article model with translation mapping
 * - work: Portfolio work model
 * - service: Service model
 * - client: Client model
 * - contact: Contact submission model
 * - recaptcha: reCAPTCHA response model
 * - translation: Translation memory model
 * - email: Email message and error models
 * - email_settings: Email provider configuration
 * - email_log: Email delivery tracking
 * - email_template: Email template management
 */
pub mod translation;
pub mod user;
pub mod work;
