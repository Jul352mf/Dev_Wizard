<#!
.SYNOPSIS
  PowerShell verification script for Dev Wizard documentation & structure (Windows friendly)
#>

$ErrorActionPreference = 'Stop'
Write-Host '🔍 Verifying Dev Wizard documentation (PowerShell)...'

$canonical = @(
  'Dev_Wizard_canonical_docs/PRD.md'
  'Dev_Wizard_canonical_docs/architecture.md'
  'Dev_Wizard_canonical_docs/security_strategy.md'
  'Dev_Wizard_canonical_docs/roadmap.md'
  'Dev_Wizard_canonical_docs/copilot_prompt.md'
)

Write-Host '✓ Checking canonical documentation...'
foreach ($doc in $canonical) {
  if (Test-Path $doc) { Write-Host "  ✓ Found: $doc" } else { throw "Missing: $doc" }
}

Write-Host '✓ Checking configuration files...'
if (Test-Path 'dev_wizard/config/features.example.json') {
  Write-Host '  ✓ Found: features.example.json'
  $content = Get-Content 'dev_wizard/config/features.example.json' -Raw
  foreach ($feat in 'projectScanning','secretsManagement') {
    if ($content -match $feat) { Write-Host "    ✓ Contains feature: $feat" }
  }
} else { throw 'Missing: dev_wizard/config/features.example.json' }

if (Test-Path 'dev_wizard/infra/environments.example.yaml') {
  Write-Host '  ✓ Found: environments.example.yaml'
  $envContent = Get-Content 'dev_wizard/infra/environments.example.yaml' -Raw
  foreach ($env in 'development:','production:') {
    if ($envContent -match $env) { Write-Host "    ✓ Contains environment: $env" }
  }
} else { throw 'Missing: dev_wizard/infra/environments.example.yaml' }

Write-Host '✓ Checking project structure...'
$dirs = @(
  'dev_wizard/app','dev_wizard/api','dev_wizard/components','dev_wizard/electron','dev_wizard/config','dev_wizard/docs','dev_wizard/pm'
)
foreach ($d in $dirs) { if (Test-Path $d) { Write-Host "  ✓ Found: $d/" } else { throw "Missing: $d/" } }

Write-Host '✓ Checking key files...'
$files = @(
  'dev_wizard/README.md','dev_wizard/package.json','dev_wizard/pm/decisions.md','dev_wizard/docker-compose.yml'
)
foreach ($f in $files) { if (Test-Path $f) { Write-Host "  ✓ Found: $f" } else { throw "Missing: $f" } }

Write-Host ''
Write-Host '✅ All documentation and structure verification passed (PowerShell)!'
Write-Host ''
Write-Host 'Next steps:'
Write-Host '  1. cd dev_wizard'
Write-Host '  2. npm install'
Write-Host '  3. npm run dev'
