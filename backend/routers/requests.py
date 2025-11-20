from fastapi import APIRouter, Depends
from psycopg import AsyncConnection
from database.schema import RequestBase
from lib.auth import get_current_user
from lib.db import get_conn

router = APIRouter(prefix="/requests", tags=["requests"])

@router.post("/")
async def post_requests(
    request: RequestBase,
    conn: AsyncConnection = Depends(get_conn),
    user=Depends(get_current_user)
):
    async with conn.cursor() as cur:
        _ = await cur.execute(
            """
                INSERT INTO user_requests (user_id, type, message)
                VALUES (%s, %s, %s)
            """,
            [user["sub"], request.type, request.message]
        )


