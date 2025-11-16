from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database.deps import get_db
from ..models.models import RecipeEquipment, Recipe, Equipment

router = APIRouter(prefix="/recipes/{recipe_id}/equipment", tags=["recipe_equipment"])


@router.get("/")
def list_recipe_equipment(recipe_id: int, db: Session = Depends(get_db)):
    items = (
        db.query(RecipeEquipment)
        .filter(RecipeEquipment.recipe_id == recipe_id)
        .all()
    )
    return {"equipment": items}


@router.post("/", status_code=201)
def add_recipe_equipment(
    recipe_id: int,
    equipment_id: int,
    db: Session = Depends(get_db),
):
    recipe = db.query(Recipe).filter(Recipe.recipe_id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")

    eq = db.query(Equipment).filter(Equipment.equipment_id == equipment_id).first()
    if not eq:
        raise HTTPException(status_code=404, detail="Equipment not found")

    re = RecipeEquipment(recipe_id=recipe_id, equipment_id=equipment_id)
    db.add(re)
    db.commit()
    db.refresh(re)
    return {"recipe_equipment": re}


@router.delete("/{equipment_id}", status_code=204)
def delete_recipe_equipment(recipe_id: int, equipment_id: int, db: Session = Depends(get_db)):
    re = (
        db.query(RecipeEquipment)
        .filter(
            RecipeEquipment.recipe_id == recipe_id,
            RecipeEquipment.equipment_id == equipment_id,
        )
        .first()
    )
    if not re:
        raise HTTPException(status_code=404, detail="Recipe equipment not found")
    db.delete(re)
    db.commit()
    return {"message": "Recipe equipment deleted"}
