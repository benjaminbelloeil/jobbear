from fastapi.testclient import TestClient

from tests.test_applications import make_app


def test_create_company_duplicate_name_returns_409(client: TestClient) -> None:
    first = client.post("/companies", json={"name": "Stripe"})
    assert first.status_code == 201
    second = client.post("/companies", json={"name": "Stripe"})
    assert second.status_code == 409


def test_delete_company_with_applications_returns_409(client: TestClient) -> None:
    company = client.post("/companies", json={"name": "TikTok"})
    assert company.status_code == 201
    company_id = company.json()["id"]
    make_app(client, company_id)

    response = client.delete(f"/companies/{company_id}")
    assert response.status_code == 409

    assert client.get(f"/companies/{company_id}").status_code == 200
