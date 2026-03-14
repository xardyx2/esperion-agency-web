# Esperion Backend

Rust backend API using Axum framework with SurrealDB database.

## Tech Stack

- **Rust** - Latest stable version
- **Axum** - Web framework
- **Tokio** - Async runtime
- **SurrealDB** - Multi-model database
- **utoipa** - OpenAPI documentation
- **jsonwebtoken** - JWT authentication
- **Argon2** - Password hashing
- **lettre** - Email services

## Directory Structure

```
backend/
├── src/
│   ├── main.rs              # Application entry point
│   ├── lib.rs               # Library exports
│   ├── api.rs               # API response types
│   ├── errors.rs            # Error definitions
│   ├── handlers/            # API handlers
│   │   ├── mod.rs
│   │   ├── auth.rs          # Authentication endpoints
│   │   ├── articles.rs      # Articles CRUD
│   │   ├── works.rs         # Works/Portfolio CRUD
│   │   ├── services.rs      # Services CRUD
│   │   ├── clients.rs       # Clients CRUD
│   │   ├── contact.rs       # Contact form
│   │   ├── media.rs         # Media library
│   │   ├── email.rs         # Email endpoints
│   │   ├── translation.rs   # Translation API
│   │   ├── seo_score.rs     # SEO scoring
│   │   ├── geo.rs           # Geolocation
│   │   └── health.rs        # Health check
│   ├── services/            # Business logic
│   │   ├── mod.rs
│   │   ├── email.rs         # Email service (6 providers)
│   │   ├── translation.rs   # Alibaba AI translation
│   │   └── image_processor.rs # WebP conversion
│   ├── models/              # Data models
│   │   ├── mod.rs
│   │   ├── user.rs          # User and JWT models
│   │   ├── article.rs
│   │   ├── work.rs
│   │   ├── service.rs
│   │   ├── client.rs
│   │   ├── contact.rs
│   │   ├── media.rs
│   │   ├── email.rs
│   │   └── recaptcha.rs
│   ├── middleware/          # Middleware
│   │   ├── mod.rs           # Auth middleware
│   │   └── cors.rs
│   └── db/                  # Database
│       ├── mod.rs           # Connection module
│       ├── schema.rs        # Schema definitions
│       └── migrations/      # SQL migrations
│           ├── 001_initial_schema.sql
│           ├── 001_initial_schema_down.sql
│           ├── 002_add_user_sessions.sql
│           └── 002_add_user_sessions_down.sql
├── tests/                   # Integration tests
│   └── email_service_test.rs
├── Cargo.toml               # Dependencies
└── .env.example             # Environment template
```

## Authentication System

### Token Strategy

- **Access Token**: 15-minute expiration (JWT)
- **Refresh Token**: 30-day expiration
- **Token Blacklisting**: Secure logout via SurrealDB

### JWT Claims

```rust
pub struct JwtClaims {
    pub sub: String,        // User ID
    pub email: String,
    pub role: String,
    pub exp: usize,         // Expiration timestamp
    pub iat: usize,         // Issued at
}
```

### Session Management

- Device tracking (device_id, IP, user agent)
- Session listing for users
- Force logout specific sessions
- Automatic session cleanup

### Auth Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | Login with email/password |
| POST | `/api/v1/auth/logout` | Logout (blacklist refresh token) |
| POST | `/api/v1/auth/refresh` | Refresh access token |
| GET | `/api/v1/auth/sessions` | List active sessions |
| DELETE | `/api/v1/auth/sessions/:id` | Force logout session |

### Password Hashing

Argon2 is used for secure password hashing:

```rust
fn hash_password(password: &str) -> Result<String, StatusCode> {
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    argon2.hash_password(password.as_bytes(), &salt)
        .map(|h| h.to_string())
}
```

## API Endpoints

### Articles

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/articles` | List articles (paginated, filtered) |
| GET | `/api/v1/articles/:slug` | Get article by slug |
| POST | `/api/v1/articles` | Create article (auth required) |
| PUT | `/api/v1/articles/:id` | Update article (auth required) |
| DELETE | `/api/v1/articles/:id` | Delete article (auth required) |

### Works (Portfolio)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/works` | List works |
| GET | `/api/v1/works/featured` | Featured works |
| GET | `/api/v1/works/:slug` | Get work by slug |
| POST | `/api/v1/works` | Create work (auth required) |
| PUT | `/api/v1/works/:id` | Update work (auth required) |
| DELETE | `/api/v1/works/:id` | Delete work (auth required) |

### Services

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/services` | List services |
| GET | `/api/v1/services/:slug` | Get service by slug |
| POST | `/api/v1/services` | Create service (auth required) |
| PUT | `/api/v1/services/:id` | Update service (auth required) |
| DELETE | `/api/v1/services/:id` | Delete service (auth required) |

### Clients

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/clients` | List clients |
| GET | `/api/v1/clients/stats` | Client statistics |
| GET | `/api/v1/clients/logos` | Client logos |
| POST | `/api/v1/clients` | Create client (auth required) |
| PUT | `/api/v1/clients/:id` | Update client (auth required) |
| DELETE | `/api/v1/clients/:id` | Delete client (auth required) |

