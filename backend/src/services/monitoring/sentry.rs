//! Sentry error tracking integration
use sentry::ClientInitGuard;

pub struct SentryConfig {
    pub dsn: String,
    pub environment: String,
    pub release: String,
}

pub fn init_sentry(config: SentryConfig) -> ClientInitGuard {
    sentry::init((
        config.dsn,
        sentry::ClientOptions {
            release: Some(config.release.into()),
            environment: Some(config.environment.into()),
            traces_sample_rate: 0.1,
            ..Default::default()
        },
    ))
}

pub fn capture_error(error: &dyn std::error::Error) {
    sentry::capture_error(error);
}

pub fn capture_message(message: &str, level: sentry::Level) {
    sentry::capture_message(message, level);
}
