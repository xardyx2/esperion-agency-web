use argon2::{
    password_hash::{rand_core::OsRng, PasswordHasher, SaltString},
    Argon2,
};
use axum::{
    extract::{Extension, Path, Query, State},
    response::Json,
};
use serde::{Deserialize, Serialize};
use utoipa::ToSchema;

use crate::api::{bad_request_error, internal_error, not_found_error, ApiError, ApiResponse};
use crate::models::user::{UserClaims, UserRole};

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct ManagedUser {
    pub id: String,
    pub email: String,
    pub full_name: String,
    pub username: String,
    pub role: String,
    pub phone: Option<String>,
    pub created_at: Option<String>,
    pub updated_at: Option<String>,
}

#[derive(Debug, Clone, Deserialize, ToSchema)]
pub struct UserListQuery {
    pub role: Option<String>,
    pub page: Option<u32>,
    pub limit: Option<u32>,
}

#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct UserListResponse {
    pub data: Vec<ManagedUser>,
    pub total: u32,
    pub page: u32,
    pub limit: u32,
}

#[derive(Debug, Clone, Deserialize, ToSchema)]
pub struct CreateManagedUserRequest {
    pub email: String,
    pub password: String,
    pub full_name: String,
    pub username: String,
    pub phone: Option<String>,
    pub role: String,
}

#[derive(Debug, Clone, Deserialize, ToSchema)]
pub struct UpdateManagedUserRequest {
    pub full_name: Option<String>,
    pub username: Option<String>,
    pub phone: Option<String>,
    pub role: Option<String>,
}

#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct FixedRoleCatalogEntry {
    pub role: String,
    pub permissions: Vec<String>,
}

#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct FixedRoleCatalogResponse {
    pub roles: Vec<FixedRoleCatalogEntry>,
}

#[derive(Debug, Clone, Deserialize, ToSchema)]
pub struct ActivityLogQuery {
    pub user_id: Option<String>,
    pub role: Option<String>,
    pub page: Option<u32>,
    pub limit: Option<u32>,
}

#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct ActivityLogItem {
    pub id: String,
    pub user_id: Option<String>,
    pub user_role: Option<String>,
    pub action: String,
    pub entity: String,
    pub entity_id: Option<String>,
    pub details: Option<String>,
    pub ip_address: Option<String>,
    pub created_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, ToSchema)]
pub struct ActivityLogListResponse {
    pub data: Vec<ActivityLogItem>,
    pub total: u32,
    pub page: u32,
    pub limit: u32,
}

fn forbidden_error(message: &str) -> ApiError {
    ApiError {
        status: axum::http::StatusCode::FORBIDDEN,
        message: Some(message.to_string()),
    }
}

fn ensure_admin(claims: &UserClaims) -> Result<(), ApiError> {
    if claims.role.can_manage_users() {
        Ok(())
    } else {
        Err(forbidden_error("Admin access required"))
    }
}

fn normalize_role(role: &str) -> Result<UserRole, ApiError> {
    match role.to_lowercase().as_str() {
        "admin" => Ok(UserRole::Admin),
        "editor" => Ok(UserRole::Editor),
        "viewer" => Ok(UserRole::Viewer),
        _ => Err(bad_request_error("Role must be one of: admin, editor, viewer")),
    }
}

fn role_label(role: &UserRole) -> &'static str {
    match role {
        UserRole::Admin => "admin",
        UserRole::Editor => "editor",
        UserRole::Viewer => "viewer",
    }
}

fn parse_pagination(page: Option<u32>, limit: Option<u32>) -> (u32, u32, u32) {
    let page = page.unwrap_or(1).max(1);
    let limit = limit.unwrap_or(20).clamp(1, 100);
    let start = (page - 1) * limit;
    (page, limit, start)
}

fn hash_password(password: &str) -> Result<String, ApiError> {
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    argon2
        .hash_password(password.as_bytes(), &salt)
        .map(|hash| hash.to_string())
        .map_err(|_| internal_error("Failed to hash password"))
}

