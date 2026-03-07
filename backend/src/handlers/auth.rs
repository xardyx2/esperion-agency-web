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
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

use crate::api::{ApiResponse, internal_error, bad_request_error};
use crate::db::DbState;

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
    
    // Generate JWT tokens
    let token = crate::middleware::generate_jwt(&user_id, &req.email, "editor")
        .map_err(|_| internal_error("Failed to generate token"))?;
    let refresh_token = crate::middleware::generate_jwt(&user_id, &req.email, "refresh")
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
    
    // Generate JWT tokens
    let token = crate::middleware::generate_jwt(&user_id, &email, &role)
        .map_err(|_| internal_error("Failed to generate token"))?;
    let refresh_token = crate::middleware::generate_jwt(&user_id, &email, "refresh")
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
    tag = "Auth",
    responses(
        (status = 200, description = "Logout successful"),
        (status = 401, description = "Unauthorized"),
    ),
)]
pub async fn logout() -> ApiResponse<serde_json::Value> {
    // TODO: Invalidate token in production
    Ok(Json(serde_json::json!({ "message": "Logout successful" })))
}

/// Refresh token
#[utoipa::path(
    post,
    path = "/api/v1/auth/refresh",
    tag = "Auth",
    responses(
        (status = 200, description = "Token refreshed", body = AuthResponse),
        (status = 401, description = "Invalid refresh token"),
    ),
)]
pub async fn refresh_token() -> ApiResponse<AuthResponse> {
    // TODO: Implement proper token refresh logic
    let response = AuthResponse {
        user: UserResponse {
            id: "user_1".to_string(),
            email: "test@example.com".to_string(),
            full_name: "Test User".to_string(),
            username: "testuser".to_string(),
            role: "editor".to_string(),
        },
        token: "mock_jwt_token".to_string(),
        refresh_token: "mock_refresh_token".to_string(),
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
