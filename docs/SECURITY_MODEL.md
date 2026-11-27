# NEXUS Security Model

## Trust boundaries
- Browser: untrusted client; no provider keys or privileged credentials.
- API: validates identity, tenant ownership, permissions, schemas, rate limits, and request size.
- Database: private network access; least-privilege service accounts.
- Evidence storage: encrypted, access-controlled, retention-managed.
- AI provider: receives only minimized and redacted context; output is untrusted data.

## Required controls
- Server-side authentication and authorization on every protected route.
- Secure, HttpOnly, SameSite cookies; CSRF protection for cookie-authenticated mutations.
- MFA support for privileged roles.
- Rate limiting and request-size limits.
- Strict CORS allowlist; security headers; TLS in production.
- Schema validation and parameterized database queries.
- Secrets supplied through deployment secret management, never committed or exposed to frontend bundles.
- Redaction of passwords, API keys, bearer tokens, cookies, and personal data before evidence storage or AI processing.
- Append-only audit trail for privileged actions and approvals.
- Backups with encryption and tested restoration procedures.

## AI-specific controls
- Treat imported documents, logs, and model outputs as untrusted data.
- Never let text inside evidence alter system policy or permissions.
- AI can draft summaries and remediation suggestions only.
- Human approval is mandatory before a recommendation becomes a verified finding or an external report.
- Keep provider/model, prompt template version, timestamp, and reviewer decision for traceability.

## Safe operating mode
NEXUS is read-only by default. It does not scan arbitrary targets, execute shell commands, exploit vulnerabilities, replay traffic, collect credentials, or perform stealth/evasion actions.
