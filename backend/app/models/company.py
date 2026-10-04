from datetime import datetime

from sqlalchemy import DateTime, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class Company(Base):
    __tablename__ = "companies"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(200), unique=True)
    # Used to match incoming emails by sender domain, e.g. "stripe.com".
    domain: Mapped[str | None] = mapped_column(String(255))
    website: Mapped[str | None] = mapped_column(String(500))
    location: Mapped[str | None] = mapped_column(String(200))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # TODO(me): add the `applications` relationship (and its back_populates on Application).
