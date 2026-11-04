from fastapi.testclient import TestClient
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.status_event import StatusEvent


def create_application(client: TestClient) -> int:
    company_response = client.post(
        "/companies",
        json={"name": "TikTok"},
    )
    assert company_response.status_code == 201
    company_id = company_response.json()["id"]

    return make_app(client, company_id)


def make_app(client: TestClient, company_id: int, applied_at: str = "2026-10-01") -> int:
    application_response = client.post(
        "/applications",
        json={
            "company_id": company_id,
            "position": "Software Engineer",
            "applied_at": applied_at,
        },
    )
    assert application_response.status_code == 201
    application_id: int = application_response.json()["id"]

    return application_id


def count_status_events(db_session: Session, application_id: int) -> int:
    return (
        db_session.scalar(
            select(func.count())
            .select_from(StatusEvent)
            .where(StatusEvent.application_id == application_id)
        )
        or 0
    )


def test_change_status_applied_to_oa_returns_200_and_sets_prepare_oa(client: TestClient) -> None:
    application_id = create_application(client)
    transition_response = client.post(
        f"/applications/{application_id}/status", json={"to_status": "OA"}
    )

    assert transition_response.status_code == 200
    assert transition_response.json()["next_action"] == "PREPARE_OA"
    assert transition_response.json()["status"] == "OA"


def test_change_status_rejected_to_applied_returns_422_with_readable_message(
    client: TestClient,
) -> None:
    application_id = create_application(client)
    reject_response = client.post(
        f"/applications/{application_id}/status",
        json={
            "to_status": "REJECTED",
        },
    )

    assert reject_response.status_code == 200

    transition_response = client.post(
        f"/applications/{application_id}/status",
        json={
            "to_status": "APPLIED",
        },
    )

    assert transition_response.status_code == 422
    assert transition_response.json()["detail"] == "Cannot move from REJECTED to APPLIED"


def test_change_status_writes_exactly_one_status_event(
    client: TestClient, db_session: Session
) -> None:
    application_id = create_application(client)
    events_before = count_status_events(db_session, application_id)
    transition_response = client.post(
        f"/applications/{application_id}/status", json={"to_status": "OA"}
    )
    assert transition_response.status_code == 200
    events_after = count_status_events(db_session, application_id)
    assert events_after == events_before + 1


def test_change_status_unknown_application_returns_404(client: TestClient) -> None:
    test_response = client.post(
        "/applications/999999/status",
        json={
            "to_status": "APPLIED",
        },
    )
    assert test_response.status_code == 404


def test_create_application_starts_applied_with_one_event(
    client: TestClient, db_session: Session
) -> None:
    application_id = create_application(client)
    response = client.get(f"/applications/{application_id}")

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "APPLIED"
    assert data["next_action"] == "WAITING"
    assert count_status_events(db_session, application_id) == 1


def test_create_application_unknown_company_returns_404(client: TestClient) -> None:
    response = client.post(
        "/applications",
        json={"company_id": 999999, "position": "Full-Stack Developer", "applied_at": "2026-10-01"},
    )
    assert response.status_code == 404


def test_patch_cannot_change_status(client: TestClient) -> None:
    application_id = create_application(client)
    response = client.patch(f"/applications/{application_id}", json={"status": "OA"})
    assert response.status_code == 200
    assert response.json()["status"] == "APPLIED"


def test_list_filters_by_two_statuses(client: TestClient) -> None:
    company = client.post("/companies", json={"name": "TikTok"})
    assert company.status_code == 201
    company_id = company.json()["id"]

    make_app(client, company_id)
    b = make_app(client, company_id)
    c = make_app(client, company_id)

    client.post(f"/applications/{b}/status", json={"to_status": "OA"})
    client.post(f"/applications/{c}/status", json={"to_status": "REJECTED"})
    response = client.get("/applications", params={"status": ["APPLIED", "OA"]})
    assert response.status_code == 200
    assert response.json()["total"] == 2


def test_list_date_filters_are_inclusive(client: TestClient) -> None:
    company = client.post("/companies", json={"name": "TikTok"})
    assert company.status_code == 201
    company_id = company.json()["id"]

    make_app(client, company_id, "2026-10-01")
    make_app(client, company_id, "2026-10-05")
    make_app(client, company_id, "2026-10-10")

    response = client.get(
        "/applications", params={"applied_from": "2026-10-01", "applied_to": "2026-10-05"}
    )
    assert response.status_code == 200
    assert response.json()["total"] == 2


def test_list_total_counts_before_paging(client: TestClient) -> None:
    company = client.post("/companies", json={"name": "TikTok"})
    assert company.status_code == 201
    company_id = company.json()["id"]

    make_app(client, company_id, "2026-10-01")
    make_app(client, company_id, "2026-10-05")
    make_app(client, company_id, "2026-10-10")

    response = client.get("/applications", params={"page_size": 2})
    assert response.status_code == 200
    data = response.json()
    assert len(data["items"]) == 2
    assert data["total"] == 3


def test_list_page_past_end_is_empty(client: TestClient) -> None:
    company = client.post("/companies", json={"name": "TikTok"})
    assert company.status_code == 201
    company_id = company.json()["id"]

    make_app(client, company_id, "2026-10-01")
    make_app(client, company_id, "2026-10-05")
    make_app(client, company_id, "2026-10-10")

    response = client.get("/applications", params={"page": 3, "page_size": 2})
    assert response.status_code == 200
    data = response.json()
    assert data["items"] == []
    assert data["total"] == 3
