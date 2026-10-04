"""Import every model here so `Base.metadata` sees all tables (Alembic relies on this)."""

from app.models.application import Application
from app.models.company import Company
from app.models.email import Email
from app.models.enums import (
    ApplicationSource,
    ApplicationStatus,
    EmailClassification,
    EventSource,
    NextAction,
)
from app.models.status_event import StatusEvent

__all__ = [
    "Application",
    "ApplicationSource",
    "ApplicationStatus",
    "Company",
    "Email",
    "EmailClassification",
    "EventSource",
    "NextAction",
    "StatusEvent",
]
