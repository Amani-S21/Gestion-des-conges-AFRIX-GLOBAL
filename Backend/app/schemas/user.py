"""
Schémas Pydantic pour la gestion des utilisateurs.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict
from app.models.enums import RoleUtilisateur


class UserSummary(BaseModel):
    id: int
    nom: str
    prenom: str
    email: EmailStr
    matricule: str

    model_config = ConfigDict(from_attributes=True)


class UserBase(BaseModel):
    email: EmailStr
    nom: str
    prenom: str
    matricule: str
    departement: str = "Général"
    role: RoleUtilisateur = RoleUtilisateur.EMPLOYE
    is_active: bool = True
    manager_id: Optional[int] = None


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    nom: Optional[str] = None
    prenom: Optional[str] = None
    departement: Optional[str] = None
    role: Optional[RoleUtilisateur] = None
    is_active: Optional[bool] = None
    manager_id: Optional[int] = None
    password: Optional[str] = None


class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime
    manager: Optional[UserSummary] = None

    model_config = ConfigDict(from_attributes=True)