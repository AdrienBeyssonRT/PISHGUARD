# Structure du Projet PhishGuard

## 📁 Arborescence Complète

```
phishguard/
├── install.sh                    # Installation et déploiement automatique (tout-en-un)
├── docker-compose.yml            # Configuration Docker unifiée
├── package.json                  # Configuration monorepo
├── .gitignore                    # Fichiers ignorés par Git
├── .dockerignore                 # Fichiers ignorés par Docker
│
├── DEPLOYMENT.md                 # Guide de déploiement complet
├── PROJECT_STATUS.md             # Compte rendu du projet
├── STRUCTURE.md                  # Ce fichier
│
├── ansible/                      # Automatisation Ansible
│   ├── ansible.cfg               # Configuration Ansible
│   ├── requirements.yml          # Collections Ansible
│   │
│   ├── inventory/                # Inventaires
│   │   ├── hosts.local.yml       # Configuration locale
│   │   └── hosts.yml             # Configuration staging/production
│   │
│   ├── playbooks/                # Playbooks Ansible
│   │   ├── deploy.yml            # Déploiement complet
│   │   ├── update.yml            # Mise à jour
│   │   └── backup.yml            # Sauvegarde
│   │
│   ├── templates/                # Templates Jinja2
│   │   ├── env.j2                # Variables d'environnement root
│   │   ├── backend-env.j2        # Variables backend
│   │   └── frontend-env.j2       # Variables frontend
│   │
│   └── group_vars/               # Variables par groupe
│       └── all.yml               # Variables globales
│
└── apps/                          # Applications
    │
    ├── backend/                   # API NestJS
    │   ├── Dockerfile             # Image Docker backend
    │   ├── package.json           # Dépendances backend
    │   ├── tsconfig.json          # Configuration TypeScript
    │   ├── nest-cli.json          # Configuration NestJS CLI
    │   │
    │   ├── prisma/                # Prisma ORM
    │   │   └── schema.prisma      # Schéma de base de données
    │   │
    │   └── src/                   # Code source backend
    │       ├── main.ts            # Point d'entrée
    │       ├── app.module.ts      # Module racine
    │       │
    │       ├── auth/              # Authentification
    │       │   ├── auth.module.ts
    │       │   ├── auth.service.ts
    │       │   ├── auth.controller.ts
    │       │   ├── jwt-auth.guard.ts
    │       │   ├── dto/
    │       │   │   ├── login.dto.ts
    │       │   │   └── register.dto.ts
    │       │   └── strategies/
    │       │       └── jwt.strategy.ts
    │       │
    │       ├── organizations/     # Gestion organisations
    │       │   ├── organizations.module.ts
    │       │   ├── organizations.service.ts
    │       │   └── organizations.controller.ts
    │       │
    │       ├── users/            # Gestion utilisateurs
    │       │   ├── users.module.ts
    │       │   └── users.service.ts
    │       │
    │       ├── employees/         # Gestion employés
    │       │   ├── employees.module.ts
    │       │   ├── employees.service.ts
    │       │   ├── employees.controller.ts
    │       │   └── dto/
    │       │       └── create-employee.dto.ts
    │       │
    │       ├── templates/         # Templates d'emails
    │       │   ├── templates.module.ts
    │       │   ├── templates.service.ts
    │       │   ├── templates.controller.ts
    │       │   └── dto/
    │       │       └── create-template.dto.ts
    │       │
    │       ├── campaigns/         # Campagnes
    │       │   ├── campaigns.module.ts
    │       │   ├── campaigns.service.ts
    │       │   ├── campaigns.controller.ts
    │       │   └── dto/
    │       │       └── create-campaign.dto.ts
    │       │
    │       ├── simulations/       # Simulations et tracking
    │       │   ├── simulations.module.ts
    │       │   ├── tracking.service.ts
    │       │   └── tracking.controller.ts
    │       │
    │       ├── detection/        # Détection temps réel
    │       │   ├── detection.module.ts
    │       │   ├── detection.service.ts
    │       │   └── detection.controller.ts
    │       │
    │       ├── stats/             # Statistiques
    │       │   ├── stats.module.ts
    │       │   ├── stats.service.ts
    │       │   └── stats.controller.ts
    │       │
    │       ├── jobs/              # Jobs Cron
    │       │   ├── jobs.module.ts
    │       │   └── send-emails.job.ts
    │       │
    │       ├── health/            # Health check
    │       │   ├── health.module.ts
    │       │   └── health.controller.ts
    │       │
    │       └── shared/            # Services partagés
    │           ├── prisma.module.ts
    │           └── prisma.service.ts
    │
    └── frontend/                  # Application Next.js
        ├── Dockerfile             # Image Docker frontend
        ├── package.json           # Dépendances frontend
        ├── tsconfig.json          # Configuration TypeScript
        ├── next.config.js         # Configuration Next.js
        ├── tailwind.config.js     # Configuration Tailwind
        ├── postcss.config.js      # Configuration PostCSS
        │
        └── app/                   # Pages Next.js (App Router)
            ├── layout.tsx         # Layout racine
            ├── globals.css        # Styles globaux
            ├── page.tsx           # Page d'accueil
            │
            ├── login/             # Page de connexion
            │   └── page.tsx
            │
            ├── register/          # Page d'inscription
            │   └── page.tsx
            │
            ├── dashboard/         # Dashboard
            │   └── page.tsx
            │
            ├── campaigns/         # Campagnes
            │   ├── page.tsx       # Liste des campagnes
            │   └── [id]/
            │       └── page.tsx   # Détail d'une campagne
            │
            ├── detection/         # Détection
            │   └── page.tsx
            │
            └── settings/          # Paramètres
                └── page.tsx
```

## 📦 Modules Backend

1. **AuthModule** : Authentification JWT
2. **OrganizationsModule** : Gestion des organisations
3. **UsersModule** : Gestion des utilisateurs
4. **EmployeesModule** : Gestion des employés
5. **TemplatesModule** : Gestion des templates
6. **CampaignsModule** : Gestion des campagnes
7. **SimulationsModule** : Tracking des simulations
8. **DetectionModule** : Détection en temps réel
9. **StatsModule** : Statistiques
10. **JobsModule** : Jobs Cron
11. **HealthModule** : Health check
12. **PrismaModule** : Service Prisma (global)

## 🎨 Pages Frontend

1. **/** : Landing page
2. **/login** : Connexion
3. **/register** : Inscription
4. **/dashboard** : Dashboard
5. **/campaigns** : Liste des campagnes
6. **/campaigns/[id]** : Détail d'une campagne
7. **/detection** : Détection en temps réel
8. **/settings** : Paramètres

## 🐳 Services Docker

1. **postgres** : Base de données PostgreSQL
2. **backend** : API NestJS
3. **frontend** : Application Next.js

## 📋 Fichiers de Configuration

- **docker-compose.yml** : Configuration Docker unifiée
- **ansible/playbooks/** : Playbooks de déploiement
- **ansible/inventory/** : Configuration des serveurs
- **ansible/templates/** : Templates de configuration

## 🔧 Scripts

- **install.sh** : Installation et déploiement automatique (exécute directement Ansible)

---

**Structure optimisée et prête pour la production** ✅

