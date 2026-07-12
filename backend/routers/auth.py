from fastapi import APIRouter, Cookie, Depends, Response, status

from schemas.auth import LoginSchema, RegisterSchema, UserSchema
from services.auth import AuthService, SESSION_TTL


router = APIRouter(prefix="/auth", tags=["Auth"])
COOKIE_NAME = "letter_session"


def set_session_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        max_age=int(SESSION_TTL.total_seconds()),
        httponly=True,
        secure=False,
        samesite="lax",
        path="/",
    )


@router.post("/register", response_model=UserSchema, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterSchema, response: Response, service: AuthService = Depends()):
    user, token = service.register(payload)
    set_session_cookie(response, token)
    return user


@router.post("/login", response_model=UserSchema)
def login(payload: LoginSchema, response: Response, service: AuthService = Depends()):
    user, token = service.login(payload)
    set_session_cookie(response, token)
    return user


@router.get("/me", response_model=UserSchema)
def me(
    letter_session: str | None = Cookie(default=None),
    service: AuthService = Depends(),
):
    return service.get_user_by_session(letter_session)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(
    response: Response,
    letter_session: str | None = Cookie(default=None),
    service: AuthService = Depends(),
):
    service.logout(letter_session)
    response.delete_cookie(COOKIE_NAME, path="/")
