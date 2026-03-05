/**
 * Contact Submission Model
 * 
 * Represents contact form submissions
 * Used for managing leads and inquiries
 */

use serde::{Deserialize, Serialize};
use surrealdb::sql::Thing;

/// Contact submission status
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum ContactStatus {
    New,
    Contacted,
    Qualified,
    Converted,
    Lost,
}

impl Default for ContactStatus {
    fn default() -> Self {
        ContactStatus::New
    }
}

impl ContactStatus {
    pub fn as_str(&self) -> &'static str {
        match self {
            ContactStatus::New => "new",
            ContactStatus::Contacted => "contacted",
            ContactStatus::Qualified => "qualified",
            ContactStatus::Converted => "converted",
            ContactStatus::Lost => "lost",
        }
    }

    pub fn from_str(s: &str) -> Self {
        match s.to_lowercase().as_str() {
            "new" => ContactStatus::New,
            "contacted" => ContactStatus::Contacted,
            "qualified" => ContactStatus::Qualified,
            "converted" => ContactStatus::Converted,
            "lost" => ContactStatus::Lost,
            _ => ContactStatus::New,
        }
    }
}

/// Contact submission record
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ContactSubmission {
    pub id: Option<Thing>,
    pub full_name: String,
    pub company_name: Option<String>,
    pub service: String,
    pub description: String,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub recaptcha_score: Option<f32>,
    pub status: ContactStatus,
    pub notes: Option<String>,
    pub created_at: Option<String>,
}

impl ContactSubmission {
    /// Create a new contact submission
    pub fn new(
        full_name: String,
        service: String,
        description: String,
    ) -> Self {
        Self {
            id: None,
            full_name,
            company_name: None,
            service,
            description,
            email: None,
            phone: None,
            recaptcha_score: None,
            status: ContactStatus::default(),
            notes: None,
            created_at: Some(chrono::Utc::now().to_rfc3339()),
        }
    }

    /// Set company name
    pub fn with_company_name(mut self, company_name: String) -> Self {
        self.company_name = Some(company_name);
        self
    }

    /// Set email
    pub fn with_email(mut self, email: String) -> Self {
        self.email = Some(email);
        self
    }

    /// Set phone
    pub fn with_phone(mut self, phone: String) -> Self {
        self.phone = Some(phone);
        self
    }

    /// Set reCAPTCHA score
    pub fn with_recaptcha_score(mut self, score: f32) -> Self {
        self.recaptcha_score = Some(score);
        self
    }

    /// Set status
    pub fn with_status(mut self, status: ContactStatus) -> Self {
        self.status = status;
        self
    }

    /// Set notes
    pub fn with_notes(mut self, notes: String) -> Self {
        self.notes = Some(notes);
        self
    }
}

/// Contact submission filter options
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct ContactFilter {
    pub service: Option<String>,
    pub status: Option<String>,
    pub date_from: Option<String>,
    pub date_to: Option<String>,
    pub limit: Option<u32>,
    pub offset: Option<u32>,
}

impl ContactFilter {
    /// Build WHERE clause for SurrealDB query
    pub fn to_where_clause(&self) -> String {
        let mut conditions = Vec::new();

        if let Some(ref service) = self.service {
            conditions.push(format!("service = '{}'", service.replace('\'', "''")));
        }

        if let Some(ref status) = self.status {
            conditions.push(format!("status = '{}'", status.replace('\'', "''")));
        }

        if let Some(ref date_from) = self.date_from {
            conditions.push(format!("created_at >= '{}'", date_from));
        }

        if let Some(ref date_to) = self.date_to {
            conditions.push(format!("created_at <= '{}'", date_to));
        }

        if conditions.is_empty() {
            String::new()
        } else {
            format!(" WHERE {}", conditions.join(" AND "))
        }
    }
}

/// Create contact submission request
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateContactRequest {
    pub full_name: String,
    pub company_name: Option<String>,
    pub service: String,
    pub description: String,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub recaptcha_token: Option<String>,
}

/// Update contact submission request
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct UpdateContactRequest {
    pub company_name: Option<String>,
    pub service: Option<String>,
    pub description: Option<String>,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub status: Option<String>,
    pub notes: Option<String>,
}

/// Contact submission stats
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ContactStats {
    pub total: u32,
    pub by_status: ContactStatusCounts,
    pub by_service: Vec<ServiceCount>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ContactStatusCounts {
    pub new: u32,
    pub contacted: u32,
    pub qualified: u32,
    pub converted: u32,
    pub lost: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ServiceCount {
    pub service: String,
    pub count: u32,
}