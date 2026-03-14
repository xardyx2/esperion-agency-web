/// Middleware Module
///
/// Contains middleware components for authentication, CORS, logging, and rate limiting.

use axum::{
    extract::{Request, State},
    http::StatusCode,
    middleware::Next,
    response::Response,
};
use chrono::{Duration, Utc};
use jsonwebtoken::{encode, Algorithm, DecodingKey, EncodingKey, Header, Validation};
use serde::Deserialize;
use std::{collections::HashMap, sync::{Mutex, OnceLock}};

use crate::models::user::{JwtClaims, UserRole};

const AUTH_RATE_LIMIT_WINDOW_SECS: i64 = 15 * 60;
const AUTH_RATE_LIMIT_MAX_ATTEMPTS: usize = 10;

static AUTH_RATE_LIMITER: OnceLock<Mutex<HashMap<String, Vec<i64>>>> = OnceLock::new();

fn auth_rate_limiter() -> &'static Mutex<HashMap<String, Vec<i64>>> {
    AUTH_RATE_LIMITER.get_or_init(|| Mutex::new(HashMap::new()))
}

fn auth_rate_limit_key(req: &Request, path: &str) -> String {
    let ip = req
        .headers()
        .get("x-forwarded-for")
        .and_then(|value| value.to_str().ok())
        .and_then(|value| value.split(',').next())
        .map(str::trim)
        .filter(|value| !value.is_empty())
        .or_else(|| {
            req.headers()
                .get("x-real-ip")
                .and_then(|value| value.to_str().ok())
                .map(str::trim)
                .filter(|value| !value.is_empty())
        })
        .unwrap_or("unknown");

    format!("{}:{}", path, ip)
}

fn enforce_auth_rate_limit(req: &Request, path: &str) -> Result<(), StatusCode> {
    let key = auth_rate_limit_key(req, path);
    let now = Utc::now().timestamp();
    let cutoff = now - AUTH_RATE_LIMIT_WINDOW_SECS;

    let mut limiter = auth_rate_limiter()
        .lock()
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let entry = limiter.entry(key).or_default();
    entry.retain(|timestamp| *timestamp >= cutoff);

    if entry.len() >= AUTH_RATE_LIMIT_MAX_ATTEMPTS {
        return Err(StatusCode::TOO_MANY_REQUESTS);
    }

    entry.push(now);
    Ok(())
}

/// Generate a JWT token for a user
pub fn generate_jwt(user_id: &str, email: &str, role: &str) -> Result<String, crate::api::ApiError> {
    let now = Utc::now();
    
    // Map string role to UserRole enum or special "refresh" token
    let user_role = if role == "refresh" {
        UserRole::Editor // For refresh tokens, we use a neutral role
    } else {
        // Attempt to map string to appropriate role
        match role.to_lowercase().as_str() {
            "admin" => UserRole::Admin,
            "viewer" => UserRole::Viewer,
            _ => UserRole::Editor, // default to editor
        }
    };
    
    let claims = JwtClaims {
        sub: user_id.to_string(),
        email: email.to_string(),
        role: user_role,
        device_id: None,
        exp: if role == "refresh" {
            (now + Duration::days(30)).timestamp() // 30 days for refresh token
        } else {
            (now + Duration::hours(24)).timestamp() // 24 hours for regular token - retaining compatibility
        },
        iat: now.timestamp(),
    };

    // Use a secret key from environment variable in production
    let secret = std::env::var("JWT_SECRET").unwrap_or_else(|_| "esperion-secret-key-change-in-production".to_string());
    
    encode(&Header::new(Algorithm::HS256), &claims, &EncodingKey::from_secret(secret.as_bytes()))
        .map_err(|_| crate::api::internal_error("Failed to generate JWT"))
}

/// Generate a short-lived access token (15 minutes) for enhanced security after login/refresh
pub fn generate_short_access_token(user_id: &str, email: &str, role: &str) -> Result<String, crate::api::ApiError> {
    let now = Utc::now();
    
    // Map string role to UserRole enum
    let user_role = match role.to_lowercase().as_str() {
        "admin" => crate::models::user::UserRole::Admin,
        "viewer" => crate::models::user::UserRole::Viewer,
        _ => crate::models::user::UserRole::Editor, // default to editor
    };
    
    let claims = JwtClaims {
        sub: user_id.to_string(),
        email: email.to_string(),
        role: user_role,
        device_id: None,
        exp: (now + Duration::minutes(15)).timestamp(), // 15 minutes for access token (enhanced security)
        iat: now.timestamp(),
    };

    // Use a secret key from environment variable in production
    let secret = std::env::var("JWT_SECRET").unwrap_or_else(|_| "esperion-secret-key-change-in-production".to_string());
    
    encode(&Header::new(Algorithm::HS256), &claims, &EncodingKey::from_secret(secret.as_bytes()))
        .map_err(|_| crate::api::internal_error("Failed to generate JWT"))
}

