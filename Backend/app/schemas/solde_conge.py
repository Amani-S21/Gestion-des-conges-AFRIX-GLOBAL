"""
Schémas Pydantic pour les soldes de congés.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.schemas.type_conge import TypeCongeResponse
from app.schemas.user import UserSummary


class SoldeCongeBase(BaseModel):
    type_conge_id: int
    annee: int
    jours_acquis: float = 0.0
    jours_pris: float = 0.0
    jours_en_attente: float = 0.0


class SoldeCongeCreate(SoldeCongeBase):
    employe_id: int


class SoldeCongeUpdate(BaseModel):
    jours_acquis: Optional[float] = None
    jours_pris: Optional[float] = None
    jours_en_attente: Optional[float] = None


class SoldeCongeResponse(BaseModel):
    id: int
    employe_id: int
    type_conge_id: int
    annee: int
    jours_acquis: float
    jours_pris: float
    jours_en_attente: float
    jours_restants: float
    type_conge: Optional[TypeCongeResponse] = None
    employe: Optional[UserSummary] = None
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)