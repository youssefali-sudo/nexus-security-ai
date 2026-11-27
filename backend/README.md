# NEXUS Backend — Local Development

## Requirements
Python 3.10 or newer.

## Run locally
From the repository root:

```bash
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.app.main:app --reload
```

Open `http://127.0.0.1:8000/docs` for the interactive API documentation.

## Included endpoints
- `GET /api/v1/health` — local service health.
- `POST /api/v1/reviews/logs` — deterministic keyword-based review of text supplied in the request.

## Important limitations
This is an early local-development scaffold, not a production service. It has no authentication, authorization, database, tenant isolation, persistent evidence store, or rate limiting. Do not deploy it publicly or submit real sensitive logs. Remove secrets and personal information from sample text before testing.

The log review is heuristic triage only. It does not establish that an incident occurred and does not connect to any external system.
