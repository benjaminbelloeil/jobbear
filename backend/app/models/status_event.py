from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base
from app.models.enums import ApplicationStatus, EventSource


class StatusEvent(Base):
    __tablename__ = "status_events"

    id: Mapped[int] = mapped_column(primary_key=True)
    application_id: Mapped[int] = mapped_column(ForeignKey("applications.id", ondelete="CASCADE"))
    # Nullable: the very first event (creation) has no previous status.
    from_status: Mapped[ApplicationStatus | None] = mapped_column(
        Enum(ApplicationStatus, name="application_status")
    )
    to_status: Mapped[ApplicationStatus] = mapped_column(
        Enum(ApplicationStatus, name="application_status")
    )
    source: Mapped[EventSource] = mapped_column(Enum(EventSource, name="event_source"))
    occurred_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    note: Mapped[str | None] = mapped_column(Text)

    # TODO(me): add the relationship back to Application.
