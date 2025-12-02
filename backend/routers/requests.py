from typing import Any
from fastapi import APIRouter, Depends, status
from psycopg import AsyncConnection
from database.error import raise_error
from database.schema import RequestBase
from lib.auth import get_current_user
from lib.db import get_conn

router = APIRouter(prefix="/requests", tags=["requests"])

@router.get("/user/{request_type}")
async def get_request(
    request_type: str,
    conn: AsyncConnection = Depends(get_conn),
    user=Depends(get_current_user)
):
    async with conn.cursor() as cur:
        try:
            _ = await cur.execute(
                """
                    SELECT * FROM user_requests
                    WHERE user_id = %s 
                    AND type = %s
                """,
                [user["sub"], request_type]
            )
            res = await cur.fetchall()
            return res
        except Exception as e:
            raise_error(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                "OTHER",
                "Unexpected error while getting request.",
                {"exception": str(e)},
            )


@router.get("/")
async def get_request(
    conn: AsyncConnection = Depends(get_conn),
    user=Depends(get_current_user)
):
    async with conn.cursor() as cur:
        try:
            print(user['sub'])
            _ = await cur.execute(
                """
                    SELECT role FROM neon_auth.users
                    WHERE id = %s 
                """,
                [user["sub"]]
            )
            user_data: Any = await cur.fetchone()
            if (not user_data):
                raise_error(
                    status.HTTP_500_INTERNAL_SERVER_ERROR,
                    "OTHER",
                    "Unexpected error while getting request.",
                    {"exception": "user not in database"},
                )
                return;
            if (user_data["role"] != "admin"):
                raise_error(
                    status.HTTP_500_INTERNAL_SERVER_ERROR,
                    "OTHER",
                    "Unexpected error while getting request.",
                    {"exception": "user not authorized"},
                )
                return;
            _ = await cur.execute(
                """
                    SELECT req.id, req.user_id, email, name, req.status, req.type, req.message 
                    FROM user_requests as req
                    LEFT JOIN neon_auth.users_sync on req.user_id = neon_auth.users_sync.id
                """
            )
            res = await cur.fetchall()
            return res
        except Exception as e:
            raise_error(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                "OTHER",
                "Unexpected error while getting request.",
                {"exception": str(e)},
            )


@router.put("/{request_id}/reject")
async def reject_request(
    request_id: str,
    conn: AsyncConnection = Depends(get_conn),
    user=Depends(get_current_user)
):
    async with conn.cursor() as cur:
        try:
            _ = await cur.execute(
                """
                    SELECT role FROM neon_auth.users
                    WHERE id = %s 
                """,
                [user["sub"]]
            )
            user_data: Any = await cur.fetchone()
            if (not user_data):
                raise_error(
                    status.HTTP_500_INTERNAL_SERVER_ERROR,
                    "OTHER",
                    "Unexpected error while getting request.",
                    {"exception": "user not in database"},
                )
                return;
            if (user_data["role"] != "admin"):
                raise_error(
                    status.HTTP_500_INTERNAL_SERVER_ERROR,
                    "OTHER",
                    "Unexpected error while getting request.",
                    {"exception": "user not authorized"},
                )
                return;
            print(request_id)

            _ = await cur.execute(
                """
                    UPDATE user_requests
                    SET status = 'rejected'
                    WHERE id=%s
                    RETURNING *
                """,
                [request_id]
            )
        except Exception as e:
            raise_error(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                "OTHER",
                "Unexpected error while getting request.",
                {"exception": str(e)},
            )

@router.put("/{request_id}/approve")
async def approve_request(
    request_id: str,
    conn: AsyncConnection = Depends(get_conn),
    user=Depends(get_current_user)
):
    async with conn.cursor() as cur:
        try:
            _ = await cur.execute(
                """
                    SELECT role FROM neon_auth.users
                    WHERE id = %s 
                """,
                [user["sub"]]
            )
            user_data: Any = await cur.fetchone()
            if (not user_data):
                raise_error(
                    status.HTTP_500_INTERNAL_SERVER_ERROR,
                    "OTHER",
                    "Unexpected error while getting request.",
                    {"exception": "user not in database"},
                )
                return;
            if (user_data["role"] != "admin"):
                raise_error(
                    status.HTTP_500_INTERNAL_SERVER_ERROR,
                    "OTHER",
                    "Unexpected error while getting request.",
                    {"exception": "user not authorized"},
                )
                return;
            print(request_id)

            _ = await cur.execute(
                """
                    UPDATE user_requests
                    SET status = 'approved'
                    WHERE id=%s
                    RETURNING *
                """,
                [request_id]
            )
            data: Any = await cur.fetchone()
            if data["type"] == "become_chef":
                _ = await cur.execute(
                    """
                        UPDATE neon_auth.users
                        SET role = 'chef'
                        WHERE id=%s
                    """,
                    [data["user_id"]]
                )
            else:
                _ = await cur.execute(
                    """
                        UPDATE user_requests
                        SET status = 'pending'
                        WHERE id=%s
                        RETURNING *
                    """,
                    [request_id]
                )
                raise_error(
                    status.HTTP_500_INTERNAL_SERVER_ERROR,
                    "OTHER",
                    "Unexpected error while getting request.",
                    {"exception": "unhandled request type"},
                )

        except Exception as e:
            raise_error(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                "OTHER",
                "Unexpected error while getting request.",
                {"exception": str(e)},
            )



@router.post("/")
async def post_requests(
    request: RequestBase,
    conn: AsyncConnection = Depends(get_conn),
    user=Depends(get_current_user)
):
    print("YO", request)
    async with conn.cursor() as cur:
        try:
            _ = await cur.execute(
                """
                    INSERT INTO user_requests (user_id, type, message)
                    VALUES (%s, %s, %s)
                """,
                [user["sub"], request.type, request.message]
            )
        except Exception as e:
            raise_error(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                "OTHER",
                "Unexpected error while creating request.",
                {"exception": str(e)},
            )

