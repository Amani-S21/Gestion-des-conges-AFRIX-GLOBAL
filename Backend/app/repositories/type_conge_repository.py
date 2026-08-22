"""
Repository d'accès aux données pour les types de congé.
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.type_conge import TypeConge


class TypeCongeRepository:
    """Encapsule toutes les requetes SQLAlchemy sur la table types_conge."""

    @staticmethod
    def get_all_active(db: Session) -> List[TypeConge]:
        """Retourne tous les types de congé actifs."""
        return db.query(TypeConge).filter(TypeConge.is_active == True).all()

    @staticmethod
    def get_by_id(db: Session, type_conge_id: int) -> Optional[TypeConge]:
        """Récupère un type de congé par son identifiant."""
        return db.query(TypeConge).filter(TypeConge.id == type_conge_id).first()

    @staticmethod
    def get_by_id_active(db: Session, type_conge_id: int) -> Optional[TypeConge]:
        """Récupère un type de congé actif par son identifiant."""
        return (
            db.query(TypeConge)
            .filter(TypeConge.id == type_conge_id, TypeConge.is_active == True)
            .first()
        )

    @staticmethod
    def get_by_code(db: Session, code: str) -> Optional[TypeConge]:
        """Récupère un type de congé par son code unique."""
        return db.query(TypeConge).filter(TypeConge.code == code).first()

    @staticmethod
    def create(db: Session, type_conge: TypeConge) -> TypeConge:
        """Persiste un nouveau type de congé."""
        db.add(type_conge)
        db.commit()
        db.refresh(type_conge)
        return type_conge
