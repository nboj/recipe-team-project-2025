from fastapi import APIRouter, Depends, File, Form, UploadFile, HTTPException
from sqlalchemy.orm import Session
from ..database.deps import get_db
from ..models.models import Recipe, CookingMethod
from ..lib.auth import get_current_user
import os

router = APIRouter(prefix="/recipes", tags=["recipes"])

# Folder where uploaded images will be saved
UPLOAD_DIR = "backend/static/images"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def recipe_to_dict(recipe: Recipe) -> dict:
    """Convert a Recipe ORM object into a JSON-friendly dict."""
    return {
        "recipe_id": recipe.recipe_id,
        "title": recipe.title,
        "description": recipe.description,
        "instructions": recipe.instructions,
        "prep_time": recipe.prep_time,
        "cook_time": recipe.cook_time,
        "servings": recipe.servings,
        "image": recipe.image,
        "cooking_method": recipe.cooking_method,
        "my_rating": recipe.my_rating,
        "comments": recipe.comments,
        "rated_date": recipe.rated_date,
        "created_date": recipe.created_date,
        "updated_date": recipe.updated_date,
        "created_by": recipe.created_by,
    }


# ============================================
# Create a new recipe (with optional image upload)
# ============================================
@router.post("/", status_code=201)
def create_recipe(
    title: str = Form(...),
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
    db: Session = Depends(get_db),
):
    """Insert a new recipe into the database using SQLAlchemy."""
    image_path = None

    if image:
        safe_title = (title or "recipe").replace(" ", "_")
        filename = f"{safe_title}_{image.filename}"
        full_path = os.path.join(UPLOAD_DIR, filename)

        with open(full_path, "wb") as f:
            f.write(image.file.read())

        # store a relative path (same as before)
        image_path = full_path.replace("backend/", "")

    new_recipe = Recipe(
        title=title,
        description=description,
        instructions=instructions,
        prep_time=prep_time,
        cook_time=cook_time,
        servings=servings,
        image=image_path,
        cooking_method=cooking_method,
        my_rating=my_rating,
        comments=comments,
        rated_date=rated_date,
        created_date=created_date,
        updated_date=updated_date,
        created_by=user.get("sub"),
    )

    db.add(new_recipe)
    db.commit()
    db.refresh(new_recipe)

    return {
        "message": "Recipe created successfully",
        "recipe": recipe_to_dict(new_recipe),
    }


# ============================================
# Get all recipes for current user
# ============================================
@router.get("/")
def get_all_recipes(
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return all recipes created by the current user."""
    recipes = (
        db.query(Recipe)
        .filter(Recipe.created_by == user.get("sub"))
        .order_by(Recipe.created_date.desc().nullslast())
        .all()
    )

    return {"recipes": [recipe_to_dict(r) for r in recipes]}


# ============================================
# Get one recipe by ID
# ============================================
@router.get("/{recipe_id}")
def get_recipe(
    recipe_id: int,
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Return a single recipe by ID."""
    recipe = (
        db.query(Recipe)
        .filter(
            Recipe.recipe_id == recipe_id,
            Recipe.created_by == user.get("sub"),
        )
        .first()
    )

    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    return {"recipe": recipe_to_dict(recipe)}


# ============================================
# Update a recipe
# ============================================
@router.put("/{recipe_id}")
def update_recipe(
    recipe_id: int,
    title: str = Form(None),
    description: str = Form(None),
    instructions: str = Form(None),
    prep_time: str = Form(None),
    cook_time: str = Form(None),
    servings: str = Form(None),
    cooking_method: int = Form(None),
    my_rating: int = Form(None),
    comments: str = Form(None),
    rated_date: str = Form(None),
    updated_date: str = Form(None),
    image: UploadFile = File(None),
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    recipe = (
        db.query(Recipe)
        .filter(
            Recipe.recipe_id == recipe_id,
            Recipe.created_by == user.get("sub"),
        )
        .first()
    )

    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    # Handle image update if provided
    if image:
        safe_title = (title or recipe.title or "recipe").replace(" ", "_")
        filename = f"{safe_title}_{image.filename}"
        full_path = os.path.join(UPLOAD_DIR, filename)

        with open(full_path, "wb") as f:
            f.write(image.file.read())

        recipe.image = full_path.replace("backend/", "")

    # Update scalar fields only if provided
    if title is not None:
        recipe.title = title
    if description is not None:
        recipe.description = description
    if instructions is not None:
        recipe.instructions = instructions
    if prep_time is not None:
        recipe.prep_time = prep_time
    if cook_time is not None:
        recipe.cook_time = cook_time
    if servings is not None:
        recipe.servings = servings
    if cooking_method is not None:
        recipe.cooking_method = cooking_method
    if my_rating is not None:
        recipe.my_rating = my_rating
    if comments is not None:
        recipe.comments = comments
    if rated_date is not None:
        recipe.rated_date = rated_date
    if updated_date is not None:
        recipe.updated_date = updated_date

    db.commit()
    db.refresh(recipe)

    return {"message": "Recipe updated successfully", "recipe": recipe_to_dict(recipe)}


# ============================================
# Delete a recipe
# ============================================
@router.delete("/{recipe_id}", status_code=204)
def delete_recipe(
    recipe_id: int,
    user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    recipe = (
        db.query(Recipe)
        .filter(
            Recipe.recipe_id == recipe_id,
            Recipe.created_by == user.get("sub"),
        )
        .first()
    )

    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    db.delete(recipe)
    db.commit()

    return {"message": "Recipe deleted"}
