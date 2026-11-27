# NEXUS Backend — Local Development

Python 3.10+ is required.

```bash
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
pip install -r backend/requirements.txt
uvicorn backend.app.main:app --reload
```

Open `http://127.0.0.1:8000/docs`. Run tests with `pytest backend/tests`.

## Endpoints
- `GET /api/v1/health` — local service health.
- `GET /api/v1/languages` — registry of 24 supported languages.
- `POST /api/v1/reviews/logs` — basic heuristic review of caller-supplied log text.
- `POST /api/v1/analysis/defensive` — correlated event analysis with prioritized findings, severity and a 0–100 heuristic risk score.
- `POST /api/v1/reviews/source` — heuristic static review of caller-supplied source code.

Supported languages: Go, TypeScript, JavaScript, Python, Rust, Java, C, C++, C#, PHP, Ruby, Swift, Kotlin, Dart, Lua, R, Perl, Scala, Bash, PowerShell, SQL, Elixir, Haskell, and Zig.

Example request:
```json
{"language":"go","code":"package main\\nfunc main() {}"}
```
Provide a language id or a filename with a supported extension. The explicit language takes precedence.

The current engine uses conservative shared regular-expression indicators. It is not a compiler, full parser, dependency scanner, or language-specific semantic analyzer. It processes source in memory, does not execute or store it, and never echoes source in the response. Findings require human review; no findings do not prove safety.

## Limitations
This is a local-development scaffold, not production-ready. It has no authentication, authorization, database, tenant isolation, persistent evidence store, or rate limiting. Do not deploy publicly or submit sensitive logs or proprietary source code. Redact secrets and personal information first.


## Defensive event correlation (v3.2)
The `/api/v1/analysis/defensive` endpoint accepts a sanitized log sample (up to 50,000 characters) and returns aggregate event counts, categories, prioritized findings, recommended review actions, and a heuristic risk score. It recognizes authentication failures and successes, access denials, MFA disablement, privilege changes, endpoint alerts, service errors, and selected weak-configuration indicators.

The engine is deterministic and local-only: it does not execute log content, contact systems, persist input, or return raw log lines. The score is a triage aid, not a probability of compromise or a certified risk rating. Validate findings against the original authorized source and surrounding context.
