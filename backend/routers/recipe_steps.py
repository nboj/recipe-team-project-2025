from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database.deps import get_db
from ..models.models import RecipeStep, Recipe

router = APIRouter(prefix="/recipes/{recipe_id}/steps", tags=["recipe_steps"])


@router.get("/")
def list_steps(recipe_id: int, db: Session = Depends(get_db)):
    steps = (
        db.query(RecipeStep)
        .filter(RecipeStep.recipe_id == recipe_id)
        .order_by(RecipeStep.step_number)
        .all()
    )
    return {"steps": steps}


@router.post("/", status_code=201)
def add_step(
    recipe_id: int,
    step_number: int,
    instruction_text: str,
    db: Session = Depends(get_db),
):
    # Optional: ensure recipe exists
    recipe = db.query(Recipe).filter(Recipe.recipe_id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    step = RecipeStep(
        recipe_id=recipe_id,
        step_number=step_number,
        instruction_text=instruction_text,
    )
    db.add(step)
    db.commit()
    db.refresh(step)
    return {"step": step}


@router.delete("/{step_number}", status_code=204)
def delete_step(recipe_id: int, step_number: int, db: Session = Depends(get_db)):
    step = (
        db.query(RecipeStep)
        .filter(
            RecipeStep.recipe_id == recipe_id,
            RecipeStep.step_number == step_number,
        )
        .first()
    )
    if not step:
        raise HTTPException(status_code=404, detail="Step not found")
    db.delete(step)
    db.commit()
    return {"message": "Step deleted"}
