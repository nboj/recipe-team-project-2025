from fastapi import APIRouter, Depends
from psycopg import AsyncConnection
from lib.auth import get_current_user
from lib.db import get_conn
from database import schema

router = APIRouter(prefix="/recipes", tags=["recipes"])


@router.get("/")
async def read_recipes(
    conn: AsyncConnection = Depends(get_conn), _user=Depends(get_current_user)
):
    async with conn.cursor() as cur:
        _ = await cur.execute("SELECT * FROM recipes")
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
            SELECT * FROM RECIPES
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