fn map_managed_user(value: &serde_json::Value) -> Result<ManagedUser, ApiError> {
    Ok(ManagedUser {
        id: value
            .get("id")
            .and_then(|v| v.as_str())
            .ok_or_else(|| internal_error("User record missing id"))?
            .to_string(),
        email: value.get("email").and_then(|v| v.as_str()).unwrap_or_default().to_string(),
        full_name: value.get("full_name").and_then(|v| v.as_str()).unwrap_or_default().to_string(),
        username: value.get("username").and_then(|v| v.as_str()).unwrap_or_default().to_string(),
        role: value.get("role").and_then(|v| v.as_str()).unwrap_or("editor").to_string(),
        phone: value.get("phone").and_then(|v| v.as_str()).map(|v| v.to_string()),
        created_at: value.get("created_at").and_then(|v| v.as_str()).map(|v| v.to_string()),
        updated_at: value.get("updated_at").and_then(|v| v.as_str()).map(|v| v.to_string()),
    })
}

async fn fetch_user_record(db: &crate::db::DbState, user_id: &str) -> Result<serde_json::Value, ApiError> {
    let mut result = db
        .query("SELECT * FROM users WHERE id = $id LIMIT 1")
        .bind(("id", user_id.to_owned()))
        .await
        .map_err(|e| internal_error(e))?;

    result
        .take(0)
        .ok()
        .flatten()
        .ok_or_else(|| not_found_error("User not found"))
}

async fn count_admins(db: &crate::db::DbState) -> Result<u32, ApiError> {
    let mut result = db
        .query("SELECT count() as count FROM users WHERE role = 'admin'")
        .await
        .map_err(|e| internal_error(e))?;
    let rows: Vec<serde_json::Value> = result.take(0).unwrap_or_default();
    Ok(rows.first().and_then(|row| row.get("count")).and_then(|value| value.as_u64()).unwrap_or(0) as u32)
}

async fn write_audit_log(
    db: &crate::db::DbState,
    actor_id: String,
    action: String,
    entity_id: String,
    details: serde_json::Value,
) -> Result<(), ApiError> {
    db.query("CREATE activity_logs SET user_id = $user_id, action = $action, entity = 'USER', entity_id = $entity_id, details = $details, created_at = time::now()")
        .bind(("user_id", actor_id))
        .bind(("action", action))
        .bind(("entity_id", entity_id))
        .bind(("details", details))
        .await
        .map_err(|e| internal_error(e))?;
    Ok(())
}

fn fixed_role_catalog() -> Vec<FixedRoleCatalogEntry> {
    vec![
        FixedRoleCatalogEntry {
            role: "admin".to_string(),
            permissions: vec![
                "users.read".to_string(),
                "users.write".to_string(),
                "roles.read".to_string(),
                "activity_logs.read".to_string(),
            ],
        },
        FixedRoleCatalogEntry {
            role: "editor".to_string(),
            permissions: vec!["content.read".to_string(), "content.write".to_string()],
        },
        FixedRoleCatalogEntry {
            role: "viewer".to_string(),
            permissions: vec!["content.read".to_string()],
        },
    ]
}

#[utoipa::path(
    get,
    path = "/api/v1/users",
    tag = "User Management",
    params(
        ("role" = Option<String>, Query, description = "Filter by fixed role"),
        ("page" = Option<u32>, Query, description = "Page number"),
        ("limit" = Option<u32>, Query, description = "Page size")
    ),
    responses(
        (status = 200, description = "Users retrieved", body = UserListResponse),
        (status = 401, description = "Unauthorized"),
        (status = 403, description = "Forbidden")
    ),
    security(("bearer_auth" = []))
)]
pub async fn list_users(
    State(app_state): State<crate::AppState>,
    Query(query): Query<UserListQuery>,
    Extension(claims): Extension<UserClaims>,
) -> ApiResponse<UserListResponse> {
    ensure_admin(&claims)?;

    let db = &app_state.db;
    let (page, limit, start) = parse_pagination(query.page, query.limit);
    let where_clause = match query.role.as_deref() {
        Some(role) => {
            let normalized = normalize_role(role)?;
            format!(" WHERE role = '{}'", role_label(&normalized))
        }
        None => String::new(),
    };

    let query_sql = format!("SELECT * FROM users{} ORDER BY created_at DESC LIMIT {} START {};", where_clause, limit, start);
    let mut result = db.query(query_sql).await.map_err(|e| internal_error(e))?;
    let rows: Vec<serde_json::Value> = result.take(0).unwrap_or_default();
    let users = rows.iter().map(map_managed_user).collect::<Result<Vec<_>, _>>()?;

    let count_sql = format!("SELECT count() as count FROM users{};", where_clause);
    let mut count_result = db.query(count_sql).await.map_err(|e| internal_error(e))?;
    let counts: Vec<serde_json::Value> = count_result.take(0).unwrap_or_default();
    let total = counts.first().and_then(|row| row.get("count")).and_then(|value| value.as_u64()).unwrap_or(0) as u32;

    Ok(Json(UserListResponse { data: users, total, page, limit }))
}

