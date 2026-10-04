"""Shared FastAPI dependencies."""

from typing import Annotated

from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.db import get_db

DbSession = Annotated[Session, Depends(get_db)]

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]) -> str:
    """Validate the bearer JWT and return the admin email it was issued for.

    Raise 401 (with a `WWW-Authenticate: Bearer` header) if the token is missing,
    expired, has a bad signature, or its subject isn't `settings.admin_email`.

    Docs: https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/
    """
    # TODO(me): decode the token with PyJWT using settings.jwt_secret / jwt_algorithm,
    #           handle jwt.InvalidTokenError, and check the `sub` claim.
    # TODO(me): once this works, protect every router except /auth and /health, e.g. via
    #           `dependencies=[Depends(get_current_user)]` on the APIRouter or include_router.
    raise NotImplementedError


CurrentUser = Annotated[str, Depends(get_current_user)]
