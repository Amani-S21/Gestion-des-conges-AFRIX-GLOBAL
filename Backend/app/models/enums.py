"""
Énumérations métier pour les rôles, les statuts et les types de périodes.
"""

from enum import Enum


class RoleUtilisateur(str, Enum):
    """Rôles définis dans l'application AFRIX GLOBAL."""
    EMPLOYE = "EMPLOYE"
    MANAGER = "MANAGER"
    RH_ADMIN = "RH_ADMIN"


class StatutDemande(str, Enum):
    """Statuts du cycle de vie d'une demande de congé."""
    EN_ATTENTE = "EN_ATTENTE"
    APPROUVEE = "APPROUVEE"
    REFUSEE = "REFUSEE"
    ANNULEE = "ANNULEE"


class PeriodeJournee(str, Enum):
    """Précision pour les demi-journées."""
    JOURNEE_COMPLETE = "JOURNEE_COMPLETE"
    MATIN = "MATIN"
    APRES_MIDI = "APRES_MIDI"