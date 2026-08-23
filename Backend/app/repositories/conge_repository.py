"""
Repository d'accès aux données pour les demandes de congé.
"""

from datetime import date
from typing import List, Optional
from sqlalchemy import and_
from sqlalchemy.orm import Session
from app.models.conge import DemandeConge
from app.models.enums import StatutDemande, RoleUtilisateur
from app.models.user import User


class CongeRepository:
    """Encapsule toutes les requetes SQLAlchemy sur la table demandes_conge."""

    @staticmethod
    def get_by_id(db: Session, demande_id: int) -> Optional[DemandeConge]:
        """Récupère une demande de congé par son identifiant."""
        return db.query(DemandeConge).filter(DemandeConge.id == demande_id).first()

    @staticmethod
    def get_by_employe(
        db: Session,
        employe_id: int,
        statut: Optional[StatutDemande] = None,
    ) -> List[DemandeConge]:
        """Liste les demandes d'un employé, avec filtre optionnel sur le statut."""
        query = db.query(DemandeConge).filter(DemandeConge.employe_id == employe_id)
        if statut:
            query = query.filter(DemandeConge.statut == statut)
        return query.order_by(DemandeConge.created_at.desc()).all()

    @staticmethod
    def get_pending_for_manager(db: Session, manager: User) -> List[DemandeConge]:
        """
        Retourne les demandes en attente visibles par ce manager.
        - RH_ADMIN : toutes les demandes en attente.
        - MANAGER : uniquement celles de ses collaborateurs.
        """
        query = db.query(DemandeConge).filter(DemandeConge.statut == StatutDemande.EN_ATTENTE)
        if manager.role == RoleUtilisateur.MANAGER:
            collaborateurs_ids = [c.id for c in manager.collaborateurs]
            query = query.filter(DemandeConge.employe_id.in_(collaborateurs_ids))
        return query.order_by(DemandeConge.created_at.asc()).all()

    @staticmethod
    def get_all(
        db: Session,
        statut: Optional[StatutDemande] = None,
        employe_id: Optional[int] = None,
    ) -> List[DemandeConge]:
        """Supervision globale : liste toutes les demandes avec filtres optionnels."""
        query = db.query(DemandeConge)
        if statut:
            query = query.filter(DemandeConge.statut == statut)
        if employe_id:
            query = query.filter(DemandeConge.employe_id == employe_id)
        return query.order_by(DemandeConge.created_at.desc()).all()

    @staticmethod
    def find_overlap(
        db: Session,
        employe_id: int,
        date_debut: date,
        date_fin: date,
    ) -> Optional[DemandeConge]:
        """
        Détecte un chevauchement avec une demande existante (EN_ATTENTE ou APPROUVEE).
        Retourne la première demande en conflit ou None.
        """
        return (
            db.query(DemandeConge)
            .filter(
                DemandeConge.employe_id == employe_id,
                DemandeConge.statut.in_([StatutDemande.EN_ATTENTE, StatutDemande.APPROUVEE]),
                and_(
                    DemandeConge.date_debut <= date_fin,
                    DemandeConge.date_fin >= date_debut,
                ),
            )
            .first()
        )

    @staticmethod
    def create(db: Session, demande: DemandeConge) -> DemandeConge:
        """Persiste une nouvelle demande de congé."""
        db.add(demande)
        db.commit()
        db.refresh(demande)
        return demande

    @staticmethod
    def update(db: Session, demande: DemandeConge) -> DemandeConge:
        """Persiste les modifications d'une demande existante."""
        db.commit()
        db.refresh(demande)
        return demande
