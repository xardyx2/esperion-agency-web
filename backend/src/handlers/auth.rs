/**
 * Authentication Handler
 * 
 * Handles user authentication:
 * - Register new user
 * - Login user
 * - Logout user
 * - Refresh token
 */

use axum::{
    extract::State,
    http::StatusCode,
    Json,
    Router,
};
use argon2::{
    password_hash::{rand_core::OsRng, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};
use chrono::{Duration, Utc};
use jsonwebtoken::{encode, decode, DecodingKey, EncodingKey, Header, Validation};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

use crate::api::{ApiResponse, internal_error, bad_request_error};
use crate::db::DbState;

/// Request for the logout endpoint containing refresh_token
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct LogoutRequest {
    pub refresh_token: String,
}

/// Request for refreshing tokens containing the refresh_token
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct RefreshRequest {
    pub refresh_token: String,
}

/// Register input
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct RegisterRequest {
    pub email: String,
    pub password: String,
    pub full_name: String,
    pub username: String,
    pub phone: Option<String>,
}

/// Login input
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct LoginRequest {
    pub email: String,
    pub password: String,
}

/// Auth response
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct AuthResponse {
    pub user: UserResponse,
    pub token: String,
    pub refresh_token: String,
}

/// User response (without sensitive data)
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct UserResponse {
    pub id: String,
    pub email: String,
    pub full_name: String,
    pub username: String,
    pub role: String,
}

/// Hash password using Argon2
fn hash_password(password: &str) -> Result<String, StatusCode> {
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    let hash = argon2
        .hash_password(password.as_bytes(), &salt)
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        .to_string();
    Ok(hash)
}

/// Verify password
fn verify_password(password: &str, hash: &str) -> bool {
    let parsed_hash = argon2::PasswordHash::new(hash).ok();
    match parsed_hash {
        Some(parsed) => Argon2::default()
            .verify_password(password.as_bytes(), &parsed)
            .is_ok(),
        None => false,
    }
}

/// Register new user
#[utoipa::path(
    post,
    path = "/api/v1/auth/register",
    tag = "Auth",
    request_body = RegisterRequest,
    responses(
        (status = 201, description = "User registered", body = AuthResponse),
        (status = 400, description = "Email already exists"),
        (status = 500, description = "Internal server error"),
    ),
)]
pub async fn register(
    State(db): State<DbState>,
    Json(req): Json<RegisterRequest>,
) -> ApiResponse<AuthResponse> {
    // Hash password
    let password_hash = hash_password(&req.password)
        .map_err(|e| internal_error(e))?;
    
    // Check if email already exists
    let check_query = "SELECT * FROM users WHERE email = $email LIMIT 1";
    let mut check_result = db
        .query(check_query)
        .bind(("email", &req.email))
        .await
        .map_err(|e| internal_error(e))?;
    
    let existing: Option<serde_json::Value> = check_result.take(0).ok().flatten();
    if existing.is_some() {
        return Err(bad_request_error("Email already exists"));
    }
    
    // Insert user into database
    let insert_query = "CREATE users SET email = $email, password_hash = $password_hash, full_name = $full_name, username = $username, phone = $phone, role = 'editor', created_at = time::now()";
    let mut insert_result = db
        .query(insert_query)
        .bind(("email", &req.email))
        .bind(("password_hash", &password_hash))
        .bind(("full_name", &req.full_name))
        .bind(("username", &req.username))
        .bind(("phone", &req.phone))
        .await
        .map_err(|e| internal_error(e))?;
    
    let created: Option<serde_json::Value> = insert_result.take(0).ok().flatten();
    let user_data = created.ok_or(internal_error("Failed to create user"))?;
    
    // Extract user ID
    let user_id = user_data.get("id")
        .and_then(|v| v.as_str())
        .unwrap_or("unknown")
        .to_string();
    
    // Generate JWT tokens - short-lived access token, long-lived refresh token
    let token = crate::middleware::generate_short_access_token(&user_id, &req.email, "editor")
        .map_err(|_| internal_error("Failed to generate token"))?;
    let refresh_token = crate::middleware::generate_long_refresh_token(&user_id, &req.email)
        .map_err(|_| internal_error("Failed to generate refresh token"))?;
    
    let response = AuthResponse {
        user: UserResponse {
            id: user_id,
            email: req.email,
            full_name: req.full_name,
            username: req.username,
            role: "editor".to_string(),
        },
        token,
        refresh_token,
    };
    
    Ok(Json(response))
}

