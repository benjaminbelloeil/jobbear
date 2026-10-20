from datetime import UTC, date, datetime
from typing import Annotated

from fastapi import APIRouter, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.orm import selectinload

from app.api.deps import DbSession
from app.models.application import Application
from app.models.company import Company
from app.models.enums import ApplicationStatus, EventSource
from app.models.status_event import StatusEvent
from app.schemas.application import (
    ApplicationCreate,
    ApplicationPage,
    ApplicationRead,
    ApplicationSort,
    ApplicationUpdate,
    StatusChangeRequest,
)
from app.services.status_rules import default_next_action

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
    db_query = select(Application)
    if status_filter is not None:
        db_query = db_query.where(Application.status.in_(status_filter))
    if company_id is not None:
        db_query = db_query.where(Application.company_id == company_id)
    if applied_from is not None:
        db_query = db_query.where(Application.applied_at >= applied_from)
    if applied_to is not None:
        db_query = db_query.where(Application.applied_at <= applied_to)
    total = db.scalar(select(func.count()).select_from(db_query.subquery())) or 0
    if sort == ApplicationSort.APPLIED_AT_DESC:
        db_query = db_query.order_by(Application.applied_at.desc())
    elif sort == ApplicationSort.APPLIED_AT_ASC:
        db_query = db_query.order_by(Application.applied_at)
    elif sort == ApplicationSort.LAST_ACTIVITY_DESC:
        db_query = db_query.order_by(Application.last_activity_at.desc())
    elif sort == ApplicationSort.COMPANY_ASC:
        db_query = db_query.join(Company).order_by(Company.name)
    db_query = db_query.order_by(Application.id)
    rows = db.scalars(
        db_query.offset((page - 1) * page_size)
        .options(selectinload(Application.company))
        .limit(page_size)
    ).all()
    return ApplicationPage(
        items=[ApplicationRead.model_validate(application) for application in rows],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.post("", response_model=ApplicationRead, status_code=status.HTTP_201_CREATED)
def create_application(payload: ApplicationCreate, db: DbSession) -> ApplicationRead:
    """Create an application in APPLIED with the default next action.

    Also write the initial status_events row (from_status=None → APPLIED, source=MANUAL)
    and set last_activity_at. 404 if company_id doesn't exist.
    """
    if db.get(Company, payload.company_id) is None:
        raise HTTPException(
            status_code=404,
            detail=f"Company with id '{payload.company_id}' not found.",
        )
    application = Application(
        **payload.model_dump(),
        status=ApplicationStatus.APPLIED,
        next_action=default_next_action(ApplicationStatus.APPLIED),
        last_activity_at=datetime.now(UTC),
    )
    status_event = StatusEvent(
        from_status=None,
        to_status=ApplicationStatus.APPLIED,
        source=EventSource.MANUAL,
    )
    application.status_events.append(status_event)
    db.add(application)
    db.commit()
    db.refresh(application)
    return ApplicationRead.model_validate(application)


@router.get("/{application_id}", response_model=ApplicationRead)
def get_application(application_id: int, db: DbSession) -> ApplicationRead:
    """Return one application (with its company) or 404."""
    db_application = db.get(Application, application_id)
    if db_application is None:
        raise HTTPException(
            status_code=404,
            detail=f"Application with id '{application_id}' not found.",
        )
    return ApplicationRead.model_validate(db_application)


@router.patch("/{application_id}", response_model=ApplicationRead)
def update_application(
    application_id: int, payload: ApplicationUpdate, db: DbSession
) -> ApplicationRead:
    """Partial update of non-status fields."""
    db_application = db.get(Application, application_id)
    if db_application is None:
        raise HTTPException(
            status_code=404,
            detail=f"Application with id '{application_id}' not found.",
        )
    changes = payload.model_dump(exclude_unset=True)
    required_fields = ["company_id", "position", "source", "remote", "next_action", "applied_at"]
    for field in required_fields:
        if field in changes and changes[field] is None:
            raise HTTPException(
                status_code=422,
                detail=f"{field} cannot be null.",
            )

    if "company_id" in changes and db.get(Company, changes["company_id"]) is None:
        raise HTTPException(
            status_code=404,
            detail=f"Company with id '{changes['company_id']}' not found.",
        )

    for field, value in changes.items():
        setattr(db_application, field, value)

    db.commit()
    db.refresh(db_application)
    return ApplicationRead.model_validate(db_application)


@router.delete("/{application_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(application_id: int, db: DbSession) -> None:
    """Delete an application; its status_events are removed by the FK cascade."""
    db_application = db.get(Application, application_id)
    if db_application is None:
        raise HTTPException(
            status_code=404,
            detail=f"Application with id '{application_id}' not found.",
        )
    db.delete(db_application)
    db.commit()


@router.post("/{application_id}/status", response_model=ApplicationRead)
def change_status(
    application_id: int, payload: StatusChangeRequest, db: DbSession
) -> ApplicationRead:
    """Change status and write a status_events row (source=MANUAL).

    Keep this thin: delegate to `services.status_rules.change_status`, which validates
    the transition (422 if not allowed), sets the default next_action, and logs the event.
    """

    raise NotImplementedError
