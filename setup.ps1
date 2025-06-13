# React FSD Full-Stack Project Setup Script
# Erstellt Frontend und Backend in separaten Ordnern

Write-Host "React FSD Full-Stack Project Setup Script"
Write-Host "========================================"
Write-Host ""

# FRONTEND Struktur
Write-Host "Creating frontend structure..."

# Frontend src/ Struktur
# App Layer
New-Item -ItemType Directory -Force -Path "frontend\src\app" | Out-Null
New-Item -ItemType Directory -Force -Path "frontend\src\app\providers" | Out-Null
New-Item -ItemType Directory -Force -Path "frontend\src\app\providers\router" | Out-Null
New-Item -ItemType Directory -Force -Path "frontend\src\app\providers\query" | Out-Null
New-Item -ItemType File -Force -Path "frontend\src\app\providers\index.tsx" | Out-Null
New-Item -ItemType Directory -Force -Path "frontend\src\app\styles" | Out-Null
New-Item -ItemType File -Force -Path "frontend\src\app\styles\globals.css" | Out-Null
New-Item -ItemType File -Force -Path "frontend\src\app\styles\fonts.css" | Out-Null
New-Item -ItemType File -Force -Path "frontend\src\app\index.tsx" | Out-Null

# Pages Layer
New-Item -ItemType Directory -Force -Path "frontend\src\pages" | Out-Null
New-Item -ItemType Directory -Force -Path "frontend\src\pages\home" | Out-Null
New-Item -ItemType Directory -Force -Path "frontend\src\pages\about" | Out-Null
New-Item -ItemType File -Force -Path "frontend\src\pages\index.ts" | Out-Null

# Widgets Layer
New-Item -ItemType Directory -Force -Path "frontend\src\widgets" | Out-Null
New-Item -ItemType Directory -Force -Path "frontend\src\widgets\header" | Out-Null
New-Item -ItemType Directory -Force -Path "frontend\src\widgets\footer" | Out-Null
New-Item -ItemType File -Force -Path "frontend\src\widgets\index.ts" | Out-Null

# Features Layer
New-Item -ItemType Directory -Force -Path "frontend\src\features" | Out-Null
New-Item -ItemType Directory -Force -Path "frontend\src\features\auth" | Out-Null
New-Item -ItemType Directory -Force -Path "frontend\src\features\user-profile" | Out-Null
New-Item -ItemType File -Force -Path "frontend\src\features\index.ts" | Out-Null

# Entities Layer
New-Item -ItemType Directory -Force -Path "frontend\src\entities" | Out-Null
New-Item -ItemType Directory -Force -Path "frontend\src\entities\user" | Out-Null
New-Item -ItemType Directory -Force -Path "frontend\src\entities\post" | Out-Null
New-Item -ItemType File -Force -Path "frontend\src\entities\index.ts" | Out-Null

# Shared Layer
New-Item -ItemType Directory -Force -Path "frontend\src\shared" | Out-Null
New-Item -ItemType Directory -Force -Path "frontend\src\shared\api" | Out-Null
New-Item -ItemType Directory -Force -Path "frontend\src\shared\api\client" | Out-Null
New-Item -ItemType Directory -Force -Path "frontend\src\shared\api\mocks" | Out-Null
New-Item -ItemType File -Force -Path "frontend\src\shared\api\index.ts" | Out-Null

New-Item -ItemType Directory -Force -Path "frontend\src\shared\config" | Out-Null
New-Item -ItemType File -Force -Path "frontend\src\shared\config\constants.ts" | Out-Null
New-Item -ItemType File -Force -Path "frontend\src\shared\config\env.ts" | Out-Null

New-Item -ItemType Directory -Force -Path "frontend\src\shared\lib" | Out-Null
New-Item -ItemType Directory -Force -Path "frontend\src\shared\lib\tanstack-query" | Out-Null
New-Item -ItemType Directory -Force -Path "frontend\src\shared\lib\tanstack-router" | Out-Null
New-Item -ItemType Directory -Force -Path "frontend\src\shared\lib\zod" | Out-Null
New-Item -ItemType File -Force -Path "frontend\src\shared\lib\utils.ts" | Out-Null

New-Item -ItemType Directory -Force -Path "frontend\src\shared\ui" | Out-Null
New-Item -ItemType Directory -Force -Path "frontend\src\shared\ui\button" | Out-Null
New-Item -ItemType Directory -Force -Path "frontend\src\shared\ui\card" | Out-Null
New-Item -ItemType Directory -Force -Path "frontend\src\shared\ui\dialog" | Out-Null
New-Item -ItemType File -Force -Path "frontend\src\shared\ui\index.ts" | Out-Null

