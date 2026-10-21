from fastapi.testclient import TestClient


def test_change_status_unknown_application_returns_404(client: TestClient) -> None:
    response = client.post(
        "/applications/999999/status",
        json={
            "to_status": "APPLIED",
        },
    )
    assert response.status_code == 404