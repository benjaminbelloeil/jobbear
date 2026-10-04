"""Daily job logic: mark stale applications as GHOSTED.

Rule:
    An application in APPLIED whose last activity (last_activity_at, falling back to
    applied_at) is `settings.ghosted_after_days` (default 21) or more days ago moves to
    GHOSTED, with next_action NONE, and gets a status_events row with source=SYSTEM and a
    note like "No response after 21 days".

Must go through `status_rules.change_status` so the event is always written.
Must be idempotent: running it twice in a day changes nothing the second time.
"""

from datetime import datetime

from sqlalchemy.orm import Session


def mark_ghosted(db: Session, now: datetime, ghosted_after_days: int) -> int:
    """Ghost every stale APPLIED application and return how many were updated.

    `now` is a parameter (not datetime.now() inside) so tests can control time.
    """
    # TODO(me): select stale APPLIED applications, change each to GHOSTED, commit once.
    raise NotImplementedError
