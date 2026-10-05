"""Application settings, loaded from environment variables and `.env`."""

from functools import lru_cache
from pathlib import Path

from pydantic import EmailStr, Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

# `.env` lives at the repo root; also accept one next to the backend for flexibility.
_BACKEND_DIR = Path(__file__).resolve().parent.parent
_ENV_FILES = (_BACKEND_DIR.parent / ".env", _BACKEND_DIR / ".env")


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=_ENV_FILES, extra="ignore")

    # Database
    database_url: str = "postgresql+psycopg://jobbear:jobbear@localhost:5432/jobbear"
    test_database_url: str = "postgresql+psycopg://jobbear:jobbear@localhost:5432/jobbear_test"

    # Auth
    jwt_secret: str = "change-me"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24 * 7
    admin_email: EmailStr = "you@example.com"
    admin_password_hash: str = ""

    # Integrations
    anthropic_api_key: str = ""
    anthropic_model: str = "claude-haiku-4-5-20251001"
    classifier_confidence_threshold: float = Field(default=0.8, ge=0, le=1)
    google_client_secrets_path: Path = Path("./secrets/client_secret.json")
    google_token_path: Path = Path("./secrets/gmail_token.json")

    # Jobs
    scheduler_enabled: bool = False
    gmail_sync_interval_minutes: int = Field(default=60, gt=0)
    ghosted_after_days: int = Field(default=21, gt=0)
    weekly_goal: int = Field(default=35, gt=0)

    # HTTP
    cors_origins: list[str] = ["http://localhost:5173"]

    @field_validator("database_url", "test_database_url")
    @classmethod
    def _use_psycopg3(cls, url: str) -> str:
        """Point plain Postgres URLs at the psycopg 3 driver.

        Hosts like Railway hand out `postgresql://…` (or `postgres://…`), which SQLAlchemy
        reads as "use psycopg2". Only psycopg 3 is installed, so rewrite the scheme.
        """
        for prefix in ("postgres://", "postgresql://"):
            if url.startswith(prefix):
                return "postgresql+psycopg://" + url.removeprefix(prefix)
        return url


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