#[utoipa::path(
    get,
    path = "/api/v1/users/{id}",
    tag = "User Management",
    params(("id" = String, Path, description = "User ID")),
    responses(
        (status = 200, description = "User retrieved", body = ManagedUser),
        (status = 401, description = "Unauthorized"),
        (status = 403, description = "Forbidden"),
        (status = 404, description = "User not found")
    ),
    security(("bearer_auth" = []))
)]
pub async fn get_user(
    State(app_state): State<crate::AppState>,
    Path(id): Path<String>,
    Extension(claims): Extension<UserClaims>,
) -> ApiResponse<ManagedUser> {
    ensure_admin(&claims)?;
    let user = fetch_user_record(&app_state.db, &id).await?;
    Ok(Json(map_managed_user(&user)?))
}

#[utoipa::path(
    post,
    path = "/api/v1/users",
    tag = "User Management",
    request_body = CreateManagedUserRequest,
    responses(
        (status = 200, description = "User created", body = ManagedUser),
        (status = 400, description = "Bad request"),
        (status = 401, description = "Unauthorized"),
        (status = 403, description = "Forbidden")
    ),
    security(("bearer_auth" = []))
)]
pub async fn create_user(
    State(app_state): State<crate::AppState>,
    Extension(claims): Extension<UserClaims>,
    Json(payload): Json<CreateManagedUserRequest>,
) -> ApiResponse<ManagedUser> {
    ensure_admin(&claims)?;

    let db = &app_state.db;
    let role = normalize_role(&payload.role)?;
    if payload.password.trim().len() < 8 {
        return Err(bad_request_error("Initial password must be at least 8 characters"));
    }

    let mut existing_result = db
        .query("SELECT * FROM users WHERE email = $email OR username = $username")
        .bind(("email", payload.email.to_owned()))
        .bind(("username", payload.username.to_owned()))
        .await
        .map_err(|e| internal_error(e))?;
    let existing: Vec<serde_json::Value> = existing_result.take(0).unwrap_or_default();
    if !existing.is_empty() {
        return Err(bad_request_error("Email or username already exists"));
    }

    let password_hash = hash_password(&payload.password)?;
    let role_value = role_label(&role);
    let mut create_result = db
        .query("CREATE users SET email = $email, password_hash = $password_hash, full_name = $full_name, username = $username, phone = $phone, role = $role, created_at = time::now(), updated_at = time::now()")
        .bind(("email", payload.email.to_owned()))
        .bind(("password_hash", password_hash.to_owned()))
        .bind(("full_name", payload.full_name.to_owned()))
        .bind(("username", payload.username.to_owned()))
        .bind(("phone", payload.phone.to_owned()))
        .bind(("role", role_value))
        .await
        .map_err(|e| internal_error(e))?;

    let created: Option<serde_json::Value> = create_result.take(0).ok().flatten();
    let created = created.ok_or_else(|| internal_error("Failed to create user"))?;
    let managed = map_managed_user(&created)?;

    write_audit_log(
        db,
        claims.sub.clone(),
        "USER_CREATE".to_string(),
        managed.id.clone(),
        serde_json::json!({
            "email": managed.email,
            "username": managed.username,
            "role": managed.role,
        }),
    ).await?;

    Ok(Json(managed))
}

