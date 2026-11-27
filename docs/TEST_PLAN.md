# NEXUS V3 Test Plan

## API correctness
- Validate all request and response schemas.
- Reject unknown fields on write endpoints.
- Verify pagination, sorting, and filtering are deterministic.
- Verify idempotency for workflow creation.

## Authorization
- Unauthenticated requests cannot access protected data.
- Users cannot read or mutate another tenant's records.
- Viewers cannot approve or administer.
- Requesters cannot self-approve protected actions.
- Revoked sessions lose access immediately.

## Evidence handling
- Secret-like values are redacted before persistence and AI processing.
- Oversized payloads are rejected safely.
- Evidence provenance is preserved through exports.
- Verified observations require evidence and reviewer metadata.

## Workflow reliability
- Invalid state transitions are rejected.
- Budgets and deadlines are enforced.
- Cancellation is honored between steps.
- Failed jobs preserve safe diagnostics and can be retried idempotently.

## Audit and operations
- Privileged actions create audit events.
- Application roles cannot update or delete audit history.
- Logs never include passwords, cookies, tokens, or provider keys.
- Backup restoration is exercised before production releases.

## Frontend
- Arabic RTL and keyboard navigation.
- Responsive layouts at mobile, tablet, and desktop widths.
- Clear empty, loading, error, and permission-denied states.
- All AI-generated content is labeled as a suggestion until reviewed.
