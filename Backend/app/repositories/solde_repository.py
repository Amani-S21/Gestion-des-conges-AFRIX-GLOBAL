"""
Repository d'accès aux données pour les soldes de congés.
"""

from datetime import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.solde_conge import SoldeConge
from app.models.type_conge import TypeConge


class SoldeRepository:
    """Encapsule toutes les requetes SQLAlchemy sur la table soldes_conge."""

    @staticmethod
    def get_by_employe_type_annee(
        db: Session, employe_id: int, type_conge_id: int, annee: int
    ) -> Optional[SoldeConge]:
        """Récupère le solde d'un employé pour un type et une année précis."""
        return (
            db.query(SoldeConge)
            .filter(
                SoldeConge.employe_id == employe_id,
                SoldeConge.type_conge_id == type_conge_id,
                SoldeConge.annee == annee,
            )
            .first()
        )

    @staticmethod
    def get_by_employe(
        db: Session, employe_id: int, annee: Optional[int] = None
    ) -> List[SoldeConge]:
        """Liste les soldes d'un employé, pour une année ou toutes les années."""
        if annee is None:
            annee = datetime.now().year
        return (
            db.query(SoldeConge)
            .filter(SoldeConge.employe_id == employe_id, SoldeConge.annee == annee)
            .all()
        )

    @staticmethod
    def get_by_id(db: Session, solde_id: int) -> Optional[SoldeConge]:
        """Récupère un solde par son identifiant."""
        return db.query(SoldeConge).filter(SoldeConge.id == solde_id).first()

    @staticmethod
    def get_or_create(
        db: Session, employe_id: int, type_conge_id: int, annee: Optional[int] = None
    ) -> SoldeConge:
        """Récupère ou crée le solde pour un employé/type/année."""
        if annee is None:
            annee = datetime.now().year

        solde = SoldeRepository.get_by_employe_type_annee(db, employe_id, type_conge_id, annee)
        if not solde:
            type_conge = db.query(TypeConge).filter(TypeConge.id == type_conge_id).first()
            quota = type_conge.quota_annuel_defaut if type_conge else 0.0
            solde = SoldeConge(
                employe_id=employe_id,
                type_conge_id=type_conge_id,
                annee=annee,
                jours_acquis=quota,
                jours_pris=0.0,
                jours_en_attente=0.0,
            )
            db.add(solde)
            db.commit()
            db.refresh(solde)
        return solde

    @staticmethod
    def update(db: Session, solde: SoldeConge) -> SoldeConge:
        """Persiste les modifications d'un solde existant."""
        db.commit()
        db.refresh(solde)
        return solde
