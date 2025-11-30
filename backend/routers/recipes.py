from typing import Any
from fastapi import APIRouter, Depends
from psycopg import AsyncConnection
from lib.auth import get_current_user
from lib.db import get_conn
from database import schema

router = APIRouter(prefix="/recipes", tags=["recipes"])


@router.get("/")
async def read_recipes(
    q: str | None = None,
    sort_by: str | None = None,
    limit: int | None = None,
    descending: bool | None = None,
    conn: AsyncConnection = Depends(get_conn), _user=Depends(get_current_user)
):
    async with conn.cursor() as cur:
        base = """
            SELECT 
                id,
                title,
                description,
                created_at,
                updated_at,
                created_by,
                cook_time,
                image,
                (select avg(rating) from reviews where id=reviews.recipe_id ) as rating
             FROM recipes
         """
        conditions: list[str] = []
        params: list[str] = []
        if q:
            conditions.append("(title ILIKE %s OR description ILIKE %s)")
            like = f"%{q}%"
            params.append(like)
            params.append(like)

        if len(conditions) > 0 and len(params) > 0:
            base +=  " WHERE " + " AND ".join(conditions)


        allowed_sort_columns = {"created_at", "updated_at", "cook_time", "title", "description"}
        if sort_by in allowed_sort_columns:
            if descending:
                base += f" ORDER BY {sort_by} DESC "
            else:
                base += f" ORDER BY {sort_by} ASC "

        if limit:
            base += " LIMIT %s "
            params.append(str(limit))

        query: Any = base
        print(query)
        print(params)

        _ = await cur.execute(query, params)
        rows = await cur.fetchall()
        return rows


@router.get("/{recipe_id}")
async def read_recipe(
    recipe_id: str,
    conn: AsyncConnection = Depends(get_conn),
    _user=Depends(get_current_user),
):
    async with conn.cursor() as cur:
        _ = await cur.execute(
            """
            SELECT 
                id,
                title,
                description,
                created_at,
                updated_at,
                created_by,
                cook_time,
                image,
                (select avg(rating) from reviews where id=reviews.recipe_id ) as rating
            FROM RECIPES
            WHERE id = %s
        """,
            [recipe_id],
        )
        return await cur.fetchone()


@router.post("/")
async def post_recipe(
    recipe: schema.RecipeBase,
    conn: AsyncConnection = Depends(get_conn),
    user=Depends(get_current_user),
):
    async with conn.cursor() as cur:
        _ = await cur.execute(
            f"""
            INSERT INTO recipes (title, description, cook_time, created_by)
            VALUES(%s, %s, %s, %s)
        """,
            [recipe.title, recipe.description, recipe.cook_time, user["sub"]],
        )
