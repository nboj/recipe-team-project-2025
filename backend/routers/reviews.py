from fastapi import APIRouter, Depends, status
from psycopg import AsyncConnection
from database.error import ErrorBody, ErrorResponse, raise_error
from database.schema import ReviewBase
from lib.auth import get_current_user
from lib.db import get_conn

router = APIRouter(prefix="/reviews", tags=["reviews"])


@router.get("/{recipe_id}")
async def read_reviews(
    recipe_id: str,
    conn: AsyncConnection = Depends(get_conn),
    _user=Depends(get_current_user),
):
    async with conn.cursor() as cur:
        try:
            _ = await cur.execute(
                """
                SELECT 
                    comment,
                    rating,
                    user_id,
                    users.role,
                    users_sync.name,
                    users_sync.raw_json->>'display_name' as display_name,
                    users_sync.raw_json->>'profile_image_url' as profile_image_url 
                FROM reviews
                INNER JOIN neon_auth.users on users.id = user_id
                inner join neon_auth.users_sync on users.id = neon_auth.users_sync.id 
                WHERE recipe_id = %s
            """,
                [recipe_id],
            )
            rows = await cur.fetchall()
            return rows
        except Exception as e:
            raise_error(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                "OTHER",
                "Unexpected error while creating review.",
                {"exception": str(e)},
            )


@router.post("/{recipe_id}")
async def write_reviews(
    recipe_id: str,
    review: ReviewBase,
    conn: AsyncConnection = Depends(get_conn),
    user=Depends(get_current_user),
):
    if review.rating < 0 or review.rating > 5:
        raise_error(
            status.HTTP_400_BAD_REQUEST,
            "INVALID_RATING",
            "Rating was out of range",
            {}
        )
    async with conn.cursor() as cur:
        try:
            _ = await cur.execute(
                """
                INSERT INTO reviews (recipe_id, user_id, comment, rating)
                VALUES (%s, %s, %s, %s)
            """,
                [recipe_id, user["sub"], review.comment, review.rating],
            )
        except Exception as e:
            raise_error(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                "OTHER",
                "Unexpected error while creating review.",
                {"exception": str(e)},
            )

@router.delete("/{recipe_id}")
async def delete_reviews(
    recipe_id: str,
    conn: AsyncConnection = Depends(get_conn),
    user=Depends(get_current_user),
):
    async with conn.cursor() as cur:
        try:
            _ = await cur.execute("""
                DELETE FROM reviews
                WHERE recipe_id = %s
                AND user_id = %s
            """, [recipe_id, user["sub"]])
        except Exception as e: 
            raise_error(
                status.HTTP_500_INTERNAL_SERVER_ERROR,
                "OTHER",
                "Unexpected error while creating review.",
                {"exception": str(e)},
            )
