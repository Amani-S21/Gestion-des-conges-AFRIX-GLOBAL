"""
Endpoints de consultation et gestion des soldes de congés.
"""

from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.dependencies import get_current_user, require_rh_admin
from app.db.session import get_db
from app.models.solde_conge import SoldeConge
from app.models.type_conge import TypeConge
from app.models.user import User
from app.schemas.solde_conge import SoldeCongeResponse, SoldeCongeUpdate
from app.services.solde_service import SoldeService

router = APIRouter(prefix="/soldes", tags=["Soldes de Congé"])


@router.get("/me", response_model=List[SoldeCongeResponse])
def get_my_soldes(
    annee: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Consulter ses soldes disponibles pour l'année en cours."""
    if annee is None:
        annee = datetime.now().year
    
    # S'assurer que tous les types actifs ont une ligne de solde
    types_conge = db.query(TypeConge).filter(TypeConge.is_active == True).all()
    for tc in types_conge:
        SoldeService.get_or_create_solde(db, current_user.id, tc.id, annee)

    return SoldeService.get_soldes_employe(db, current_user.id, annee)


@router.get("/user/{user_id}", response_model=List[SoldeCongeResponse])
def get_user_soldes(
    user_id: int,
    annee: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Consulter les soldes d'un collaborateur (RH ou Manager du collaborateur)."""
    return SoldeService.get_soldes_employe(db, user_id, annee)


@router.put("/{solde_id}", response_model=SoldeCongeResponse)
def update_solde(
    solde_id: int,
    solde_in: SoldeCongeUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_rh_admin),
):
    """Ajustement manuel d'un solde (RH uniquement)."""
    solde = db.query(SoldeConge).filter(SoldeConge.id == solde_id).first()
    if not solde:
        raise HTTPException(status_code=404, detail="Solde introuvable.")

    for field, value in solde_in.model_dump(exclude_unset=True).items():
        setattr(solde, field, value)

    db.commit()
    db.refresh(solde)
    return solde