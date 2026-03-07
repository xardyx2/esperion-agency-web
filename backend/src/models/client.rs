/**
 * Client Model
 *
 * Represents clients of the agency
 * Used for showcasing client logos and testimonials
 */
use serde::{Deserialize, Serialize};
use surrealdb::sql::Thing;

/// Client record
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Client {
    pub id: Option<Thing>,
    pub name: String,
    pub logo: String,
    pub testimonial: Option<String>,
    pub featured: bool,
    pub category: Option<String>,
    pub status: ClientStatus,
    pub internal_notes: Option<String>,
    pub created_at: Option<String>,
}

/// Client status enum
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum ClientStatus {
    Active,
    Inactive,
    Prospect,
}

impl Default for ClientStatus {
    fn default() -> Self {
        ClientStatus::Active
    }
}

impl ClientStatus {
    pub fn as_str(&self) -> &'static str {
        match self {
            ClientStatus::Active => "active",
            ClientStatus::Inactive => "inactive",
            ClientStatus::Prospect => "prospect",
        }
    }

    pub fn from_str(s: &str) -> Self {
        match s.to_lowercase().as_str() {
            "active" => ClientStatus::Active,
            "inactive" => ClientStatus::Inactive,
            "prospect" => ClientStatus::Prospect,
            _ => ClientStatus::Active,
        }
    }
}

impl Client {
    /// Create a new client record
    pub fn new(name: String, logo: String) -> Self {
        Self {
            id: None,
            name,
            logo,
            testimonial: None,
            featured: false,
            category: None,
            status: ClientStatus::default(),
            internal_notes: None,
            created_at: Some(chrono::Utc::now().to_rfc3339()),
        }
    }

    /// Set testimonial
    pub fn with_testimonial(mut self, testimonial: String) -> Self {
        self.testimonial = Some(testimonial);
        self
    }

    /// Set featured status
    pub fn with_featured(mut self, featured: bool) -> Self {
        self.featured = featured;
        self
    }

    /// Set category
    pub fn with_category(mut self, category: String) -> Self {
        self.category = Some(category);
        self
    }

    /// Set status
    pub fn with_status(mut self, status: ClientStatus) -> Self {
        self.status = status;
        self
    }

    /// Set internal notes
    pub fn with_internal_notes(mut self, notes: String) -> Self {
        self.internal_notes = Some(notes);
        self
    }
}

/// Client filter options
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct ClientFilter {
    pub featured: Option<bool>,
    pub category: Option<String>,
    pub status: Option<String>,
    pub limit: Option<u32>,
    pub offset: Option<u32>,
}

impl ClientFilter {
    /// Build WHERE clause for SurrealDB query
    pub fn to_where_clause(&self) -> String {
        let mut conditions = Vec::new();

        if let Some(featured) = self.featured {
            conditions.push(format!("featured = {}", featured));
        }

        if let Some(ref category) = self.category {
            conditions.push(format!("category = '{}'", category.replace('\'', "''")));
        }

        if let Some(ref status) = self.status {
            conditions.push(format!("status = '{}'", status.replace('\'', "''")));
        }

        if conditions.is_empty() {
            String::new()
        } else {
            format!(" WHERE {}", conditions.join(" AND "))
        }
    }
}

/// Create client request
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateClientRequest {
    pub name: String,
    pub logo: String,
    pub testimonial: Option<String>,
    pub featured: Option<bool>,
    pub category: Option<String>,
    pub status: Option<String>,
    pub internal_notes: Option<String>,
}

/// Update client request
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct UpdateClientRequest {
    pub name: Option<String>,
    pub logo: Option<String>,
    pub testimonial: Option<String>,
    pub featured: Option<bool>,
    pub category: Option<String>,
    pub status: Option<String>,
    pub internal_notes: Option<String>,
}

/// Client stats response
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ClientStats {
    pub total: u32,
    pub featured: u32,
    pub by_status: ClientStatusCounts,
    pub by_category: Vec<CategoryCount>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ClientStatusCounts {
    pub active: u32,
    pub inactive: u32,
    pub prospect: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CategoryCount {
    pub category: String,
    pub count: u32,
}

/// Client logo for carousel
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ClientLogo {
    pub id: String,
    pub name: String,
    pub logo: String,
    pub category: Option<String>,
}
