"""
Modèle Utilisateur représentant un employé, un manager ou un administrateur RH.
"""

from typing import List, Optional
from sqlalchemy import String, Boolean, Enum as SQLEnum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base_class import TimeStampedModel
from app.models.enums import RoleUtilisateur


class User(TimeStampedModel):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    nom: Mapped[str] = mapped_column(String(100), nullable=False)
    prenom: Mapped[str] = mapped_column(String(100), nullable=False)
    matricule: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    departement: Mapped[str] = mapped_column(String(100), nullable=False, default="Général")
    role: Mapped[RoleUtilisateur] = mapped_column(
        SQLEnum(RoleUtilisateur, name="role_utilisateur_enum"),
        default=RoleUtilisateur.EMPLOYE,
        nullable=False,
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Hiérarchie : Un employé peut avoir un manager
    manager_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )

    # Relations
    manager: Mapped[Optional["User"]] = relationship(
        "User",
        remote_side=[id],
        back_populates="collaborateurs",
    )
    collaborateurs: Mapped[List["User"]] = relationship(
        "User",
        back_populates="manager",
    )
    demandes_conge: Mapped[List["DemandeConge"]] = relationship(
        "DemandeConge",
        back_populates="employe",
        foreign_keys="[DemandeConge.employe_id]",
        cascade="all, delete-orphan",
    )
    soldes_conge: Mapped[List["SoldeConge"]] = relationship(
        "SoldeConge",
        back_populates="employe",
        cascade="all, delete-orphan",
    )
    notifications: Mapped[List["Notification"]] = relationship(
        "Notification",
        back_populates="destinataire",
        cascade="all, delete-orphan",
    )