New-Item -ItemType Directory -Force -Path "frontend\src\shared\types" | Out-Null
New-Item -ItemType File -Force -Path "frontend\src\shared\types\index.ts" | Out-Null

# Frontend Public
New-Item -ItemType Directory -Force -Path "frontend\public" | Out-Null
New-Item -ItemType Directory -Force -Path "frontend\public\fonts" | Out-Null
New-Item -ItemType Directory -Force -Path "frontend\public\images" | Out-Null

# Frontend Tests
New-Item -ItemType Directory -Force -Path "frontend\tests" | Out-Null
New-Item -ItemType File -Force -Path "frontend\tests\setup.ts" | Out-Null
New-Item -ItemType Directory -Force -Path "frontend\tests\utils" | Out-Null

# Frontend Config Files
Write-Host "Creating frontend config files..."
New-Item -ItemType File -Force -Path "frontend\package.json" | Out-Null
New-Item -ItemType File -Force -Path "frontend\tsconfig.json" | Out-Null
New-Item -ItemType File -Force -Path "frontend\tsconfig.node.json" | Out-Null
New-Item -ItemType File -Force -Path "frontend\vite.config.ts" | Out-Null
New-Item -ItemType File -Force -Path "frontend\index.html" | Out-Null
New-Item -ItemType File -Force -Path "frontend\.env.example" | Out-Null
New-Item -ItemType File -Force -Path "frontend\.env.local" | Out-Null
New-Item -ItemType File -Force -Path "frontend\.eslintrc.js" | Out-Null
New-Item -ItemType File -Force -Path "frontend\.prettierrc" | Out-Null
New-Item -ItemType File -Force -Path "frontend\tailwind.config.ts" | Out-Null
New-Item -ItemType File -Force -Path "frontend\postcss.config.js" | Out-Null
New-Item -ItemType File -Force -Path "frontend\components.json" | Out-Null
New-Item -ItemType File -Force -Path "frontend\vitest.config.ts" | Out-Null
New-Item -ItemType File -Force -Path "frontend\.gitignore" | Out-Null

# BACKEND Struktur
Write-Host "Creating backend structure..."
New-Item -ItemType Directory -Force -Path "backend\src" | Out-Null
New-Item -ItemType Directory -Force -Path "backend\src\controllers" | Out-Null
New-Item -ItemType Directory -Force -Path "backend\src\routes" | Out-Null
New-Item -ItemType Directory -Force -Path "backend\src\models" | Out-Null
New-Item -ItemType Directory -Force -Path "backend\src\services" | Out-Null
New-Item -ItemType Directory -Force -Path "backend\src\middleware" | Out-Null
New-Item -ItemType Directory -Force -Path "backend\src\utils" | Out-Null
New-Item -ItemType Directory -Force -Path "backend\src\config" | Out-Null
New-Item -ItemType Directory -Force -Path "backend\src\types" | Out-Null
New-Item -ItemType Directory -Force -Path "backend\tests" | Out-Null

# Backend Config Files
Write-Host "Creating backend config files..."
New-Item -ItemType File -Force -Path "backend\src\index.ts" | Out-Null
New-Item -ItemType File -Force -Path "backend\src\app.ts" | Out-Null
New-Item -ItemType File -Force -Path "backend\package.json" | Out-Null
New-Item -ItemType File -Force -Path "backend\tsconfig.json" | Out-Null
New-Item -ItemType File -Force -Path "backend\.env.example" | Out-Null
New-Item -ItemType File -Force -Path "backend\.env.local" | Out-Null
New-Item -ItemType File -Force -Path "backend\.eslintrc.js" | Out-Null
New-Item -ItemType File -Force -Path "backend\.prettierrc" | Out-Null
New-Item -ItemType File -Force -Path "backend\nodemon.json" | Out-Null
New-Item -ItemType File -Force -Path "backend\.gitignore" | Out-Null

# SHARED Types (optional für geteilte Types zwischen Frontend und Backend)
Write-Host "Creating shared types structure..."
New-Item -ItemType Directory -Force -Path "shared" | Out-Null
New-Item -ItemType Directory -Force -Path "shared\types" | Out-Null
New-Item -ItemType File -Force -Path "shared\types\index.ts" | Out-Null
New-Item -ItemType File -Force -Path "shared\package.json" | Out-Null
New-Item -ItemType File -Force -Path "shared\tsconfig.json" | Out-Null

