"""
Schémas Pydantic pour les types de congés.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class TypeCongeBase(BaseModel):
    code: str
    libelle: str
    description: Optional[str] = None
    quota_annuel_defaut: float = 0.0
    justificatif_requis: bool = False
    is_active: bool = True


class TypeCongeCreate(TypeCongeBase):
    pass


class TypeCongeUpdate(BaseModel):
    libelle: Optional[str] = None
    description: Optional[str] = None
    quota_annuel_defaut: Optional[float] = None
    justificatif_requis: Optional[bool] = None
    is_active: Optional[bool] = None


class TypeCongeResponse(TypeCongeBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)