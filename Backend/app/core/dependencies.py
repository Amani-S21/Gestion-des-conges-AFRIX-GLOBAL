"""
Dépendances FastAPI pour l'authentification et le contrôle d'accès basé sur les rôles (RBAC).
"""

from typing import List
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from app.core.config import settings
from app.db.session import get_db
from app.models.enums import RoleUtilisateur
from app.models.user import User
from app.schemas.token import TokenPayload

# Point de récupération du token (format standard OAuth2 Bearer)
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)


def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
) -> User:
    """
    Vérifie la validité du token JWT et retourne l'utilisateur connecté.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Identifiants non valides ou session expirée.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        token_data = TokenPayload(sub=user_id, role=payload.get("role"))
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.id == int(token_data.sub)).first()
    if user is None:
        raise credentials_exception
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Ce compte utilisateur est désactivé.",
        )
    return user


def require_roles(allowed_roles: List[RoleUtilisateur]):
    """
    Générateur de dépendance vérifiant si l'utilisateur possède l'un des rôles requis.
    """
    def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Vous n'avez pas les droits nécessaires pour effectuer cette action.",
            )
        return current_user
    return role_checker


# Raccourcis de dépendances pour les routes
require_manager_or_rh = require_roles([RoleUtilisateur.MANAGER, RoleUtilisateur.RH_ADMIN])
require_rh_admin = require_roles([RoleUtilisateur.RH_ADMIN])