#[utoipa::path(
    put,
    path = "/api/v1/users/{id}",
    tag = "User Management",
    request_body = UpdateManagedUserRequest,
    params(("id" = String, Path, description = "User ID")),
    responses(
        (status = 200, description = "User updated", body = ManagedUser),
        (status = 400, description = "Bad request"),
        (status = 401, description = "Unauthorized"),
        (status = 403, description = "Forbidden"),
        (status = 404, description = "User not found")
    ),
    security(("bearer_auth" = []))
)]
pub async fn update_user(
    State(app_state): State<crate::AppState>,
    Path(id): Path<String>,
    Extension(claims): Extension<UserClaims>,
    Json(payload): Json<UpdateManagedUserRequest>,
) -> ApiResponse<ManagedUser> {
    ensure_admin(&claims)?;

    let db = &app_state.db;
    let existing = fetch_user_record(db, &id).await?;
    let current_role = existing.get("role").and_then(|v| v.as_str()).unwrap_or("editor").to_string();
    let next_role = match payload.role.as_deref() {
        Some(role) => role_label(&normalize_role(role)?).to_string(),
        None => current_role.clone(),
    };

    if current_role == "admin" && next_role != "admin" && count_admins(db).await? <= 1 {
        return Err(bad_request_error("Cannot demote the last remaining admin"));
    }

    let full_name = payload.full_name.clone().unwrap_or_else(|| existing.get("full_name").and_then(|v| v.as_str()).unwrap_or_default().to_string());
    let username = payload.username.clone().unwrap_or_else(|| existing.get("username").and_then(|v| v.as_str()).unwrap_or_default().to_string());
    let phone = payload.phone.clone().or_else(|| existing.get("phone").and_then(|v| v.as_str()).map(|v| v.to_string()));
    let email = existing.get("email").and_then(|v| v.as_str()).unwrap_or_default().to_string();

    let mut duplicate_result = db
        .query("SELECT * FROM users WHERE username = $username AND id != $id")
        .bind(("username", username.to_owned()))
        .bind(("id", id.to_owned()))
        .await
        .map_err(|e| internal_error(e))?;
    let duplicates: Vec<serde_json::Value> = duplicate_result.take(0).unwrap_or_default();
    if !duplicates.is_empty() {
        return Err(bad_request_error("Username already exists"));
    }

    let mut update_result = db
        .query("UPDATE users SET full_name = $full_name, username = $username, phone = $phone, role = $role, updated_at = time::now() WHERE id = $id")
        .bind(("full_name", full_name.to_owned()))
        .bind(("username", username.to_owned()))
        .bind(("phone", phone.to_owned()))
        .bind(("role", next_role.clone()))
        .bind(("id", id.to_owned()))
        .await
        .map_err(|e| internal_error(e))?;

    let updated: Option<serde_json::Value> = update_result.take(0).ok().flatten();
    let updated = updated.ok_or_else(|| not_found_error("User not found"))?;
    let managed = map_managed_user(&updated)?;

    write_audit_log(
        db,
        claims.sub.clone(),
        if current_role != next_role { "USER_ROLE_UPDATE".to_string() } else { "USER_UPDATE".to_string() },
        managed.id.clone(),
        serde_json::json!({
            "email": email,
            "username": managed.username,
            "previous_role": current_role,
            "next_role": next_role,
        }),
    ).await?;

    Ok(Json(managed))
}

