from fastapi import APIRouter, HTTPException
from sqlalchemy import select

from app.api.deps import DbSession
from app.models.application import Application
from app.models.status_event import StatusEvent
from app.schemas.event import StatusEventRead

router = APIRouter(prefix="/applications", tags=["events"])


@router.get("/{application_id}/events", response_model=list[StatusEventRead])
def list_events(application_id: int, db: DbSession) -> list[StatusEventRead]:
    """Return the application's status history, oldest first. 404 if it doesn't exist."""
    db_application = db.get(Application, application_id)
    if db_application is None:
        raise HTTPException(
            status_code=404,
            detail=f"Application with id '{application_id}' not found.",
        )
    events = list(
        db.scalars(
            select(StatusEvent)
            .where(StatusEvent.application_id == application_id)
            .order_by(StatusEvent.occurred_at, StatusEvent.id)
        )
    )
    return [StatusEventRead.model_validate(event) for event in events]
