/// Middleware Module
///
/// Contains middleware components for authentication, CORS, logging, and rate limiting.

use axum::{
    extract::{Request, State},
    http::StatusCode,
    middleware::Next,
    response::{IntoResponse, Response},
    Json,
};
use chrono::{Duration, Utc};
use jsonwebtoken::{encode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};

use crate::models::user::{JwtClaims, UserRole};

/// Generate a JWT token for a user
pub fn generate_jwt(user_id: &str, email: &str, _role: &str) -> Result<String, crate::api::ApiError> {
    let now = Utc::now();
    
    let claims = JwtClaims {
        sub: user_id.to_string(),
        email: email.to_string(),
        role: UserRole::Editor, // Default role, can be customized
        device_id: None,
        exp: (now + Duration::hours(24)).timestamp(),
        iat: now.timestamp(),
    };

    // Use a secret key from environment variable in production
    let secret = std::env::var("JWT_SECRET").unwrap_or_else(|_| "esperion-secret-key-change-in-production".to_string());
    
    encode(&Header::default(), &claims, &EncodingKey::from_secret(secret.as_bytes()))
        .map_err(|_| crate::api::internal_error("Failed to generate JWT"))
}

/// Verify a JWT token
pub fn verify_jwt(token: &str) -> Result<JwtClaims, StatusCode> {
    let secret = std::env::var("JWT_SECRET").unwrap_or_else(|_| "esperion-secret-key-change-in-production".to_string());
    
    let token_data = jsonwebtoken::decode::<JwtClaims>(
        token,
        &DecodingKey::from_secret(secret.as_bytes()),
        &Validation::default(),
    )
    .map_err(|_| StatusCode::UNAUTHORIZED)?;

    Ok(token_data.claims)
}

/// Auth middleware - extracts and validates JWT from Authorization header
pub async fn auth_middleware(
    State(_state): State<crate::db::DbState>,
    mut req: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    // Get Authorization header
    let auth_header = req
        .headers()
        .get(axum::http::header::AUTHORIZATION)
        .and_then(|h| h.to_str().ok())
        .and_then(|s| s.strip_prefix("Bearer "))
        .ok_or(StatusCode::UNAUTHORIZED)?;

    // Verify token
    let claims = verify_jwt(auth_header)?;

    // Store claims in request extensions
    req.extensions_mut().insert(claims);

    Ok(next.run(req).await)
}

/// Middleware is now handled via handlers and main.rs configuration
pub struct Middleware;
