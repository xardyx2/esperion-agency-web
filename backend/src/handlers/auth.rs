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
    extract::{Extension, State, Request},
    http::StatusCode,
    Json,
};
use argon2::{
    password_hash::{rand_core::OsRng, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};
use chrono::{Duration, Utc};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

use crate::api::{ApiResponse, internal_error, bad_request_error};

/// Request for refreshing tokens containing the refresh_token
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct RefreshRequest {
    pub refresh_token: String,
}

/// Request for the logout endpoint containing refresh_token
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct LogoutRequest {
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

/// Get current authenticated user
#[utoipa::path(
    get,
    path = "/api/v1/auth/me",
    tag = "Auth",
    responses(
        (status = 200, description = "Current user", body = UserResponse),
        (status = 401, description = "Unauthorized"),
        (status = 404, description = "User not found"),
    ),
    security(("bearer_auth" = [])),
)]
pub async fn get_current_user(
    State(app_state): State<crate::AppState>,
    Extension(claims): Extension<crate::models::user::JwtClaims>,
) -> ApiResponse<UserResponse> {
    let db = &app_state.db;

    let mut result = db
        .query("SELECT * FROM users WHERE id = $id LIMIT 1")
        .bind(("id", claims.sub.to_owned()))
        .await
        .map_err(|e| internal_error(e))?;

    let user_data: Option<serde_json::Value> = result.take(0).ok().flatten();
    let user = user_data.ok_or_else(|| crate::api::not_found_error("User not found"))?;

    Ok(Json(UserResponse {
        id: user.get("id").and_then(|v| v.as_str()).unwrap_or(&claims.sub).to_string(),
        email: user.get("email").and_then(|v| v.as_str()).unwrap_or(&claims.email).to_string(),
        full_name: user.get("full_name").and_then(|v| v.as_str()).unwrap_or("").to_string(),
        username: user.get("username").and_then(|v| v.as_str()).unwrap_or("").to_string(),
        role: user.get("role").and_then(|v| v.as_str()).unwrap_or("editor").to_string(),
    }))
}

/// Session representation for managing user sessions
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct Session {
    pub id: String,
    pub user_id: String,
    pub device_id: Option<String>,
    pub ip_address: Option<String>,
    pub user_agent: Option<String>,
    pub created_at: chrono::DateTime<Utc>,
    pub expires_at: chrono::DateTime<Utc>,
    pub is_current: bool, // Indicates if this is the session making the request
}

/// Request for listing user sessions
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct ListSessionsRequest {
    pub page: Option<u32>,
    pub limit: Option<u32>,
}

/// Response for listing user sessions
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct ListSessionsResponse {
    pub sessions: Vec<Session>,
    pub total: u64,
    pub page: u32,
    pub limit: u32,
}

/// Request for force-logout of a specific session
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct ForceLogoutSessionRequest {
    pub session_id: String,
}

