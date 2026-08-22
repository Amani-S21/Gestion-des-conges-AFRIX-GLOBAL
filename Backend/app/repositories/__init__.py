"""
Couche d'accès aux données (Repository pattern).
Chaque repository encapsule les requetes SQLAlchemy pour un modele donne.
"""

from app.repositories.user_repository import UserRepository
from app.repositories.conge_repository import CongeRepository
from app.repositories.solde_repository import SoldeRepository
from app.repositories.notification_repository import NotificationRepository
from app.repositories.type_conge_repository import TypeCongeRepository

__all__ = [
    "UserRepository",
    "CongeRepository",
    "SoldeRepository",
    "NotificationRepository",
    "TypeCongeRepository",
]
