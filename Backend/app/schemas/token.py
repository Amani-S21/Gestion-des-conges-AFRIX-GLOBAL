"""
Schemas d'authentification et de jetons JWT.
"""

from typing import Optional
from pydantic import BaseModel, EmailStr


class Token(BaseModel):
    """Reponse standard lors d'un login : access token uniquement."""
    access_token: str
    token_type: str = "bearer"


class TokenPair(BaseModel):
    """Paire de jetons emise lors d'une connexion : acces + rafraichissement."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshTokenRequest(BaseModel):
    """Corps de la requete POST /auth/refresh."""
    refresh_token: str


class TokenPayload(BaseModel):
    sub: Optional[str] = None
    role: Optional[str] = None
    type: Optional[str] = None
    exp: Optional[int] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str