/// Rate limiting information in response headers
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RateLimitHeaders {
    pub remaining: u32,
    pub reset_time: u64, // Unix timestamp when the limit resets
    pub limit: u32,
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
    State(app_state): State<crate::AppState>,
    Json(reg_req): Json<RegisterRequest>,
) -> ApiResponse<AuthResponse> {
    let db = &app_state.db;
    // Hash password
    let password_hash = hash_password(&reg_req.password)
        .map_err(|e| internal_error(e))?;
    
    // Check if email already exists
    let check_query = "SELECT * FROM users WHERE email = $email LIMIT 1";
    let mut check_result = db
        .query(check_query)
        .bind(("email", reg_req.email.to_owned()))
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
        .bind(("email", reg_req.email.to_owned()))
        .bind(("password_hash", password_hash.to_owned()))
        .bind(("full_name", reg_req.full_name.to_owned()))
        .bind(("username", reg_req.username.to_owned()))
        .bind(("phone", reg_req.phone.to_owned()))
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
    let token = crate::middleware::generate_short_access_token(&user_id, &reg_req.email, "editor")
        .map_err(|_| internal_error("Failed to generate token"))?;
    let refresh_token = crate::middleware::generate_long_refresh_token(&user_id, &reg_req.email)
        .map_err(|_| internal_error("Failed to generate refresh token"))?;
    
    // Create user session
    crate::middleware::create_user_session(
        &db,
        &user_id,
        &refresh_token,
        Some("127.0.0.1".to_string()),
        Some("Esperion Backend Registration".to_string()),
        None,
    ).await
        .map_err(|_| internal_error("Failed to create session"))?;
    
    let response = AuthResponse {
        user: UserResponse {
            id: user_id,
            email: reg_req.email,
            full_name: reg_req.full_name,
            username: reg_req.username,
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
    State(app_state): State<crate::AppState>,
    Json(login_req): Json<LoginRequest>,
) -> ApiResponse<AuthResponse> {
    let db = &app_state.db;
    // Find user by email
    let query = "SELECT * FROM users WHERE email = $email LIMIT 1";
    let mut result = db
        .query(query)
        .bind(("email", login_req.email.to_owned()))
        .await
        .map_err(|e| internal_error(e))?;
    
    let user_data: Option<serde_json::Value> = result.take(0).ok().flatten();
    let user = user_data.ok_or(bad_request_error("Invalid credentials"))?;
    
    // Verify password
    let password_hash = user.get("password_hash")
        .and_then(|v| v.as_str())
        .ok_or(internal_error("Invalid password hash"))?;
    
    let password_valid = verify_password(&login_req.password, password_hash);
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
    
    // Create user session
    crate::middleware::create_user_session(
        &db,
        &user_id,
        &refresh_token,
        Some("127.0.0.1".to_string()),
        Some("Esperion Backend Login".to_string()),
        None,
    ).await
        .map_err(|_| internal_error("Failed to create session"))?;
    
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
    State(app_state): State<crate::AppState>,
    // Extract the claims from the request extensions within the function using context
    Json(logout_req): Json<LogoutRequest>,
) -> ApiResponse<serde_json::Value> {
    let db = &app_state.db;
    // Unfortunately, can't get the claims here as the logout request has the refresh_token being logged out itself
    // The logout logic needs to be handled without knowing the current user (or we could verify the refresh token)
    // This causes the logout mechanism some complexity, but we can at least add the token to blacklist
    
    // First check the refresh token to get the user ID, if the token is valid but not blacklisted
    let secret = std::env::var("JWT_SECRET").unwrap_or_else(|_| "esperion-secret-key-change-in-production".to_string());
    
    let token_claims = jsonwebtoken::decode::<crate::models::user::JwtClaims>(
        &logout_req.refresh_token,
        &jsonwebtoken::DecodingKey::from_secret(secret.as_bytes()),
        &jsonwebtoken::Validation::new(jsonwebtoken::Algorithm::HS256),
    ).ok(); // If invalid, we just proceed with blacklisting without user tracking
    
    let user_id = token_claims.map(|data| data.claims.sub);
    
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
        .bind(("refresh_token", logout_req.refresh_token.to_owned()))
        .bind(("expires_at", fifteen_days_later.to_owned()))
        .await
        .map_err(|e| internal_error(e))?;
    
    let _: Option<serde_json::Value> = result.take(0).ok().flatten();
    
    // If we got user_id from the token, remove the session as well
    if let Some(uid) = user_id {
        // Delete the corresponding session if it exists
        let delete_session_query = "
            DELETE FROM sessions WHERE user_id = $user_id AND token = $refresh_token
        ";
        
        let _ = db.query(delete_session_query)
            .bind(("user_id", uid.to_owned()))
            .bind(("refresh_token", logout_req.refresh_token.to_owned()))
            .await
            .map_err(|e| internal_error(e))?;
        
        // Add audit logging for logout
        let audit_query = "
            CREATE activity_logs SET 
                user_id = $user_id,
                action = 'LOGOUT',
                entity = 'USER',
                entity_id = $user_id,
                details = $details
        ";
        
        let details = serde_json::json!({
            "success": true,
            "action": "logout",
            "token_blacklisted": true
        });
        
        let _ = db
            .query(audit_query)
            .bind(("user_id", uid.to_owned()))
            .bind(("details", details.to_owned()))
            .await
            .map_err(|e| internal_error(e))?;
    }

    Ok(Json(serde_json::json!({
        "message": "Logout successful",
        "success": true
    })))
}

/// Helper function to extract IP address from request
fn extract_ip_address_from_request(request: &axum::http::Request<axum::body::Body>) -> Option<String> {
    // Try X-Forwarded-For first (for requests through proxies/load balancers)
    if let Some(xff) = request.headers().get("x-forwarded-for") {
        if let Ok(xff_str) = xff.to_str() {
            // The client's IP is usually the first one in the forwarded list
            if let Some(client_ip) = xff_str.split(',').next() {
                return Some(client_ip.trim().to_string());
            }
        }
    }

    // Try X-Real-IP header (nginx reverse proxy)
    if let Some(xri) = request.headers().get("x-real-ip") {
        if let Ok(ip_str) = xri.to_str() {
            return Some(ip_str.to_string());
        }
    }

    // If none of the above worked, return None
    None
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
    State(app_state): State<crate::AppState>,
    Json(req): Json<RefreshRequest>,
) -> ApiResponse<AuthResponse> {
    let db = &app_state.db;
    // Check if refresh token is blacklisted
    let blacklist_check_query = "
        SELECT * FROM token_blacklist 
        WHERE token = $refresh_token 
        AND expires_at >= time::now()
        LIMIT 1
    ";
    let mut blacklist_result = db
        .query(blacklist_check_query)
        .bind(("refresh_token", req.refresh_token.to_owned()))
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
        &jsonwebtoken::Validation::new(jsonwebtoken::Algorithm::HS256),
    ).map_err(|_| bad_request_error("Invalid refresh token"))?;
    
    let claims = token_data.claims;
    
    // Now get the user by their ID from the database to get current user info
    let user_query = "SELECT * FROM users WHERE id = $id LIMIT 1";
    let mut user_result = db
        .query(user_query)
        .bind(("id", claims.sub.to_owned()))
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
        .bind(("refresh_token", req.refresh_token.to_owned()))
        .bind(("expires_at", fifteen_days_later.to_owned()))
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

/// Get user sessions
#[utoipa::path(
    get,
    path = "/api/v1/auth/sessions",
    tag = "Auth",
    responses(
        (status = 200, description = "Sessions retrieved", body = ListSessionsResponse),
        (status = 401, description = "Unauthorized"),
        (status = 500, description = "Internal server error"),
    ),
)]
pub async fn get_sessions(
    State(app_state): State<crate::AppState>,
    req: Request,
) -> ApiResponse<ListSessionsResponse> {
    let db = &app_state.db;
    // Extract claims from request extensions (from auth middleware)
    let claims = req.extensions().get::<crate::models::user::JwtClaims>()
        .ok_or(crate::api::internal_error("Missing user claims"))?;
    
    // Get query parameters for pagination
    let pagination = get_pagination_params_from_request(&req);
    let page = pagination.0;
    let limit = pagination.1;
    
    // Query user's active sessions
    let query = format!(
        "SELECT *, time.out AS expires_at FROM sessions WHERE user_id = $user_id ORDER BY created_at DESC LIMIT $limit START ($page - 1) * $limit"
    );
    
    let mut result = db
        .query(query.as_str())
        .bind(("user_id", claims.sub.to_owned()))
        .bind(("page", page as i64))
        .bind(("limit", limit as i64))
        .await
        .map_err(|e| crate::api::internal_error(e))?;
    
    let sessions: Vec<serde_json::Value> = result.take(0).unwrap_or_else(|_| vec![]);
    
    // Count total sessions for this user
    let count_query = "SELECT count(*) AS total FROM sessions WHERE user_id = $user_id";
    let mut count_result = db
        .query(count_query)
        .bind(("user_id", claims.sub.to_owned()))
        .await
        .map_err(|e| crate::api::internal_error(e))?;
    
    let count_data: Vec<serde_json::Value> = count_result.take(0).unwrap_or_else(|_| vec![]);
    let total = count_data.first()
        .and_then(|v| v.get("total"))
        .and_then(|v| v.as_number())
        .and_then(|n| n.as_u64())
        .unwrap_or(0);
    
    // Convert to Session struct
    let session_list: Vec<Session> = sessions.into_iter()
        .map(|sess| {
            Session {
                id: sess.get("id")
                    .and_then(|v| v.as_str())
                    .unwrap_or("unknown")
                    .to_string(),
                user_id: sess.get("user_id")
                    .and_then(|v: &serde_json::Value| v.as_str())
                    .unwrap_or(&claims.sub)
                    .to_string(),
                device_id: sess.get("device_id")
                    .and_then(|v| v.as_str())
                    .map(|s| s.to_string()),
                ip_address: sess.get("ip_address")
                    .and_then(|v| v.as_str())
                    .map(|s| s.to_string()),
                user_agent: sess.get("user_agent")
                    .and_then(|v| v.as_str())
                    .map(|s| s.to_string()),
                created_at: sess.get("created_at")
                    .and_then(|v| v.as_str())
                    .and_then(|s| s.parse().ok())
                    .unwrap_or(Utc::now()),
                expires_at: sess.get("expires_at")
                    .and_then(|v| v.as_str())
                    .and_then(|s| s.parse().ok())
                    .unwrap_or_else(|| Utc::now()),
                is_current: false, // Will be set later if this is the current session
            }
        })
        .collect();
    
    let response = ListSessionsResponse {
        sessions: session_list,
        total,
        page,
        limit,
    };
    
    Ok(Json(response))
}

