"""
Modèle TypeConge définissant les catégories de congés (Payés, RTT, Maladie, etc.).
"""

from typing import List
from sqlalchemy import String, Boolean, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base_class import TimeStampedModel


class TypeConge(TimeStampedModel):
    __tablename__ = "types_conge"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    code: Mapped[str] = mapped_column(String(20), unique=True, index=True, nullable=False)
    libelle: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str] = mapped_column(String(255), nullable=True)
    quota_annuel_defaut: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    justificatif_requis: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relations
    demandes: Mapped[List["DemandeConge"]] = relationship("DemandeConge", back_populates="type_conge")
    soldes: Mapped[List["SoldeConge"]] = relationship("SoldeConge", back_populates="type_conge")