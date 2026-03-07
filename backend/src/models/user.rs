/**
 * User Model
 *
 * Represents a user account in the system
 * Used for authentication and authorization
 */
use serde::{Deserialize, Serialize};
use surrealdb::sql::Datetime;
use utoipa::ToSchema;

/// User account model
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct User {
    pub id: Option<String>,
    pub email: String,
    pub password_hash: String,
    pub full_name: String,
    pub role: UserRole,
    pub phone: Option<String>,
    pub username: String,
    pub device_id: Option<String>,
    pub created_at: Datetime,
    pub updated_at: Datetime,
}

/// User roles for authorization
#[derive(Debug, Clone, Serialize, Deserialize, ToSchema, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum UserRole {
    Admin,
    Editor,
    Viewer,
}

impl Default for UserRole {
    fn default() -> Self {
        Self::Editor
    }
}

impl UserRole {
    /// Check if role can edit content
    pub fn can_edit(&self) -> bool {
        matches!(self, Self::Admin | Self::Editor)
    }

    /// Check if role can delete content
    pub fn can_delete(&self) -> bool {
        matches!(self, Self::Admin)
    }

    /// Check if role can manage users
    pub fn can_manage_users(&self) -> bool {
        matches!(self, Self::Admin)
    }
}

/// User registration input
#[derive(Debug, Deserialize, ToSchema)]
pub struct RegisterInput {
    pub email: String,
    pub password: String,
    pub full_name: String,
    pub role: Option<UserRole>,
    pub phone: Option<String>,
    pub username: String,
}

/// User login input
#[derive(Debug, Deserialize, ToSchema)]
pub struct LoginInput {
    pub email: String,
    pub password: String,
}

/// Authentication response
#[derive(Debug, Serialize, ToSchema)]
pub struct AuthResponse {
    pub user: User,
    pub token: String,
    pub refresh_token: String,
}

/// JWT claims for authentication
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct JwtClaims {
    pub sub: String, // User ID
    pub email: String,
    pub role: UserRole,
    pub device_id: Option<String>,
    pub exp: i64, // Expiration timestamp
    pub iat: i64, // Issued at timestamp
}

/// User claims for extension trait (alias for JwtClaims)
pub type UserClaims = JwtClaims;
