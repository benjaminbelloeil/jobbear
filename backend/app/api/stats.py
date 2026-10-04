from typing import Annotated

from fastapi import APIRouter, Query

from app.api.deps import DbSession
from app.schemas.stats import StatsSummary, WeeklyStats

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("/summary", response_model=StatsSummary)
def summary(db: DbSession) -> StatsSummary:
    """Totals by status, response/OA/interview rates, avg days to first response."""
    # TODO(me): delegate to services.stats.get_summary.
    raise NotImplementedError


@router.get("/weekly", response_model=WeeklyStats)
def weekly(db: DbSession, weeks: Annotated[int, Query(ge=1, le=52)] = 12) -> WeeklyStats:
    """Applications per week for the last `weeks` weeks vs. settings.weekly_goal."""
    # TODO(me): delegate to services.stats.get_weekly.
    raise NotImplementedError
