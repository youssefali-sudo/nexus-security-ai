"""NEXUS defensive API starter.

This local-development scaffold only analyzes text explicitly submitted by the caller.
It does not connect to hosts, execute commands, or perform network probing.
Do not expose it publicly until authentication, authorization, persistence, and rate
limits have been implemented and reviewed.
"""
from __future__ import annotations

import re
from typing import Literal

from fastapi import FastAPI
from pydantic import BaseModel, Field, ConfigDict

app = FastAPI(
    title="NEXUS SECURITY AI API",
    version="3.0.0",
    description="Local defensive review API. No target scanning or command execution.",
)

class LogReviewRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    text: str = Field(min_length=1, max_length=50_000)
    source_label: str = Field(default="user-supplied sample", max_length=120)

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

# Conservative patterns for triaging supplied text. These are indicators only,
# not proof that an incident occurred.
RULES = [
    ("authentication", "high", re.compile(r"\b(authentication failed|invalid password|login denied)\b", re.I),
     "Repeated authentication-failure wording was found."),
    ("service", "medium", re.compile(r"\b(service unavailable|connection refused|timeout)\b", re.I),
     "Service availability wording was found."),
    ("configuration", "low", re.compile(r"\b(debug mode enabled|default configuration)\b", re.I),
     "A configuration-review phrase was found."),
]

@app.get("/api/v1/health")
def health() -> dict[str, str]:
    return {"status": "ok", "version": "3.0.0", "mode": "local-defensive-review"}

@app.post("/api/v1/reviews/logs", response_model=LogReviewResponse)
def review_logs(payload: LogReviewRequest) -> LogReviewResponse:
    # Do not echo or persist submitted text; callers should redact secrets first.
    lines = payload.text.splitlines()
    observations: list[Observation] = []
    for category, severity, pattern, summary in RULES:
        count = sum(1 for line in lines if pattern.search(line))
        if count:
            observations.append(Observation(
                category=category, severity=severity, summary=summary, count=count
            ))
    return LogReviewResponse(
        source_label=payload.source_label,
        lines_reviewed=len(lines),
        observations=observations,
        disclaimer=(
            "Heuristic indicators only. Results are not proof of compromise; "
            "review the original authorized source and context."
        ),
    )

@app.get("/")
def root() -> dict[str, str]:
    return {"name": "NEXUS SECURITY AI", "docs": "/docs", "health": "/api/v1/health"}