#[utoipa::path(
    delete,
    path = "/api/v1/users/{id}",
    tag = "User Management",
    params(("id" = String, Path, description = "User ID")),
    responses(
        (status = 200, description = "User deleted"),
        (status = 400, description = "Bad request"),
        (status = 401, description = "Unauthorized"),
        (status = 403, description = "Forbidden"),
        (status = 404, description = "User not found")
    ),
    security(("bearer_auth" = []))
)]
pub async fn delete_user(
    State(app_state): State<crate::AppState>,
    Path(id): Path<String>,
    Extension(claims): Extension<UserClaims>,
) -> ApiResponse<serde_json::Value> {
    ensure_admin(&claims)?;

    let db = &app_state.db;
    let existing = fetch_user_record(db, &id).await?;
    let current_role = existing.get("role").and_then(|v| v.as_str()).unwrap_or("editor").to_string();
    if current_role == "admin" && count_admins(db).await? <= 1 {
        return Err(bad_request_error("Cannot delete the last remaining admin"));
    }

    db.query("DELETE users WHERE id = $id")
        .bind(("id", id.to_owned()))
        .await
        .map_err(|e| internal_error(e))?;

    write_audit_log(
        db,
        claims.sub.clone(),
        "USER_DELETE".to_string(),
        id.clone(),
        serde_json::json!({
            "deleted_role": current_role,
            "deleted_email": existing.get("email").and_then(|v| v.as_str()).unwrap_or_default(),
            "delete_mode": "hard-delete",
        }),
    ).await?;

    Ok(Json(serde_json::json!({
        "success": true,
        "message": "User deleted successfully",
        "delete_mode": "hard-delete"
    })))
}

#[utoipa::path(
    get,
    path = "/api/v1/roles",
    tag = "User Management",
    responses(
        (status = 200, description = "Fixed role catalog", body = FixedRoleCatalogResponse),
        (status = 401, description = "Unauthorized"),
        (status = 403, description = "Forbidden")
    ),
    security(("bearer_auth" = []))
)]
pub async fn list_roles(
    Extension(claims): Extension<UserClaims>,
) -> ApiResponse<FixedRoleCatalogResponse> {
    ensure_admin(&claims)?;
    Ok(Json(FixedRoleCatalogResponse { roles: fixed_role_catalog() }))
}

#[utoipa::path(
    get,
    path = "/api/v1/activity-logs",
    tag = "User Management",
    params(
        ("user_id" = Option<String>, Query, description = "Filter by user ID"),
        ("role" = Option<String>, Query, description = "Filter by current fixed role"),
        ("page" = Option<u32>, Query, description = "Page number"),
        ("limit" = Option<u32>, Query, description = "Page size")
    ),
    responses(
        (status = 200, description = "Activity logs", body = ActivityLogListResponse),
        (status = 401, description = "Unauthorized"),
        (status = 403, description = "Forbidden")
    ),
    security(("bearer_auth" = []))
)]
pub async fn list_activity_logs(
    State(app_state): State<crate::AppState>,
    Query(query): Query<ActivityLogQuery>,
    Extension(claims): Extension<UserClaims>,
) -> ApiResponse<ActivityLogListResponse> {
    ensure_admin(&claims)?;

    let db = &app_state.db;
    let (page, limit, start) = parse_pagination(query.page, query.limit);
    let mut result = if let Some(user_id) = &query.user_id {
        db.query("SELECT * FROM activity_logs WHERE user_id = $user_id ORDER BY created_at DESC")
            .bind(("user_id", user_id.to_owned()))
            .await
            .map_err(|e| internal_error(e))?
    } else {
        db.query("SELECT * FROM activity_logs ORDER BY created_at DESC")
            .await
            .map_err(|e| internal_error(e))?
    };

    let role_filter = query.role.as_deref().map(normalize_role).transpose()?;
    let desired_role = role_filter.as_ref().map(role_label);
    let rows: Vec<serde_json::Value> = result.take(0).unwrap_or_default();
    let mut items = Vec::new();

    for row in rows {
        let user_id = row.get("user_id").and_then(|v| v.as_str()).map(|v| v.to_string());
        let user_role = if let Some(ref user_id) = user_id {
            fetch_user_record(db, user_id)
                .await
                .ok()
                .and_then(|user| user.get("role").and_then(|v| v.as_str()).map(|v| v.to_string()))
        } else {
            None
        };

        if let Some(expected) = desired_role {
            if user_role.as_deref() != Some(expected) {
                continue;
            }
        }

        items.push(ActivityLogItem {
            id: row.get("id").and_then(|v| v.as_str()).unwrap_or("unknown").to_string(),
            user_id,
            user_role,
            action: row.get("action").and_then(|v| v.as_str()).unwrap_or_default().to_string(),
            entity: row.get("entity").and_then(|v| v.as_str()).unwrap_or_default().to_string(),
            entity_id: row.get("entity_id").and_then(|v| v.as_str()).map(|v| v.to_string()),
            details: row.get("details").map(|v| v.to_string()),
            ip_address: row.get("ip_address").and_then(|v| v.as_str()).map(|v| v.to_string()),
            created_at: row.get("created_at").and_then(|v| v.as_str()).map(|v| v.to_string()),
        });
    }

    let total = items.len() as u32;
    let data = items.into_iter().skip(start as usize).take(limit as usize).collect();
    Ok(Json(ActivityLogListResponse { data, total, page, limit }))
}

