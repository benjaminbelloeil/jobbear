from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base
from app.models.enums import EmailClassification

if TYPE_CHECKING:
    from app.models.application import Application


class Email(Base):
    __tablename__ = "emails"

    id: Mapped[int] = mapped_column(primary_key=True)
    # Nullable: emails that could not be matched stay unlinked for manual review.
    application_id: Mapped[int | None] = mapped_column(
        ForeignKey("applications.id", ondelete="SET NULL")
    )
    message_id: Mapped[str] = mapped_column(String(255), unique=True)
    sender: Mapped[str] = mapped_column(String(500))
    subject: Mapped[str] = mapped_column(String(1000))
    snippet: Mapped[str | None] = mapped_column(Text)
    received_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    classification: Mapped[EmailClassification | None] = mapped_column(
        Enum(EmailClassification, name="email_classification")
    )
    confidence: Mapped[float | None]
    processed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    reviewed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    application: Mapped["Application | None"] = relationship(back_populates="emails")
