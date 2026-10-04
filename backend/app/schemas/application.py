from datetime import date, datetime
from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field

from app.models.enums import ApplicationSource, ApplicationStatus, NextAction
from app.schemas.company import CompanyRead


class ApplicationBase(BaseModel):
    company_id: int
    position: str = Field(min_length=1, max_length=300)
    job_url: str | None = Field(default=None, max_length=1000)
    source: ApplicationSource = ApplicationSource.ATS
    location: str | None = Field(default=None, max_length=200)
    remote: bool = False
    applied_at: date
    notes: str | None = None


class ApplicationCreate(ApplicationBase):
    pass


class ApplicationUpdate(BaseModel):
    """Partial update. Status is changed only via POST /applications/{id}/status."""

    company_id: int | None = None
    position: str | None = Field(default=None, min_length=1, max_length=300)
    job_url: str | None = Field(default=None, max_length=1000)
    source: ApplicationSource | None = None
    location: str | None = Field(default=None, max_length=200)
    remote: bool | None = None
    next_action: NextAction | None = None
    applied_at: date | None = None
    notes: str | None = None


class ApplicationRead(ApplicationBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: ApplicationStatus
    next_action: NextAction
    last_activity_at: datetime | None
    created_at: datetime
    updated_at: datetime
    company: CompanyRead | None = None


class StatusChangeRequest(BaseModel):
    to_status: ApplicationStatus
    note: str | None = None


class ApplicationSort(StrEnum):
    APPLIED_AT_DESC = "-applied_at"
    APPLIED_AT_ASC = "applied_at"
    LAST_ACTIVITY_DESC = "-last_activity_at"
    COMPANY_ASC = "company"


class ApplicationPage(BaseModel):
    items: list[ApplicationRead]
    total: int
    page: int
    page_size: int
