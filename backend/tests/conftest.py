"""Test fixtures.

Tests run against a separate Postgres database (TEST_DATABASE_URL). Tables are created
once per session from the models, and every test runs inside a transaction that is rolled
back afterwards, so tests never see each other's data (even if the code under test commits).
"""

from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import Engine, create_engine
from sqlalchemy.orm import Session

from app import models  # noqa: F401  (registers every table on Base.metadata)
from app.config import settings
from app.db import Base, get_db
from app.main import app


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
