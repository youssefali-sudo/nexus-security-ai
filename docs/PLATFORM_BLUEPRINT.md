# NEXUS SECURITY AI — V3 Platform Blueprint

## Product goal
NEXUS is a defensive security operations workspace. It borrows general product patterns—task orchestration, linked evidence, approval checkpoints, asset relationships, budgets, and auditability—without copying ARTEX code or implementing offensive execution.

## Core workspaces
1. **Command Center** — open incidents, asset posture, review queue, recent decisions.
2. **Asset Graph** — owned systems and their documented relationships; manually entered or imported from approved inventory exports.
3. **Review Workflows** — repeatable, read-only review jobs for supplied logs, configuration snapshots, and policy documents.
4. **Evidence Ledger** — source, timestamp, hash, redaction status, reviewer, and links to related assets/incidents.
5. **Incident Room** — timeline, owner, severity, tasks, decisions, and closure notes.
6. **Approval Desk** — human review for sensitive administrative changes and data exports.
7. **AI Copilot** — explain evidence and draft remediation guidance; suggestions remain untrusted until reviewed.
8. **Reports** — exportable summaries with evidence references and clear confidence labels.

## Workflow model
A workflow is a finite state machine:
`draft → queued → running_read_only → review_required → completed`
It may also move to `cancelled` or `failed`. It never invokes shells, scanners, exploit modules, arbitrary network requests, or external target actions. Each step consumes a bounded time/token budget and writes an audit event.

## Evidence-first design
Every observation has provenance: who supplied it, when, from which source, how it was normalized, and whether sensitive values were redacted. A finding cannot be marked verified solely because an AI model suggested it. Verification requires a human reviewer and a cited source excerpt or approved record.

## AI provider strategy
Provider adapters are isolated behind a server-side interface. API keys are never placed in browser code. Provider failover is allowed only for text-generation requests; no provider can trigger operational actions. Every AI response stores provider/model metadata and a human-review state.

## Deployment stages
- V3-A: contracts, data model, security boundaries, and tests.
- V3-B: API and database migrations.
- V3-C: authentication, roles, MFA-ready session policy, and audit events.
- V3-D: evidence ingestion, redaction, and deterministic log review.
- V3-E: workflow queue, approvals, incident room, and reports.
- V3-F: AI explanations behind a feature flag, with human review.

## Non-goals
Autonomous penetration testing, exploitation, credential collection, stealth, persistence, evasion, arbitrary target scanning, and replaying captured traffic.
