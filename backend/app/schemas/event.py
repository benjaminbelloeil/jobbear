from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.enums import ApplicationStatus, EventSource


class StatusEventRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    application_id: int
    from_status: ApplicationStatus | None
    to_status: ApplicationStatus
    source: EventSource
    occurred_at: datetime
    note: str | None
