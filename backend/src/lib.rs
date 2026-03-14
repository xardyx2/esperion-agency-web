use axum::extract::FromRef;
use std::sync::Arc;

pub mod api;
pub mod db;
pub mod errors;
pub mod handlers;
pub mod middleware;
pub mod models;
pub mod routes;
pub mod services;

#[derive(Clone)]
pub struct AppState {
    pub db: Arc<crate::db::Db>,
    pub email_service: crate::services::email::EmailService,
}

impl FromRef<AppState> for Arc<crate::db::Db> {
    fn from_ref(app_state: &AppState) -> Arc<crate::db::Db> {
        app_state.db.clone()
    }
}

impl FromRef<AppState> for crate::services::email::EmailService {
    fn from_ref(app_state: &AppState) -> crate::services::email::EmailService {
        app_state.email_service.clone()
    }
}
