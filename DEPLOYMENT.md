# Guide de Déploiement PhishGuard

Guide complet pour déployer PhishGuard avec **une seule commande** sur Ubuntu.

## 🚀 Installation et Déploiement Automatique

### UNE SEULE COMMANDE

```bash
# Cloner le projet
git clone https://github.com/votre-repo/phishguard.git
cd phishguard

# Installation et déploiement automatique
sudo ./install.sh local
```

**Le script `install.sh` fait automatiquement :**
1. Mise à jour du système (`apt update && apt upgrade`)
2. Installation des prérequis (Python, pip, git, curl, etc.)
3. Installation d'Ansible
4. Installation des collections Ansible
5. Installation de Docker
6. Configuration des permissions
7. Ajout de l'utilisateur au groupe docker
8. **Exécution directe des playbooks Ansible** (sans script intermédiaire)

### Résultat

Après l'exécution :
- ✅ PhishGuard est installé
- ✅ PhishGuard est configuré
- ✅ PhishGuard est déployé
- ✅ Services démarrés (PostgreSQL, Backend, Frontend)
- ✅ Migrations exécutées
- ✅ Prêt à l'emploi

**Accès :**
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Health: http://localhost:3001/health

## 📋 Installation Manuelle (Alternative)

Si vous préférez installer manuellement :

```bash
# 1. Mettre à jour le système
sudo apt update && sudo apt upgrade -y

# 2. Installer Python et pip
sudo apt install -y python3 python3-pip git curl

# 3. Installer Ansible
pip3 install ansible

# 4. Rendre le script exécutable
chmod +x install.sh

# 5. Déployer (le script exécute directement Ansible)
sudo ./install.sh local deploy
```

## 🔧 Configuration

### Inventaire Local

Le fichier `ansible/inventory/hosts.local.yml` est déjà configuré pour un déploiement local.

### Inventaire Production

Éditez `ansible/inventory/hosts.yml` :

```yaml
production:
  hosts:
    phishguard-prod:
      ansible_host: votre-serveur.com
      ansible_user: ubuntu
      frontend_url: https://phishguard.com
      api_base_url: https://api.phishguard.com
      git_repo: https://github.com/votre-repo/phishguard.git
```

### Secrets

Les secrets sont générés automatiquement. Pour les personnaliser, ajoutez dans l'inventaire :

```yaml
vars:
  database_password: "votre_mot_de_passe"
  jwt_secret: "votre_secret_jwt"
  tracking_enc_key: "votre_cle_tracking"
```

## 🛠️ Commandes de Déploiement

### Déploiement

```bash
# Local (installation complète + déploiement)
sudo ./install.sh local

# Staging (installation complète + déploiement)
sudo ./install.sh staging

# Production (installation complète + déploiement)
sudo ./install.sh production
```

### Mise à Jour

```bash
# Mise à jour (Ansible déjà installé)
./install.sh production update
```

### Sauvegarde

```bash
# Sauvegarde (Ansible déjà installé)
./install.sh production backup
```

## 🎯 Ce Que Fait Le Déploiement

Le playbook Ansible `deploy.yml` exécute automatiquement :

1. ✅ Vérifie les prérequis système
2. ✅ Installe Docker (si nécessaire)
3. ✅ Crée utilisateur et répertoires
4. ✅ Clone/mise à jour du code
5. ✅ Génère secrets automatiquement
6. ✅ Configure tous les fichiers .env
7. ✅ Construit images Docker
8. ✅ Démarre services (PostgreSQL, Backend, Frontend)
9. ✅ Exécute migrations Prisma
10. ✅ Vérifie santé des services

## 🔐 Sécurité

### Permissions Docker

Après l'installation, si vous obtenez une erreur de permission :

```bash
# Ajouter utilisateur au groupe docker
sudo usermod -aG docker $USER

# Activer le groupe (ou se reconnecter)
newgrp docker

# Vérifier
docker ps
```

### Firewall (UFW)

```bash
# Activer UFW
sudo ufw enable

# Autoriser les ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 3000/tcp  # Frontend
sudo ufw allow 3001/tcp  # Backend
```

### HTTPS (Production)

```bash
# Installer Nginx et Certbot
sudo apt install nginx certbot python3-certbot-nginx

# Configuration automatique
sudo certbot --nginx -d phishguard.com
```

## 🐛 Dépannage

### Vérifier les services

```bash
# Conteneurs
docker ps

# Logs
docker compose logs -f

# Santé
curl http://localhost:3001/health
```

### Problèmes courants

**Docker ne démarre pas :**
```bash
sudo systemctl status docker
sudo systemctl restart docker
sudo systemctl enable docker
```

**Permissions Docker :**
```bash
sudo usermod -aG docker $USER
newgrp docker
```

**Logs détaillés Ansible :**
```bash
ansible-playbook -i ansible/inventory/hosts.yml \
  ansible/playbooks/deploy.yml -vvv
```

## 🚢 Déploiement Cloud

### AWS EC2

1. Créer instance EC2 (Ubuntu 22.04+)
2. Configurer Security Group (ports 22, 3000, 3001)
3. Configurer `ansible/inventory/hosts.yml`
4. `sudo ./install.sh production`

### DigitalOcean / OVH / Scaleway

Même processus :
1. Créer instance (Ubuntu)
2. Configurer firewall
3. Configurer inventaire
4. `sudo ./install.sh production`

## 📊 Monitoring

```bash
# Health check
curl http://localhost:3001/health

# Logs en temps réel
docker compose logs -f

# Métriques Docker
docker stats

# Espace disque
df -h
docker system df
```

## 📝 Checklist

- [ ] Ubuntu 22.04+ installé
- [ ] Accès root/sudo
- [ ] Internet disponible
- [ ] Inventaire configuré (production)
- [ ] Accès SSH au serveur (production)
- [ ] Firewall configuré (production)
- [ ] DNS configuré (production)
- [ ] SSL/TLS configuré (production)

---

**UNE SEULE COMMANDE : `sudo ./install.sh local`** 🚀

Le script `install.sh` exécute directement les playbooks Ansible, sans script intermédiaire.
