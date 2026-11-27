from fastapi.testclient import TestClient

from backend.app.main import app

client = TestClient(app)


def test_health():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_log_review_reports_indicators_without_echoing_input():
    response = client.post(
        "/api/v1/reviews/logs",
        json={
            "source_label": "sample",
            "text": "authentication failed\nservice unavailable\nnormal event",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["lines_reviewed"] == 3
    assert len(data["observations"]) == 2
    assert "authentication failed" not in response.text


def test_log_review_rejects_unknown_fields():
    response = client.post(
        "/api/v1/reviews/logs",
        json={"text": "sample", "unexpected": "value"},
    )
    assert response.status_code == 422


def test_log_review_rejects_empty_input():
    response = client.post("/api/v1/reviews/logs", json={"text": ""})
    assert response.status_code == 422
