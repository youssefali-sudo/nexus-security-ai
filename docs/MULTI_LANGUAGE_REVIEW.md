# Multi-language Defensive Review

NEXUS provides a read-only language registry and heuristic static source review.

Supported: Go, TypeScript, JavaScript, Python, Rust, Java, C, C++, C#, PHP, Ruby, Swift, Kotlin, Dart, Lua, R, Perl, Scala, Bash, PowerShell, SQL, Elixir, Haskell, and Zig.

API:
- `GET /api/v1/languages`
- `POST /api/v1/reviews/source`

Request: `code` (1–100,000 chars), optional `language` id, or optional `filename` for extension detection. The response includes rule IDs, severity, line numbers, remediation-oriented summaries, and a disclaimer; it never returns submitted source.

The service does not compile or execute code, invoke shell commands, scan targets, fetch dependencies, or contact external services. The shared regex checks are first-pass triage only, not complete language-specific analysis and not proof that code is safe. Language-specific parsers and dependency analysis are future work.
