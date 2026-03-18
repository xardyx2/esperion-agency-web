/**
 * Request Handlers Module
 * 
 * Contains all HTTP request handlers organized by feature:
 * - geo: IP-based geolocation
 * - auth: Authentication (register, login, logout)
 * - articles: Article CRUD
 * - works: Portfolio CRUD
 * - services: Services CRUD
 * - clients: Clients CRUD
 * - contact: Contact form submission
 * - translation: Automated content translation
 */

pub mod geo;
pub mod auth;
pub mod articles;
pub mod health;
pub mod media;
pub mod monitoring;
pub mod analytics;
pub mod backup;
pub mod works;
pub mod services;
pub mod clients;
pub mod contact;
pub mod seo_score;
pub mod translation;
pub mod email;
pub mod email_management;
pub mod user_management;