#[cfg(test)]
mod tests {
    use std::{sync::Arc, time::Duration};

    use super::*;
    use crate::{models::email::EmailSettings, services::email::EmailService, AppState};
    use surrealdb::{engine::remote::ws::Ws, opt::auth::Root, Surreal};
    use tokio::time::timeout;

    async fn test_state() -> Option<AppState> {
        let db = match timeout(Duration::from_secs(2), Surreal::new::<Ws>("127.0.0.1:8000")).await {
            Ok(Ok(db)) => db,
            _ => return None,
        };

        match timeout(Duration::from_secs(2), db.signin(Root { username: "root", password: "root" })).await {
            Ok(Ok(_)) => {}
            _ => return None,
        }

        let db_name = format!("user_mgmt_{}", uuid::Uuid::new_v4().simple());
        match timeout(Duration::from_secs(2), db.use_ns("test").use_db(&db_name)).await {
            Ok(Ok(_)) => {}
            _ => return None,
        }

        match timeout(Duration::from_secs(2), db.query(crate::db::schema::get_schema())).await {
            Ok(Ok(_)) => {}
            _ => return None,
        }

        let email_service = EmailService::new(&EmailSettings {
            provider: "smtp".to_string(),
            smtp_host: Some("localhost".to_string()),
            smtp_port: Some(1025),
            smtp_username: None,
            smtp_password: None,
            smtp_encryption: Some("starttls".to_string()),
            api_key: None,
            from_address: "noreply@example.com".to_string(),
            domain: None,
            region: None,
            access_key_id: None,
            secret_access_key: None,
        }).ok()?;

        Some(AppState { db: Arc::new(db), email_service })
    }

    async fn seed_user(state: &AppState, email: &str, username: &str, role: &str) -> String {
        let mut result = state.db
            .query("CREATE users SET email = $email, password_hash = 'hash', full_name = $full_name, username = $username, role = $role, created_at = time::now(), updated_at = time::now()")
            .bind(("email", email))
            .bind(("full_name", username))
            .bind(("username", username))
            .bind(("role", role))
            .await
            .unwrap();

        let created: Option<serde_json::Value> = result.take(0).ok().flatten();
        created.unwrap().get("id").and_then(|v| v.as_str()).unwrap().to_string()
    }

    fn claims(user_id: &str, role: UserRole) -> UserClaims {
        UserClaims {
            sub: user_id.to_string(),
            email: "admin@example.com".to_string(),
            role,
            device_id: None,
            exp: chrono::Utc::now().timestamp() + 3600,
            iat: chrono::Utc::now().timestamp(),
        }
    }

    #[tokio::test]
    async fn admin_can_list_users() {
        let Some(state) = test_state().await else { return; };
        let admin_id = seed_user(&state, "admin@example.com", "admin", "admin").await;
        let _editor_id = seed_user(&state, "editor@example.com", "editor", "editor").await;

        let response = list_users(
            State(state),
            Query(UserListQuery { role: None, page: Some(1), limit: Some(10) }),
            Extension(claims(&admin_id, UserRole::Admin)),
        ).await.unwrap();

        assert_eq!(response.0.total, 2);
    }

    #[tokio::test]
    async fn non_admin_cannot_list_users() {
        let Some(state) = test_state().await else { return; };
        let editor_id = seed_user(&state, "editor@example.com", "editor", "editor").await;

        let result = list_users(
            State(state),
            Query(UserListQuery { role: None, page: Some(1), limit: Some(10) }),
            Extension(claims(&editor_id, UserRole::Editor)),
        ).await;

        assert_eq!(result.unwrap_err().status, axum::http::StatusCode::FORBIDDEN);
    }

