from datetime import date

from pydantic import BaseModel

from app.models.enums import ApplicationStatus


class StatsSummary(BaseModel):
    total: int
    by_status: dict[ApplicationStatus, int]
    response_rate: float
    oa_rate: float
    interview_rate: float
    avg_days_to_first_response: float | None


class WeeklyStat(BaseModel):
    week_start: date
    applications: int
    goal: int


class WeeklyStats(BaseModel):
    weeks: list[WeeklyStat]
    goal: int
