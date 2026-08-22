"""
Schémas Pydantic pour la soumission, consultation et validation des demandes de congé.
"""

from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, model_validator
from app.models.enums import StatutDemande, PeriodeJournee
from app.schemas.type_conge import TypeCongeResponse
from app.schemas.user import UserSummary


class DemandeCongeBase(BaseModel):
    type_conge_id: int
    date_debut: date
    date_fin: date
    periode_debut: PeriodeJournee = PeriodeJournee.JOURNEE_COMPLETE
    periode_fin: PeriodeJournee = PeriodeJournee.JOURNEE_COMPLETE
    motif: Optional[str] = None
    justificatif_url: Optional[str] = None


class DemandeCongeCreate(DemandeCongeBase):
    @model_validator(mode="after")
    def verifier_dates(self):
        if self.date_fin < self.date_debut:
            raise ValueError("La date de fin ne peut pas être antérieure à la date de début.")
        return self


class DemandeCongeDecision(BaseModel):
    decision: StatutDemande  # APPROUVEE ou REFUSEE
    commentaire: Optional[str] = None

    @model_validator(mode="after")
    def verifier_decision(self):
        if self.decision not in [StatutDemande.APPROUVEE, StatutDemande.REFUSEE]:
            raise ValueError("La décision doit être soit APPROUVEE, soit REFUSEE.")
        if self.decision == StatutDemande.REFUSEE and not self.commentaire:
            raise ValueError("Un motif est obligatoire en cas de refus.")
        return self


class DemandeCongeResponse(BaseModel):
    id: int
    employe_id: int
    type_conge_id: int
    date_debut: date
    date_fin: date
    periode_debut: PeriodeJournee
    periode_fin: PeriodeJournee
    nombre_jours: float
    motif: Optional[str] = None
    justificatif_url: Optional[str] = None
    statut: StatutDemande
    decideur_id: Optional[int] = None
    commentaire_decision: Optional[str] = None
    date_decision: Optional[datetime] = None
    created_at: datetime
    
    employe: Optional[UserSummary] = None
    decideur: Optional[UserSummary] = None
    type_conge: Optional[TypeCongeResponse] = None

    model_config = ConfigDict(from_attributes=True)