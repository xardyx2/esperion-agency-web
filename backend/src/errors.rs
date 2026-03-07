/**
 * Application Error Types
 *
 * Defines custom error types for the Esperion API
 */
use axum::{http::StatusCode, response::IntoResponse};
use serde::Serialize;
use std::fmt;

/// Application-specific error types
#[derive(Debug)]
pub enum AppError {
    /// reCAPTCHA verification failed
    RecaptchaFailed,
    /// reCAPTCHA token is missing
    RecaptchaTokenMissing,
    /// Internal server error
    InternalServerError(String),
}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            AppError::RecaptchaFailed => write!(f, "reCAPTCHA verification failed"),
            AppError::RecaptchaTokenMissing => write!(f, "reCAPTCHA token is missing"),
            AppError::InternalServerError(msg) => write!(f, "Internal server error: {}", msg),
        }
    }
}

impl std::error::Error for AppError {}

impl IntoResponse for AppError {
    fn into_response(self) -> axum::response::Response {
        let (status, message) = match self {
            AppError::RecaptchaFailed => (
                StatusCode::BAD_REQUEST,
                "reCAPTCHA verification failed".to_string(),
            ),
            AppError::RecaptchaTokenMissing => (
                StatusCode::BAD_REQUEST,
                "reCAPTCHA token is required".to_string(),
            ),
            AppError::InternalServerError(_) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Internal server error".to_string(),
            ),
        };

        (status, message).into_response()
    }
}

impl From<reqwest::Error> for AppError {
    fn from(err: reqwest::Error) -> Self {
        AppError::InternalServerError(format!("Request error: {}", err))
    }
}

#[derive(Debug)]
pub enum RecaptchaError {
    /// Network or HTTP error during verification
    RequestError(reqwest::Error),
    /// Verification process failed
    VerificationFailed,
    /// Invalid response from reCAPTCHA service
    InvalidResponse,
}

impl fmt::Display for RecaptchaError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            RecaptchaError::RequestError(e) => write!(f, "Network error: {}", e),
            RecaptchaError::VerificationFailed => write!(f, "reCAPTCHA verification failed"),
            RecaptchaError::InvalidResponse => write!(f, "Invalid reCAPTCHA response"),
        }
    }
}

impl std::error::Error for RecaptchaError {}

impl From<reqwest::Error> for RecaptchaError {
    fn from(err: reqwest::Error) -> Self {
        RecaptchaError::RequestError(err)
    }
}
