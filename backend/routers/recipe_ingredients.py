from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database.deps import get_db
from ..models.models import RecipeIngredient, Recipe, Ingredient, Unit

router = APIRouter(prefix="/recipes/{recipe_id}/ingredients", tags=["recipe_ingredients"])


@router.get("/")
def list_recipe_ingredients(recipe_id: int, db: Session = Depends(get_db)):
    items = (
        db.query(RecipeIngredient)
        .filter(RecipeIngredient.recipe_id == recipe_id)
        .all()
    )
    return {"ingredients": items}


@router.post("/", status_code=201)
def add_recipe_ingredient(
    recipe_id: int,
    ingredient_id: int,
    quantity: str = "",
    unit_id: int | None = None,
    prep_notes: str = "",
    db: Session = Depends(get_db),
):
    # Optional: ensure foreign keys exist
    recipe = db.query(Recipe).filter(Recipe.recipe_id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    ing = db.query(Ingredient).filter(Ingredient.ingredient_id == ingredient_id).first()
    if not ing:
        raise HTTPException(status_code=404, detail="Ingredient not found")

    if unit_id is not None:
        unit = db.query(Unit).filter(Unit.unit_id == unit_id).first()
        if not unit:
            raise HTTPException(status_code=404, detail="Unit not found")

    ri = RecipeIngredient(
        recipe_id=recipe_id,
        ingredient_id=ingredient_id,
        quantity=quantity,
        unit_id=unit_id,
        prep_notes=prep_notes,
    )

    db.add(ri)
    db.commit()
    db.refresh(ri)
    return {"recipe_ingredient": ri}


@router.delete("/{ingredient_id}", status_code=204)
def delete_recipe_ingredient(recipe_id: int, ingredient_id: int, db: Session = Depends(get_db)):
    ri = (
        db.query(RecipeIngredient)
        .filter(
            RecipeIngredient.recipe_id == recipe_id,
            RecipeIngredient.ingredient_id == ingredient_id,
        )
        .first()
    )
    if not ri:
        raise HTTPException(status_code=404, detail="Recipe ingredient not found")
    db.delete(ri)
    db.commit()
    return {"message": "Recipe ingredient deleted"}
