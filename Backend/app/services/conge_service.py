"""
Service principal de traitement du cycle de vie des demandes de conge.
"""

from datetime import datetime, timezone
from typing import List, Optional
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.conge import DemandeConge
from app.models.enums import StatutDemande, RoleUtilisateur
from app.models.notification import Notification
from app.models.user import User
from app.repositories.conge_repository import CongeRepository
from app.repositories.notification_repository import NotificationRepository
from app.repositories.solde_repository import SoldeRepository
from app.repositories.type_conge_repository import TypeCongeRepository
from app.schemas.conge import DemandeCongeCreate, DemandeCongeDecision
from app.services.conge_calculator import calculer_jours_ouvres


class CongeService:
    @staticmethod
    def creer_demande(db: Session, employe: User, schema: DemandeCongeCreate) -> DemandeConge:
        """Cree une nouvelle demande de conge avec toutes les validations metier."""
        # 1. Verifier l'existence du type de conge
        type_conge = TypeCongeRepository.get_by_id_active(db, schema.type_conge_id)
        if not type_conge:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Type de conge introuvable ou inactif.",
            )

        # 2. Calcul du nombre de jours ouvres
        nb_jours = calculer_jours_ouvres(
            schema.date_debut, schema.date_fin, schema.periode_debut, schema.periode_fin
        )
        if nb_jours <= 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La periode selectionnee ne comporte aucun jour ouvre valide.",
            )

        # 3. Detection des chevauchements
        chevauchement = CongeRepository.find_overlap(db, employe.id, schema.date_debut, schema.date_fin)
        if chevauchement:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Vous avez deja une demande en cours ou validee sur cette periode.",
            )

        # 4. Verification et reservation du solde
        annee = schema.date_debut.year
        solde = SoldeRepository.get_or_create(db, employe.id, schema.type_conge_id, annee)

        if solde.jours_acquis > 0 and solde.jours_restants < nb_jours:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Solde insuffisant : il vous reste {solde.jours_restants} jours (demande : {nb_jours} jours).",
            )

        # Mise a jour des jours en attente
        solde.jours_en_attente += nb_jours

        # 5. Creation de la demande
        demande = DemandeConge(
            employe_id=employe.id,
            type_conge_id=schema.type_conge_id,
            date_debut=schema.date_debut,
            date_fin=schema.date_fin,
            periode_debut=schema.periode_debut,
            periode_fin=schema.periode_fin,
            nombre_jours=nb_jours,
            motif=schema.motif,
            justificatif_url=schema.justificatif_url,
            statut=StatutDemande.EN_ATTENTE,
        )
        db.add(demande)

        # 6. Notification au manager (s'il existe)
        if employe.manager_id:
            notif_manager = Notification(
                destinataire_id=employe.manager_id,
                titre="Nouvelle demande de conge",
                message=f"{employe.prenom} {employe.nom} a soumis une demande de {nb_jours} jour(s).",
                lien="/validation",
            )
            NotificationRepository.create(db, notif_manager)

        db.commit()
        db.refresh(demande)
        return demande

    @staticmethod
    def traiter_decision(
        db: Session, demande_id: int, decideur: User, decision_data: DemandeCongeDecision
    ) -> DemandeConge:
        """Validation ou refus d'une demande par un manager ou RH."""
        demande = CongeRepository.get_by_id(db, demande_id)
        if not demande:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Demande de conge introuvable.")

        if demande.statut != StatutDemande.EN_ATTENTE:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cette demande a deja ete traitee.")

        # Verification des droits : Manager de l'employe ou RH_ADMIN
        if decideur.role != RoleUtilisateur.RH_ADMIN:
            if demande.employe.manager_id != decideur.id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Vous n'etes pas autorise a valider les demandes de cet employe.",
                )

        solde = SoldeRepository.get_or_create(db, demande.employe_id, demande.type_conge_id, demande.date_debut.year)

        if decision_data.decision == StatutDemande.APPROUVEE:
            demande.statut = StatutDemande.APPROUVEE
            solde.jours_en_attente = max(0.0, solde.jours_en_attente - demande.nombre_jours)
            solde.jours_pris += demande.nombre_jours
            titre_notif = "Demande de conge approuvee"
            msg_notif = f"Votre demande du {demande.date_debut} au {demande.date_fin} a ete approuvee."
        else:
            demande.statut = StatutDemande.REFUSEE
            solde.jours_en_attente = max(0.0, solde.jours_en_attente - demande.nombre_jours)
            titre_notif = "Demande de conge refusee"
            msg_notif = f"Votre demande a ete refusee. Motif : {decision_data.commentaire}"

        demande.decideur_id = decideur.id
        demande.commentaire_decision = decision_data.commentaire
        demande.date_decision = datetime.now(timezone.utc)

        notification = Notification(
            destinataire_id=demande.employe_id,
            titre=titre_notif,
            message=msg_notif,
            lien="/conges",
        )
        NotificationRepository.create(db, notification)

        db.commit()
        db.refresh(demande)
        return demande

    @staticmethod
    def annuler_demande(db: Session, demande_id: int, utilisateur: User) -> DemandeConge:
        """Annulation d'une demande par l'employe ou un RH."""
        demande = CongeRepository.get_by_id(db, demande_id)
        if not demande:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Demande introuvable.")

        if demande.employe_id != utilisateur.id and utilisateur.role != RoleUtilisateur.RH_ADMIN:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Action non autorisee.")

        if demande.statut == StatutDemande.ANNULEE:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="La demande est deja annulee.")

        solde = SoldeRepository.get_or_create(db, demande.employe_id, demande.type_conge_id, demande.date_debut.year)

        if demande.statut == StatutDemande.EN_ATTENTE:
            solde.jours_en_attente = max(0.0, solde.jours_en_attente - demande.nombre_jours)
        elif demande.statut == StatutDemande.APPROUVEE:
            solde.jours_pris = max(0.0, solde.jours_pris - demande.nombre_jours)

        demande.statut = StatutDemande.ANNULEE
        db.commit()
        db.refresh(demande)
        return demande
