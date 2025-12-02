import os
from dotenv import load_dotenv
from psycopg.connection_async import AsyncConnection
from psycopg.rows import dict_row

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
assert DATABASE_URL is not None

#pool = AsyncConnectionPool(
#    conninfo=DATABASE_URL,
#    kwargs={"row_factory": dict_row},
#    open=False
#)

async def get_conn():
    """
    FastAPI dependency: yields a connection from the pool.
    """
    conn = await AsyncConnection.connect(DATABASE_URL, row_factory=dict_row, autocommit=True)
    try:
        yield conn
    finally:
        await conn.close()
