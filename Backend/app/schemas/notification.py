"""
Schémas Pydantic pour les notifications.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class NotificationResponse(BaseModel):
    id: int
    destinataire_id: int
    titre: str
    message: str
    lue: bool
    lien: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)