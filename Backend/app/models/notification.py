"""
Modèle Notification pour alerter les utilisateurs lors des changements de statut.
"""

from sqlalchemy import String, Boolean, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base_class import TimeStampedModel


class Notification(TimeStampedModel):
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    destinataire_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    titre: Mapped[str] = mapped_column(String(150), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    lue: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    lien: Mapped[str] = mapped_column(String(255), nullable=True)

    # Relations
    destinataire: Mapped["User"] = relationship("User", back_populates="notifications")