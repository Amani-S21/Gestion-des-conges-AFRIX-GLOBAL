### AFRIX GLOBAL
## Application de gestion des congés
Cadrage fonctionnel et plan de conception
Document de cadrage
Version 1.0 — 16 août 2026
## Sommaire
1 1. Contexte et problématique  
2 2. Objectifs du projet  
3 3. Questions à valider avec le client  
4 4. Utilisateurs et responsabilités  
5 5. Besoins fonctionnels prioritaires  
5.1 5.1 Soumettre une demande de congé  
5.2 5.2 Consulter les demandes envoyées  
5.3 5.3 Accepter ou refuser une demande  
5.4 5.4 Consulter les jours disponibles 
5.5 5.5 Suivre l’état d’une demande  
6 6. Fonctionnalités du produit minimum viable  
7 7. Parcours utilisateur cible  
8 8. Règles de gestion à définir  
9 9. Plan de réalisation proposé  
10 10. Critères de réussite  
11 Conclusion  
12 11. Conception UI/UX de l’application 
12.1 11.1 Principes d’expérience utilisateur 
12.2 11.2 Architecture de navigation  
13 12. Maquettes des écrans principaux  
13.1 12.1 Tableau de bord de l’employé  
13.2 12.2 Création d’une demande de congé  
13.3 12.3 File de traitement du responsable  
13.4 12.4 Détail et décision  
13.5 12.5 Tableau de bord RH  
14 13. Fonctionnement écran par écran  
15 14. Responsive et comportement sur différents écrans 
16 15. Validation UX avec les utilisateurs  
17 16. Refonte du design par profil utilisateur 
17.1 16.1 Système visuel commun 
17.2 16.2 Règles de clarté et de respiration  
17.3 16.3 Résultat attendu  


