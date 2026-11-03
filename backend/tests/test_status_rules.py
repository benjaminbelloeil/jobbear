import pytest
from sqlalchemy.orm import Session

from app.models import Application, EventSource
from app.models.enums import ApplicationStatus, NextAction
from app.services.status_rules import (
    InvalidTransitionError,
    change_status,
    default_next_action,
    is_transition_allowed,
)


def test_every_status_next_action() -> None:
    for status in ApplicationStatus:
        result = default_next_action(status)
        assert isinstance(result, NextAction)


@pytest.mark.parametrize(
    ("from_status", "to_status", "expected"),
    [
        (ApplicationStatus.APPLIED, ApplicationStatus.OA, True),
        (ApplicationStatus.OA, ApplicationStatus.INTERVIEWING, True),
        (ApplicationStatus.OFFER, ApplicationStatus.ACCEPTED, True),
        (ApplicationStatus.APPLIED, ApplicationStatus.ACCEPTED, False),
        (ApplicationStatus.OFFER, ApplicationStatus.APPLIED, False),
        (ApplicationStatus.GHOSTED, ApplicationStatus.OFFER, False),
    ],
)
def test_is_transition_allowed(
    from_status: ApplicationStatus, to_status: ApplicationStatus, expected: bool
) -> None:
    assert is_transition_allowed(from_status, to_status) == expected


def test_change_status_allowed_move_writes_one_event(
    db_session: Session, application: Application
) -> None:
    event = change_status(
        db=db_session,
        application=application,
        to_status=ApplicationStatus.OA,
        source=EventSource.MANUAL,
    )
    db_session.flush()
    assert application.status == ApplicationStatus.OA
    assert len(application.status_events) == 1
    assert event.from_status == ApplicationStatus.APPLIED
    assert event.to_status == ApplicationStatus.OA


def test_change_status_blocked_move_raises_and_changes_nothing(
    db_session: Session, application: Application
) -> None:
    with pytest.raises(InvalidTransitionError):
        change_status(
            db=db_session,
            application=application,
            to_status=ApplicationStatus.ACCEPTED,
            source=EventSource.MANUAL,
        )
    assert application.status == ApplicationStatus.APPLIED
    assert len(application.status_events) == 0
