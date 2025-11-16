from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database.deps import get_db
from ..models.models import CookingMethod

router = APIRouter(prefix="/methods", tags=["cooking_methods"])


@router.get("/")
def list_methods(db: Session = Depends(get_db)):
    methods = db.query(CookingMethod).order_by(CookingMethod.name).all()
    return {"methods": methods}


@router.post("/", status_code=201)
def create_method(name: str, db: Session = Depends(get_db)):
    m = CookingMethod(name=name)
    db.add(m)
    db.commit()
    db.refresh(m)
    return {"method": m}


@router.get("/{method_id}")
def get_method(method_id: int, db: Session = Depends(get_db)):
    m = db.query(CookingMethod).filter(CookingMethod.method_id == method_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Method not found")
    return {"method": m}


@router.delete("/{method_id}", status_code=204)
def delete_method(method_id: int, db: Session = Depends(get_db)):
    m = db.query(CookingMethod).filter(CookingMethod.method_id == method_id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Method not found")
    db.delete(m)
    db.commit()
    return {"message": "Method deleted"}
