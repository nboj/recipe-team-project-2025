from fastapi import APIRouter, Depends
from psycopg import AsyncConnection
from lib.auth import get_current_user
from lib.db import get_conn

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/user")
async def read_user(
    conn: AsyncConnection = Depends(get_conn), user=Depends(get_current_user)
):
    async with conn.cursor() as cur:
        base = """
            SELECT 
                role
            FROM neon_auth.users
            WHERE id=%s
         """
        _ = await cur.execute(base, [user["sub"]])
        rows = await cur.fetchone()
        return rows
