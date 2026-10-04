"""Analytics for the dashboard.

Definitions (write them down precisely before coding; they are interview questions):
    - response_rate: share of applications that got *any* reply
      (moved past APPLIED to anything except GHOSTED / WITHDRAWN).
    - oa_rate: share of applications that ever reached OA.
    - interview_rate: share that ever reached INTERVIEWING.
      "Ever reached" means you must look at status_events, not only the current status.
    - avg_days_to_first_response: mean days between applied_at and the first
      non-SYSTEM status event after APPLIED. None when there is no data.
    - weekly: applications per ISO week (Monday start) vs. settings.weekly_goal,
      including weeks with zero applications.
"""

from sqlalchemy.orm import Session

from app.schemas.stats import StatsSummary, WeeklyStats


def get_summary(db: Session) -> StatsSummary:
    """Compute the StatsSummary described in the module docstring."""
    # TODO(me): implement. Try to do the counting in SQL (GROUP BY), not Python loops.
    raise NotImplementedError


def get_weekly(db: Session, weeks: int, goal: int) -> WeeklyStats:
    """Return the last `weeks` ISO weeks (oldest first), zero-filled, with the goal."""
    # TODO(me): implement (hint: date_trunc('week', ...) in Postgres).
    raise NotImplementedError
