from fastapi import APIRouter

from app.schemas.auth import LoginRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest) -> TokenResponse:
    """Exchange the admin email + password for a JWT.

    - Compare `payload.email` to `settings.admin_email`.
    - Verify `payload.password` against `settings.admin_password_hash` with pwdlib.
    - On success, sign a JWT with `sub` = email and `exp` = now + jwt_expire_minutes.
    - On failure, return 401 with the same message for a wrong email or a wrong password.
    """
    # TODO(me): implement login (pwdlib PasswordHash.recommended().verify + jwt.encode).
    raise NotImplementedError
