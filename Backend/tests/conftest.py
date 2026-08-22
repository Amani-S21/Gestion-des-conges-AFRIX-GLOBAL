"""
Fixtures pytest partagees pour tous les tests du backend.
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from app.db.base import Base
from app.db.session import get_db
from app.main import app
from app.core.security import get_password_hash
from app.models.enums import RoleUtilisateur
from app.models.user import User
from app.models.type_conge import TypeConge

# --- Base de donnees SQLite en memoire pour les tests ---
SQLALCHEMY_TEST_URL = "sqlite:///./test.db"

engine_test = create_engine(
    SQLALCHEMY_TEST_URL,
    connect_args={"check_same_thread": False},
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine_test)


@pytest.fixture(scope="session", autouse=True)
def create_test_tables():
    """Cree toutes les tables au debut de la session de tests."""
    Base.metadata.create_all(bind=engine_test)
    yield
    Base.metadata.drop_all(bind=engine_test)


@pytest.fixture()
def db() -> Session:
    """Fournit une session de test isolee avec rollback automatique."""
    connection = engine_test.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture()
def client(db: Session) -> TestClient:
    """Client HTTP de test utilisant la session de test injectee."""
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


# --- Fixtures d'utilisateurs de test ---

@pytest.fixture()
def type_conge_annuel(db: Session) -> TypeConge:
    """Type de conge 'Conge Annuel' pour les tests."""
    tc = TypeConge(
        code="CA",
        libelle="Conge Annuel",
        quota_annuel_defaut=25.0,
        is_active=True,
    )
    db.add(tc)
    db.commit()
    db.refresh(tc)
    return tc


@pytest.fixture()
def employe(db: Session) -> User:
    """Utilisateur employe de test."""
    user = User(
        email="employe@test.com",
        hashed_password=get_password_hash("password123"),
        nom="Dupont",
        prenom="Alice",
        matricule="EMP001",
        departement="Technique",
        role=RoleUtilisateur.EMPLOYE,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture()
def manager(db: Session) -> User:
    """Utilisateur manager de test."""
    user = User(
        email="manager@test.com",
        hashed_password=get_password_hash("password123"),
        nom="Martin",
        prenom="Bob",
        matricule="MGR001",
        departement="Technique",
        role=RoleUtilisateur.MANAGER,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@pytest.fixture()
def rh_admin(db: Session) -> User:
    """Utilisateur RH Admin de test."""
    user = User(
        email="rh@test.com",
        hashed_password=get_password_hash("password123"),
        nom="Bernard",
        prenom="Claire",
        matricule="RH001",
        departement="RH",
        role=RoleUtilisateur.RH_ADMIN,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_token(client: TestClient, email: str, password: str = "password123") -> str:
    """Utilitaire : retourne un access token pour un utilisateur."""
    response = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    assert response.status_code == 200
    return response.json()["access_token"]
