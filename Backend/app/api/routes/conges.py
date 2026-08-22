"""
Endpoints du cycle de vie des demandes de conge.
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_current_user, require_manager_or_rh
from app.db.session import get_db
from app.models.enums import StatutDemande
from app.models.user import User
from app.repositories.conge_repository import CongeRepository
from app.schemas.conge import DemandeCongeCreate, DemandeCongeDecision, DemandeCongeResponse
from app.services.conge_service import CongeService

router = APIRouter(prefix="/conges", tags=["Demandes de Conge"])


@router.post("/", response_model=DemandeCongeResponse, status_code=status.HTTP_201_CREATED)
def create_conge(
    demande_in: DemandeCongeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Soumettre une nouvelle demande de conge."""
    return CongeService.creer_demande(db, current_user, demande_in)


@router.get("/me", response_model=List[DemandeCongeResponse])
def get_my_conges(
    statut: Optional[StatutDemande] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Historique personnel des demandes de conge de l'employe connecte."""
    return CongeRepository.get_by_employe(db, current_user.id, statut)


@router.get("/a-valider", response_model=List[DemandeCongeResponse])
def get_conges_a_valider(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager_or_rh),
):
    """File des demandes en attente de validation (pour les Managers et RH)."""
    return CongeRepository.get_pending_for_manager(db, current_user)


@router.get("/", response_model=List[DemandeCongeResponse])
def get_all_conges(
    statut: Optional[StatutDemande] = None,
    employe_id: Optional[int] = None,
    db: Session = Depends(get_db),
    _: User = Depends(require_manager_or_rh),
):
    """Supervision globale des demandes de conge avec filtres."""
    return CongeRepository.get_all(db, statut, employe_id)


@router.get("/{demande_id}", response_model=DemandeCongeResponse)
def get_conge_by_id(
    demande_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Recupere le detail d'une demande de conge par son identifiant.
    L'employe ne peut consulter que ses propres demandes.
    Les managers et RH peuvent consulter toutes les demandes.
    """
    from app.models.enums import RoleUtilisateur
    demande = CongeRepository.get_by_id(db, demande_id)
    if not demande:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Demande de conge introuvable.")

    # Controle d'acces : l'employe ne voit que ses propres demandes
    if (
        current_user.role == RoleUtilisateur.EMPLOYE
        and demande.employe_id != current_user.id
    ):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Acces non autorise.")

    return demande


@router.post("/{demande_id}/decision", response_model=DemandeCongeResponse)
def decide_conge(
    demande_id: int,
    decision_in: DemandeCongeDecision,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager_or_rh),
):
    """Accepter ou refuser une demande de conge."""
    return CongeService.traiter_decision(db, demande_id, current_user, decision_in)


@router.post("/{demande_id}/annuler", response_model=DemandeCongeResponse)
def cancel_conge(
    demande_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Annuler une demande de conge."""
    return CongeService.annuler_demande(db, demande_id, current_user)
