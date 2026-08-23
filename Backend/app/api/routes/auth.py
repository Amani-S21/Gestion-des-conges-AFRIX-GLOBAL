"""
Endpoints d'authentification et de gestion de session.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from jose import JWTError
from sqlalchemy.orm import Session
from app.core.security import create_access_token, create_refresh_token, decode_token, verify_password
from app.core.dependencies import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.token import LoginRequest, RefreshTokenRequest, Token, TokenPair, TokenPayload
from app.schemas.user import UserResponse

router = APIRouter(prefix="/auth", tags=["Authentification"])


@router.post("/login", response_model=TokenPair)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """
    Connexion utilisateur.
    Retourne une paire de jetons : access_token (courte duree) + refresh_token (longue duree).
    """
    user = UserRepository.get_by_email(db, login_data.email)
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou mot de passe incorrect.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Ce compte utilisateur est inactif.",
        )

    access_token = create_access_token(subject=user.id, role=user.role.value)
    refresh_token = create_refresh_token(subject=user.id)

    return TokenPair(access_token=access_token, refresh_token=refresh_token)


@router.post("/refresh", response_model=Token)
def refresh_access_token(
    body: RefreshTokenRequest,
    db: Session = Depends(get_db),
):
    """
    Rafraichissement du jeton d'acces a partir d'un refresh token valide.
    Le refresh token doit etre de type 'refresh' (champ type dans le payload).
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Jeton de rafraichissement invalide ou expire.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_token(body.refresh_token)
        token_type: str = payload.get("type")
        user_id: str = payload.get("sub")

        if token_type != "refresh" or user_id is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    user = UserRepository.get_by_id(db, int(user_id))
    if not user or not user.is_active:
        raise credentials_exception

    new_access_token = create_access_token(subject=user.id, role=user.role.value)
    return Token(access_token=new_access_token)


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Recupere les informations du compte connecte."""
    return current_user
