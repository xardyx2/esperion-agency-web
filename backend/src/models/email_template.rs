/**
 * Email Template Model
 * 
 * Manages HTML email templates with variable substitution
 */

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use surrealdb::Surreal;
use surrealdb::engine::remote::ws::Client;
use surrealdb::types::RecordId;

/// Email template record
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EmailTemplateRecord {
    pub id: Option<RecordId>,
    pub name: String,
    pub slug: String,
    pub subject: String,
    pub body_plain: String,
    pub body_html: Option<String>,
    pub variables: Vec<String>,
    pub category: String,
    pub is_active: bool,
    pub created_at: Option<DateTime<Utc>>,
    pub updated_at: Option<DateTime<Utc>>,
}

impl EmailTemplateRecord {
    /// Create a new email template
    pub fn new(
        name: String,
        slug: String,
        subject: String,
        body_plain: String,
        category: String,
    ) -> Self {
        Self {
            id: None,
            name,
            slug,
            subject,
            body_plain,
            body_html: None,
            variables: Vec::new(),
            category,
            is_active: true,
            created_at: None,
            updated_at: None,
        }
    }

    /// Set HTML body
    pub fn with_html_body(mut self, body_html: String) -> Self {
        self.body_html = Some(body_html);
        self
    }

    /// Set variables
    pub fn with_variables(mut self, variables: Vec<String>) -> Self {
        self.variables = variables;
        self
    }

    /// Render template with variables
    pub fn render(&self, variables: &serde_json::Value) -> Result<RenderedEmail, TemplateError> {
        let subject = self.replace_variables(&self.subject, variables)?;
        let body_plain = self.replace_variables(&self.body_plain, variables)?;
        let body_html = self
            .body_html
            .as_ref()
            .map(|html| self.replace_variables(html, variables))
            .transpose()?;

        Ok(RenderedEmail {
            subject,
            body_plain,
            body_html,
        })
    }

    /// Replace variables in text
    fn replace_variables(
        &self,
        text: &str,
        variables: &serde_json::Value,
    ) -> Result<String, TemplateError> {
        let mut result = text.to_string();

        // Replace {{variable}} patterns
        for var in &self.variables {
            if let Some(value) = variables.get(var) {
                let value_str = value.as_str().unwrap_or_else(|| value.to_string().as_str());
                result = result.replace(&format!("{{{{{}}}}}", var), value_str);
            }
        }

        Ok(result)
    }

    /// Save template to database
    pub async fn save(&self, db: &Surreal<Client>) -> Result<Self, surrealdb::Error> {
        let mut result = db
            .query(
                r#"UPSERT email_templates CONTENT {
                    name: $name,
                    slug: $slug,
                    subject: $subject,
                    body_plain: $body_plain,
                    body_html: $body_html,
                    variables: $variables,
                    category: $category,
                    is_active: $is_active,
                    updated_at: time::now()
                }"#,
            )
            .bind(("name", self.name.clone()))
            .bind(("slug", self.slug.clone()))
            .bind(("subject", self.subject.clone()))
            .bind(("body_plain", self.body_plain.clone()))
            .bind(("body_html", self.body_html.clone()))
            .bind(("variables", self.variables.clone()))
            .bind(("category", self.category.clone()))
            .bind(("is_active", self.is_active))
            .await?;

        let result: Option<Self> = result.take(0)?;
        result.ok_or_else(|| surrealdb::Error::thrown("Failed to save email template"))
    }

    /// Get template by slug
    pub async fn get_by_slug(
        db: &Surreal<Client>,
        slug: &str,
    ) -> Result<Option<Self>, surrealdb::Error> {
        let mut result = db
            .query("SELECT * FROM email_templates WHERE slug = $slug AND is_active = true LIMIT 1")
            .bind(("slug", slug.to_string()))
            .await?;

        let template: Option<Self> = result.take(0)?;
        Ok(template)
    }

    /// Get all templates
    pub async fn get_all(db: &Surreal<Client>) -> Result<Vec<Self>, surrealdb::Error> {
        let mut result = db
            .query("SELECT * FROM email_templates ORDER BY category, name")
            .await?;

        let templates: Vec<Self> = result.take(0)?;
        Ok(templates)
    }

    /// Get templates by category
    pub async fn get_by_category(
        db: &Surreal<Client>,
        category: &str,
    ) -> Result<Vec<Self>, surrealdb::Error> {
        let mut result = db
            .query("SELECT * FROM email_templates WHERE category = $category ORDER BY name")
            .bind(("category", category.to_string()))
            .await?;

        let templates: Vec<Self> = result.take(0)?;
        Ok(templates)
    }

    /// Update template
    pub async fn update(&self, db: &Surreal<Client>) -> Result<Self, surrealdb::Error> {
        if let Some(id) = &self.id {
            let mut result = db
                .query(
                    r#"UPDATE email_templates SET
                        name = $name,
                        slug = $slug,
                        subject = $subject,
                        body_plain = $body_plain,
                        body_html = $body_html,
                        variables = $variables,
                        category = $category,
                        is_active = $is_active,
                        updated_at = time::now()
                    WHERE id = $id"#,
                )
                .bind(("id", id.clone()))
                .bind(("name", self.name.clone()))
                .bind(("slug", self.slug.clone()))
                .bind(("subject", self.subject.clone()))
                .bind(("body_plain", self.body_plain.clone()))
                .bind(("body_html", self.body_html.clone()))
                .bind(("variables", self.variables.clone()))
                .bind(("category", self.category.clone()))
                .bind(("is_active", self.is_active))
                .await?;

            let result: Option<Self> = result.take(0)?;
            result.ok_or_else(|| surrealdb::Error::thrown("Failed to update email template"))
        } else {
            self.save(db).await
        }
    }

    /// Delete template
    pub async fn delete(db: &Surreal<Client>, id: &RecordId) -> Result<(), surrealdb::Error> {
        db.query("DELETE email_templates WHERE id = $id")
            .bind(("id", id.clone()))
            .await?;
        Ok(())
    }
}

/// Rendered email with substituted variables
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RenderedEmail {
    pub subject: String,
    pub body_plain: String,
    pub body_html: Option<String>,
}

/// Template-related errors
#[derive(Debug, Clone)]
pub enum TemplateError {
    VariableNotFound(String),
    RenderError(String),
}

impl std::fmt::Display for TemplateError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            TemplateError::VariableNotFound(var) => {
                write!(f, "Template variable not found: {}", var)
            }
            TemplateError::RenderError(msg) => write!(f, "Template render error: {}", msg),
        }
    }
}

impl std::error::Error for TemplateError {}
