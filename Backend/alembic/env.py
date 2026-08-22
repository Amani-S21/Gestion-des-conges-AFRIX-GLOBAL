"""
Configuration Alembic - connecte les migrations aux modeles SQLAlchemy du projet.
"""

from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

# -- Import de la configuration et des modeles du projet
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.config import settings
from app.db.base import Base  # noqa: F401 — importe tous les modeles

# --- Configuration Alembic ---
config = context.config

# Injection de l'URL de connexion depuis les parametres du projet
config.set_main_option("sqlalchemy.url", settings.sync_database_url)

# Activation du logging Python si configure dans alembic.ini
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Reference vers les metadonnees contenant la definition de tous les modeles
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """
    Mode hors ligne : genere les scripts SQL sans connexion active.
    Utile pour generer un script a appliquer manuellement en production.
    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """
    Mode en ligne : applique les migrations sur une connexion active.
    Mode recommande pour le developpement et la CI/CD.
    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
