#!/bin/bash
# Wrapper Ansible pour PhishGuard - Simplifie l'utilisation d'Ansible
# 
# Ce script automatise :
# - Vérification d'Ansible
# - Installation des collections
# - Sélection de l'inventaire selon l'environnement
# - Construction de la commande ansible-playbook
# - Confirmation pour production
#
# Usage: ./deploy.sh [local|staging|production] [deploy|update|backup]
#
# Sans ce script, vous devriez taper :
#   cd ansible
#   ansible-galaxy collection install -r requirements.yml
#   ansible-playbook -i inventory/hosts.local.yml playbooks/deploy.yml
#
# Avec ce script, c'est juste : ./deploy.sh local

set -e

ENV=${1:-local}
ACTION=${2:-deploy}

echo "🚀 PhishGuard - $ACTION ($ENV)"

# Vérifier Ansible
if ! command -v ansible-playbook >/dev/null 2>&1; then
    echo "❌ Ansible requis: pip install ansible"
    exit 1
fi

# Installer collections Ansible
cd ansible
ansible-galaxy collection install -r requirements.yml -q 2>/dev/null || true
cd ..

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
        echo "⚠️  ATTENTION: Déploiement en PRODUCTION"
        read -p "Confirmer (yes): " confirm
        [ "$confirm" != "yes" ] && exit 1
        ;;
    *)
        echo "❌ Environnement invalide: $ENV"
        echo "Usage: ./deploy.sh [local|staging|production] [deploy|update|backup]"
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

# Exécuter Ansible
echo "📦 Exécution d'Ansible..."
if [ -n "$LIMIT" ]; then
    ansible-playbook -i "$INVENTORY" --limit "$LIMIT" "$PLAYBOOK"
else
    ansible-playbook -i "$INVENTORY" "$PLAYBOOK"
fi

echo "✅ Déploiement terminé!"