/// Login user
#[utoipa::path(
    post,
    path = "/api/v1/auth/login",
    tag = "Auth",
    request_body = LoginRequest,
    responses(
        (status = 200, description = "Login successful", body = AuthResponse),
        (status = 401, description = "Invalid credentials"),
    ),
)]
pub async fn login(
    State(db): State<DbState>,
    Json(req): Json<LoginRequest>,
) -> ApiResponse<AuthResponse> {
    // Find user by email
    let query = "SELECT * FROM users WHERE email = $email LIMIT 1";
    let mut result = db
        .query(query)
        .bind(("email", &req.email))
        .await
        .map_err(|e| internal_error(e))?;
    
    let user_data: Option<serde_json::Value> = result.take(0).ok().flatten();
    let user = user_data.ok_or(bad_request_error("Invalid credentials"))?;
    
    // Verify password
    let password_hash = user.get("password_hash")
        .and_then(|v| v.as_str())
        .ok_or(internal_error("Invalid password hash"))?;
    
    let password_valid = verify_password(&req.password, password_hash);
    if !password_valid {
        return Err(crate::api::bad_request_error("Invalid credentials"));
    }
    
    // Extract user data
    let user_id = user.get("id")
        .and_then(|v| v.as_str())
        .unwrap_or("unknown")
        .to_string();
    let email = user.get("email")
        .and_then(|v| v.as_str())
        .unwrap_or("")
        .to_string();
    let full_name = user.get("full_name")
        .and_then(|v| v.as_str())
        .unwrap_or("")
        .to_string();
    let username = user.get("username")
        .and_then(|v| v.as_str())
        .unwrap_or("")
        .to_string();
    let role = user.get("role")
        .and_then(|v: &serde_json::Value| v.as_str())
        .unwrap_or("editor")
        .to_string();
    
    // Generate JWT tokens - short-lived access token, long-lived refresh token
    let token = crate::middleware::generate_short_access_token(&user_id, &email, &role)
        .map_err(|_| internal_error("Failed to generate token"))?;
    let refresh_token = crate::middleware::generate_long_refresh_token(&user_id, &email)
        .map_err(|_| internal_error("Failed to generate refresh token"))?;
    
    let response = AuthResponse {
        user: UserResponse {
            id: user_id,
            email,
            full_name,
            username,
            role,
        },
        token,
        refresh_token,
    };
    
    Ok(Json(response))
}

/// Logout user
#[utoipa::path(
    post,
    path = "/api/v1/auth/logout",
    request_body = LogoutRequest,
    tag = "Auth",
    responses(
        (status = 200, description = "Logout successful"),
        (status = 401, description = "Unauthorized"),
        (status = 500, description = "Internal server error"),
    ),
)]
pub async fn logout(
    State(db): State<DbState>,
    Json(req): Json<LogoutRequest>,
) -> ApiResponse<serde_json::Value> {
    // Add refresh token to blacklist
    let now = chrono::Utc::now();
    let fifteen_days_later = now + chrono::Duration::days(15); // Store for 15 days to prevent reuse
    
    let query = "
        CREATE token_blacklist SET 
            token = $refresh_token, 
            invalidated_at = time::now(),
            expires_at = $expires_at
    ";
    
    let mut result = db
        .query(query)
        .bind(("refresh_token", &req.refresh_token))
        .bind(("expires_at", &fifteen_days_later))
        .await
        .map_err(|e| internal_error(e))?;
    
    let _: Option<serde_json::Value> = result.take(0).ok().flatten();
    
    Ok(Json(serde_json::json!({
        "message": "Logout successful",
        "success": true
    })))
}

