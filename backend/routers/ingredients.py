from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database.deps import get_db
from ..models.models import Ingredient

router = APIRouter(prefix="/ingredients", tags=["ingredients"])


@router.get("/")
def list_ingredients(db: Session = Depends(get_db)):
    ingredients = db.query(Ingredient).order_by(Ingredient.name).all()
    return {"ingredients": ingredients}


@router.post("/", status_code=201)
def create_ingredient(name: str, db: Session = Depends(get_db)):
    ing = Ingredient(name=name)
    db.add(ing)
    db.commit()
    db.refresh(ing)
    return {"ingredient": ing}


@router.get("/{ingredient_id}")
def get_ingredient(ingredient_id: int, db: Session = Depends(get_db)):
    ing = db.query(Ingredient).filter(Ingredient.ingredient_id == ingredient_id).first()
    if not ing:
        raise HTTPException(status_code=404, detail="Ingredient not found")
    return {"ingredient": ing}


@router.delete("/{ingredient_id}", status_code=204)
def delete_ingredient(ingredient_id: int, db: Session = Depends(get_db)):
    ing = db.query(Ingredient).filter(Ingredient.ingredient_id == ingredient_id).first()
    if not ing:
        raise HTTPException(status_code=404, detail="Ingredient not found")
    db.delete(ing)
    db.commit()
    return {"message": "Ingredient deleted"}
