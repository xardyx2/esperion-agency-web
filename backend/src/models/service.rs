/**
 * Service Model
 *
 * Represents services offered by the agency
 * Used for showcasing services on the website
 */
use serde::{Deserialize, Serialize};
use surrealdb::sql::Thing;

/// FAQ item for a service
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FaqItem {
    pub question: String,
    pub answer: String,
    pub order: i32,
}

/// Pricing table row
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PricingRow {
    pub feature: String,
    pub basic: String,
    pub standard: String,
    pub premium: String,
}

/// Pricing table for a service
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PricingTable {
    pub currency: String,
    pub rows: Vec<PricingRow>,
}

/// Service record
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Service {
    pub id: Option<Thing>,
    pub title: String,
    pub slug: String,
    pub description: String,
    pub icon: Option<String>,
    pub featured: bool,
    pub display_order: i32,
    pub pricing_table: Option<PricingTable>,
    pub faq: Option<Vec<FaqItem>>,
    pub created_at: Option<String>,
}

impl Service {
    /// Create a new service record
    pub fn new(title: String, slug: String, description: String) -> Self {
        Self {
            id: None,
            title,
            slug,
            description,
            icon: None,
            featured: false,
            display_order: 0,
            pricing_table: None,
            faq: None,
            created_at: Some(chrono::Utc::now().to_rfc3339()),
        }
    }

    /// Set icon
    pub fn with_icon(mut self, icon: String) -> Self {
        self.icon = Some(icon);
        self
    }

    /// Set featured status
    pub fn with_featured(mut self, featured: bool) -> Self {
        self.featured = featured;
        self
    }

    /// Set display order
    pub fn with_display_order(mut self, order: i32) -> Self {
        self.display_order = order;
        self
    }

    /// Set pricing table
    pub fn with_pricing_table(mut self, pricing_table: PricingTable) -> Self {
        self.pricing_table = Some(pricing_table);
        self
    }

    /// Set FAQ
    pub fn with_faq(mut self, faq: Vec<FaqItem>) -> Self {
        self.faq = Some(faq);
        self
    }
}

/// Service filter options
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct ServiceFilter {
    pub featured: Option<bool>,
    pub limit: Option<u32>,
    pub offset: Option<u32>,
}

impl ServiceFilter {
    /// Build WHERE clause for SurrealDB query
    pub fn to_where_clause(&self) -> String {
        let mut conditions = Vec::new();

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

/// Create service request
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateServiceRequest {
    pub title: String,
    pub slug: String,
    pub description: String,
    pub icon: Option<String>,
    pub featured: Option<bool>,
    pub display_order: Option<i32>,
    pub pricing_table: Option<PricingTable>,
    pub faq: Option<Vec<FaqItem>>,
}

/// Update service request
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct UpdateServiceRequest {
    pub title: Option<String>,
    pub description: Option<String>,
    pub icon: Option<String>,
    pub featured: Option<bool>,
    pub display_order: Option<i32>,
    pub pricing_table: Option<PricingTable>,
    pub faq: Option<Vec<FaqItem>>,
}

/// Default services for seeding
pub const DEFAULT_SERVICES: &[(&str, &str, &str)] = &[
    (
        "Web Development",
        "web-development",
        "Custom web applications and websites built with modern technologies",
    ),
    (
        "Mobile App Development",
        "mobile-app-development",
        "Native and cross-platform mobile applications",
    ),
    (
        "UI/UX Design",
        "ui-ux-design",
        "User-centered design for digital products",
    ),
    (
        "Digital Marketing",
        "digital-marketing",
        "SEO, SEM, and social media marketing strategies",
    ),
    (
        "E-Commerce Solutions",
        "ecommerce-solutions",
        "Complete online store setup and optimization",
    ),
    (
        "Consulting",
        "consulting",
        "Technology and digital transformation consulting",
    ),
];
