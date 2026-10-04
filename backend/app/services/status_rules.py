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
    - Are REJECTED / ACCEPTED / WITHDRAWN terminal?
    - Can GHOSTED come back to life (a late reply moves it to OA / INTERVIEWING / REJECTED)?
    - Is a no-op transition (X -> X) an error or silently ignored?
"""

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
    # TODO(me): implement the mapping. Make it exhaustive: adding a new status later
    #           should fail loudly, not fall through silently.
    raise NotImplementedError


def is_transition_allowed(from_status: ApplicationStatus, to_status: ApplicationStatus) -> bool:
    """Return True if moving `from_status` -> `to_status` is allowed."""
    # TODO(me): define the allowed-transitions table and check against it.
    raise NotImplementedError


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
    # TODO(me): implement.
    raise NotImplementedError
