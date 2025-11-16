from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database.deps import get_db
from ..models.models import Category

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("/")
def list_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).order_by(Category.name).all()
    return {"categories": categories}


@router.post("/", status_code=201)
def create_category(name: str, db: Session = Depends(get_db)):
    cat = Category(name=name)
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return {"category": cat}


@router.get("/{category_id}")
def get_category(category_id: int, db: Session = Depends(get_db)):
    cat = db.query(Category).filter(Category.category_id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"category": cat}


@router.delete("/{category_id}", status_code=204)
def delete_category(category_id: int, db: Session = Depends(get_db)):
    cat = db.query(Category).filter(Category.category_id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(cat)
    db.commit()
    return {"message": "Category deleted"}
