#!/bin/bash
# Verification script for Dev Wizard documentation
# This script checks that all required documentation files exist and contain expected content

set -e

echo "🔍 Verifying Dev Wizard documentation..."

# Check canonical docs
CANONICAL_DOCS=(
  "Dev_Wizard_canonical_docs/PRD.md"
  "Dev_Wizard_canonical_docs/architecture.md"
  "Dev_Wizard_canonical_docs/security_strategy.md"
  "Dev_Wizard_canonical_docs/roadmap.md"
  "Dev_Wizard_canonical_docs/copilot_prompt.md"
)

echo "✓ Checking canonical documentation..."
for doc in "${CANONICAL_DOCS[@]}"; do
  if [ -f "$doc" ]; then
    echo "  ✓ Found: $doc"
  else
    echo "  ✗ Missing: $doc"
    exit 1
  fi
done

# Check config files
echo "✓ Checking configuration files..."
if [ -f "dev_wizard/config/features.example.json" ]; then
  echo "  ✓ Found: features.example.json"
  # Check for expected keys
  if grep -q "projectScanning" "dev_wizard/config/features.example.json"; then
    echo "    ✓ Contains feature: projectScanning"
  fi
  if grep -q "secretsManagement" "dev_wizard/config/features.example.json"; then
    echo "    ✓ Contains feature: secretsManagement"
  fi
else
  echo "  ✗ Missing: config/features.example.json"
  exit 1
fi

if [ -f "dev_wizard/infra/environments.example.yaml" ]; then
  echo "  ✓ Found: environments.example.yaml"
  # Check for expected environments
  if grep -q "development:" "dev_wizard/infra/environments.example.yaml"; then
    echo "    ✓ Contains environment: development"
  fi
  if grep -q "production:" "dev_wizard/infra/environments.example.yaml"; then
    echo "    ✓ Contains environment: production"
  fi
else
  echo "  ✗ Missing: infra/environments.example.yaml"
  exit 1
fi

# Check project structure
echo "✓ Checking project structure..."
REQUIRED_DIRS=(
  "dev_wizard/app"
  "dev_wizard/api"
  "dev_wizard/components"
  "dev_wizard/electron"
  "dev_wizard/config"
  "dev_wizard/docs"
  "dev_wizard/pm"
)

for dir in "${REQUIRED_DIRS[@]}"; do
  if [ -d "$dir" ]; then
    echo "  ✓ Found: $dir/"
  else
    echo "  ✗ Missing: $dir/"
    exit 1
  fi
done

# Check key files
echo "✓ Checking key files..."
KEY_FILES=(
  "dev_wizard/README.md"
  "dev_wizard/package.json"
  "dev_wizard/pm/decisions.md"
  "dev_wizard/.env.example"
  "dev_wizard/docker-compose.yml"
)

for file in "${KEY_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ Found: $file"
  else
    echo "  ✗ Missing: $file"
    exit 1
  fi
done

echo ""
echo "✅ All documentation and structure verification passed!"
echo ""
echo "Next steps:"
echo "  1. cd dev_wizard"
echo "  2. npm install"
echo "  3. npm run dev        # Start web app"
echo "  4. npm run api:dev    # Start API server"
echo "  5. npm run electron   # Start desktop app"
