"""
Export centralisé de tous les schémas Pydantic.
"""

from app.schemas.token import Token, TokenPayload, LoginRequest
from app.schemas.user import UserCreate, UserUpdate, UserResponse, UserSummary
from app.schemas.type_conge import TypeCongeCreate, TypeCongeUpdate, TypeCongeResponse
from app.schemas.solde_conge import SoldeCongeCreate, SoldeCongeUpdate, SoldeCongeResponse
from app.schemas.conge import DemandeCongeCreate, DemandeCongeDecision, DemandeCongeResponse
from app.schemas.notification import NotificationResponse

__all__ = [
    "Token",
    "TokenPayload",
    "LoginRequest",
    "UserCreate",
    "UserUpdate",
    "UserResponse",
    "UserSummary",
    "TypeCongeCreate",
    "TypeCongeUpdate",
    "TypeCongeResponse",
    "SoldeCongeCreate",
    "SoldeCongeUpdate",
    "SoldeCongeResponse",
    "DemandeCongeCreate",
    "DemandeCongeDecision",
    "DemandeCongeResponse",
    "NotificationResponse",
]