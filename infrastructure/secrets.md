# CI/CD Secrets Management

## Required GitHub Secrets

The following secrets need to be configured in your GitHub repository Settings > Secrets and variables > Actions:

### Required Secrets
- `DISCORD_WEBHOOK` - Webhook URL for deployment notifications
- `PRODUCTION_JWT_SECRET` - JWT secret for production environment
- `DB_ROOT_USER` - Database root user
- `DB_ROOT_PASSWORD` - Database root password
- `DB_USER` - Database user for application
- `DB_PASSWORD` - Database password for application
- `SMTP_HOST` - SMTP server host
- `SMTP_PORT` - SMTP server port
- `SMTP_USER` - SMTP username
- `SMTP_PASS` - SMTP password
- `CONTACT_EMAIL` - Default contact email address

### Optional Secrets
- `LHCI_GITHUB_APP_TOKEN` - Token for Lighthouse CI GitHub App
- `STAGING_TAG` - Specific tag to deploy to staging (defaults to 'develop')

## Environment-Specific Secrets

### Staging Environment
The staging environment uses placeholder values (or actual staging-specific secrets similar to production).

### Production Environment
The production environment uses the secure values stored in GitHub secrets.

## Secret Security Best Practices

1. **Never Hard-code Secrets**: All secrets must come from GitHub Actions secrets, never be embedded in code.

2. **Minimum Permissions**: Each job should only have access to the secrets it actually needs.

3. **Encrypted Storage**: All secrets are encrypted at rest in GitHub's secure storage.

4. **Regular Rotation**: Secrets should be rotated periodically based on security policies.

5. **Principle of Least Privilege**: Only provide the minimum necessary permissions to each secret.

6. **Environment Isolation**: Don't reuse the same secrets between staging and production environments.

## Access Control

- Secrets are only accessible during GitHub Actions job execution
- Secrets are masked in console output automatically
- Secrets are not available in fork PRs for security reasons
- Access is restricted based on repository permissions

## Security Checks

The workflow includes various security measures:
- Secrets are not echoed to logs
- Docker registry authentication happens securely
- Environment variables are properly scoped to jobs
- Rollback mechanisms ensure safe recovery from failed deployments