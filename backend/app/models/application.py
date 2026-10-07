from datetime import date, datetime
from typing import TYPE_CHECKING

from sqlalchemy import Date, DateTime, Enum, ForeignKey, String, Text, func
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
    company_id: Mapped[int] = mapped_column(ForeignKey("companies.id"))
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
    applied_at: Mapped[date] = mapped_column(Date)
    last_activity_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    notes: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    company: Mapped["Company"] = relationship(back_populates="applications")
    emails: Mapped[list["Email"]] = relationship(back_populates="application")
    status_events: Mapped[list["StatusEvent"]] = relationship(
        back_populates="application",
        cascade="all, delete-orphan",
        passive_deletes=True,
        order_by="desc(StatusEvent.occurred_at)",
    )
