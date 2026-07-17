import os
from contextlib import contextmanager

from psycopg.rows import dict_row
from psycopg_pool import ConnectionPool


SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    avatar TEXT NOT NULL DEFAULT '',
    banner TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_expires_at_idx ON sessions(expires_at);

-- The sqlite schema used COLLATE NOCASE on username: uniqueness and profile
-- lookups must stay case-insensitive after the Postgres migration.
CREATE UNIQUE INDEX IF NOT EXISTS users_username_lower_idx ON users (lower(username));
"""


def _build_dsn() -> str:
    """Return the Postgres connection string.

    On Vercel the Neon integration injects DATABASE_URL automatically. Locally
    we fall back to the same variable so there is a single source of truth.
    """
    dsn = os.getenv("DATABASE_URL")
    if not dsn:
        raise RuntimeError(
            "DATABASE_URL is not set. Connect the Neon database in Vercel "
            "or export DATABASE_URL locally."
        )
    # Neon requires SSL. The pooled DSN already contains the right params, but
    # make sure a plain postgres:// url is usable too.
    if "sslmode=" not in dsn and "?" not in dsn:
        dsn = f"{dsn}?sslmode=require"
    elif "sslmode=" not in dsn:
        dsn = f"{dsn}&sslmode=require"
    return dsn


# A single process-wide pool. Vercel serverless functions may reuse warm
# instances, so we lazily build the pool on first use and reuse it afterwards.
_pool: ConnectionPool | None = None


def _get_pool() -> ConnectionPool:
    global _pool
    if _pool is not None and not _pool.closed:
        return _pool
    _pool = ConnectionPool(
        conninfo=_build_dsn(),
        min_size=1,
        max_size=8,
    )
    _pool.open(wait=True)
    return _pool


def init_database() -> None:
    """Create the tables if they don't exist yet."""
    with _get_pool().connection() as connection:
        connection.execute(SCHEMA_SQL)


@contextmanager
def database():
    """Yield a pooled psycopg connection.

    Rows are returned as dicts so callers can use `row["col"]` and `dict(row)`
    the same way they did under sqlite3.Row. The connection is committed on
    success and rolled back on error.
    """
    pool = _get_pool()
    with pool.connection() as connection:
        connection.row_factory = dict_row
        try:
            yield connection
            connection.commit()
        except Exception:
            connection.rollback()
            raise


def close_database() -> None:
    """Close the pool. Useful for graceful shutdown in tests."""
    global _pool
    if _pool is not None and not _pool.closed:
        _pool.close()
    _pool = None
