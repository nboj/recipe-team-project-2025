from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database.deps import get_db
from ..models.models import RecipeCategory, Recipe, Category

router = APIRouter(prefix="/recipes/{recipe_id}/categories", tags=["recipe_categories"])


@router.get("/")
def list_recipe_categories(recipe_id: int, db: Session = Depends(get_db)):
    items = (
        db.query(RecipeCategory)
        .filter(RecipeCategory.recipe_id == recipe_id)
        .all()
    )
    return {"categories": items}


@router.post("/", status_code=201)
def add_recipe_category(
    recipe_id: int,
    category_id: int,
    db: Session = Depends(get_db),
):
    # Optional FK checks
    recipe = db.query(Recipe).filter(Recipe.recipe_id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    cat = db.query(Category).filter(Category.category_id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")

    rc = RecipeCategory(recipe_id=recipe_id, category_id=category_id)
    db.add(rc)
    db.commit()
    db.refresh(rc)
    return {"recipe_category": rc}


@router.delete("/{category_id}", status_code=204)
def delete_recipe_category(recipe_id: int, category_id: int, db: Session = Depends(get_db)):
    rc = (
        db.query(RecipeCategory)
        .filter(
            RecipeCategory.recipe_id == recipe_id,
            RecipeCategory.category_id == category_id,
        )
        .first()
    )
    if not rc:
        raise HTTPException(status_code=404, detail="Recipe category not found")
    db.delete(rc)
    db.commit()
    return {"message": "Recipe category deleted"}
