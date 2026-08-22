"""
Gestion de la session et du moteur de base de données PostgreSQL.
"""

from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from app.core.config import settings

# Création du moteur SQLAlchemy
engine = create_engine(
    settings.sync_database_url,
    pool_pre_ping=True,  # Vérifie la validité de la connexion avant chaque requête
    pool_size=10,
    max_overflow=20,
)

# Fabrique de sessions locales
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def get_db() -> Generator[Session, None, None]:
    """
    Dépendance FastAPI fournissant une session de base de données par requête.
    Garantit la fermeture propre de la session après l'exécution.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()