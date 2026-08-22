"""
Endpoints de gestion des catégories de congés.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.dependencies import require_rh_admin, get_current_user
from app.db.session import get_db
from app.models.type_conge import TypeConge
from app.models.user import User
from app.schemas.type_conge import TypeCongeCreate, TypeCongeResponse, TypeCongeUpdate

router = APIRouter(prefix="/types-conge", tags=["Types de Congé"])


@router.get("/", response_model=List[TypeCongeResponse])
def get_types_conge(db: Session = Depends(get_db), _: User = Depends(get_current_user)):
    """Liste tous les types de congés disponibles."""
    return db.query(TypeConge).filter(TypeConge.is_active == True).all()


@router.post("/", response_model=TypeCongeResponse, status_code=status.HTTP_201_CREATED)
def create_type_conge(
    type_in: TypeCongeCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_rh_admin),
):
    """Création d'un type de congé (RH uniquement)."""
    if db.query(TypeConge).filter(TypeConge.code == type_in.code).first():
        raise HTTPException(status_code=400, detail="Ce code de congé existe déjà.")
    
    type_conge = TypeConge(**type_in.model_dump())
    db.add(type_conge)
    db.commit()
    db.refresh(type_conge)
    return type_conge