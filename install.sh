#!/bin/bash
# Script d'installation et déploiement automatique PhishGuard
# Usage: sudo ./install.sh [local|staging|production] [deploy|update|backup]
# 
# Ce script fait TOUT automatiquement :
# 1. Met à jour le système (si deploy)
# 2. Installe tous les prérequis (si deploy)
# 3. Installe Ansible (si deploy)
# 4. Installe Docker (si deploy)
# 5. Configure les permissions (si deploy)
# 6. Exécute directement les playbooks Ansible

set -e

ENV=${1:-local}
ACTION=${2:-deploy}

echo "🚀 PhishGuard - $ACTION ($ENV)"
echo "=============================="
echo ""

# Détecter l'utilisateur qui a lancé le script
ORIGINAL_USER=${SUDO_USER:-$USER}
CURRENT_DIR=$(pwd)

# Sélectionner inventaire et limite
case $ENV in
    local)
        INVENTORY="ansible/inventory/hosts.local.yml"
        LIMIT=""
        ;;
    staging)
        INVENTORY="ansible/inventory/hosts.yml"
        LIMIT="staging"
        ;;
    production|prod)
        INVENTORY="ansible/inventory/hosts.yml"
        LIMIT="production"
        if [ "$ACTION" = "deploy" ]; then
            echo "⚠️  ATTENTION: Déploiement en PRODUCTION"
            read -p "Confirmer (yes): " confirm
            [ "$confirm" != "yes" ] && exit 1
        fi
        ;;
    *)
        echo "❌ Environnement invalide: $ENV"
        echo "Usage: sudo ./install.sh [local|staging|production] [deploy|update|backup]"
        exit 1
        ;;
esac

# Vérifier playbook
PLAYBOOK="ansible/playbooks/${ACTION}.yml"
if [ ! -f "$PLAYBOOK" ]; then
    echo "❌ Action invalide: $ACTION"
    echo "Actions disponibles: deploy, update, backup"
    exit 1
fi

# Si c'est update ou backup, vérifier Ansible et exécuter
if [ "$ACTION" != "deploy" ]; then
    if ! command -v ansible-playbook >/dev/null 2>&1; then
        echo "❌ Ansible requis: pip install ansible"
        exit 1
    fi
    
    echo "📦 Installation des collections Ansible..."
    cd "$CURRENT_DIR/ansible"
    ansible-galaxy collection install -r requirements.yml -q 2>/dev/null || true
    cd "$CURRENT_DIR"
    
    echo "📦 Exécution du playbook Ansible..."
    if [ -n "$LIMIT" ]; then
        ansible-playbook -i "$INVENTORY" --limit "$LIMIT" "$PLAYBOOK"
    else
        ansible-playbook -i "$INVENTORY" "$PLAYBOOK"
    fi
    
    echo "✅ Opération terminée !"
    exit 0
fi

# Installation complète (deploy uniquement)
# Vérifier qu'on est root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ Ce script doit être exécuté en tant que root (sudo) pour l'installation"
    echo "Usage: sudo ./install.sh [local|staging|production] deploy"
    exit 1
fi

echo "📦 Étape 1/7 : Mise à jour du système..."
apt update && apt upgrade -y

echo ""
echo "📦 Étape 2/7 : Installation des prérequis système..."
apt install -y \
    python3 \
    python3-pip \
    python3-venv \
    git \
    curl \
    wget \
    ca-certificates \
    gnupg \
    lsb-release \
    openssl

echo ""
echo "📦 Étape 3/7 : Installation d'Ansible..."
pip3 install ansible

echo ""
echo "📦 Étape 4/7 : Installation des collections Ansible..."
cd "$CURRENT_DIR/ansible"
sudo -u $ORIGINAL_USER ansible-galaxy collection install -r requirements.yml -q 2>/dev/null || true
cd "$CURRENT_DIR"

echo ""
echo "🔧 Étape 5/7 : Configuration des permissions..."
chmod +x install.sh
chown $ORIGINAL_USER:$ORIGINAL_USER install.sh

echo ""
echo "📦 Étape 6/7 : Installation de Docker..."
if ! command -v docker &> /dev/null; then
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg
    
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    apt update
    apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    systemctl start docker
    systemctl enable docker
    echo "✅ Docker installé et démarré"
else
    echo "✅ Docker déjà installé"
fi

echo ""
echo "👤 Étape 7/7 : Configuration de l'utilisateur $ORIGINAL_USER..."
usermod -aG docker $ORIGINAL_USER

echo ""
echo "✅ Installation terminée !"
echo ""
echo "🚀 Lancement automatique du déploiement Ansible..."
echo ""

# Exécuter Ansible directement
echo "📦 Exécution du playbook Ansible..."
cd "$CURRENT_DIR"

# Construire la commande Ansible
ANSIBLE_CMD="ansible-playbook -i $INVENTORY"
if [ -n "$LIMIT" ]; then
    ANSIBLE_CMD="$ANSIBLE_CMD --limit $LIMIT"
fi
ANSIBLE_CMD="$ANSIBLE_CMD $PLAYBOOK"

# Exécuter en tant qu'utilisateur original avec le groupe docker
if sudo -u $ORIGINAL_USER sg docker -c "cd '$CURRENT_DIR' && $ANSIBLE_CMD" 2>/dev/null; then
    echo "✅ Déploiement réussi"
elif sudo -u $ORIGINAL_USER bash -c "cd '$CURRENT_DIR' && $ANSIBLE_CMD" 2>/dev/null; then
    echo "✅ Déploiement réussi"
else
    echo ""
    echo "⚠️  Le déploiement nécessite que le groupe docker soit actif."
    echo "   Exécutez manuellement :"
    echo "   newgrp docker"
    echo "   sudo ./install.sh $ENV $ACTION"
    echo ""
    echo "   Ou reconnectez-vous pour que le groupe docker soit actif."
    exit 1
fi

echo ""
echo "🎉 Installation et déploiement terminés avec succès !"
echo ""
echo "🌐 Accès :"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo "   Health:   http://localhost:3001/health"
echo ""
