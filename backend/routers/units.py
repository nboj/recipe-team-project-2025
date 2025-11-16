from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database.deps import get_db
from ..models.models import Unit

router = APIRouter(prefix="/units", tags=["units"])


@router.get("/")
def list_units(db: Session = Depends(get_db)):
    units = db.query(Unit).order_by(Unit.name).all()
    return {"units": units}


@router.post("/", status_code=201)
def create_unit(name: str, abbreviation: str, db: Session = Depends(get_db)):
    unit = Unit(name=name, abbreviation=abbreviation)
    db.add(unit)
    db.commit()
    db.refresh(unit)
    return {"unit": unit}


@router.get("/{unit_id}")
def get_unit(unit_id: int, db: Session = Depends(get_db)):
    unit = db.query(Unit).filter(Unit.unit_id == unit_id).first()
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")
    return {"unit": unit}


@router.delete("/{unit_id}", status_code=204)
def delete_unit(unit_id: int, db: Session = Depends(get_db)):
    unit = db.query(Unit).filter(Unit.unit_id == unit_id).first()
    if not unit:
        raise HTTPException(status_code=404, detail="Unit not found")
    db.delete(unit)
    db.commit()
    return {"message": "Unit deleted"}
