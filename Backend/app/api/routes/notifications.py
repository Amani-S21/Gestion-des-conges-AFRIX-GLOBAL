"""
Endpoints de consultation et gestion des notifications.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.dependencies import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.repositories.notification_repository import NotificationRepository
from app.schemas.notification import NotificationResponse

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("/", response_model=List[NotificationResponse])
def get_my_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Liste les 30 dernieres notifications de l'utilisateur connecte."""
    return NotificationRepository.get_by_destinataire(db, current_user.id)


@router.patch("/{notification_id}/lire", response_model=NotificationResponse)
def mark_as_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Marquer une notification comme lue."""
    notif = NotificationRepository.get_by_id_and_destinataire(db, notification_id, current_user.id)
    if not notif:
        raise HTTPException(status_code=404, detail="Notification introuvable.")
    return NotificationRepository.mark_as_read(db, notif)