/// Refresh token - receives refresh token, validates it hasn't been blacklisted,
/// verifies its signature and validity, and generates new access + refresh tokens
#[utoipa::path(
    post,
    path = "/api/v1/auth/refresh",
    request_body = RefreshRequest,
    tag = "Auth",
    responses(
        (status = 200, description = "Token refreshed", body = AuthResponse),
        (status = 401, description = "Invalid refresh token"),
        (status = 500, description = "Internal server error"),
    ),
)]
pub async fn refresh_token(
    State(db): State<DbState>,
    Json(req): Json<RefreshRequest>,
) -> ApiResponse<AuthResponse> {
    // Check if refresh token is blacklisted
    let blacklist_check_query = "
        SELECT * FROM token_blacklist 
        WHERE token = $refresh_token 
        AND expires_at >= time::now()
        LIMIT 1
    ";
    let mut blacklist_result = db
        .query(blacklist_check_query)
        .bind(("refresh_token", &req.refresh_token))
        .await
        .map_err(|e| internal_error(e))?;
    
    let blacklisted_token: Option<serde_json::Value> = blacklist_result.take(0).ok().flatten();
    if blacklisted_token.is_some() {
        return Err(bad_request_error("Token has been revoked"));
    }
    
    // Verify the refresh token by decoding JWT  
    let secret = std::env::var("JWT_SECRET").unwrap_or_else(|_| "esperion-secret-key-change-in-production".to_string());
    
    let token_data = jsonwebtoken::decode::<crate::models::user::JwtClaims>(
        &req.refresh_token,
        &jsonwebtoken::DecodingKey::from_secret(secret.as_bytes()),
        &jsonwebtoken::Validation::default(),
    ).map_err(|_| bad_request_error("Invalid refresh token"))?;
    
    let claims = token_data.claims;
    
    // Now get the user by their ID from the database to get current user info
    let user_query = "SELECT * FROM users WHERE id = $id LIMIT 1";
    let mut user_result = db
        .query(user_query)
        .bind(("id", &claims.sub))
        .await
        .map_err(|e| internal_error(e))?;
        
    let user_data: Option<serde_json::Value> = user_result.take(0).ok().flatten();
    let user = user_data.ok_or(bad_request_error("User not found"))?;

    // Extract user data
    let user_id = user.get("id").and_then(|v| v.as_str()).unwrap_or(&claims.sub).to_string();
    let email = user.get("email").and_then(|v| v.as_str()).unwrap_or(&claims.email).to_string();
    let full_name = user.get("full_name").and_then(|v: &serde_json::Value| v.as_str()).unwrap_or("").to_string();
    let username = user.get("username").and_then(|v: &serde_json::Value| v.as_str()).unwrap_or("").to_string();
    let role_str = user.get("role").and_then(|v: &serde_json::Value| v.as_str()).unwrap_or("editor");

    // Invalidate the old refresh token by adding it to blacklist
    let now = chrono::Utc::now();
    let fifteen_days_later = now + chrono::Duration::days(15);
    let invalidate_query = "
        CREATE token_blacklist SET 
            token = $refresh_token, 
            invalidated_at = time::now(),
            expires_at = $expires_at
    ";
    let _ = db
        .query(invalidate_query)
        .bind(("refresh_token", &req.refresh_token))
        .bind(("expires_at", &fifteen_days_later))
        .await
        .map_err(|e| internal_error(e))?;
    
    // Generate new access token (15 minute expiry) 
    // and new refresh token (30 day expiry) with current user data
    let access_token = crate::middleware::generate_short_access_token(&user_id, &email, role_str)?; // 15 min access token
    let new_refresh_token = crate::middleware::generate_long_refresh_token(&user_id, &email)?; // 30 day refresh token
    
    let response = AuthResponse {
        user: UserResponse {
            id: user_id,
            email,
            full_name,
            username,
            role: role_str.to_string(),
        },
        token: access_token,
        refresh_token: new_refresh_token,
    };
    
    Ok(Json(response))
}

