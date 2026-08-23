"""
Script de peuplement initial (Seed) pour créer les comptes de test et types de congés.
"""

from datetime import datetime
from app.core.security import get_password_hash
from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.models.enums import RoleUtilisateur
from app.models.type_conge import TypeConge
from app.models.user import User
from app.services.solde_service import SoldeService


def seed_data():
    # 1. Création des tables
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        print("Initialisation des données AFRIX GLOBAL...")

        # 2. Types de congés par défaut avec libellés complets
        types_conge_init = [
            {
                "code": "CP",
                "libelle": "Congés Payés Annuels",
                "description": "Congés annuels rémunérés légaux (25 jours / an)",
                "quota_annuel_defaut": 25.0,
                "justificatif_requis": False,
            },
            {
                "code": "RTT",
                "libelle": "Réduction du Temps de Travail (RTT)",
                "description": "Jours de repos accordés au titre de la réduction du temps de travail",
                "quota_annuel_defaut": 10.0,
                "justificatif_requis": False,
            },
            {
                "code": "MALADIE",
                "libelle": "Congé Maladie",
                "description": "Arrêt maladie couvert avec justificatif/certificat médical",
                "quota_annuel_defaut": 0.0,
                "justificatif_requis": True,
            },
            {
                "code": "SANS_SOLDE",
                "libelle": "Congé Sans Solde",
                "description": "Absence autorisée non rémunérée",
                "quota_annuel_defaut": 0.0,
                "justificatif_requis": False,
            },
        ]

        types_map = {}
        for item in types_conge_init:
            tc = db.query(TypeConge).filter(TypeConge.code == item["code"]).first()
            if not tc:
                tc = TypeConge(**item)
                db.add(tc)
                db.commit()
                db.refresh(tc)
            else:
                tc.libelle = item["libelle"]
                tc.description = item["description"]
                db.commit()
                db.refresh(tc)
            types_map[tc.code] = tc

        print("Types de congés configurés avec succès.")

        # 3. Utilisateur Administrateur RH
        admin = db.query(User).filter(User.email == "admin@afrix.com").first()
        if not admin:
            admin = User(
                email="admin@afrix.com",
                hashed_password=get_password_hash("admin123"),
                nom="KABORE",
                prenom="Aminata",
                matricule="AFX-RH-001",
                departement="Ressources Humaines",
                role=RoleUtilisateur.RH_ADMIN,
                is_active=True,
            )
            db.add(admin)
            db.commit()
            db.refresh(admin)

        # 4. Utilisateur Manager
        manager = db.query(User).filter(User.email == "manager@afrix.com").first()
        if not manager:
            manager = User(
                email="manager@afrix.com",
                hashed_password=get_password_hash("manager123"),
                nom="OUEDRAOGO",
                prenom="Jean",
                matricule="AFX-MGT-001",
                departement="Ingénierie",
                role=RoleUtilisateur.MANAGER,
                is_active=True,
            )
            db.add(manager)
            db.commit()
            db.refresh(manager)

        # 5. Utilisateur Employé (rattaché au manager)
        employe = db.query(User).filter(User.email == "employe@afrix.com").first()
        if not employe:
            employe = User(
                email="employe@afrix.com",
                hashed_password=get_password_hash("employe123"),
                nom="DIALLO",
                prenom="Moussa",
                matricule="AFX-DEV-001",
                departement="Ingénierie",
                role=RoleUtilisateur.EMPLOYE,
                manager_id=manager.id,
                is_active=True,
            )
            db.add(employe)
            db.commit()
            db.refresh(employe)

        # 6. Initialisation des soldes pour l'année en cours
        annee = datetime.now().year
        for user in [admin, manager, employe]:
            for tc in types_map.values():
                SoldeService.get_or_create_solde(db, user.id, tc.id, annee)

        print("Comptes utilisateurs de test configurés :")
        print("   - RH / Admin : admin@afrix.com / admin123")
        print("   - Manager    : manager@afrix.com / manager123")
        print("   - Employé    : employe@afrix.com / employe123")
        print("Base de données initialisée et prête !")

    except Exception as e:
        db.rollback()
        print(f"Erreur lors de l'initialisation : {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_data()