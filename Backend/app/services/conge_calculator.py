"""
Calculateur de durée des congés (jours ouvrés et demi-journées).
"""

from datetime import date, timedelta
from app.models.enums import PeriodeJournee


def calculer_jours_ouvres(
    date_debut: date,
    date_fin: date,
    periode_debut: PeriodeJournee = PeriodeJournee.JOURNEE_COMPLETE,
    periode_fin: PeriodeJournee = PeriodeJournee.JOURNEE_COMPLETE,
) -> float:
    """
    Calcule le nombre de jours ouvrés (du lundi au vendredi) entre deux dates,
    en ajustant pour les demi-journées.
    """
    if date_fin < date_debut:
        return 0.0

    # Si c'est sur la même journée
    if date_debut == date_fin:
        if date_debut.weekday() >= 5:  # Samedi (5) ou Dimanche (6)
            return 0.0
        if periode_debut in [PeriodeJournee.MATIN, PeriodeJournee.APRES_MIDI]:
            return 0.5
        return 1.0

    total_jours = 0.0
    current_date = date_debut

    while current_date <= date_fin:
        # Exclusion des week-ends
        if current_date.weekday() < 5:
            if current_date == date_debut:
                if periode_debut in [PeriodeJournee.MATIN, PeriodeJournee.APRES_MIDI]:
                    total_jours += 0.5
                else:
                    total_jours += 1.0
            elif current_date == date_fin:
                if periode_fin in [PeriodeJournee.MATIN, PeriodeJournee.APRES_MIDI]:
                    total_jours += 0.5
                else:
                    total_jours += 1.0
            else:
                total_jours += 1.0
        current_date += timedelta(days=1)

    return total_jours