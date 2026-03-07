/**
 * reCAPTCHA Response Model
 *
 * Represents the response from Google's reCAPTCHA v3 verification API
 */
use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct RecaptchaResponse {
    pub success: bool,
    pub score: f32,
    pub action: String,
    pub challenge_ts: String,
    pub hostname: String,
    #[serde(default)]
    pub error_codes: Vec<String>,
}
