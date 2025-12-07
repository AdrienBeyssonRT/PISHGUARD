# Wrapper Ansible pour PhishGuard - Simplifie l'utilisation d'Ansible
# 
# Ce script automatise :
# - Vérification d'Ansible
# - Installation des collections
# - Sélection de l'inventaire selon l'environnement
# - Construction de la commande ansible-playbook
# - Confirmation pour production
#
# Usage: .\deploy.ps1 [local|staging|production] [deploy|update|backup]
#
# Sans ce script, vous devriez taper :
#   cd ansible
#   ansible-galaxy collection install -r requirements.yml
#   ansible-playbook -i inventory/hosts.local.yml playbooks/deploy.yml
#
# Avec ce script, c'est juste : .\deploy.ps1 local

param(
    [string]$Env = "local",
    [string]$Action = "deploy"
)

Write-Host "🚀 PhishGuard - $Action ($Env)" -ForegroundColor Cyan

# Vérifier Ansible
if (-not (Get-Command ansible-playbook -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Ansible requis: pip install ansible" -ForegroundColor Red
    exit 1
}

# Installer collections Ansible
Set-Location ansible
ansible-galaxy collection install -r requirements.yml -q 2>$null
Set-Location ..

# Sélectionner inventaire et limite
$Inventory = switch ($Env) {
    "local" {
        $script:Limit = $null
        "ansible/inventory/hosts.local.yml"
    }
    "staging" {
        $script:Limit = "staging"
        "ansible/inventory/hosts.yml"
    }
    { $_ -in "production", "prod" } {
        $script:Limit = "production"
        Write-Host "⚠️  ATTENTION: Déploiement en PRODUCTION" -ForegroundColor Red
        $confirm = Read-Host "Confirmer (yes)"
        if ($confirm -ne "yes") { exit 1 }
        "ansible/inventory/hosts.yml"
    }
    default {
        Write-Host "❌ Environnement invalide: $Env" -ForegroundColor Red
        Write-Host "Usage: .\deploy.ps1 [local|staging|production] [deploy|update|backup]"
        exit 1
    }
}

# Vérifier playbook
$Playbook = "ansible/playbooks/$Action.yml"
if (-not (Test-Path $Playbook)) {
    Write-Host "❌ Action invalide: $Action" -ForegroundColor Red
    Write-Host "Actions disponibles: deploy, update, backup"
    exit 1
}

# Exécuter Ansible
Write-Host "📦 Exécution d'Ansible..." -ForegroundColor Yellow
if ($Limit) {
    ansible-playbook -i $Inventory --limit $Limit $Playbook
} else {
    ansible-playbook -i $Inventory $Playbook
}

Write-Host "✅ Déploiement terminé!" -ForegroundColor Green
