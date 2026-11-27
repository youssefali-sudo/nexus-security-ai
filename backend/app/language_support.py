"""Offline, heuristic language registry and defensive source review."""
from __future__ import annotations
import re
from dataclasses import dataclass

@dataclass(frozen=True)
class Language:
    id: str
    name: str
    extensions: tuple[str, ...]

LANGUAGES = (
    Language("go", "Go", (".go",)),
    Language("typescript", "TypeScript", (".ts", ".tsx")),
    Language("javascript", "JavaScript", (".js", ".jsx", ".mjs", ".cjs")),
    Language("python", "Python", (".py", ".pyw")),
    Language("rust", "Rust", (".rs",)),
    Language("java", "Java", (".java",)),
    Language("c", "C", (".c", ".h")),
    Language("cpp", "C++", (".cc", ".cpp", ".cxx", ".hpp", ".hh")),
    Language("csharp", "C#", (".cs",)),
    Language("php", "PHP", (".php",)),
    Language("ruby", "Ruby", (".rb",)),
    Language("swift", "Swift", (".swift",)),
    Language("kotlin", "Kotlin", (".kt", ".kts")),
    Language("dart", "Dart", (".dart",)),
    Language("lua", "Lua", (".lua",)),
    Language("r", "R", (".r",)),
    Language("perl", "Perl", (".pl", ".pm")),
    Language("scala", "Scala", (".scala", ".sc")),
    Language("bash", "Bash", (".sh", ".bash")),
    Language("powershell", "PowerShell", (".ps1", ".psm1")),
    Language("sql", "SQL", (".sql",)),
    Language("elixir", "Elixir", (".ex", ".exs")),
    Language("haskell", "Haskell", (".hs", ".lhs")),
    Language("zig", "Zig", (".zig",)),
)
_BY_ID = {item.id: item for item in LANGUAGES}
_BY_EXTENSION = {ext.lower(): item.id for item in LANGUAGES for ext in item.extensions}
_ALIASES = {"js":"javascript", "ts":"typescript", "py":"python", "golang":"go",
            "c++":"cpp", "c#":"csharp", "pwsh":"powershell", "shell":"bash"}

def list_languages():
    return [{"id": x.id, "name": x.name, "extensions": list(x.extensions)} for x in LANGUAGES]

def resolve_language(language, filename):
    if language:
        key = language.strip().lower()
        key = _ALIASES.get(key, key)
        return key if key in _BY_ID else None
    if filename and "." in filename:
        return _BY_EXTENSION.get(("." + filename.rsplit(".", 1)[-1]).lower())
    return None

_RULES = (
    ("NXS-SEC-001", "high", "Possible hard-coded credential; use a managed secret store.",
     re.compile(r"""(?im)\b(?:password|passwd|api[_-]?key|secret|access[_-]?token)\b\s*[:=]\s*["'][^"'\r\n]{6,}["']""")),
    ("NXS-SEC-002", "high", "TLS certificate verification may be disabled; review trust configuration.",
     re.compile(r"""(?i)(?:verify\s*=\s*False|InsecureSkipVerify\s*:\s*true|rejectUnauthorized\s*:\s*false|CURLOPT_SSL_VERIFYPEER\s*,\s*false)""")),
    ("NXS-SEC-003", "medium", "Dynamic evaluation is present; validate inputs and constrain operations.",
     re.compile(r"""(?i)\b(?:eval|exec|Invoke-Expression)\s*\(""")),
    ("NXS-SEC-004", "medium", "Shell execution pattern found; review argument handling and untrusted input boundaries.",
     re.compile(r"""(?i)(?:subprocess\.(?:run|Popen|call)\s*\([^\n]*shell\s*=\s*True|\bos\.system\s*\(|\bshell_exec\s*\(|\bchild_process\.(?:exec|execSync)\s*\(|\bInvoke-Expression\b)""")),
    ("NXS-SEC-005", "medium", "SQL may be assembled dynamically; prefer parameterized queries.",
     re.compile(r"""(?i)(?:execute|query)\s*\(\s*(?:f["']|["'][^\n]*\+|format\s*\()""")),
)

def review_source(code, language):
    findings = []
    for rule_id, severity, summary, pattern in _RULES:
        for match in pattern.finditer(code):
            findings.append({"rule_id": rule_id, "severity": severity,
                             "line": code.count("\n", 0, match.start()) + 1,
                             "summary": summary})
    findings.sort(key=lambda x: (x["line"], x["rule_id"]))
    return {"language": language, "lines_reviewed": len(code.splitlines()),
            "findings": findings, "finding_count": len(findings),
            "disclaimer": "Heuristic static indicators only. No code was executed or compiled. Findings require human review; absence of findings does not prove safety."}
