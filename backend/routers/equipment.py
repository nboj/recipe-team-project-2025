from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database.deps import get_db
from ..models.models import Equipment

router = APIRouter(prefix="/equipment", tags=["equipment"])


@router.get("/")
def list_equipment(db: Session = Depends(get_db)):
    eq = db.query(Equipment).order_by(Equipment.name).all()
    return {"equipment": eq}


@router.post("/", status_code=201)
def create_equipment(name: str, db: Session = Depends(get_db)):
    e = Equipment(name=name)
    db.add(e)
    db.commit()
    db.refresh(e)
    return {"equipment": e}


@router.get("/{equipment_id}")
def get_equipment(equipment_id: int, db: Session = Depends(get_db)):
    e = db.query(Equipment).filter(Equipment.equipment_id == equipment_id).first()
    if not e:
        raise HTTPException(status_code=404, detail="Equipment not found")
    return {"equipment": e}


@router.delete("/{equipment_id}", status_code=204)
def delete_equipment(equipment_id: int, db: Session = Depends(get_db)):
    e = db.query(Equipment).filter(Equipment.equipment_id == equipment_id).first()
    if not e:
        raise HTTPException(status_code=404, detail="Equipment not found")
    db.delete(e)
    db.commit()
    return {"message": "Equipment deleted"}