/// Force logout a specific session
#[utoipa::path(
    delete,
    path = "/api/v1/auth/sessions/{session_id}",
    tag = "Auth",
    responses(
        (status = 200, description = "Session logged out"),
        (status = 401, description = "Unauthorized"),
        (status = 404, description = "Session not found"),
        (status = 500, description = "Internal server error"),
    ),
)]
pub async fn force_logout_session(
    State(app_state): State<crate::AppState>,
    axum::extract::Path(session_id): axum::extract::Path<String>,
    req: Request,
) -> ApiResponse<serde_json::Value> {
    let db = &app_state.db;
    // Extract claims from request extensions (from auth middleware)
    let claims = req.extensions().get::<crate::models::user::JwtClaims>()
        .ok_or(crate::api::internal_error("Missing user claims"))?;
    
    // Get the session to make sure it belongs to the current user
    let query = "SELECT * FROM sessions WHERE id = $session_id";
    
    let mut result = db
        .query(query)
        .bind(("session_id", session_id.to_owned()))
        .await
        .map_err(|e| crate::api::internal_error(e))?;
    
    let session_data: Option<serde_json::Value> = result.take(0).ok().flatten();
    let session = session_data.ok_or_else(|| {
        crate::api::bad_request_error("Session not found")
    })?;
    
    // Check that the session belongs to the current user
    let session_user_id = session.get("user_id")
        .and_then(|v| v.as_str())
        .ok_or_else(|| crate::api::internal_error("Invalid session data"))?;
        
    if session_user_id != claims.sub {
        return Err(crate::api::bad_request_error("Not authorized to logout this session"));
    }
    
    // Blacklist the token associated with this session (the session token itself) 
    // In the current implementation, the refresh token is stored in the session record
    if let Some(token) = session.get("token").and_then(|v| v.as_str()) {
        let now = Utc::now();
        let fifteen_days_later = now + Duration::days(15);
        let token_owned = token.to_owned();
        
        let blacklist_query = "
            CREATE token_blacklist SET 
                token = $token, 
                invalidated_at = time::now(),
                expires_at = $expires_at
        ";
        
        let _ = db
            .query(blacklist_query)
            .bind(("token", token_owned))
            .bind(("expires_at", fifteen_days_later.to_owned()))
            .await
            .map_err(|e| crate::api::internal_error(e))?;
    }
    
    // Delete the session from the database
    let delete_query = "DELETE sessions WHERE id = $session_id";
    
    let _ = db
        .query(delete_query)
        .bind(("session_id", session_id.to_owned()))
        .await
        .map_err(|e| crate::api::internal_error(e))?;
    
    Ok(Json(serde_json::json!({
        "message": "Session logged out successfully",
        "success": true
    })))
}

/// Helper function to extract pagination parameters from query string
fn get_pagination_params_from_request(req: &Request) -> (u32, u32) {
    let uri = req.uri();
    let query_string = uri.query().unwrap_or("");
    
    let mut page = 1u32;
    let mut limit = 10u32; // Default
    
    for param in query_string.split('&') {
        let parts: Vec<&str> = param.split('=').collect();
        if parts.len() == 2 {
            match parts[0] {
                "page" => {
                    if let Ok(val) = parts[1].parse::<u32>() {
                        if val > 0 {
                            page = val;
                        }
                    }
                }
                "limit" => {
                    if let Ok(val) = parts[1].parse::<u32>() {
                        // Limit between 1 and 100 records
                        if val >= 1 && val <= 100 {
                            limit = val;
                        }
                    }
                }
                _ => {}
            }
        }
    }
    
    (page, limit)
}


