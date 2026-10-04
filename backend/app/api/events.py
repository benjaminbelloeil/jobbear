from fastapi import APIRouter

from app.api.deps import DbSession
from app.schemas.event import StatusEventRead

router = APIRouter(prefix="/applications", tags=["events"])


@router.get("/{application_id}/events", response_model=list[StatusEventRead])
def list_events(application_id: int, db: DbSession) -> list[StatusEventRead]:
    """Return the application's status history, oldest first. 404 if it doesn't exist."""
    # TODO(me): query status_events for this application.
    raise NotImplementedError
