from fastapi import APIRouter

from app.api.deps import DbSession
from app.schemas.email import EmailRead, EmailSyncResult

router = APIRouter(prefix="/emails", tags=["emails"])


@router.post("/sync", response_model=EmailSyncResult)
def sync_emails(db: DbSession) -> EmailSyncResult:
    """Run a Gmail sync now (same code path as the scheduled job)."""
    # TODO(me): call the same function the scheduler uses (jobs.scheduler.run_gmail_sync).
    #           Think about what happens if this runs while the scheduled sync is running.
    raise NotImplementedError


@router.get("/unmatched", response_model=list[EmailRead])
def unmatched_emails(db: DbSession) -> list[EmailRead]:
    """Emails with no application_id, newest first, for manual review."""
    # TODO(me): query emails where application_id is null.
    raise NotImplementedError
