/**
 * Work Model
 *
 * Represents portfolio work in the works table
 * Used for showcasing completed projects
 */
use serde::{Deserialize, Serialize};
use surrealdb::sql::Thing;

/// Metric for a work (e.g., "Increased traffic by 150%")
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WorkMetric {
    pub label: String,
    pub value: String,
    pub suffix: Option<String>,
}

/// Portfolio work record
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Work {
    pub id: Option<Thing>,
    pub title: String,
    pub slug: String,
    pub description: String,
    pub service: String,
    pub platform: String,
    pub image: String,
    pub metrics: Vec<WorkMetric>,
    pub client_name: String,
    pub featured: bool,
    pub created_at: Option<String>,
}

impl Work {
    /// Create a new work record
    pub fn new(
        title: String,
        slug: String,
        description: String,
        service: String,
        platform: String,
        image: String,
        client_name: String,
    ) -> Self {
        Self {
            id: None,
            title,
            slug,
            description,
            service,
            platform,
            image,
            metrics: Vec::new(),
            client_name,
            featured: false,
            created_at: Some(chrono::Utc::now().to_rfc3339()),
        }
    }

    /// Add a metric to the work
    pub fn with_metric(mut self, label: String, value: String, suffix: Option<String>) -> Self {
        self.metrics.push(WorkMetric {
            label,
            value,
            suffix,
        });
        self
    }

    /// Set featured status
    pub fn with_featured(mut self, featured: bool) -> Self {
        self.featured = featured;
        self
    }
}

/// Work filter options
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct WorkFilter {
    pub service: Option<String>,
    pub platform: Option<String>,
    pub featured: Option<bool>,
    pub limit: Option<u32>,
    pub offset: Option<u32>,
}

impl WorkFilter {
    /// Build WHERE clause for SurrealDB query
    pub fn to_where_clause(&self) -> String {
        let mut conditions = Vec::new();

        if let Some(ref service) = self.service {
            conditions.push(format!("service = '{}'", service.replace('\'', "''")));
        }

        if let Some(ref platform) = self.platform {
            conditions.push(format!("platform = '{}'", platform.replace('\'', "''")));
        }

        if let Some(featured) = self.featured {
            conditions.push(format!("featured = {}", featured));
        }

        if conditions.is_empty() {
            String::new()
        } else {
            format!(" WHERE {}", conditions.join(" AND "))
        }
    }
}

/// Create work request
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateWorkRequest {
    pub title: String,
    pub slug: String,
    pub description: String,
    pub service: String,
    pub platform: String,
    pub image: String,
    pub client_name: String,
    pub metrics: Option<Vec<WorkMetric>>,
    pub featured: Option<bool>,
}

/// Update work request
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct UpdateWorkRequest {
    pub title: Option<String>,
    pub description: Option<String>,
    pub service: Option<String>,
    pub platform: Option<String>,
    pub image: Option<String>,
    pub client_name: Option<String>,
    pub metrics: Option<Vec<WorkMetric>>,
    pub featured: Option<bool>,
}
