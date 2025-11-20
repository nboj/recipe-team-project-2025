import os
from dotenv import load_dotenv
from psycopg.rows import dict_row
from psycopg_pool import AsyncConnectionPool

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
assert DATABASE_URL is not None

pool = AsyncConnectionPool(
    conninfo=DATABASE_URL,
    kwargs={"row_factory": dict_row},
    open=False
)

async def get_conn():
    """
    FastAPI dependency: yields a connection from the pool.
    """

    async with pool.connection() as conn:
        yield conn
