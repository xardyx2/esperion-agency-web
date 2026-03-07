#[cfg(test)]
mod auth_tests {
    use super::*;
    use axum::body::Body;
    use axum::http::Request;
    use tower::ServiceExt;
    use surrealdb::engine::local::Mem;
    use surrealdb::Surreal;

    #[tokio::test]
    async fn test_logout_blacklists_token() {
        let db = surrealdb::Surreal::init::<Mem>().await.unwrap();
        db.use_ns("test").use_db("test").await.unwrap();
        
        let db_state = DbState { db: db.clone() };
        let app = Router::new().route("/logout", post(logout)).with_state(db_state);
        
        // Test that logout blacklists tokens
        let refresh_token = "some_test_refresh_token";
        let request_payload = serde_json::json!({"refresh_token": refresh_token}).to_string();
        let response = app
            .oneshot(Request::builder()
                    .uri("/logout")
                    .method("POST")
                    .header("Content-Type", "application/json")
                    .body(Body::from(request_payload)))
            .await
            .unwrap();
            
        assert_eq!(response.status(), StatusCode::OK);
        
        // Verify the token was blacklisted
        let blacklisted_tokens: Vec<serde_json::Value> = db.query("SELECT * FROM token_blacklist WHERE token = $token")
            .bind(("token", refresh_token))
            .await.unwrap()
            .take(0).unwrap();
            
        assert_eq!(blacklisted_tokens.len(), 1);
    }

    #[tokio::test]
    async fn test_register_works_for_new_users() {
        use crate::handlers::auth::RegisterRequest;
        
        let db = surrealdb::Surreal::init::<Mem>().await.unwrap();
        db.use_ns("test").use_db("test").await.unwrap();
        
        let db_state = DbState { db: db.clone() };
        let app = Router::new().route("/register", post(register)).with_state(db_state);
        
        let register_payload = serde_json::json!({
            "email": "testuser@example.com",
            "password": "securepassword123",
            "full_name": "Test User",
            "username": "testuser"
        }).to_string();
        
        let response = app
            .oneshot(Request::builder()
                    .uri("/register")
                    .method("POST")
                    .header("Content-Type", "application/json")
                    .body(Body::from(register_payload)))
            .await
            .unwrap();
            
        assert_eq!(response.status(), StatusCode::OK);
    }
}