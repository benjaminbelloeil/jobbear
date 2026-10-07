from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.enums import EmailClassification


class EmailRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    application_id: int | None
    message_id: str
    sender: str
    subject: str
    snippet: str | None
    received_at: datetime
    classification: EmailClassification | None
    confidence: float | None
    reviewed_at: datetime | None
    processed_at: datetime | None


class EmailSyncResult(BaseModel):
    fetched: int
    matched: int
    unmatched: int
    status_updates: int
