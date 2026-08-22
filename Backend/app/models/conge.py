"""
Modèle DemandeConge représentant une soumission de congé et son cycle de validation.
"""

from datetime import date, datetime
from typing import Optional
from sqlalchemy import String, Date, DateTime, Float, Enum as SQLEnum, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base_class import TimeStampedModel
from app.models.enums import StatutDemande, PeriodeJournee


class DemandeConge(TimeStampedModel):
    __tablename__ = "demandes_conge"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    employe_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    type_conge_id: Mapped[int] = mapped_column(ForeignKey("types_conge.id", ondelete="RESTRICT"), nullable=False)

    date_debut: Mapped[date] = mapped_column(Date, nullable=False)
    date_fin: Mapped[date] = mapped_column(Date, nullable=False)
    periode_debut: Mapped[PeriodeJournee] = mapped_column(
        SQLEnum(PeriodeJournee, name="periode_journee_enum"),
        default=PeriodeJournee.JOURNEE_COMPLETE,
        nullable=False,
    )
    periode_fin: Mapped[PeriodeJournee] = mapped_column(
        SQLEnum(PeriodeJournee, name="periode_journee_enum", create_type=False),
        default=PeriodeJournee.JOURNEE_COMPLETE,
        nullable=False,
    )
    nombre_jours: Mapped[float] = mapped_column(Float, nullable=False)
    motif: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    justificatif_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    statut: Mapped[StatutDemande] = mapped_column(
        SQLEnum(StatutDemande, name="statut_demande_enum"),
        default=StatutDemande.EN_ATTENTE,
        nullable=False,
        index=True,
    )
    
    # Décision du manager ou RH
    decideur_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
    )
    commentaire_decision: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    date_decision: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Relations
    employe: Mapped["User"] = relationship("User", foreign_keys=[employe_id], back_populates="demandes_conge")
    decideur: Mapped[Optional["User"]] = relationship("User", foreign_keys=[decideur_id])
    type_conge: Mapped["TypeConge"] = relationship("TypeConge", back_populates="demandes")