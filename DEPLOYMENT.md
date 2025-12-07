# Guide de Déploiement PhishGuard

Guide complet pour déployer PhishGuard avec **une seule commande** via Ansible.

## 🚀 Démarrage Rapide

### Installation

```bash
# Installer Ansible
pip install ansible
```

### Déploiement

```bash
# Local
./deploy.sh local

# Production
./deploy.sh production deploy
```

**C'est tout !** Ansible installe Docker, configure tout et déploie automatiquement.

## 📋 Pourquoi `deploy.sh` ?

`deploy.sh` est un **wrapper** qui simplifie l'utilisation d'Ansible. Il automatise plusieurs étapes :

### Ce que fait `deploy.sh` automatiquement :

1. ✅ **Vérifie qu'Ansible est installé** - Évite les erreurs
2. ✅ **Installe les collections Ansible** - `ansible-galaxy collection install`
3. ✅ **Sélectionne le bon inventaire** - Selon l'environnement (local/staging/production)
4. ✅ **Construit la commande complète** - Avec tous les paramètres nécessaires
5. ✅ **Ajoute une confirmation** - Pour la production (sécurité)
6. ✅ **Valide les paramètres** - Évite les erreurs de frappe

### Comparaison

**Sans `deploy.sh` (commande Ansible complète) :**
```bash
cd ansible
ansible-galaxy collection install -r requirements.yml
ansible-playbook -i inventory/hosts.local.yml playbooks/deploy.yml
```

**Avec `deploy.sh` (une seule commande) :**
```bash
./deploy.sh local
```

**Avantages :**
- ✅ Plus simple à retenir
- ✅ Moins d'erreurs de frappe
- ✅ Gestion automatique des chemins
- ✅ Confirmation automatique pour production
- ✅ Messages d'erreur clairs

## 📋 Commandes

```bash
# Déploiement
./deploy.sh local deploy
./deploy.sh staging deploy
./deploy.sh production deploy

# Mise à jour
./deploy.sh production update

# Sauvegarde
./deploy.sh production backup
```

## 🔧 Utilisation Directe d'Ansible (Optionnel)

Si vous préférez utiliser Ansible directement (sans wrapper) :

```bash
# Installer collections
cd ansible
ansible-galaxy collection install -r requirements.yml

# Déployer local
ansible-playbook -i inventory/hosts.local.yml playbooks/deploy.yml

# Déployer production
ansible-playbook -i inventory/hosts.yml --limit production playbooks/deploy.yml

# Mise à jour
ansible-playbook -i inventory/hosts.yml --limit production playbooks/update.yml

# Sauvegarde
ansible-playbook -i inventory/hosts.yml --limit production playbooks/backup.yml
```

**Note :** Le wrapper `deploy.sh` fait exactement la même chose, mais de manière plus simple.

## 🔧 Configuration

### 1. Inventaire (`ansible/inventory/hosts.yml`)

```yaml
production:
  hosts:
    phishguard-prod:
      ansible_host: votre-serveur.com
      ansible_user: root
      frontend_url: https://phishguard.com
      api_base_url: https://api.phishguard.com
      git_repo: https://github.com/votre-repo/phishguard.git
```

### 2. Secrets (Optionnel)

Les secrets sont générés automatiquement. Pour les personnaliser :

```yaml
vars:
  database_password: "votre_mot_de_passe"
  jwt_secret: "votre_secret_jwt"
  tracking_enc_key: "votre_cle_tracking"
```

### 3. Ansible Vault (Recommandé)

```bash
ansible-vault create ansible/group_vars/production/vault.yml
```

## 🎯 Ce Que Fait Le Déploiement

1. ✅ Installe Docker automatiquement
2. ✅ Crée utilisateur et répertoires
3. ✅ Clone/mise à jour du code
4. ✅ Génère secrets automatiquement
5. ✅ Configure tous les .env
6. ✅ Construit images Docker
7. ✅ Démarre services (PostgreSQL, Backend, Frontend)
8. ✅ Exécute migrations Prisma
9. ✅ Vérifie santé des services

## 📁 Structure

```
phishguard/
├── deploy.sh              # Wrapper Ansible (simplifie l'utilisation)
├── docker-compose.yml     # Configuration Docker
├── ansible/
│   ├── playbooks/         # deploy.yml, update.yml, backup.yml
│   ├── inventory/         # Configuration serveurs
│   └── templates/         # Templates .env
└── apps/
    ├── backend/
    └── frontend/
```

## 🔐 Sécurité

### SSH

```bash
ssh-keygen -t ed25519
ssh-copy-id user@serveur.com
```

### Firewall

Ports nécessaires :
- **3000** : Frontend
- **3001** : Backend
- **5432** : PostgreSQL (interne)

### HTTPS

Utilisez nginx/traefik comme reverse proxy.

## 🐛 Dépannage

### Vérifier connexion

```bash
ansible all -i ansible/inventory/hosts.yml -m ping
```

### Logs détaillés

```bash
ansible-playbook -i ansible/inventory/hosts.yml \
  ansible/playbooks/deploy.yml -vvv
```

### Vérifier services

```bash
docker ps
docker compose logs -f
curl http://localhost:3001/health
```

## 🔄 Workflow

1. **Local** : `./deploy.sh local deploy`
2. **Staging** : `./deploy.sh staging deploy`
3. **Production** : `./deploy.sh production deploy`
4. **Mise à jour** : `./deploy.sh production update`
5. **Sauvegarde** : `./deploy.sh production backup`

## 📊 Monitoring

```bash
# Health check
curl http://localhost:3001/health

# Logs
docker compose logs -f

# Métriques
docker stats
```

## 🚢 Cloud

### AWS EC2 / DigitalOcean / OVH

1. Créer instance (Ubuntu 22.04)
2. Configurer firewall (ports 3000, 3001, 22)
3. Configurer `ansible/inventory/hosts.yml`
4. `./deploy.sh production deploy`

## 📝 Checklist

- [ ] Ansible installé
- [ ] Inventaire configuré
- [ ] Accès SSH au serveur
- [ ] Firewall configuré
- [ ] DNS configuré (production)
- [ ] SSL/TLS configuré (production)

## 🆘 Support

**Problème ?**

1. Logs : `docker compose logs`
2. Santé : `curl http://localhost:3001/health`
3. Connexion : `ansible all -m ping`
4. Verbose : `ansible-playbook ... -vvv`

---

## 💡 Résumé

**`deploy.sh` = Wrapper qui simplifie Ansible**

- **Sans wrapper** : 3-4 commandes à retenir
- **Avec wrapper** : 1 commande simple

**Une seule commande : `./deploy.sh production deploy`** 🚀
