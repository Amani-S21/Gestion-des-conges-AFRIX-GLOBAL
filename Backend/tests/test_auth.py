"""
Tests des endpoints d'authentification : login, refresh, profil.
"""

import pytest
from fastapi.testclient import TestClient
from tests.conftest import get_token


class TestLogin:
    """Tests du endpoint POST /api/v1/auth/login."""

    def test_login_succes(self, client: TestClient, employe):
        """Un employe peut se connecter avec ses bons identifiants."""
        response = client.post("/api/v1/auth/login", json={
            "email": "employe@test.com",
            "password": "password123"
        })
        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["token_type"] == "bearer"

    def test_login_email_incorrect(self, client: TestClient, employe):
        """Un email inconnu retourne HTTP 401."""
        response = client.post("/api/v1/auth/login", json={
            "email": "inconnu@test.com",
            "password": "password123"
        })
        assert response.status_code == 401

    def test_login_mot_de_passe_incorrect(self, client: TestClient, employe):
        """Un mauvais mot de passe retourne HTTP 401."""
        response = client.post("/api/v1/auth/login", json={
            "email": "employe@test.com",
            "password": "mauvais_mdp"
        })
        assert response.status_code == 401

    def test_login_compte_inactif(self, client: TestClient, db):
        """Un compte desactive retourne HTTP 403."""
        from app.models.user import User
        from app.models.enums import RoleUtilisateur
        from app.core.security import get_password_hash
        user = User(
            email="inactif@test.com",
            hashed_password=get_password_hash("password123"),
            nom="Inactif",
            prenom="User",
            matricule="INA001",
            departement="Test",
            role=RoleUtilisateur.EMPLOYE,
            is_active=False,
        )
        db.add(user)
        db.commit()
        response = client.post("/api/v1/auth/login", json={
            "email": "inactif@test.com",
            "password": "password123"
        })
        assert response.status_code == 403


class TestRefreshToken:
    """Tests du endpoint POST /api/v1/auth/refresh."""

    def test_refresh_succes(self, client: TestClient, employe):
        """Un refresh token valide permet d'obtenir un nouveau access token."""
        login_resp = client.post("/api/v1/auth/login", json={
            "email": "employe@test.com",
            "password": "password123"
        })
        refresh_token = login_resp.json()["refresh_token"]

        response = client.post("/api/v1/auth/refresh", json={"refresh_token": refresh_token})
        assert response.status_code == 200
        assert "access_token" in response.json()
        assert "refresh_token" not in response.json()  # refresh retourne seulement l'access

    def test_refresh_token_invalide(self, client: TestClient, employe):
        """Un refresh token invalide retourne HTTP 401."""
        response = client.post("/api/v1/auth/refresh", json={"refresh_token": "jeton.invalide.xxx"})
        assert response.status_code == 401

    def test_access_token_ne_peut_pas_rafraichir(self, client: TestClient, employe):
        """Un access token ne doit pas etre accepte comme refresh token."""
        login_resp = client.post("/api/v1/auth/login", json={
            "email": "employe@test.com",
            "password": "password123"
        })
        access_token = login_resp.json()["access_token"]

        response = client.post("/api/v1/auth/refresh", json={"refresh_token": access_token})
        assert response.status_code == 401


class TestGetMe:
    """Tests du endpoint GET /api/v1/auth/me."""

    def test_get_me_authentifie(self, client: TestClient, employe):
        """Un utilisateur connecte peut recuperer son profil."""
        token = get_token(client, "employe@test.com")
        response = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "employe@test.com"
        assert "hashed_password" not in data

    def test_get_me_non_authentifie(self, client: TestClient):
        """Sans token, le endpoint retourne HTTP 401."""
        response = client.get("/api/v1/auth/me")
        assert response.status_code == 401
