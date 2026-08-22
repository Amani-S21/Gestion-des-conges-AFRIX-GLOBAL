"""
Point d'entrée principal de l'application FastAPI AFRIX GLOBAL.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.router import api_router
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Création automatique des tables au démarrage si elles n'existent pas
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API REST pour la gestion des congés et absences - AFRIX GLOBAL",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Configuration des en-têtes CORS (permet la communication avec Angular sur localhost:4200)
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Inclusion du routeur racine API v1
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/health", tags=["Santé"])
def health_check():
    """Endpoint de contrôle de l'état de l'API."""
    return {"status": "ok", "app": settings.PROJECT_NAME}