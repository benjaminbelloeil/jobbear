"""APScheduler setup for the in-process background jobs.

Jobs:
    - gmail_sync: every settings.gmail_sync_interval_minutes. Fetch new emails, store them,
      classify, match, and apply confident status changes (source=EMAIL).
    - ghosting: once a day. Calls services.ghosting.mark_ghosted.

Each job opens its own session with SessionLocal() (not get_db: there is no request)
and must close it. Prevent overlapping runs (max_instances=1, coalesce=True).
Enabled only when settings.scheduler_enabled is true (see main.py lifespan).
Note: with several uvicorn workers each process would run its own scheduler.
"""

from apscheduler.schedulers.background import BackgroundScheduler  # type: ignore[import-untyped]

from app.schemas.email import EmailSyncResult


def run_gmail_sync() -> EmailSyncResult:
    """One full Gmail sync pass. Also called by POST /emails/sync."""
    # TODO(me): wire gmail_client + classifier + status_rules together.
    raise NotImplementedError


def run_ghosting() -> int:
    """One ghosting pass. Returns the number of applications ghosted."""
    # TODO(me): open a session and call services.ghosting.mark_ghosted.
    raise NotImplementedError


def create_scheduler() -> BackgroundScheduler:
    """Create a BackgroundScheduler with the gmail_sync and ghosting jobs registered."""
    # TODO(me): add both jobs (interval + cron triggers) with stable ids.
    raise NotImplementedError
