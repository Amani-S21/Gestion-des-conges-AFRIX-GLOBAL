"""
Endpoints de gestion des utilisateurs (reserve aux RH et Managers).
"""

from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.dependencies import require_rh_admin, get_current_user
from app.core.security import get_password_hash
from app.db.session import get_db
from app.models.enums import RoleUtilisateur
from app.models.user import User
from app.repositories.solde_repository import SoldeRepository
from app.repositories.type_conge_repository import TypeCongeRepository
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate, UserResponse, UserUpdate

router = APIRouter(prefix="/users", tags=["Utilisateurs"])


@router.get("/", response_model=List[UserResponse])
def get_users(
    departement: Optional[str] = None,
    role: Optional[RoleUtilisateur] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Liste tous les utilisateurs actifs."""
    return UserRepository.get_all(db, departement=departement, role=role)


@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    user_in: UserCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_rh_admin),
):
    """Creation d'un utilisateur et initialisation de ses soldes annuels (RH uniquement)."""
    if UserRepository.exists_with_email(db, user_in.email):
        raise HTTPException(status_code=400, detail="Un utilisateur avec cet email existe deja.")
    if UserRepository.exists_with_matricule(db, user_in.matricule):
        raise HTTPException(status_code=400, detail="Un utilisateur avec ce matricule existe deja.")

    user = User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        nom=user_in.nom,
        prenom=user_in.prenom,
        matricule=user_in.matricule,
        departement=user_in.departement,
        role=user_in.role,
        is_active=user_in.is_active,
        manager_id=user_in.manager_id,
    )
    user = UserRepository.create(db, user)

    # Initialisation automatique des soldes pour chaque type de conge actif
    types_conge = TypeCongeRepository.get_all_active(db)
    for tc in types_conge:
        SoldeRepository.get_or_create(db, user.id, tc.id)

    return user


@router.get("/{user_id}", response_model=UserResponse)
def get_user_by_id(
    user_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    """Recupere le detail d'un utilisateur."""
    user = UserRepository.get_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable.")
    return user


@router.patch("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int,
    user_in: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Mise a jour partielle d'un utilisateur.
    - Un employe peut uniquement modifier son propre profil (champs limites).
    - Un RH_ADMIN peut modifier n'importe quel utilisateur (tous les champs).
    """
    user = UserRepository.get_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable.")

    # Controle d'acces : un employe ne peut modifier que son propre profil
    if current_user.role != RoleUtilisateur.RH_ADMIN and current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Vous n'etes pas autorise a modifier ce profil.",
        )

    # Les champs sensibles (role, is_active, manager_id) sont reserves au RH_ADMIN
    updates = user_in.model_dump(exclude_unset=True)
    champs_rh_uniquement = {"role", "is_active", "manager_id"}
    if current_user.role != RoleUtilisateur.RH_ADMIN:
        for champ in champs_rh_uniquement:
            updates.pop(champ, None)

    # Verification de l'unicite de l'email si modifie
    if "email" in updates and updates["email"] != user.email:
        if UserRepository.exists_with_email(db, updates["email"], exclude_id=user_id):
            raise HTTPException(status_code=400, detail="Cet email est deja utilise par un autre compte.")

    # Hachage du mot de passe si fourni
    if "password" in updates and updates["password"]:
        updates["hashed_password"] = get_password_hash(updates.pop("password"))
    else:
        updates.pop("password", None)

    for field, value in updates.items():
        setattr(user, field, value)

    return UserRepository.update(db, user)
