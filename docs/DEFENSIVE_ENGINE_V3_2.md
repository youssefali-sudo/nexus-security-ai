# NEXUS Defensive Event Correlation Engine — v3.2

## Purpose
Provide deterministic first-pass triage for sanitized, user-supplied log samples. This module is a defensive workflow aid, not an autonomous response system or a compromise detector.

## Event families
- Authentication failures and successes, including a success observed after failures in the supplied sequence.
- MFA disablement and privilege/role changes.
- Endpoint-protection alerts.
- Repeated access-denied events.
- Selected weak-configuration indicators.
- Repeated service-availability errors.

## Output
The engine returns aggregate event and category counts, prioritized findings, severity labels, review recommendations, and a heuristic risk score from 0 to 100. It never returns the original log lines. The score is a triage aid, not a probability or certified risk rating.

## API
`POST /api/v1/analysis/defensive`

Request: `{ "text": "...sanitized sample...", "source_label": "lab sample" }`

Maximum input: 50,000 characters. Unknown request fields are rejected. Empty input is rejected.

## Safety and limitations
The engine only inspects supplied text in memory. It does not execute content, connect to hosts, scan networks, persist input, block accounts, or take remediation actions. Pattern matches can be false positives or false negatives. Review the original authorized source and surrounding context before acting. Never submit credentials, tokens, personal data, or production secrets.

## Validation
Regression tests cover event correlation, critical finding ordering, empty/benign samples, unknown-field rejection, and raw-log non-disclosure.
