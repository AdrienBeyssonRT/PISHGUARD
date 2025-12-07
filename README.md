# PhishGuard - SaaS Anti-Phishing

SaaS complet combinant simulations de phishing et détection en temps réel des emails suspects.

## 🚀 Démarrage Rapide

### Déploiement Automatique (Recommandé)

```bash
# Installer Ansible
pip install ansible

# Déployer
./deploy.sh local
```

**C'est tout !** Ansible installe Docker, configure tout et déploie automatiquement.

📖 **Lisez [DEPLOYMENT.md](./DEPLOYMENT.md) pour le guide complet**

## 📋 Prérequis

- **Ansible** : `pip install ansible`
- **Docker** : Installé automatiquement par Ansible
- **Node.js 18+** : Pour développement local uniquement

## 🏗️ Architecture

- **Frontend**: Next.js 15 + Tailwind CSS
- **Backend**: NestJS + PostgreSQL
- **Base de données**: PostgreSQL avec Prisma ORM
- **Déploiement**: Ansible + Docker Compose

## 📁 Structure

```
phishguard/
├── deploy.sh              # Script de déploiement (Ansible)
├── docker-compose.yml     # Configuration Docker
├── DEPLOYMENT.md          # Guide de déploiement complet
├── ansible/
│   ├── playbooks/         # Playbooks Ansible
│   ├── inventory/         # Configuration serveurs
│   └── templates/         # Templates .env
└── apps/
    ├── frontend/          # Next.js
    └── backend/           # NestJS
```

## 🛠️ Commandes

### Déploiement

```bash
./deploy.sh local deploy      # Local
./deploy.sh staging deploy    # Staging
./deploy.sh production deploy # Production
```

### Mise à Jour

```bash
./deploy.sh production update
```

### Sauvegarde

```bash
./deploy.sh production backup
```

### Développement Local

```bash
npm install
npm run dev
```

## 🎯 Fonctionnalités

✅ Authentification (JWT)  
✅ Gestion multi-tenant  
✅ Gestion des employés  
✅ Templates d'emails  
✅ Campagnes de phishing  
✅ Tracking (open/click/submit)  
✅ Détection temps réel  
✅ Dashboard avec statistiques  
✅ Déploiement automatisé  

## 📚 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Guide de déploiement complet
- Configuration détaillée dans `ansible/inventory/`

## 🔒 Sécurité

- Mots de passe hashés (bcrypt)
- Tokens JWT sécurisés
- Tracking chiffré (AES-256-GCM)
- Cookies HttpOnly
- Validation des entrées

## 🚢 Déploiement

### Production

```bash
# Configurer ansible/inventory/hosts.yml
./deploy.sh production deploy
```

### Cloud

- **AWS EC2** : Instance Ubuntu + Ansible
- **DigitalOcean** : Droplet + Ansible
- **VPS OVH/Scaleway** : Même processus

## 📊 Monitoring

```bash
# Health check
curl http://localhost:3001/health

# Logs
docker compose logs -f
```

## 🤝 Contribution

1. Fork le projet
2. Créez une branche
3. Committez vos changements
4. Ouvrez une Pull Request

## 📝 License

MIT

---

**PhishGuard** - Protégez vos équipes du phishing en moins de 5 minutes.
