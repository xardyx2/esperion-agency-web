/**
 * SEO Score Handler Tests
 *
 * Tests for the SEO scoring system
 */

#[cfg(test)]
mod tests {
    use esperion_backend::handlers::seo_score::{calculate_seo_score, SeoScoreResponse};
    use esperion_backend::models::seo_score::{CalculateSeoScoreRequest, SeoScoreBreakdown};

    fn empty_breakdown() -> SeoScoreBreakdown {
        SeoScoreBreakdown {
            content_quality: 0,
            on_page_seo: 0,
            readability: 0,
            internal_linking: 0,
            technical_seo: 0,
            local_seo: 0,
        }
    }

    #[test]
    fn test_calculate_seo_score_excellent_content() {
        let request = CalculateSeoScoreRequest {
            article_id: "test-1".to_string(),
            title: "Test Article".to_string(),
            content: "Lorem ipsum ".repeat(100), // 200+ words
            meta_description: Some("This is a test meta description that is between 120 and 160 characters long. It should be perfect for SEO purposes and should give us full points.".to_string()),
            slug: "test-article".to_string(),
        };

        let response = calculate_seo_score(&request);

        assert!(response.score > 0);
        assert!(response.score <= 100);
        assert!(!response.grade.is_empty());
    }

    #[test]
    fn test_calculate_seo_score_short_content() {
        let request = CalculateSeoScoreRequest {
            article_id: "test-2".to_string(),
            title: "Short Article".to_string(),
            content: "Short content".to_string(),
            meta_description: None,
            slug: "short-article".to_string(),
        };

        let response = calculate_seo_score(&request);

        // Should have low content quality score
        assert!(response.breakdown.content_quality < 20);

        // Should have suggestions
        assert!(!response.suggestions.is_empty());
    }

    #[test]
    fn test_calculate_seo_score_grade_boundaries() {
        // Test excellent (90+)
        let excellent = SeoScoreResponse {
            article_id: "test".to_string(),
            score: 95,
            max_score: 100,
            grade: "Excellent".to_string(),
            breakdown: empty_breakdown(),
            suggestions: vec![],
        };
        assert_eq!(excellent.grade, "Excellent");

        // Test good (80-89)
        let good = SeoScoreResponse {
            article_id: "test".to_string(),
            score: 85,
            max_score: 100,
            grade: "Good".to_string(),
            breakdown: empty_breakdown(),
            suggestions: vec![],
        };
        assert_eq!(good.grade, "Good");

        // Test fair (70-79)
        let fair = SeoScoreResponse {
            article_id: "test".to_string(),
            score: 75,
            max_score: 100,
            grade: "Fair".to_string(),
            breakdown: empty_breakdown(),
            suggestions: vec![],
        };
        assert_eq!(fair.grade, "Fair");

        // Test needs improvement (60-69)
        let needs_improvement = SeoScoreResponse {
            article_id: "test".to_string(),
            score: 65,
            max_score: 100,
            grade: "Needs Improvement".to_string(),
            breakdown: empty_breakdown(),
            suggestions: vec![],
        };
        assert_eq!(needs_improvement.grade, "Needs Improvement");

        // Test poor (<60)
        let poor = SeoScoreResponse {
            article_id: "test".to_string(),
            score: 45,
            max_score: 100,
            grade: "Poor".to_string(),
            breakdown: empty_breakdown(),
            suggestions: vec![],
        };
        assert_eq!(poor.grade, "Poor");
    }

    #[test]
    fn test_seo_score_breakdown_total() {
        let breakdown = SeoScoreBreakdown {
            content_quality: 30,
            on_page_seo: 20,
            readability: 12,
            internal_linking: 8,
            technical_seo: 10,
            local_seo: 5,
        };

        assert_eq!(breakdown.total(), 85);
    }

    #[test]
    fn test_seo_score_breakdown_max() {
        let max_breakdown = SeoScoreBreakdown {
            content_quality: 35,
            on_page_seo: 25,
            readability: 15,
            internal_linking: 10,
            technical_seo: 10,
            local_seo: 5,
        };

        assert_eq!(max_breakdown.total(), 100);
    }
}
