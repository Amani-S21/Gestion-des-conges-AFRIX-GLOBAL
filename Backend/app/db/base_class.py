"""
Classe de base déclarative pour tous les modèles SQLAlchemy de l'application.
"""

from datetime import datetime
from sqlalchemy import DateTime, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    """Classe de base pour tous les modèles ORM."""
    pass


class TimeStampedModel(Base):
    """
    Classe abstraite ajoutant automatiquement les dates de création 
    et de mise à jour sur les entités métier.
    """
    __abstract__ = True

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        comment="Date et heure de création de l'enregistrement",
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
        comment="Date et heure de dernière modification",
    )