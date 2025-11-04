from fastapi import APIRouter, Depends, HTTPException 
from sqlalchemy.orm import Session
from database import db, models, schema 

router = APIRouter(prefix="/recipes", tags=["recipes"])

def get_db():
    db_conn = db.SessionLocal()
    try:
        yield db_conn 
    finally:
        db_conn.close() 

@router.post("/", response_model=schema.Recipe)
def create_recipe(recipe: schema.RecipeCreate, db: Session = Depends(get_db)):
    db_recipe = models.Recipe(title=recipe.title, description=recipe.description)
    db.add(db_recipe)
    db.commit()
    db.refresh(db_recipe)
    return db_recipe

@router.get("/", response_model=list[schema.Recipe])
def read_recipes(db: Session = Depends(get_db)):
    return db.query(models.Recipe).all()