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

Edge cases (decided in 3.1):
    - Zero applications: every rate is 0.0 (never divide by zero) and the average is
      None, not 0. An average of 0 days would claim everyone replied instantly.
    - Applications but no replies yet: the average is None as well ("no data yet").
    - APPLIED -> OA -> REJECTED counts toward oa_rate and response_rate: the company
      did answer, even though the current status is REJECTED.
    - GHOSTED is not a response: it is a SYSTEM event (our daily job), not a reply
      from the company. SYSTEM events never count as a reply.
    - APPLIED -> GHOSTED -> INTERVIEWING is a response (a late reply). Its first
      response is the INTERVIEWING event, because the GHOSTED one is SYSTEM.
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