### Contact

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/contact` | Submit contact form |
| GET | `/api/v1/contact/submissions` | List submissions (auth required) |
| GET | `/api/v1/contact/stats` | Submission statistics |

### Media Library

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/media` | List media files |
| GET | `/api/v1/media/:id` | Get media item |
| POST | `/api/v1/media/upload` | Upload media (multipart) |
| PUT | `/api/v1/media/:id` | Update metadata |
| DELETE | `/api/v1/media/:id` | Delete media |

### SEO

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/seo/calculate` | Calculate SEO score |
| GET | `/api/v1/seo/:article_id` | Get SEO score |
| GET | `/api/v1/seo/competitor/:keyword` | Competitor analysis |

### Translation

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/translate` | Translate text (Alibaba AI) |
| POST | `/api/v1/articles/:id/translate` | Translate article |

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/v1/openapi.json` | OpenAPI spec |
| GET | `/api/v1/docs` | Scalar API docs |

## Services

### Email Service

Multi-provider email abstraction supporting:

1. **SMTP** (lettre) - Built-in
2. **SendGrid** - API-based
3. **Mailgun** - API-based
4. **Amazon SES** - AWS SDK
5. **Postmark** - API-based
6. **SMTP2GO** - API-based

```rust
pub enum EmailProvider {
    Smtp(SmtpConfig),
    SendGrid(String),
    Mailgun(MailgunConfig),
    Ses(SesConfig),
    Postmark(String),
    Smtp2Go(String),
}

pub async fn send_email(
    provider: &EmailProvider,
    to: &str,
    subject: &str,
    body: &str,
) -> Result<(), EmailError>
```

### Image Processing Service

WebP conversion and thumbnail generation:

```rust
pub struct ImageProcessor;

impl ImageProcessor {
    pub async fn convert_to_webp(&self, path: &Path, quality: u8) -> Result<PathBuf>;
    pub async fn generate_thumbnails(&self, path: &Path) -> Result<Vec<Thumbnail>>;
}

pub struct Thumbnail {
    pub path: PathBuf,
    pub size: (u32, u32),
    pub width: u32,
    pub height: u32,
}

// Sizes: 150x150, 300x300, 600x600, 1200x1200
```

### Translation Service

Alibaba AI translation integration:

```rust
pub struct TranslationService {
    api_key: String,
}

impl TranslationService {
    pub async fn translate(
        &self,
        text: &str,
        source_lang: &str,
        target_lang: &str,
    ) -> Result<String, TranslationError>
}
```

## Database

### SurrealDB Schema

The database uses strict schema mode with defined tables:

- `users` - User accounts
- `articles` - Blog articles (with i18n fields)
- `works` - Portfolio projects
- `services` - Service offerings
- `clients` - Client information
- `contact_submissions` - Contact form submissions
- `media_library` - Media files
- `sessions` - User sessions
- `activity_logs` - Audit trail
- `token_blacklist` - Revoked tokens
- `translation_cache` - Translation cache
- `analytics_events` - Custom analytics

### Migrations

```bash
# Apply migrations
cargo run -- migrate

# Check migration status
cargo run -- migrate-status

# Rollback to version
cargo run -- migrate-rollback -v 1.0.0
```

Migration files are in `src/db/migrations/`:
- `001_initial_schema.sql` - Core tables
- `002_add_user_sessions.sql` - Session management

## Development

### Setup

```bash
# Build
cargo build

# Run in development
cargo run

# Run with watch mode
cargo watch -x run
```

Backend runs on port 8080.

### Docker Development

From the repository root:

```bash
docker compose up --build -d
```

In the local Docker stack, the backend listens on container port `8080` and is exposed on host port `8081`.
The development container uses `cargo watch --poll -x run` so host-side source edits are detected reliably through Docker bind mounts.

### Environment Variables

```env
# Server
PORT=8080
HOST=0.0.0.0

# Database (host-side `cargo run` against Docker Compose DB)
DB_HOST=127.0.0.1
DB_PORT=8002
DB_USER=root
DB_PASS=root
DB_NS=esperion
DB_DB=esperion_db

# JWT
JWT_SECRET=your-secret-key-change-in-production

# Email (SMTP)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password

# reCAPTCHA
RECAPTCHA_SECRET_KEY=your-recaptcha-secret

# Alibaba AI
ALIBABA_API_KEY=your-alibaba-api-key
```

### Testing

```bash
# Run all tests
cargo test

# Run specific test
cargo test auth_tests

# Run with output
cargo test -- --nocapture
```

## OpenAPI Documentation

Access the OpenAPI specification:

- **OpenAPI JSON**: `http://localhost:8080/api/v1/openapi.json`

When the backend runs in Docker Compose, use `http://localhost:8081/api/v1/openapi.json` from the host.

You can view this spec using any OpenAPI viewer like:
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [Scalar](https://github.com/scalar/scalar)
- [Stoplight Elements](https://elements.stoplight.io/)

The spec includes all endpoints with:
- Request/response schemas
- Authentication requirements
- Tags and descriptions

## Security

### Headers

- CORS configured for frontend origin
- CSP headers (configurable)
- HSTS enabled in production

### Rate Limiting

Rate limiting is planned for Phase 2.

### Audit Logging

All write operations are logged to `activity_logs`:

```sql
CREATE activity_logs SET 
    user_id = $user_id,
    action = 'CREATE_ARTICLE',
    entity = 'ARTICLE',
    entity_id = $article_id,
    details = { title: $title }
```

## License

Copyright (c) 2024 Esperion Digital Agency
