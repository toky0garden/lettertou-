import hashlib
import hmac
import re
import secrets
from base64 import urlsafe_b64decode, urlsafe_b64encode
from datetime import datetime, timedelta, timezone

import psycopg.errors
from fastapi import HTTPException, status

from core.database import database
from schemas.auth import LoginSchema, RegisterSchema, UpdateProfileSchema, UserSchema


SESSION_TTL = timedelta(days=30)
EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


class AuthService:
    def register(self, payload: RegisterSchema) -> tuple[UserSchema, str]:
        username = payload.username.strip()
        email = payload.email.strip().lower()
        self._validate_identity(username, email)

        try:
            with database() as connection:
                cursor = connection.execute(
                    """
                    INSERT INTO users (username, email, password_hash)
                    VALUES (%s, %s, %s)
                    RETURNING id
                    """,
                    (username, email, self._hash_password(payload.password)),
                )
                row = cursor.fetchone()
                user_id = row["id"] if row else None
        except psycopg.errors.UniqueViolation as error:
            message = "Пользователь с такой почтой или именем уже существует"
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=message) from error

        return self._create_session_for_user(user_id)

    def login(self, payload: LoginSchema) -> tuple[UserSchema, str]:
        email = payload.email.strip().lower()
        with database() as connection:
            row = connection.execute(
                "SELECT id, password_hash FROM users WHERE email = %s",
                (email,),
            ).fetchone()

        if row is None or not self._verify_password(payload.password, row["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Неверная почта или пароль",
            )

        return self._create_session_for_user(row["id"])

    def get_user_by_username(self, username: str) -> UserSchema:
        with database() as connection:
            row = connection.execute(
                "SELECT id, username, email, avatar, banner FROM users WHERE lower(username) = lower(%s)",
                (username,),
            ).fetchone()
        if row is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден")
        return UserSchema(**dict(row))

    def get_user_by_session(self, token: str | None) -> UserSchema:
        if not token:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Требуется вход")

        now = datetime.now(timezone.utc)
        with database() as connection:
            row = connection.execute(
                """
                SELECT users.id, users.username, users.email, users.avatar, users.banner
                FROM sessions
                JOIN users ON users.id = sessions.user_id
                WHERE sessions.token_hash = %s AND sessions.expires_at > %s
                """,
                (self._hash_token(token), now),
            ).fetchone()
        if row is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Сессия истекла")
        return UserSchema(**dict(row))

    def logout(self, token: str | None) -> None:
        if not token:
            return
        with database() as connection:
            connection.execute("DELETE FROM sessions WHERE token_hash = %s", (self._hash_token(token),))

    def update_profile(self, token: str | None, payload: UpdateProfileSchema) -> UserSchema:
        user = self.get_user_by_session(token)
        email = payload.email.strip().lower() if payload.email else user.email

        if payload.email or payload.new_password:
            with database() as connection:
                row = connection.execute("SELECT password_hash FROM users WHERE id = %s", (user.id,)).fetchone()
            if not payload.current_password or not self._verify_password(payload.current_password, row["password_hash"]):
                raise HTTPException(status_code=401, detail="Текущий пароль указан неверно")

        if payload.email and not EMAIL_PATTERN.fullmatch(email):
            raise HTTPException(status_code=422, detail="Некорректный формат почты")

        fields = ["email = %s"]
        values: list[object] = [email]
        if payload.new_password:
            fields.append("password_hash = %s")
            values.append(self._hash_password(payload.new_password))
        values.append(user.id)

        try:
            with database() as connection:
                connection.execute(f"UPDATE users SET {', '.join(fields)} WHERE id = %s", values)
        except psycopg.errors.UniqueViolation as error:
            raise HTTPException(status_code=409, detail="Эта почта уже используется") from error
        return self.get_user_by_session(token)

    def update_image(self, token: str | None, field: str, url: str) -> UserSchema:
        if field not in {"avatar", "banner"}:
            raise ValueError("Unsupported profile image field")
        user = self.get_user_by_session(token)
        with database() as connection:
            connection.execute(f"UPDATE users SET {field} = %s WHERE id = %s", (url, user.id))
        return self.get_user_by_session(token)

    def _create_session_for_user(self, user_id: int) -> tuple[UserSchema, str]:
        token = secrets.token_urlsafe(32)
        now = datetime.now(timezone.utc)
        expires_at = now + SESSION_TTL
        with database() as connection:
            connection.execute("DELETE FROM sessions WHERE expires_at <= %s", (now,))
            connection.execute(
                "INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (%s, %s, %s)",
                (self._hash_token(token), user_id, expires_at),
            )
            row = connection.execute(
                "SELECT id, username, email, avatar, banner FROM users WHERE id = %s",
                (user_id,),
            ).fetchone()
        return UserSchema(**dict(row)), token

    @staticmethod
    def _validate_identity(username: str, email: str) -> None:
        if not 3 <= len(username) <= 24:
            raise HTTPException(status_code=422, detail="Имя должно содержать от 3 до 24 символов")
        if not EMAIL_PATTERN.fullmatch(email):
            raise HTTPException(status_code=422, detail="Некорректный формат почты")

    @staticmethod
    def _hash_password(password: str) -> str:
        salt = secrets.token_bytes(16)
        digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 600_000)
        return f"pbkdf2_sha256$600000${urlsafe_b64encode(salt).decode()}${urlsafe_b64encode(digest).decode()}"

    @staticmethod
    def _verify_password(password: str, encoded: str) -> bool:
        try:
            algorithm, iterations, salt, digest = encoded.split("$", 3)
            if algorithm != "pbkdf2_sha256":
                return False
            actual = hashlib.pbkdf2_hmac(
                "sha256",
                password.encode(),
                urlsafe_b64decode(salt),
                int(iterations),
            )
            return hmac.compare_digest(actual, urlsafe_b64decode(digest))
        except (ValueError, TypeError):
            return False

    @staticmethod
    def _hash_token(token: str) -> str:
        return hashlib.sha256(token.encode()).hexdigest()
