"""FastAPI app factory, middleware, and router wiring."""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import Depends, FastAPI, Response, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.api import applications, auth, companies, emails, events, stats
from app.config import settings
from app.db import get_db


class HealthResponse(BaseModel):
    status: str
    database: str


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    scheduler = None
    if settings.scheduler_enabled:
        from app.jobs.scheduler import create_scheduler

        scheduler = create_scheduler()
        scheduler.start()
    yield
    if scheduler is not None:
        scheduler.shutdown(wait=False)


def create_app() -> FastAPI:
    app = FastAPI(title="JobBear API", version="0.1.0", lifespan=lifespan)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health", response_model=HealthResponse, tags=["health"])
    def health(response: Response, db: Annotated[Session, Depends(get_db)]) -> HealthResponse:
        """Liveness + database connectivity check."""
        try:
            db.execute(text("SELECT 1"))
        except SQLAlchemyError:
            response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
            return HealthResponse(status="degraded", database="unreachable")
        return HealthResponse(status="ok", database="ok")

    app.include_router(auth.router)
    app.include_router(companies.router)
    app.include_router(applications.router)
    app.include_router(events.router)
    app.include_router(stats.router)
    app.include_router(emails.router)

    return app


app = create_app()
