"""
Repository d'accès aux données pour les utilisateurs.
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.enums import RoleUtilisateur
from app.models.user import User


class UserRepository:
    """Encapsule toutes les requetes SQLAlchemy sur la table users."""

    @staticmethod
    def get_by_id(db: Session, user_id: int) -> Optional[User]:
        """Récupère un utilisateur par son identifiant."""
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def get_by_email(db: Session, email: str) -> Optional[User]:
        """Récupère un utilisateur par son adresse e-mail."""
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def get_by_matricule(db: Session, matricule: str) -> Optional[User]:
        """Récupère un utilisateur par son matricule."""
        return db.query(User).filter(User.matricule == matricule).first()

    @staticmethod
    def get_all(
        db: Session,
        departement: Optional[str] = None,
        role: Optional[RoleUtilisateur] = None,
        actif_seulement: bool = True,
    ) -> List[User]:
        """Liste les utilisateurs avec filtres optionnels."""
        query = db.query(User)
        if actif_seulement:
            query = query.filter(User.is_active == True)
        if departement:
            query = query.filter(User.departement == departement)
        if role:
            query = query.filter(User.role == role)
        return query.order_by(User.nom, User.prenom).all()

    @staticmethod
    def create(db: Session, user: User) -> User:
        """Persiste un nouvel utilisateur."""
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def update(db: Session, user: User) -> User:
        """Persiste les modifications d'un utilisateur existant."""
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def exists_with_email(db: Session, email: str, exclude_id: Optional[int] = None) -> bool:
        """Vérifie si un email est déjà utilisé (utile pour la mise à jour)."""
        query = db.query(User).filter(User.email == email)
        if exclude_id:
            query = query.filter(User.id != exclude_id)
        return query.first() is not None

    @staticmethod
    def exists_with_matricule(db: Session, matricule: str, exclude_id: Optional[int] = None) -> bool:
        """Vérifie si un matricule est déjà utilisé."""
        query = db.query(User).filter(User.matricule == matricule)
        if exclude_id:
            query = query.filter(User.id != exclude_id)
        return query.first() is not None