# DOCKER Struktur
Write-Host "Creating docker structure..."
New-Item -ItemType Directory -Force -Path "docker" | Out-Null
New-Item -ItemType Directory -Force -Path "docker\frontend" | Out-Null
New-Item -ItemType Directory -Force -Path "docker\backend" | Out-Null
New-Item -ItemType Directory -Force -Path "docker\nginx" | Out-Null
New-Item -ItemType File -Force -Path "docker\docker-compose.yml" | Out-Null
New-Item -ItemType File -Force -Path "docker\docker-compose.dev.yml" | Out-Null
New-Item -ItemType File -Force -Path "docker\docker-compose.prod.yml" | Out-Null
New-Item -ItemType File -Force -Path "docker\frontend\Dockerfile" | Out-Null
New-Item -ItemType File -Force -Path "docker\frontend\Dockerfile.dev" | Out-Null
New-Item -ItemType File -Force -Path "docker\backend\Dockerfile" | Out-Null
New-Item -ItemType File -Force -Path "docker\backend\Dockerfile.dev" | Out-Null
New-Item -ItemType File -Force -Path "docker\nginx\nginx.conf" | Out-Null
New-Item -ItemType File -Force -Path "docker\.env.example" | Out-Null

# ROOT Level Dateien
Write-Host "Creating root level files..."
New-Item -ItemType File -Force -Path ".gitignore" | Out-Null
New-Item -ItemType File -Force -Path "README.md" | Out-Null
New-Item -ItemType File -Force -Path "package.json" | Out-Null
New-Item -ItemType File -Force -Path "pnpm-workspace.yaml" | Out-Null
New-Item -ItemType File -Force -Path ".nvmrc" | Out-Null
New-Item -ItemType File -Force -Path ".editorconfig" | Out-Null
New-Item -ItemType File -Force -Path ".env.example" | Out-Null

# Husky (Git Hooks) auf Root Level
Write-Host "Creating husky structure..."
New-Item -ItemType Directory -Force -Path ".husky" | Out-Null
New-Item -ItemType File -Force -Path ".husky\pre-commit" | Out-Null
New-Item -ItemType File -Force -Path ".husky\pre-push" | Out-Null
New-Item -ItemType File -Force -Path ".husky\commit-msg" | Out-Null

# VS Code Einstellungen auf Root Level
Write-Host "Creating VS Code settings..."
New-Item -ItemType Directory -Force -Path ".vscode" | Out-Null
New-Item -ItemType File -Force -Path ".vscode\settings.json" | Out-Null
New-Item -ItemType File -Force -Path ".vscode\extensions.json" | Out-Null
New-Item -ItemType File -Force -Path ".vscode\launch.json" | Out-Null

# GitHub Templates
Write-Host "Creating GitHub templates..."
New-Item -ItemType Directory -Force -Path ".github" | Out-Null
New-Item -ItemType Directory -Force -Path ".github\workflows" | Out-Null
New-Item -ItemType File -Force -Path ".github\workflows\ci.yml" | Out-Null
New-Item -ItemType File -Force -Path ".github\workflows\frontend.yml" | Out-Null
New-Item -ItemType File -Force -Path ".github\workflows\backend.yml" | Out-Null
New-Item -ItemType File -Force -Path ".github\PULL_REQUEST_TEMPLATE.md" | Out-Null
New-Item -ItemType Directory -Force -Path ".github\ISSUE_TEMPLATE" | Out-Null
New-Item -ItemType File -Force -Path ".github\ISSUE_TEMPLATE\bug_report.md" | Out-Null
New-Item -ItemType File -Force -Path ".github\ISSUE_TEMPLATE\feature_request.md" | Out-Null

Write-Host ""
Write-Host "Full-Stack project structure created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Project structure:"
Write-Host "- frontend/   React app with FSD architecture"
Write-Host "- backend/    Node.js API"
Write-Host "- shared/     Shared types between frontend and backend"
Write-Host "- docker/     Docker configurations"
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Copy configuration content into the files"
Write-Host "2. Run 'pnpm install' in root (for workspace)"
Write-Host "3. Run 'pnpm install' in frontend/"
Write-Host "4. Run 'pnpm install' in backend/"
Write-Host "5. In frontend/ run 'npx shadcn-ui@latest init'"
Write-Host "6. In frontend/ run 'npx msw init public/ --save'"
Write-Host "7. Run 'pnpm run dev' to start both services"