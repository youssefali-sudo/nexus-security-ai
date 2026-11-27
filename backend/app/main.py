"""NEXUS defensive API starter; local-only, caller-supplied text review."""
from __future__ import annotations
import re
from typing import Literal
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field, ConfigDict
from backend.app.language_support import list_languages, resolve_language, review_source

app = FastAPI(title="NEXUS SECURITY AI API", version="3.1.0",
              description="Local defensive review API. No target scanning or command execution.")

class LogReviewRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    text: str = Field(min_length=1, max_length=50_000)
    source_label: str = Field(default="user-supplied sample", max_length=120)

class SourceReviewRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    code: str = Field(min_length=1, max_length=100_000)
    language: str | None = Field(default=None, max_length=40)
    filename: str | None = Field(default=None, max_length=180)

class Observation(BaseModel):
    category: Literal["authentication", "service", "configuration", "general"]
    severity: Literal["info", "low", "medium", "high"]
    summary: str
    count: int

class LogReviewResponse(BaseModel):
    source_label: str
    lines_reviewed: int
    observations: list[Observation]
    disclaimer: str

RULES = [
    ("authentication", "high", re.compile(r"\b(authentication failed|invalid password|login denied)\b", re.I), "Repeated authentication-failure wording was found."),
    ("service", "medium", re.compile(r"\b(service unavailable|connection refused|timeout)\b", re.I), "Service availability wording was found."),
    ("configuration", "low", re.compile(r"\b(debug mode enabled|default configuration)\b", re.I), "A configuration-review phrase was found."),
]

@app.get("/api/v1/health")
def health():
    return {"status": "ok", "version": "3.1.0", "mode": "local-defensive-review"}

@app.get("/api/v1/languages")
def languages():
    return {"count": len(list_languages()), "languages": list_languages()}

@app.post("/api/v1/reviews/source")
def review_source_code(payload: SourceReviewRequest):
    language = resolve_language(payload.language, payload.filename)
    if language is None:
        raise HTTPException(status_code=422, detail="Unsupported or missing language. Supply a supported language id or filename extension.")
    # Inspect in memory only. Never execute, store, or echo caller source.
    return review_source(payload.code, language)

@app.post("/api/v1/reviews/logs", response_model=LogReviewResponse)
def review_logs(payload: LogReviewRequest):
    lines = payload.text.splitlines()
    observations = []
    for category, severity, pattern, summary in RULES:
        count = sum(1 for line in lines if pattern.search(line))
        if count:
            observations.append(Observation(category=category, severity=severity, summary=summary, count=count))
    return LogReviewResponse(source_label=payload.source_label, lines_reviewed=len(lines),
        observations=observations,
        disclaimer="Heuristic indicators only. Results are not proof of compromise; review the authorized source and context.")

@app.get("/")
def root():
    return {"name": "NEXUS SECURITY AI", "docs": "/docs", "health": "/api/v1/health"}
