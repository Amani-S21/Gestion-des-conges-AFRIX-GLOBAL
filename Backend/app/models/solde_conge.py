"""
Modèle SoldeConge pour suivre le quota de jours alloués, pris et restants par employé.
"""

from sqlalchemy import Integer, Float, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base_class import TimeStampedModel


class SoldeConge(TimeStampedModel):
    __tablename__ = "soldes_conge"
    __table_args__ = (
        UniqueConstraint("employe_id", "type_conge_id", "annee", name="uq_employe_type_annee"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    employe_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type_conge_id: Mapped[int] = mapped_column(ForeignKey("types_conge.id", ondelete="RESTRICT"), nullable=False)
    annee: Mapped[int] = mapped_column(Integer, nullable=False)

    jours_acquis: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    jours_pris: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    jours_en_attente: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)

    # Relations
    employe: Mapped["User"] = relationship("User", back_populates="soldes_conge")
    type_conge: Mapped["TypeConge"] = relationship("TypeConge", back_populates="soldes")

    @property
    def jours_restants(self) -> float:
        """Calcule le solde disponible immédiat."""
        return max(0.0, self.jours_acquis - self.jours_pris - self.jours_en_attente)