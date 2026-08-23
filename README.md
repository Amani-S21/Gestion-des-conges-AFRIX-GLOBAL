# AFRIX GLOBAL — Application Fullstack de Gestion des Congés

Système complet de gestion des absences et congés pour l'entreprise **AFRIX GLOBAL**.

---

## 🏗️ Architecture du Projet

Le dépôt est organisé sous forme de monorepo structuré :

```text
PoseToi/
├── Backend/                        # API Backend (FastAPI, SQLAlchemy, PostgreSQL, Alembic, JWT)
│   ├── app/                        # Code source FastAPI (api, core, models, repositories, schemas, services)
│   ├── tests/                      # Suite de tests automatisés (26 tests pytest)
│   ├── seed.py                     # Script d'initialisation des comptes et types de congés
│   └── requirements.txt            # Dépendances Python
│
├── Gestion-des-conges-AFRIX-GLOBAL/# Application Frontend (Angular 20+, Signals, Standalone)
│   ├── src/app/                    # Composants, services API, gardes et interceptor JWT
│   └── package.json                # Dépendances npm
│
├── docs/                           # Cahier des charges et spécifications fonctionnelles
├── AGENT.md                        # Directives d'architecture et de développement
└── README.md                       # Documentation générale
```

---

## 🚀 Démarrage Rapide

### 1. Démarrer le Backend (FastAPI)

```bash
cd Backend
# Créer et activer l'environnement virtuel si besoin
python -m venv venv
.\venv\Scripts\Activate.ps1   # (ou source venv/bin/activate sous Linux/macOS)

# Installer les dépendances
pip install -r requirements.txt

# Initialiser la base de données de test
python seed.py

# Démarrer le serveur API
uvicorn app.main:app --reload --port 8000
```
- **Documentation OpenAPI (Swagger) :** `http://localhost:8000/docs`

---

### 2. Démarrer le Frontend (Angular)

```bash
cd Gestion-des-conges-AFRIX-GLOBAL

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start
```
- **Application Web :** `http://localhost:4200/`

---

## 👥 Comptes de démonstration préconfigurés

| Profil | Email | Mot de passe | Rôle |
|---|---|---|---|
| **Employé** | `employe@afrix.com` | `employe123` | Collaborateur (soumission & suivi) |
| **Manager** | `manager@afrix.com` | `manager123` | Responsable d'équipe (validation / refus) |
| **RH Admin** | `admin@afrix.com` | `admin123` | Supervision, soldes & gestion des utilisateurs |

*(Des boutons de connexion rapide sont également disponibles directement sur l'écran d'accueil)*

---

## 🧪 Tests

- **Backend :**
  ```bash
  cd Backend
  pytest
  ```
- **Frontend :**
  ```bash
  cd Gestion-des-conges-AFRIX-GLOBAL
  npm run build
  ```
