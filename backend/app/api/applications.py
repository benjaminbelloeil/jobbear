from datetime import date
from typing import Annotated

from fastapi import APIRouter, Query, status

from app.api.deps import DbSession
from app.models.enums import ApplicationStatus
from app.schemas.application import (
    ApplicationCreate,
    ApplicationPage,
    ApplicationRead,
    ApplicationSort,
    ApplicationUpdate,
    StatusChangeRequest,
)

router = APIRouter(prefix="/applications", tags=["applications"])


@router.get("", response_model=ApplicationPage)
def list_applications(
    db: DbSession,
    status_filter: Annotated[list[ApplicationStatus] | None, Query(alias="status")] = None,
    company_id: int | None = None,
    applied_from: date | None = None,
    applied_to: date | None = None,
    sort: ApplicationSort = ApplicationSort.APPLIED_AT_DESC,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 25,
) -> ApplicationPage:
    """List applications with filters, sorting, and pagination.

    - `status` may be repeated (`?status=APPLIED&status=OA`).
    - `applied_from` / `applied_to` are inclusive bounds on `applied_at`.
    - Return the total count *before* pagination so the UI can render page numbers.
    """
    # TODO(me): build the filtered query, count, sort, offset/limit.
    raise NotImplementedError


@router.post("", response_model=ApplicationRead, status_code=status.HTTP_201_CREATED)
def create_application(payload: ApplicationCreate, db: DbSession) -> ApplicationRead:
    """Create an application in APPLIED with the default next action.

    Also write the initial status_events row (from_status=None → APPLIED, source=MANUAL)
    and set last_activity_at. 404 if company_id doesn't exist.
    """
    # TODO(me): implement using services.status_rules for the default next action.
    raise NotImplementedError


@router.get("/{application_id}", response_model=ApplicationRead)
def get_application(application_id: int, db: DbSession) -> ApplicationRead:
    """Return one application (with its company) or 404."""
    # TODO(me): fetch by id.
    raise NotImplementedError


@router.patch("/{application_id}", response_model=ApplicationRead)
def update_application(
    application_id: int, payload: ApplicationUpdate, db: DbSession
) -> ApplicationRead:
    """Partial update of non-status fields."""
    # TODO(me): apply exclude_unset fields; 404 if missing.
    raise NotImplementedError


@router.delete("/{application_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(application_id: int, db: DbSession) -> None:
    """Delete an application; its status_events are removed by the FK cascade."""
    # TODO(me): delete; 404 if missing.
    raise NotImplementedError


@router.post("/{application_id}/status", response_model=ApplicationRead)
def change_status(
    application_id: int, payload: StatusChangeRequest, db: DbSession
) -> ApplicationRead:
    """Change status and write a status_events row (source=MANUAL).

    Keep this thin: delegate to `services.status_rules.change_status`, which validates
    the transition (422 if not allowed), sets the default next_action, and logs the event.
    """
    # TODO(me): call the service and translate its errors to HTTP errors.
    raise NotImplementedError