/// Register auth routes
pub fn register_routes(router: Router<crate::db::DbState>) -> Router<crate::db::DbState> {
    use axum::routing::post;
    
    router
        .route("/api/v1/auth/register", post(register))
        .route("/api/v1/auth/login", post(login))
        .route("/api/v1/auth/logout", post(logout))
        .route("/api/v1/auth/refresh", post(refresh_token))
}

#[cfg(test)]
mod auth_tests {
    use super::*;
    use axum::body::Body;
    use axum::http::Request;
    use tower::ServiceExt;
    use surrealdb::engine::local::Mem;
    use surrealdb::Surreal;

    #[tokio::test]
    async fn test_logout_adds_token_to_blacklist() {
        let db = surrealdb::Surreal::init::<Mem>().await.unwrap();
        db.use_ns("test").use_db("test").await.unwrap();
        
        let db_state = DbState { db: db.clone() };
        let app = Router::new().route("/logout", post(logout)).with_state(db_state);
        
        // Test that logout blacklists the refresh token
        let refresh_token = "test_refresh_token_for_blacklisting";
        let request_payload = serde_json::json!({"refresh_token": refresh_token});
        let request_body = serde_json::to_string(&request_payload).unwrap();
        
        let response = app
            .oneshot(Request::builder()
                    .uri("/logout")
                    .method("POST")
                    .header("content-type", "application/json")
                    .body(Body::from(request_body)))
            .await
            .unwrap();
            
        assert_eq!(response.status(), StatusCode::OK);
        
        // Verify the token was indeed added to the blacklist in the database
        let blacklisted_tokens: Vec<serde_json::Value> = db
            .query("SELECT * FROM token_blacklist WHERE token = $token")
            .bind(("token", refresh_token))
            .await
            .unwrap()
            .take(0)
            .unwrap();
            
        assert_eq!(blacklisted_tokens.len(), 1);
        assert_eq!(blacklisted_tokens[0]["token"], refresh_token);
    }

    #[tokio::test]
    async fn test_register_creates_user_and_returns_tokens() {
        let db = surrealdb::Surreal::init::<Mem>().await.unwrap();
        db.use_ns("test").use_db("test").await.unwrap();
        
        let db_state = DbState { db: db.clone() };
        let app = Router::new().route("/register", post(register)).with_state(db_state);
        
        let register_payload = serde_json::json!({
            "email": "newuser@example.com",
            "password": "securepassword123",
            "full_name": "New User",
            "username": "newuser"
        });
        let request_body = serde_json::to_string(&register_payload).unwrap();
        
        let mut response = app
            .oneshot(Request::builder()
                    .uri("/register")
                    .method("POST")
                    .header("content-type", "application/json")
                    .body(Body::from(request_body)))
            .await
            .unwrap();
            
        assert_eq!(response.status(), StatusCode::OK);
    }

    #[tokio::test]
    // Test that login fails for nonexistent user
    async fn test_login_fails_for_nonexistent_user() {
        let db = surrealdb::Surreal::init::<Mem>().await.unwrap();
        db.use_ns("test").use_db("test").await.unwrap();
        
        let db_state = DbState { db: db.clone() };
        let app = Router::new().route("/login", post(login)).with_state(db_state);
        
        let login_payload = serde_json::json!({
            "email": "nonexistent@example.com",
            "password": "wrongpassword"
        });
        let request_body = serde_json::to_string(&login_payload).unwrap();
        
        let response = app
            .oneshot(Request::builder()
                    .uri("/login")
                    .method("POST")
                    .header("content-type", "application/json")
                    .body(Body::from(request_body)))
            .await
            .unwrap();
            
        assert_eq!(response.status(), StatusCode::BAD_REQUEST);
    }
}