    #[tokio::test]
    async fn admin_can_create_user_with_fixed_role() {
        let Some(state) = test_state().await else { return; };
        let admin_id = seed_user(&state, "admin@example.com", "admin", "admin").await;

        let response = create_user(
            State(state.clone()),
            Extension(claims(&admin_id, UserRole::Admin)),
            Json(CreateManagedUserRequest {
                email: "viewer@example.com".to_string(),
                password: "password123".to_string(),
                full_name: "Viewer User".to_string(),
                username: "viewer-user".to_string(),
                phone: None,
                role: "viewer".to_string(),
            }),
        ).await.unwrap();

        assert_eq!(response.0.role, "viewer");

        let mut logs_result = state.db.query("SELECT * FROM activity_logs WHERE action = 'USER_CREATE'").await.unwrap();
        let logs: Vec<serde_json::Value> = logs_result.take(0).unwrap_or_default();
        assert_eq!(logs.len(), 1);
    }

    #[tokio::test]
    async fn last_admin_cannot_be_demoted_or_deleted() {
        let Some(state) = test_state().await else { return; };
        let admin_id = seed_user(&state, "admin@example.com", "admin", "admin").await;

        let demote_result = update_user(
            State(state.clone()),
            Path(admin_id.clone()),
            Extension(claims(&admin_id, UserRole::Admin)),
            Json(UpdateManagedUserRequest {
                full_name: None,
                username: None,
                phone: None,
                role: Some("editor".to_string()),
            }),
        ).await;
        assert_eq!(demote_result.unwrap_err().status, axum::http::StatusCode::BAD_REQUEST);

        let delete_result = delete_user(
            State(state),
            Path(admin_id.clone()),
            Extension(claims(&admin_id, UserRole::Admin)),
        ).await;
        assert_eq!(delete_result.unwrap_err().status, axum::http::StatusCode::BAD_REQUEST);
    }

    #[tokio::test]
    async fn admin_can_update_and_delete_non_admin_user() {
        let Some(state) = test_state().await else { return; };
        let admin_id = seed_user(&state, "admin@example.com", "admin", "admin").await;
        let editor_id = seed_user(&state, "editor@example.com", "editor", "editor").await;

        let updated = update_user(
            State(state.clone()),
            Path(editor_id.clone()),
            Extension(claims(&admin_id, UserRole::Admin)),
            Json(UpdateManagedUserRequest {
                full_name: Some("Updated Editor".to_string()),
                username: Some("updated-editor".to_string()),
                phone: Some("+620000000".to_string()),
                role: Some("viewer".to_string()),
            }),
        ).await.unwrap();

        assert_eq!(updated.0.role, "viewer");
        assert_eq!(updated.0.username, "updated-editor");

        let deleted = delete_user(
            State(state.clone()),
            Path(editor_id.clone()),
            Extension(claims(&admin_id, UserRole::Admin)),
        ).await.unwrap();

        assert_eq!(deleted.0.get("success").and_then(|v| v.as_bool()), Some(true));
    }

    #[tokio::test]
    async fn activity_logs_can_be_filtered_by_role() {
        let Some(state) = test_state().await else { return; };
        let admin_id = seed_user(&state, "admin@example.com", "admin", "admin").await;
        let editor_id = seed_user(&state, "editor@example.com", "editor", "editor").await;

        state.db.query("CREATE activity_logs SET user_id = $user_id, action = 'USER_UPDATE', entity = 'USER', entity_id = $entity_id, details = { source: 'test' }, created_at = time::now()")
            .bind(("user_id", editor_id.to_owned()))
            .bind(("entity_id", editor_id.to_owned()))
            .await
            .unwrap();

        let response = list_activity_logs(
            State(state),
            Query(ActivityLogQuery { user_id: None, role: Some("editor".to_string()), page: Some(1), limit: Some(20) }),
            Extension(claims(&admin_id, UserRole::Admin)),
        ).await.unwrap();

        assert_eq!(response.0.total, 1);
        assert_eq!(response.0.data[0].user_role.as_deref(), Some("editor"));
    }
}
