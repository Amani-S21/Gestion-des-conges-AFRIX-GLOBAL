"""
Tests des endpoints de gestion des demandes de conge.
"""

import pytest
from datetime import date, timedelta
from fastapi.testclient import TestClient
from tests.conftest import get_token


class TestCreerDemande:
    """Tests du endpoint POST /api/v1/conges."""

    def test_creer_demande_succes(self, client: TestClient, employe, type_conge_annuel, db):
        """Un employe peut creer une demande de conge valide."""
        from app.repositories.solde_repository import SoldeRepository
        SoldeRepository.get_or_create(db, employe.id, type_conge_annuel.id, date.today().year)

        token = get_token(client, "employe@test.com")
        demain = date.today() + timedelta(days=1)
        apres_demain = date.today() + timedelta(days=5)
        response = client.post(
            "/api/v1/conges/",
            json={
                "type_conge_id": type_conge_annuel.id,
                "date_debut": str(demain),
                "date_fin": str(apres_demain),
                "motif": "Vacances"
            },
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 201
        data = response.json()
        assert data["statut"] == "EN_ATTENTE"
        assert data["employe_id"] == employe.id

    def test_creer_demande_dates_invalides(self, client: TestClient, employe, type_conge_annuel, db):
        """La date de fin avant la date de debut doit retourner HTTP 422."""
        token = get_token(client, "employe@test.com")
        aujourd_hui = date.today()
        hier = date.today() - timedelta(days=1)
        response = client.post(
            "/api/v1/conges/",
            json={
                "type_conge_id": type_conge_annuel.id,
                "date_debut": str(aujourd_hui),
                "date_fin": str(hier),
            },
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 422

    def test_creer_demande_sans_token(self, client: TestClient, type_conge_annuel):
        """Sans authentification, le endpoint retourne HTTP 401."""
        response = client.post(
            "/api/v1/conges/",
            json={
                "type_conge_id": type_conge_annuel.id,
                "date_debut": str(date.today()),
                "date_fin": str(date.today() + timedelta(days=2)),
            }
        )
        assert response.status_code == 401


class TestMesDemandes:
    """Tests du endpoint GET /api/v1/conges/me."""

    def test_liste_mes_demandes(self, client: TestClient, employe):
        """Un employe peut lister ses demandes (meme si vide)."""
        token = get_token(client, "employe@test.com")
        response = client.get("/api/v1/conges/me", headers={"Authorization": f"Bearer {token}"})
        assert response.status_code == 200
        assert isinstance(response.json(), list)


class TestGetDemandeById:
    """Tests du endpoint GET /api/v1/conges/{id}."""

    def test_employe_voit_sa_propre_demande(self, client: TestClient, employe, type_conge_annuel, db):
        """Un employe peut voir le detail de sa propre demande."""
        from app.models.conge import DemandeConge
        from app.models.enums import StatutDemande, PeriodeJournee
        from app.repositories.solde_repository import SoldeRepository

        SoldeRepository.get_or_create(db, employe.id, type_conge_annuel.id, date.today().year)
        demande = DemandeConge(
            employe_id=employe.id,
            type_conge_id=type_conge_annuel.id,
            date_debut=date.today() + timedelta(days=10),
            date_fin=date.today() + timedelta(days=15),
            periode_debut=PeriodeJournee.JOURNEE_COMPLETE,
            periode_fin=PeriodeJournee.JOURNEE_COMPLETE,
            nombre_jours=4.0,
            statut=StatutDemande.EN_ATTENTE,
        )
        db.add(demande)
        db.commit()
        db.refresh(demande)

        token = get_token(client, "employe@test.com")
        response = client.get(
            f"/api/v1/conges/{demande.id}",
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        assert response.json()["id"] == demande.id

    def test_demande_inexistante_retourne_404(self, client: TestClient, employe):
        """Une demande inexistante retourne HTTP 404."""
        token = get_token(client, "employe@test.com")
        response = client.get("/api/v1/conges/99999", headers={"Authorization": f"Bearer {token}"})
        assert response.status_code == 404


class TestValidation:
    """Tests des endpoints de decision (validation/refus)."""

    def test_manager_ne_peut_pas_valider_sans_lien(self, client: TestClient, manager, employe, type_conge_annuel, db):
        """Un manager ne peut pas valider la demande d'un employe qui n'est pas sous sa supervision."""
        from app.models.conge import DemandeConge
        from app.models.enums import StatutDemande, PeriodeJournee

        demande = DemandeConge(
            employe_id=employe.id,
            type_conge_id=type_conge_annuel.id,
            date_debut=date.today() + timedelta(days=20),
            date_fin=date.today() + timedelta(days=22),
            periode_debut=PeriodeJournee.JOURNEE_COMPLETE,
            periode_fin=PeriodeJournee.JOURNEE_COMPLETE,
            nombre_jours=2.0,
            statut=StatutDemande.EN_ATTENTE,
        )
        db.add(demande)
        db.commit()
        db.refresh(demande)

        token = get_token(client, "manager@test.com")
        response = client.post(
            f"/api/v1/conges/{demande.id}/decision",
            json={"decision": "APPROUVEE"},
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 403
