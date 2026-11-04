"""Test fixtures.

Tests run against a separate Postgres database (TEST_DATABASE_URL). Tables are created
once per session from the models, and every test runs inside a transaction that is rolled
back afterwards, so tests never see each other's data (even if the code under test commits).
"""

from collections.abc import Iterator
from datetime import date

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import Engine, create_engine
from sqlalchemy.orm import Session

from app import models  # noqa: F401  (registers every table on Base.metadata)
from app.config import settings
from app.db import Base, get_db
from app.main import app
from app.models import Application, ApplicationStatus, Company, NextAction


@pytest.fixture(scope="session")
def engine() -> Iterator[Engine]:
    engine = create_engine(settings.test_database_url, pool_pre_ping=True)
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    yield engine
    Base.metadata.drop_all(engine)
    engine.dispose()


@pytest.fixture
def db_session(engine: Engine) -> Iterator[Session]:
    connection = engine.connect()
    transaction = connection.begin()
    # Commits inside the code under test become SAVEPOINT releases, not real commits.
    session = Session(bind=connection, join_transaction_mode="create_savepoint")
    try:
        yield session
    finally:
        session.close()
        transaction.rollback()
        connection.close()


@pytest.fixture
def client(db_session: Session) -> Iterator[TestClient]:
    def override_get_db() -> Iterator[Session]:
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def company(db_session: Session) -> Company:
    """A saved company, for tests that work on the models directly (no API)."""
    company = Company(name="Acme", domain="acme.com")
    db_session.add(company)
    db_session.flush()  # sends the INSERT so company.id is set; the rollback still undoes it
    return company


@pytest.fixture
def application(db_session: Session, company: Company) -> Application:
    """A saved APPLIED application with no status events yet.

    Built straight from the model, so it skips the create endpoint and its first event.
    Tests that count events start from zero.
    """
    application = Application(
        company=company,
        position="Backend Engineer",
        status=ApplicationStatus.APPLIED,
        next_action=NextAction.WAITING,
        applied_at=date(2026, 10, 1),
    )
    db_session.add(application)
    db_session.flush()
    return application
