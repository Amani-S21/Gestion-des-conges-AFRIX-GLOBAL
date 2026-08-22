"""
Routeur racine de l'API REST v1.
"""

from fastapi import APIRouter
from app.api.routes import auth, users, types_conge, soldes, conges, notifications

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(users.router)
api_router.include_router(types_conge.router)
api_router.include_router(soldes.router)
api_router.include_router(conges.router)
api_router.include_router(notifications.router)