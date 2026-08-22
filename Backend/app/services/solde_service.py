"""
Service de gestion des soldes de conges des employes.
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.solde_conge import SoldeConge
from app.repositories.solde_repository import SoldeRepository
from app.repositories.type_conge_repository import TypeCongeRepository


class SoldeService:
    @staticmethod
    def get_or_create_solde(
        db: Session, employe_id: int, type_conge_id: int, annee: Optional[int] = None
    ) -> SoldeConge:
        """Recupere le solde pour une annee donnee ou le cree a partir du quota par defaut."""
        return SoldeRepository.get_or_create(db, employe_id, type_conge_id, annee)

    @staticmethod
    def get_soldes_employe(
        db: Session, employe_id: int, annee: Optional[int] = None
    ) -> List[SoldeConge]:
        """Retourne l'ensemble des soldes d'un employe pour l'annee."""
        return SoldeRepository.get_by_employe(db, employe_id, annee)

    @staticmethod
    def ensure_soldes_for_all_types(db: Session, employe_id: int, annee: Optional[int] = None) -> List[SoldeConge]:
        """S'assure que l'employe a un solde pour chaque type de conge actif."""
        types_actifs = TypeCongeRepository.get_all_active(db)
        for tc in types_actifs:
            SoldeRepository.get_or_create(db, employe_id, tc.id, annee)
        return SoldeRepository.get_by_employe(db, employe_id, annee)
