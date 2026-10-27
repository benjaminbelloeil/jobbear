from datetime import date, datetime
from typing import TYPE_CHECKING

from sqlalchemy import Date, DateTime, Enum, ForeignKey, Index, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base
from app.models.enums import ApplicationSource, ApplicationStatus, NextAction

if TYPE_CHECKING:
    from app.models.company import Company
    from app.models.email import Email
    from app.models.status_event import StatusEvent


class Application(Base):
    __tablename__ = "applications"

    id: Mapped[int] = mapped_column(primary_key=True)
    company_id: Mapped[int] = mapped_column(
        ForeignKey("companies.id"),
        # serves: list filter ?company_id=, and the "company has applications?" check on delete
        index=True,
    )
    position: Mapped[str] = mapped_column(String(300))
    job_url: Mapped[str | None] = mapped_column(String(1000))
    source: Mapped[ApplicationSource] = mapped_column(
        Enum(ApplicationSource, name="application_source"), default=ApplicationSource.ATS
    )
    location: Mapped[str | None] = mapped_column(String(200))
    remote: Mapped[bool] = mapped_column(default=False)
    status: Mapped[ApplicationStatus] = mapped_column(
        Enum(ApplicationStatus, name="application_status"), default=ApplicationStatus.APPLIED
    )
    next_action: Mapped[NextAction] = mapped_column(
        Enum(NextAction, name="next_action"), default=NextAction.WAITING
    )
    applied_at: Mapped[date] = mapped_column(
        Date,
        # serves: the list's default sort (newest first) and the applied_from / applied_to filters
        index=True,
    )
    last_activity_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    notes: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    # serves: ghosting (5.1): status = APPLIED and last_activity_at older than N days.
    # status comes first (exact match), then last_activity_at (range). Also covers ?status= filters.
    __table_args__ = (Index("ix_applications_status_last_activity", status, last_activity_at),)
    company: Mapped["Company"] = relationship(back_populates="applications")
    emails: Mapped[list["Email"]] = relationship(back_populates="application")
    status_events: Mapped[list["StatusEvent"]] = relationship(
        back_populates="application",
        cascade="all, delete-orphan",
        passive_deletes=True,
        order_by="desc(StatusEvent.occurred_at)",
    )
