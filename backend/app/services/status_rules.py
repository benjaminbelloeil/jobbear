"""Status transition rules. Every status change in the app goes through here.

Rules to implement:

Default next_action per status:
    APPLIED       -> WAITING
    OA            -> PREPARE_OA
    INTERVIEWING  -> PREPARE_INTERVIEW
    OFFER         -> DECIDE
    REJECTED, GHOSTED, ACCEPTED, WITHDRAWN -> NONE

Allowed transitions: decide and document them. Questions to answer:
    - Can an application skip OA and go APPLIED -> INTERVIEWING? (yes, usually)
        - Yes, but we should probably have a warning in the UI that this is unusual.
    - Are REJECTED / ACCEPTED / WITHDRAWN terminal?
        - No, they can go back to an earlier stage
          (OA, INTERVIEWING, OFFER) in case the AI got it wrong.
    - Can GHOSTED come back to life (a late reply moves it to OA / INTERVIEWING / REJECTED)?
        - Yes, if a late reply is received, the application
          can be moved back to one of these statuses.
    - Is a no-op transition (X -> X) an error or silently ignored?
        - Ignored, only if the application moves to a valid several
          round option like INTERVIEWING or OA should it be accepted.
"""

from datetime import UTC, datetime
from typing import assert_never

from sqlalchemy.orm import Session

from app.models import Application, ApplicationStatus, EventSource, NextAction, StatusEvent


class InvalidTransitionError(Exception):
    """Raised when a status change is not allowed by the transition rules."""

    def __init__(self, from_status: ApplicationStatus, to_status: ApplicationStatus) -> None:
        super().__init__(f"Cannot move from {from_status} to {to_status}")
        self.from_status = from_status
        self.to_status = to_status


def default_next_action(status: ApplicationStatus) -> NextAction:
    """Return the default next action for `status` (see the table in the module docstring)."""
    match status:
        case ApplicationStatus.APPLIED:
            return NextAction.WAITING
        case ApplicationStatus.OA:
            return NextAction.PREPARE_OA
        case ApplicationStatus.INTERVIEWING:
            return NextAction.PREPARE_INTERVIEW
        case ApplicationStatus.OFFER:
            return NextAction.DECIDE
        case (
            ApplicationStatus.REJECTED
            | ApplicationStatus.GHOSTED
            | ApplicationStatus.ACCEPTED
            | ApplicationStatus.WITHDRAWN
        ):
            return NextAction.NONE
    assert_never(status)


ALLOWED_TRANSITIONS = {
    ApplicationStatus.APPLIED: {
        ApplicationStatus.OA,
        ApplicationStatus.INTERVIEWING,
        ApplicationStatus.REJECTED,
        ApplicationStatus.GHOSTED,
        ApplicationStatus.WITHDRAWN,
        ApplicationStatus.OFFER,
    },
    ApplicationStatus.OA: {
        ApplicationStatus.INTERVIEWING,
        ApplicationStatus.REJECTED,
        ApplicationStatus.GHOSTED,
        ApplicationStatus.WITHDRAWN,
        ApplicationStatus.OA,
    },
    ApplicationStatus.INTERVIEWING: {
        ApplicationStatus.OFFER,
        ApplicationStatus.REJECTED,
        ApplicationStatus.GHOSTED,
        ApplicationStatus.WITHDRAWN,
        ApplicationStatus.INTERVIEWING,
    },
    ApplicationStatus.OFFER: {
        ApplicationStatus.ACCEPTED,
        ApplicationStatus.REJECTED,
        ApplicationStatus.GHOSTED,
        ApplicationStatus.WITHDRAWN,
    },
    ApplicationStatus.REJECTED: {
        ApplicationStatus.GHOSTED,
        ApplicationStatus.WITHDRAWN,
        ApplicationStatus.OFFER,
        ApplicationStatus.INTERVIEWING,
        ApplicationStatus.OA,
    },
    ApplicationStatus.GHOSTED: {
        ApplicationStatus.OA,
        ApplicationStatus.INTERVIEWING,
        ApplicationStatus.REJECTED,
        ApplicationStatus.WITHDRAWN,
    },
    ApplicationStatus.ACCEPTED: {
        ApplicationStatus.OA,
        ApplicationStatus.OFFER,
        ApplicationStatus.INTERVIEWING,
        ApplicationStatus.WITHDRAWN,
    },
    ApplicationStatus.WITHDRAWN: {
        ApplicationStatus.OA,
        ApplicationStatus.INTERVIEWING,
        ApplicationStatus.GHOSTED,
        ApplicationStatus.REJECTED,
    },
}


def is_transition_allowed(from_status: ApplicationStatus, to_status: ApplicationStatus) -> bool:
    """Return True if moving `from_status` -> `to_status` is allowed."""
    return to_status in ALLOWED_TRANSITIONS[from_status]


def change_status(
    db: Session,
    application: Application,
    to_status: ApplicationStatus,
    source: EventSource,
    note: str | None = None,
) -> StatusEvent:
    """Validate and apply a status change, then record it.

    Steps:
        1. Raise InvalidTransitionError if not `is_transition_allowed`.
        2. Update status, next_action (via `default_next_action`), last_activity_at.
        3. Add a StatusEvent(from_status, to_status, source, note).
        4. Return the event. Let the caller decide when to commit.
    """

    if not is_transition_allowed(application.status, to_status):
        raise InvalidTransitionError(application.status, to_status)

    from_status = application.status
    application.status = to_status
    application.next_action = default_next_action(to_status)
    application.last_activity_at = datetime.now(UTC)

    status_event = StatusEvent(
        application=application,
        from_status=from_status,
        to_status=to_status,
        source=source,
        note=note,
        occurred_at=datetime.now(UTC),
    )
    db.add(status_event)

    return status_event
