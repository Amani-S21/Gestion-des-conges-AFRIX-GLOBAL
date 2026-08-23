"""
Tests des endpoints de gestion des utilisateurs.
"""

import pytest
from fastapi.testclient import TestClient
from tests.conftest import get_token


class TestListeUtilisateurs:
    """Tests du endpoint GET /api/v1/users."""

    def test_employe_peut_lister(self, client: TestClient, employe):
        """N'importe quel utilisateur connecte peut lister les employes."""
        token = get_token(client, "employe@test.com")
        response = client.get("/api/v1/users/", headers={"Authorization": f"Bearer {token}"})
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_non_authentifie_interdit(self, client: TestClient, employe):
        """Sans token, le endpoint retourne HTTP 401."""
        response = client.get("/api/v1/users/")
        assert response.status_code == 401


class TestCreerUtilisateur:
    """Tests du endpoint POST /api/v1/users."""

    def test_rh_peut_creer(self, client: TestClient, rh_admin):
        """Un RH Admin peut creer un nouvel utilisateur."""
        token = get_token(client, "rh@test.com")
        response = client.post(
            "/api/v1/users/",
            json={
                "email": "nouveau@test.com",
                "password": "motdepasse123",
                "nom": "Nouveau",
                "prenom": "User",
                "matricule": "NVU001",
                "departement": "Technique",
                "role": "EMPLOYE",
            },
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 201
        assert response.json()["email"] == "nouveau@test.com"
        assert "hashed_password" not in response.json()

    def test_employe_ne_peut_pas_creer(self, client: TestClient, employe):
        """Un simple employe ne peut pas creer d'utilisateur."""
        token = get_token(client, "employe@test.com")
        response = client.post(
            "/api/v1/users/",
            json={
                "email": "nouvel2@test.com",
                "password": "motdepasse123",
                "nom": "Test",
                "prenom": "User",
                "matricule": "TST002",
                "departement": "Test",
                "role": "EMPLOYE",
            },
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 403

    def test_email_duplique_interdit(self, client: TestClient, rh_admin, employe):
        """La creation avec un email deja utilise retourne HTTP 400."""
        token = get_token(client, "rh@test.com")
        response = client.post(
            "/api/v1/users/",
            json={
                "email": "employe@test.com",  # email deja utilise
                "password": "motdepasse123",
                "nom": "Doublon",
                "prenom": "User",
                "matricule": "DBL001",
                "departement": "Test",
                "role": "EMPLOYE",
            },
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 400


class TestMettreAJourUtilisateur:
    """Tests du endpoint PATCH /api/v1/users/{id}."""

    def test_employe_peut_modifier_son_propre_profil(self, client: TestClient, employe):
        """Un employe peut modifier son propre departement."""
        token = get_token(client, "employe@test.com")
        response = client.patch(
            f"/api/v1/users/{employe.id}",
            json={"departement": "Innovation"},
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        assert response.json()["departement"] == "Innovation"

    def test_employe_ne_peut_pas_modifier_son_role(self, client: TestClient, employe):
        """Un employe ne peut pas s'auto-promouvoir en RH."""
        token = get_token(client, "employe@test.com")
        response = client.patch(
            f"/api/v1/users/{employe.id}",
            json={"role": "RH_ADMIN"},
            headers={"Authorization": f"Bearer {token}"}
        )
        # La requete reussit mais le role ne change pas (champ ignore)
        assert response.status_code == 200
        assert response.json()["role"] == "EMPLOYE"

    def test_employe_ne_peut_pas_modifier_autre_profil(self, client: TestClient, employe, manager):
        """Un employe ne peut pas modifier le profil d'un autre utilisateur."""
        token = get_token(client, "employe@test.com")
        response = client.patch(
            f"/api/v1/users/{manager.id}",
            json={"departement": "Pirate"},
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 403

    def test_rh_peut_modifier_n_importe_quel_profil(self, client: TestClient, rh_admin, employe):
        """Un RH Admin peut modifier n'importe quel utilisateur."""
        token = get_token(client, "rh@test.com")
        response = client.patch(
            f"/api/v1/users/{employe.id}",
            json={"departement": "Modifie par RH", "is_active": False},
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 200
        assert response.json()["departement"] == "Modifie par RH"
        assert response.json()["is_active"] == False

    def test_utilisateur_inexistant_retourne_404(self, client: TestClient, rh_admin):
        """Un id inexistant retourne HTTP 404."""
        token = get_token(client, "rh@test.com")
        response = client.patch(
            "/api/v1/users/99999",
            json={"departement": "X"},
            headers={"Authorization": f"Bearer {token}"}
        )
        assert response.status_code == 404
