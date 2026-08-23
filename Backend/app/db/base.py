"""
Point de rassemblement de la base SQLAlchemy et de tous les modèles pour Alembic.
"""

from app.db.base_class import Base, TimeStampedModel  # noqa: F401
from app.models.user import User  # noqa: F401
from app.models.type_conge import TypeConge  # noqa: F401
from app.models.solde_conge import SoldeConge  # noqa: F401
from app.models.conge import DemandeConge  # noqa: F401
from app.models.notification import Notification  # noqa: F401