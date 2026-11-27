# Security Notes

NEXUS SECURITY AI is a defensive workspace prototype.

## Current trust boundaries
- The current application runs entirely in the user's browser.
- Workspace records are stored in browser localStorage and are not encrypted by this prototype.
- Do not enter passwords, API keys, session cookies, personal records, or confidential production logs.
- Log analysis is a small keyword-based helper. It does not establish malicious activity or confirm an incident.
- Exported TXT and JSON files may contain the records entered by the user. Store and share them carefully.

## Authorized use
Use the workspace only to organize and review assets and records you own or are explicitly authorized to manage. This project does not provide exploit execution, credential collection, stealth, persistence, or autonomous attack features.

## Before production use
A production release must add authenticated server-side storage, role-based access control, secure session handling, input validation, rate limits, encrypted transport, audit retention controls, backups, dependency review, and a documented incident-response process. API secrets must remain server-side and must never be embedded in browser JavaScript.

## Reporting a security concern
Do not publish credentials or sensitive logs in an issue. Describe the affected feature at a high level and remove personal or confidential data.
