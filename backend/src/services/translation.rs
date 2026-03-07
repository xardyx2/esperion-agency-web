use reqwest;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use tracing;

#[derive(Debug)]
pub enum TranslationError {
    ApiError(String),
    NetworkError(String),
    InvalidResponse(String),
    ConfigurationError(String),
}

impl std::fmt::Display for TranslationError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            TranslationError::ApiError(msg) => write!(f, "API Error: {}", msg),
            TranslationError::NetworkError(msg) => write!(f, "Network Error: {}", msg),
            TranslationError::InvalidResponse(msg) => write!(f, "Invalid Response: {}", msg),
            TranslationError::ConfigurationError(msg) => write!(f, "Configuration Error: {}", msg),
        }
    }
}

impl std::error::Error for TranslationError {}

impl From<reqwest::Error> for TranslationError {
    fn from(error: reqwest::Error) -> Self {
        TranslationError::NetworkError(error.to_string())
    }
}

pub struct AlibabaTranslator {
    api_key: String,
    base_url: String,
    http_client: reqwest::Client,
}

#[derive(Serialize, Deserialize, Debug)]
struct AlibabaTranslationRequest {
    model: String,
    input: AlibabaTranslationInput,
    parameters: Option<HashMap<String, serde_json::Value>>,
}

#[derive(Serialize, Deserialize, Debug)]
struct AlibabaTranslationInput {
    source_language: String,
    target_language: String,
    text: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct AlibabaTranslationResponse {
    code: Option<i32>,
    message: Option<String>,
    request_id: String,
    output: Option<AlibabaTranslationOutput>,
}

#[derive(Serialize, Deserialize, Debug)]
struct AlibabaTranslationOutput {
    translated_text: String,
}

impl AlibabaTranslator {
    pub fn new(api_key: String) -> Self {
        Self {
            api_key,
            base_url: "https://dashscope.aliyuncs.com/api/v1".to_string(),
            http_client: reqwest::Client::new(),
        }
    }
    
    pub async fn translate(&self, text: &str, from: &str, to: &str) -> Result<String, TranslationError> {
        // Prepare the request payload
        let mut headers = reqwest::header::HeaderMap::new();
        headers.insert(
            reqwest::header::CONTENT_TYPE,
            reqwest::header::HeaderValue::from_static("application/json"),
        );
        headers.insert(
            reqwest::header::AUTHORIZATION,
            reqwest::header::HeaderValue::from_str(&format!("Bearer {}", self.api_key))
                .map_err(|e| TranslationError::ConfigurationError(e.to_string()))?,
        );

        let mut parameters = HashMap::new();
        parameters.insert("text_type".to_string(), serde_json::Value::String("text".to_string()));

        let request_payload = AlibabaTranslationRequest {
            model: "qwen-turbo".to_string(),
            input: AlibabaTranslationInput {
                source_language: from.to_string(),
                target_language: to.to_string(),
                text: text.to_string(),
            },
            parameters: Some(parameters),
        };

        // Send the request to Alibaba AI API
        let response = self
            .http_client
            .post(&format!("{}/services/aigc/text-generation/generation", self.base_url))
            .headers(headers)
            .json(&request_payload)
            .send()
            .await?;

        // Parse the response
        let response_text = response.text().await?;
        
        match serde_json::from_str::<AlibabaTranslationResponse>(&response_text) {
            Ok(alibaba_response) => {
                if let Some(code) = alibaba_response.code {
                    if code != 200 {
                        return Err(TranslationError::ApiError(
                            format!("API returned error code {}: {:?}", code, alibaba_response.message),
                        ));
                    }
                }
                
                match alibaba_response.output {
                    Some(output) => Ok(output.translated_text),
                    None => Err(TranslationError::InvalidResponse(
                        "No translated text in API response".to_string(),
                    )),
                }
            }
            Err(_) => {
                // Try parsing as streaming response format which might have different structure
                // For now, return the raw error
                Err(TranslationError::InvalidResponse(response_text))
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_alibaba_translator_creation() {
        let translator = AlibabaTranslator::new("test-key".to_string());
        assert_eq!(translator.api_key, "test-key");
        assert_eq!(translator.base_url, "https://dashscope.aliyuncs.com/api/v1");
    }

    // Mock the actual API call for testing purposes
    #[test]
    fn test_translation_error_display() {
        let error = TranslationError::ApiError("Test error".to_string());
        assert_eq!(format!("{}", error), "API Error: Test error");

        let error = TranslationError::NetworkError("Network error".to_string());
        assert_eq!(format!("{}", error), "Network Error: Network error");

        let error = TranslationError::InvalidResponse("Invalid response".to_string());
        assert_eq!(format!("{}", error), "Invalid Response: Invalid response");

        let error = TranslationError::ConfigurationError("Config error".to_string());
        assert_eq!(format!("{}", error), "Configuration Error: Config error");
    }

    #[test]
    fn test_translation_error_from_reqwest_error() {
        let reqwest_error = reqwest::Error::from(std::io::Error::new(std::io::ErrorKind::Other, "test"));
        let translation_error = TranslationError::from(reqwest_error);
        
        match translation_error {
            TranslationError::NetworkError(_) => {
                // Test passed
            },
            _ => panic!("Expected NetworkError"),
        }
    }
    
    // We can't run the actual API test since it would require a real API key and network connectivity
    // The real test happens during integration
}