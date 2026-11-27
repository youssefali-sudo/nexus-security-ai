# NEXUS V3 Roadmap

## Phase A — Product and architecture (this branch)
- [x] Define defensive product scope.
- [x] Define workflow states and approval checkpoints.
- [x] Define evidence-centered data model.
- [x] Define trust boundaries and AI safety controls.
- [ ] Review API contract and test plan.

## Phase B — Backend foundation
- [ ] FastAPI service with health/readiness endpoints.
- [ ] PostgreSQL schema and versioned migrations.
- [ ] Typed request/response schemas.
- [ ] Structured logging with secret redaction.
- [ ] Automated unit and integration tests.

## Phase C — Identity and tenancy
- [ ] Authentication and secure sessions.
- [ ] Roles and object-level authorization.
- [ ] Tenant isolation tests.
- [ ] MFA policy for privileged accounts.
- [ ] Append-only audit events.

## Phase D — Defensive workflows
- [ ] Asset import and ownership review.
- [ ] Evidence ingestion and redaction.
- [ ] Deterministic log triage with explainable rules.
- [ ] Incident timeline and assignment.
- [ ] Human approval queue.

## Phase E — Intelligence and reporting
- [ ] Server-side AI provider adapter.
- [ ] Redacted-context summarization behind a feature flag.
- [ ] Human review and confidence labels.
- [ ] Evidence-linked PDF/JSON reports.
- [ ] Usage budgets and provider observability.

## Release gates
No production release until authorization, tenant isolation, secret redaction, audit integrity, backup restoration, and API tests pass. Features that interact with external systems remain out of scope.