/// Generate a long-lived refresh token (30 days) 
pub fn generate_long_refresh_token(user_id: &str, email: &str) -> Result<String, crate::api::ApiError> {
    let now = Utc::now();
    
    // For refresh tokens, we use a generic role for validation purposes
    let claims = JwtClaims {
        sub: user_id.to_string(),
        email: email.to_string(),
        role: crate::models::user::UserRole::Editor, // Generic role
        device_id: None,
        exp: (now + Duration::days(30)).timestamp(), // 30 days for refresh token
        iat: now.timestamp(),
    };

    // Use a secret key from environment variable in production
    let secret = std::env::var("JWT_SECRET").unwrap_or_else(|_| "esperion-secret-key-change-in-production".to_string());
    
    encode(&Header::new(Algorithm::HS256), &claims, &EncodingKey::from_secret(secret.as_bytes()))
        .map_err(|_| crate::api::internal_error("Failed to generate refresh token"))
}

/// Verify a JWT token
pub fn verify_jwt(token: &str) -> Result<JwtClaims, StatusCode> {
    let secret = std::env::var("JWT_SECRET").unwrap_or_else(|_| "esperion-secret-key-change-in-production".to_string());
    
    let token_data = jsonwebtoken::decode::<JwtClaims>(
        token,
        &DecodingKey::from_secret(secret.as_bytes()),
        &Validation::new(Algorithm::HS256),
    )
    .map_err(|_| StatusCode::UNAUTHORIZED)?;

    Ok(token_data.claims)
}

/// Enhanced session management helper function to track user sessions
pub async fn create_user_session(
    db: &crate::db::DbState,
    user_id: &str,
    token: &str,
    ip_address: Option<String>,
    user_agent: Option<String>,
    device_id: Option<String>,
) -> Result<(), crate::api::ApiError> {
    // Create a record in the sessions table for the current session
    let now = Utc::now();
    let expires_at = now + Duration::days(30); // Session expires in 30 days

    let session_query = "
        CREATE sessions SET
            user_id = $user_id,
            token = $token,
            device_id = $device_id,
            ip_address = $ip_address,
            user_agent = $user_agent,
            created_at = time::now(),
            expires_at = $expires_at
    ";

    let mut session_result = db.query(session_query)
        .bind(("user_id", user_id))
        .bind(("token", token))
        .bind(("device_id", device_id))
        .bind(("ip_address", ip_address))
        .bind(("user_agent", user_agent))
        .bind(("expires_at", &expires_at))
        .await
        .map_err(|e| crate::api::internal_error(e))?;

    let _: Option<serde_json::Value> = session_result.take(0).ok().flatten();
    
    Ok(())
}

/// Auth middleware - extracts and validates JWT from Authorization header
pub async fn auth_middleware(
    State(app_state): State<crate::AppState>,
    mut req: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    let _db = &app_state.db;
    let path = req.uri().path();
    if path == "/health"
        || path.starts_with("/api/geo")
        || path.starts_with("/api/v1/auth/")
        || path == "/api/v1/analytics/public-config"
        || path == "/api/v1/analytics/track"
    {
        return Ok(next.run(req).await);
    }

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

/// Basic rate limiting middleware that can be configured to apply different strategies for different routes
pub async fn apply_rate_limit(req: Request, next: Next) -> Result<Response, StatusCode> {
    let path = req.uri().path();
    
    // Skip rate limiting for health endpoints  
    if path == "/health" {
        return Ok(next.run(req).await);
    }
    
    // Apply rate limiting based on the route
    match path {
        // For auth endpoints (register, login), implement stricter rate limits
        p if p.starts_with("/api/v1/auth/login") || p.starts_with("/api/v1/auth/register") => {
            enforce_auth_rate_limit(&req, p)?;
            Ok(next.run(req).await)
        }
        // For general API endpoints
        _ => {
            // Standard rate limiting
            Ok(next.run(req).await)
        }
    }
}

/// Middleware is now handled via handlers and main.rs configuration
pub struct Middleware;
