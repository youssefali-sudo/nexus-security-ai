# NEXUS SECURITY AI — Architecture

## Product direction
An independent defensive security operations workspace focused on asset inventory, event review, incident tracking, security-control status, and evidence-oriented reporting.

## Current v2 foundation
- `index.html`: accessible Arabic RTL application shell and view containers.
- `styles.css`: responsive dark navy / electric blue visual system.
- `app.js`: local state, asset register, incident register, checklist, keyword-based log triage, local knowledge helper, report export, and local audit trail.
- `assets/nexus-logo.svg`: project identity.
- Browser storage: localStorage only; no remote service is called by the application.

## Functional modules
1. Overview: summarizes the local workspace.
2. Asset inventory: records manually entered assets.
3. Log review: counts a few known text patterns in user-supplied samples.
4. Incident management: tracks a manually created issue through open, working, and closed states.
5. Security posture: tracks completion of a short defensive checklist.
6. Knowledge assistant: returns fixed educational guidance from a local knowledge map.
7. Reports: exports a local TXT summary or JSON snapshot.
8. Audit trail: records actions performed in the current local workspace.

## Planned production architecture
A future production deployment should separate the browser UI from a server API and persistent database. Suggested service boundaries:
- Identity and access: authentication, roles, session lifecycle, MFA policy.
- Asset service: ownership, classification, lifecycle, and change history.
- Evidence service: controlled ingestion, redaction, retention, and provenance.
- Event review: deterministic, documented defensive rules with explainable results.
- Incident workflow: assignment, status, timeline, and approvals.
- Reporting: generated summaries with source references and timestamps.
- Audit service: append-only event history with retention policy.

## Guardrails
- No autonomous exploitation or attack execution.
- No stealth, persistence, credential harvesting, or evasion workflows.
- No scanning of arbitrary external targets.
- Any future integrations must be read-only by default, explicitly authorized, scoped to owned environments, and auditable.
- AI-generated suggestions must be labeled, explainable, and require human review before operational changes.

## Release status
This is a local-only foundation, not a production security platform. The current keyword-based log review is not an IDS/SIEM replacement and the self-assessment checklist is not a certified audit.
