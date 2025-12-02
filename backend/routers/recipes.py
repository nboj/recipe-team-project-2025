from datetime import timedelta
import json
from typing import Any
import uuid
from fastapi import APIRouter, Depends, File, Form, UploadFile
from psycopg import AsyncConnection
from pydantic import BaseModel
from lib.auth import get_current_user
from lib.db import get_conn
from database import schema
from vercel.blob import UploadProgressEvent, BlobClient, AsyncBlobClient

router = APIRouter(prefix="/recipes", tags=["recipes"])


@router.get("/")
async def read_recipes(
    q: str | None = None,
    sort_by: str | None = None,
    limit: int | None = None,
    descending: bool | None = None,
    conn: AsyncConnection = Depends(get_conn),
    _user=Depends(get_current_user),
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
                difficulty,
                (
                    SELECT json_agg(
                        json_build_object(
                            'step_no', s.step_no,
                            'instruction_text', s.instruction_text,
                            'est_minutes', EXTRACT(EPOCH FROM s.est_minutes)
                        )
                        ORDER BY s.step_no
                    ) 
                    FROM steps s
                    WHERE s.recipe_id = recipes.id
                ) AS steps,
                (select avg(rating) from reviews where recipes.id=reviews.recipe_id ) as rating
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
            base += " WHERE " + " AND ".join(conditions)

        allowed_sort_columns = {
            "created_at",
            "updated_at",
            "cook_time",
            "title",
            "description",
        }
        if sort_by in allowed_sort_columns:
            if descending:
                base += f" ORDER BY {sort_by} DESC "
            else:
                base += f" ORDER BY {sort_by} ASC "

        if limit:
            base += " LIMIT %s "
            params.append(str(limit))

        query: Any = base

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
                difficulty,
                (
                    SELECT json_agg(
                        json_build_object(
                            'step_no', s.step_no,
                            'instruction_text', s.instruction_text,
                            'est_minutes', EXTRACT(EPOCH FROM s.est_minutes)
                        )
                        ORDER BY s.step_no
                    ) 
                    FROM steps s
                    WHERE s.recipe_id = recipes.id
                ) AS steps,
                (select avg(rating) from reviews where recipes.id=reviews.recipe_id ) as rating
            FROM RECIPES
            WHERE id = %s
        """,
            [recipe_id],
        )
        return await cur.fetchone()


class StepIn(BaseModel):
    step_no: int
    instruction_text: str
    est_minutes: str

@router.post("/")
async def post_recipe(
    title: str = Form(),
    description: str = Form(),
    cook_time: timedelta = Form(),
    image: UploadFile = File(),
    steps: str = Form(),
    conn: AsyncConnection = Depends(get_conn),
    user=Depends(get_current_user),
):
    async with conn.cursor() as cur:
        client = AsyncBlobClient()
        path = f"/{user["sub"]}/{uuid.uuid4()}/recipe.png"
        res = await client.put(f"{path}", await image.read())
        _ = await cur.execute(
            f"""
            INSERT INTO recipes (title, description, cook_time, created_by, image)
            VALUES(%s, %s, %s, %s, %s)
            RETURNING id;
        """,
            [title, description, cook_time, user["sub"], res.url],
        )

        raw_steps = json.loads(steps)
        parsed_steps = [StepIn(**s) for s in raw_steps]
        new_recipe: Any = await cur.fetchone()

        for step in parsed_steps:
            _ = await cur.execute(
                """
                INSERT INTO steps (recipe_id, step_no, instruction_text, est_minutes)
                VALUES (%s, %s, %s, %s);
            """,
                [new_recipe["id"], step.step_no, step.instruction_text, step.est_minutes],
            )

        return {"id": new_recipe["id"]}
