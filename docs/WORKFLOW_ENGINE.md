# Workflow Engine

## Purpose
Coordinate defensive review work without executing actions against systems. Workflows process user-supplied or explicitly connected read-only records.

## Workflow record
- `id`: opaque identifier
- `title`: short human-readable name
- `kind`: `log_review`, `asset_import_review`, `policy_review`, or `incident_summary`
- `status`: `draft`, `queued`, `running_read_only`, `review_required`, `completed`, `cancelled`, `failed`
- `created_by`, `created_at`, `updated_at`
- `budget_seconds`, `budget_tokens`
- `input_refs`: references to sanitized evidence records
- `result_refs`: references to generated summaries and observations

## State transitions
- Draft → Queued: owner confirms scope and inputs.
- Queued → Running: scheduler claims a bounded read-only job.
- Running → Review required: analysis has finished and awaits a person.
- Review required → Completed: reviewer accepts, edits, or dismisses each observation.
- Any non-terminal state → Cancelled by an authorized user.
- Running → Failed on an unexpected error; preserve diagnostic metadata without secrets.

## Approval policy
Approvals are required before publishing a report externally, changing incident ownership/severity, or exporting records that may contain sensitive data. Approval records include requester, reviewer, decision, reason, timestamp, and affected object IDs. The requester cannot approve their own high-impact request.

## Reliability
- Idempotency key on job creation.
- Bounded retries for transient storage errors only.
- Dead-letter state for repeatedly failing jobs.
- Per-workflow execution deadline and resource budget.
- Append-only audit events for transitions.
- Cancellation is cooperative and checked between processing stages.

## Safety boundary
Workers may parse, normalize, redact, classify, summarize, and compare supplied records. They must not execute commands, access arbitrary URLs, probe hosts, replay requests, or modify external systems.
