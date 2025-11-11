from fastapi import APIRouter, Depends, File, Form, UploadFile, HTTPException
from ..database import db
from ..lib.auth import get_current_user
import os

# ============================================
# Router setup
# ============================================
router = APIRouter(prefix="/recipes", tags=["recipes"])

# Folder where uploaded images will be saved
UPLOAD_DIR = "backend/static/images"
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ============================================
# Create a new recipe (with optional image upload)
# ============================================
@router.post("/", status_code=201)
async def create_recipe(
    title: str = Form(None),
    description: str = Form(None),
    instructions: str = Form(None),
    prep_time: str = Form(None),
    cook_time: str = Form(None),
    servings: str = Form(None),
    cooking_method: str = Form(None),
    my_rating: str = Form(None),
    comments: str = Form(None),
    rated_date: str = Form(None),
    created_date: str = Form(None),
    updated_date: str = Form(None),
    image: UploadFile = File(None),
    user: dict = Depends(get_current_user),
):
    """Insert a new recipe into the database.
    Accepts both form fields and an optional uploaded image.
    """

    # Save image if provided
    image_path = None
    if image:
        # create a unique file name
        safe_title = (title or "recipe").replace(" ", "_")
        filename = f"{safe_title}_{image.filename}"
        image_path = os.path.join(UPLOAD_DIR, filename)

        with open(image_path, "wb") as f:
            f.write(await image.read())

        # store a relative path instead of full backend path
        image_path = image_path.replace("backend/", "")

    query = """
        INSERT INTO Recipes (
            title, description, instructions, prep_time, cook_time, servings,
            image, cooking_method, my_rating, comments, rated_date,
            created_date, updated_date, created_by
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """

    values = (
        title,
        description,
        instructions,
        prep_time,
        cook_time,
        servings,
        image_path,
        cooking_method,
        my_rating,
        comments,
        rated_date,
        created_date,
        updated_date,
        user.get("sub"),
    )

    async with db.connection() as conn:
        cur = await conn.cursor()
        await cur.execute(query, values)
        await conn.commit()
        new_id = cur.lastrowid

    return {"message": "Recipe created successfully", "id": new_id, "image": image_path}


# ============================================
# Get all recipes
# ============================================
@router.get("/")
async def get_all_recipes(user: dict = Depends(get_current_user)):
    """Return all recipes created by the current user."""
    query = "SELECT * FROM Recipes WHERE created_by = ?"
    async with db.connection() as conn:
        cur = await conn.cursor()
        await cur.execute(query, (user.get("sub"),))
        rows = await cur.fetchall()

    return {"recipes": rows}


# ============================================
# Get one recipe by ID
# ============================================
@router.get("/{recipe_id}")
async def get_recipe(recipe_id: int, user: dict = Depends(get_current_user)):
    """Return a single recipe by ID."""
    query = "SELECT * FROM Recipes WHERE recipe_id = ? AND created_by = ?"
    async with db.connection() as conn:
        cur = await conn.cursor()
        await cur.execute(query, (recipe_id, user.get("sub")))
        row = await cur.fetchone()

    if not row:
        raise HTTPException(status_code=404, detail="Recipe not found")

    return {"recipe": row}