## Application de gestion des congés Équipe projet
1 1. Contexte et problématique
AFRIX GLOBAL souhaite améliorer la gestion des congés de ses employés. Le fonctionnement actuel
manque de visibilité et peut rendre le suivi des demandes long, dispersé et difficile à contrôler. Les
employés ne disposent pas nécessairement d’un espace unique pour formuler leurs demandes, tandis que
les responsables et l’administration doivent pouvoir les examiner, les traiter et conserver un historique
fiable.
L’objectif du projet est de concevoir une application simple, centralisée et accessible qui facilite l’ensemble
du processus, depuis la soumission d’une demande jusqu’à sa décision finale.
Problème à résoudre
Mettre fin au suivi dispersé des congés en offrant à chaque acteur une vision claire des demandes, de
leur statut et du solde de jours disponible.
2 2. Objectifs du projet
Le projet doit répondre à quatre objectifs complémentaires. Il doit d’abord simplifier la saisie des demandes
pour les employés. Il doit ensuite accélérer la validation par les responsables grâce à une vue centralisée. Il
doit également renforcer la transparence du processus par des statuts explicites et des notifications. Enfin,
il doit fournir à l’administration un outil de supervision et de contrôle.
Axe Résultat attendu
Simplicité Une demande de congé peut être créée rapidement depuis
l’application.
Visibilité Chaque utilisateur connaît le statut de ses demandes et les actions
attendues.
Contrôle Les responsables disposent des informations nécessaires pour
accepter ou refuser une demande.
Traçabilité Les décisions et les changements de statut sont conservés dans un
historique consultable.
3 3. Questions à valider avec le client
Avant de développer l’application, les règles de gestion doivent être confirmées avec AFRIX GLOBAL. Les
questions suivantes permettront de transformer le besoin général en spécifications précises.
1. Comment les employés formulent-ils actuellement leurs demandes de congé ?
2. Qui est autorisé à accepter ou à refuser une demande, et selon quel circuit de validation ?
3. Quelles informations doivent obligatoirement figurer dans une demande : type de congé, dates, motif,
justificatif ou autre élément ?
4. L’employé doit-il consulter son solde de jours en temps réel, et quelles règles déterminent ce solde ?
5. Quels événements doivent déclencher une notification : création, acceptation, refus, modification ou
annulation ?
1
Application de gestion des congés Équipe projet
6. Existe-t-il des périodes bloquées, des délais minimums ou des règles particulières selon le type de
congé ?
7. Quels indicateurs l’administration souhaite-t-elle suivre dans le tableau de bord ?
Décision attendue
Valider les réponses à ces questions avant la phase de développement afin d’éviter les ambiguïtés sur les
rôles, les règles de calcul et le circuit d’approbation.
4 4. Utilisateurs et responsabilités
L’application s’adresse à trois profils principaux. La séparation des rôles garantit que chaque utilisateur
accède uniquement aux actions nécessaires à sa mission.
Profil Responsabilités principales Actions dans l’application
Employé Exprimer un besoin d’absence et suivre
son traitement.
Créer, consulter, modifier ou annuler
une demande selon son statut ;
consulter son solde.
Responsable Examiner les demandes de son équipe
et prendre une décision.
Consulter les demandes, vérifier les
informations, accepter ou refuser,
ajouter un commentaire.
RH /
Administrateur
Administrer les règles et superviser
l’activité globale.
Gérer les employés, contrôler les
soldes, consulter les historiques et
suivre les indicateurs.
5 5. Besoins fonctionnels prioritaires
Les besoins ci-dessous constituent le périmètre fonctionnel initial. Ils pourront être précisés et classés lors
des ateliers de validation avec le client.
5.1 5.1 Soumettre une demande de congé
L’employé doit pouvoir saisir une demande directement dans l’application en indiquant les dates
concernées et les informations demandées par l’entreprise. Le système doit vérifier les données obligatoires
avant l’enregistrement.
5.2 5.2 Consulter les demandes envoyées
Le responsable doit disposer d’une liste des demandes qui lui sont soumises. Cette liste doit présenter
les informations essentielles, notamment l’employé concerné, la période demandée, le type de congé et le
statut courant.
5.3 5.3 Accepter ou refuser une demande
Le responsable doit pouvoir prendre une décision depuis une interface dédiée. En cas de refus, un
commentaire peut être demandé afin d’expliquer la décision et de faciliter le suivi par l’employé.
2
Application de gestion des congés Équipe projet
5.4 5.4 Consulter les jours disponibles
L’employé doit pouvoir connaître le nombre de jours de congé restant. Le calcul et les règles d’alimentation
du solde devront être définis avec l’administration avant l’implémentation.
5.5 5.5 Suivre l’état d’une demande
L’employé doit savoir si sa demande est en attente, acceptée, refusée ou annulée. Chaque changement de
statut doit être compréhensible et, lorsque cela est requis, accompagné d’une notification.
6 6. Fonctionnalités du produit minimum viable
Le produit minimum viable, ou MVP, doit se concentrer sur les fonctionnalités nécessaires au
fonctionnement quotidien du processus de congés.
Priorité Fonctionnalité Description
P1 Connexion Accès sécurisé selon le profil de l’utilisateur.
P1 Demande de congé Formulaire de création avec dates, type, motif et
validation des champs.
P1 Gestion des demandes Liste, consultation et filtrage des demandes par
statut ou période.
P1 Acceptation / refus Décision du responsable avec mise à jour
automatique du statut.
P1 Tableau de bord Vue synthétique des demandes en attente, des
décisions et des soldes.
P2 Notifications Information de l’employé lors des principales
évolutions de sa demande.
7 7. Parcours utilisateur cible
Le parcours cible doit rester court et lisible. L’employé se connecte, consulte son solde, renseigne sa période
d’absence puis soumet sa demande. Le responsable reçoit la demande dans sa file de traitement, vérifie
les informations disponibles et accepte ou refuse. L’employé est ensuite informé de la décision et peut
retrouver l’historique de la demande dans son espace personnel.
1. L’employé se connecte et ouvre son espace « Mes congés ».
2. Il consulte son solde disponible et crée une nouvelle demande.
3. Le système contrôle les informations saisies et enregistre la demande avec le statut « En attente ».
4. Le responsable examine la demande puis l’accepte ou la refuse.
5. Le statut est mis à jour et l’employé est informé de la décision.
3
Application de gestion des congés Équipe projet
8 8. Règles de gestion à définir
Certaines règles sont indispensables au bon fonctionnement du système mais ne sont pas encore précisées
dans le document initial. Elles doivent faire l’objet d’une validation métier avant le développement.
Sujet Point à préciser
Droits d’accès Profils, permissions et possibilité de délégation.
Calcul du solde Méthode de calcul, date de mise à jour et prise en compte
des demandes en attente.
Chevauchements Comportement lorsque deux demandes couvrent une
même période.
Annulation Acteur autorisé, délai et conséquences sur le solde.
Notifications Canal utilisé, événements déclencheurs et modèles de
messages.
Historique Durée de conservation et niveau de détail des actions
enregistrées.
9 9. Plan de réalisation proposé
La réalisation peut être organisée en quatre étapes afin de réduire les risques et de valider progressivement
les choix fonctionnels.
1. Cadrage. Recueillir les réponses aux questions métier, confirmer les rôles et formaliser les règles de
gestion.
2. Conception. Définir les écrans, le parcours utilisateur, le modèle de données et les critères
d’acceptation.
3. Développement du MVP. Implémenter la connexion, les demandes, la validation, le suivi des statuts
et le tableau de bord initial.
4. Tests et déploiement. Vérifier les scénarios principaux avec des utilisateurs représentatifs, corriger
les écarts et préparer la mise en production.
10 10. Critères de réussite
Le projet sera considéré comme réussi lorsque les employés pourront soumettre une demande sans
assistance, lorsque les responsables pourront traiter les demandes depuis une vue centralisée et lorsque
l’administration pourra suivre les soldes et l’activité globale. La clarté des statuts, la fiabilité des règles de
calcul et la traçabilité des décisions devront également être vérifiées lors des tests d’acceptation.
Prochaine étape recommandée
Organiser un atelier de validation avec AFRIX GLOBAL pour confirmer les règles de gestion, le
périmètre du MVP et les indicateurs attendus dans le tableau de bord.
4
Application de gestion des congés Équipe projet
11 Conclusion
L’application de gestion des congés doit devenir un point d’entrée unique pour les employés, les
responsables et l’administration. Le périmètre proposé apporte une base claire pour démarrer : il répond au
besoin principal, sépare les responsabilités et identifie les décisions métier encore nécessaires. La prochaine
étape consiste à valider ce cadrage, puis à le traduire en maquettes et en spécifications détaillées.
12 11. Conception UI/UX de l’application
La conception UI/UX traduit les besoins fonctionnels en écrans concrets. L’interface proposée repose sur
une navigation latérale constante, des statuts immédiatement reconnaissables et des actions principales
visibles sans multiplier les étapes. L’objectif est de permettre à un employé de soumettre une demande en
moins d’une minute, tout en donnant au responsable les informations nécessaires pour décider rapidement.
12.1 11.1 Principes d’expérience utilisateur
L’interface adopte une logique de tableau de bord : chaque profil voit d’abord les informations qui lui
sont utiles, puis peut accéder aux détails. Les composants sont volontairement réguliers afin de réduire la
charge cognitive et de faciliter la prise en main.
Principe Application dans l’interface
Hiérarchie claire Le solde, les demandes en cours et l’action principale apparaissent
dès l’arrivée sur le tableau de bord.
Simplicité Les formulaires utilisent des champs courts, des libellés explicites
et des valeurs préremplies lorsque cela est possible.
Feedback immédiat Après chaque action, le système confirme l’enregistrement et
affiche le nouveau statut de la demande.
Cohérence Les mêmes couleurs, boutons, espacements et statuts sont utilisés
sur tous les écrans.
Accessibilité Les informations ne reposent pas uniquement sur la couleur ; le
texte du statut et les contrastes renforcent la compréhension.
12.2 11.2 Architecture de navigation
Tous les profils retrouvent une structure similaire, mais les écrans et les actions visibles sont adaptés à
leurs responsabilités. Le menu latéral permet de revenir rapidement au tableau de bord, aux demandes ou
aux paramètres.
1. Employé. Tableau de bord → Nouvelle demande → Confirmation → Suivi de la demande.
2. Responsable. Tableau de bord → File des demandes → Détail d’une demande → Acceptation ou refus.
3. RH / Administrateur. Tableau de bord RH → Employés → Soldes → Rapports et historique.
5
Application de gestion des congés Équipe projet
13 12. Maquettes des écrans principaux
Les écrans suivants illustrent le comportement attendu de l’application sur ordinateur. Ils constituent une
base de discussion avec le client et pourront être transformés en maquettes haute fidélité après validation
des règles métier.
13.1 12.1 Tableau de bord de l’employé
À la connexion, l’employé voit immédiatement son solde, le nombre de demandes en cours et les jours déjà
pris. Le bouton « Nouvelle demande » est volontairement mis en avant afin de réduire le temps nécessaire
pour démarrer une démarche.
图 1 Maquette — tableau de bord de l’employé.
13.2 12.2 Création d’une demande de congé
Le formulaire guide l’utilisateur dans un ordre logique : type de congé, dates, durée et commentaire. La
validation doit empêcher l’envoi d’une demande incomplète et signaler clairement les dates incohérentes
ou indisponibles.
6
Application de gestion des congés Équipe projet
图 2 Maquette — formulaire de création d’une demande.
13.3 12.3 File de traitement du responsable
Le responsable dispose d’une vue regroupant les demandes de son équipe. Les filtres permettent d’afficher
en priorité les demandes en attente. Chaque ligne contient les informations indispensables et un accès
direct à la décision.
7
Application de gestion des congés Équipe projet
图 3 Maquette — file de demandes du responsable.
13.4 12.4 Détail et décision
Avant de décider, le responsable consulte la période, la durée, le type de congé, le commentaire de l’employé
et l’historique. Les boutons « Accepter » et « Refuser » sont différenciés, et le refus doit pouvoir être
accompagné d’un motif.
图 4 Maquette — détail d’une demande et prise de décision.
13.5 12.5 Tableau de bord RH
Le tableau de bord RH fournit une vision consolidée de l’activité. Il présente les employés actifs, le volume
mensuel des demandes, les demandes encore en attente et les actions d’administration courantes.
8
Application de gestion des congés Équipe projet
图 5 Maquette — tableau de bord de l’administration RH.
14 13. Fonctionnement écran par écran
Le tableau suivant précise ce que l’utilisateur fait à chaque étape et ce que le système doit lui retourner. Il
servira de base aux scénarios de test et à la préparation des spécifications détaillées.
Écran Action utilisateur Réponse attendue du système
Connexion Saisir ses identifiants et valider. Contrôler le profil puis ouvrir le
tableau de bord correspondant.
Tableau de bord
employé
Consulter le solde ou cliquer sur
« Nouvelle demande ».
Afficher les indicateurs et ouvrir le
formulaire adapté.
Formulaire Saisir les dates, le type et le
commentaire puis envoyer.
Contrôler les champs, enregistrer la
demande et afficher le statut « En
attente ».
File responsable Filtrer, ouvrir une demande et
consulter son détail.
Afficher les demandes pertinentes et
l’historique de chaque dossier.
Décision Accepter ou refuser, avec
commentaire si nécessaire.
Mettre à jour le statut, enregistrer
l’action et notifier l’employé.
Tableau de bord RH Consulter les indicateurs et ouvrir
une action d’administration.
Afficher les données consolidées et les
accès de supervision.
9
Application de gestion des congés Équipe projet
15 14. Responsive et comportement sur différents
écrans
La première version est pensée pour un usage sur ordinateur, notamment dans les bureaux et les services
RH. La structure doit toutefois rester adaptable aux écrans plus petits. Sur tablette, le menu latéral peut se
réduire en barre compacte. Sur mobile, les cartes d’indicateurs passent en colonne, les tableaux deviennent
des cartes empilées et le bouton d’action principale reste accessible en bas de l’écran.
Support Adaptation prévue Priorité
Ordinateur Navigation latérale complète, tableaux
détaillés et tableaux de bord larges.
MVP
Tablette Menu réduit, cartes réorganisées
et boutons conservés à une taille
confortable.
Version 1
Mobile Navigation compacte, formulaires en
colonne et demandes présentées sous
forme de cartes.
Version 2
16 15. Validation UX avec les utilisateurs
Avant le développement final, les maquettes doivent être présentées à un petit groupe représentatif :
au moins un employé, un responsable et un membre des RH. Chaque personne réalisera des scénarios
simples, comme créer une demande, retrouver son statut ou accepter une demande d’équipe. Les retours
serviront à corriger les libellés, l’ordre des champs et les informations affichées avant la construction des
écrans définitifs.
Décision recommandée
Valider d’abord les parcours et les maquettes avec les utilisateurs. Cette étape permettra de sécuriser
l’ergonomie avant d’investir dans le développement complet.
17 16. Refonte du design par profil utilisateur
Les trois profils ne doivent pas recevoir la même vue. Ils partagent une identité visuelle commune, mais
chaque espace met en avant une intention différente : l’employé veut agir simplement, le responsable veut
décider rapidement et les RH veulent piloter l’activité globale.
Profil Question principale Décision de design
Employé « Où en est ma demande et
combien de jours me reste-til ? »
Une interface personnelle, rassurante et
orientée action, avec le solde en premier
plan et deux actions principales seulement.
10
Application de gestion des congés Équipe projet
Profil Question principale Décision de design
Responsable « Quelles demandes dois-je
traiter maintenant ? »
Une interface opérationnelle, centrée sur
la file de décision, les priorités et l’accès
rapide au détail.
RH / Administrateur « Quelle est la situation
globale des congés ? »
Une interface de pilotage, avec indicateurs,
tendances, alertes et accès aux actions
d’administration.
17.1 16.1 Système visuel commun
Le design utilise un fond gris très clair, des surfaces blanches, une couleur principale vert profond et
quelques couleurs fonctionnelles limitées. Le vert indique l’action ou la réussite, l’ambre signale l’attente,
le rouge est réservé aux refus ou aux situations nécessitant une attention particulière, et le bleu sert à
distinguer les informations neutres.
Les icônes sont utilisées comme repères visuels et non comme décoration. Elles accompagnent toujours un
libellé textuel afin que l’action reste compréhensible. Les écrans privilégient des cartes larges, des groupes
clairement séparés et un nombre limité de choix visibles à chaque étape.
17.2 16.2 Règles de clarté et de respiration
Chaque écran possède un titre principal, un sous-titre explicatif et une action dominante. Les informations
secondaires sont placées dans des cartes séparées afin d’éviter les tableaux trop denses. Les boutons sont
suffisamment espacés pour éviter les erreurs de clic, tandis que les statuts sont affichés avec leur texte et
leur couleur.
La navigation reste stable à gauche, mais son contenu change selon le rôle. Ainsi, l’employé ne voit pas
les outils d’administration, le responsable accède directement à sa file de validation et les RH disposent de
raccourcis vers les employés, les soldes et les rapports.
17.3 16.3 Résultat attendu
Cette séparation des vues permet d’éviter une application confuse dans laquelle tous les utilisateurs
verraient les mêmes menus et les mêmes indicateurs. L’expérience devient plus naturelle : chaque personne
retrouve immédiatement les informations qui correspondent à sa responsabilité, avec moins de bruit visuel
et moins d’étapes inutiles.