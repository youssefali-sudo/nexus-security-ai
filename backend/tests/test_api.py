from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_health():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_language_registry_has_24_languages():
    data = client.get("/api/v1/languages").json()
    assert data["count"] == 24
    ids = {item["id"] for item in data["languages"]}
    assert {"go", "typescript", "python", "bash", "powershell"} <= ids

def test_source_review_detects_indicators_without_echoing_source():
    response = client.post("/api/v1/reviews/source", json={
        "language": "python",
        "code": 'api_key = "not-a-real-key-value"\nrequests.get(url, verify=False)',
    })
    assert response.status_code == 200
    data = response.json()
    assert data["language"] == "python"
    assert data["finding_count"] >= 2
    assert "not-a-real-key-value" not in response.text

def test_language_detection_from_filename():
    response = client.post("/api/v1/reviews/source", json={
        "filename": "sample.go", "code": "package main\nfunc main() {}"})
    assert response.status_code == 200
    assert response.json()["language"] == "go"

def test_unknown_language_rejected():
    response = client.post("/api/v1/reviews/source", json={
        "language": "not-real", "code": "sample"})
    assert response.status_code == 422

def test_source_review_rejects_unknown_fields():
    response = client.post("/api/v1/reviews/source", json={
        "language": "python", "code": "print('safe')", "unexpected": True})
    assert response.status_code == 422

def test_log_review_reports_indicators_without_echoing_input():
    response = client.post("/api/v1/reviews/logs", json={
        "source_label": "sample",
        "text": "authentication failed\nservice unavailable\nnormal event"})
    assert response.status_code == 200
    data = response.json()
    assert data["lines_reviewed"] == 3
    assert len(data["observations"]) == 2
    assert "authentication failed" not in response.text

def test_log_review_rejects_unknown_fields():
    response = client.post("/api/v1/reviews/logs", json={
        "text": "sample", "unexpected": "value"})
    assert response.status_code == 422

def test_log_review_rejects_empty_input():
    response = client.post("/api/v1/reviews/logs", json={"text": ""})
    assert response.status_code == 422
