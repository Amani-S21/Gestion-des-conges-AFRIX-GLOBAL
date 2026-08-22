"""
Repository d'accès aux données pour les notifications.
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.notification import Notification


class NotificationRepository:
    """Encapsule toutes les requetes SQLAlchemy sur la table notifications."""

    @staticmethod
    def get_by_destinataire(
        db: Session, destinataire_id: int, limit: int = 30
    ) -> List[Notification]:
        """Liste les notifications d'un utilisateur, les plus récentes en premier."""
        return (
            db.query(Notification)
            .filter(Notification.destinataire_id == destinataire_id)
            .order_by(Notification.created_at.desc())
            .limit(limit)
            .all()
        )

    @staticmethod
    def get_by_id_and_destinataire(
        db: Session, notification_id: int, destinataire_id: int
    ) -> Optional[Notification]:
        """Récupère une notification appartenant à un utilisateur précis."""
        return (
            db.query(Notification)
            .filter(
                Notification.id == notification_id,
                Notification.destinataire_id == destinataire_id,
            )
            .first()
        )

    @staticmethod
    def create(db: Session, notification: Notification) -> Notification:
        """Persiste une nouvelle notification (sans commit : le service gère la transaction)."""
        db.add(notification)
        return notification

    @staticmethod
    def mark_as_read(db: Session, notification: Notification) -> Notification:
        """Marque une notification comme lue et persiste le changement."""
        notification.lue = True
        db.commit()
        db.refresh(notification)
        return notification
