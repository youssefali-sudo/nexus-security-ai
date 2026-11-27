# NEXUS Data Model

The production database should use PostgreSQL with migrations. Store timestamps in UTC and use UUIDs for externally visible identifiers.

## Main entities
- **users**: identity reference, display name, status, created_at.
- **roles / user_roles**: explicit permissions such as viewer, analyst, incident_manager, approver, administrator.
- **assets**: name, type, environment, owner, criticality, lifecycle state.
- **asset_relationships**: source_asset_id, target_asset_id, relationship_type, provenance_ref.
- **evidence_records**: source_type, source_label, collected_at, content_hash, storage_ref, redaction_state, submitted_by.
- **observations**: category, severity, confidence, summary, evidence_record_id, asset_id, review_state.
- **incidents**: title, description, severity, status, owner_id, created_at, closed_at.
- **incident_events**: incident_id, actor_id, event_type, details, occurred_at.
- **workflows**: kind, status, budgets, requester_id, timestamps.
- **workflow_steps**: workflow_id, step_key, status, input_refs, output_refs, started_at, finished_at.
- **approvals**: object_type, object_id, requested_by, reviewed_by, decision, reason, decided_at.
- **audit_events**: actor, action, object reference, timestamp, request_id, safe metadata.

## Integrity rules
1. An observation must reference its evidence source or be explicitly labeled as an unverified manual note.
2. A verified observation requires a reviewer, a review timestamp, and at least one evidence reference.
3. Asset relationships must be tenant-scoped and cycle-safe where hierarchy semantics require it.
4. Audit events are append-only to application roles.
5. Secrets, passwords, session tokens, and raw API keys must never be stored in evidence text.
6. Deletion of an asset must preserve historical incident/evidence references through archival or tombstoning.

## Retention and privacy
Apply configurable retention by evidence class. Redact personal data and authentication material before indexing. Encrypt storage and backups. Keep encryption keys outside the database. Provide export and deletion workflows consistent with the operator's retention policy.
