# scripts/clean.ps1
# Clean up script

param(
  [switch]$All,
  [switch]$Docker,
  [switch]$Deps,
  [switch]$Build,
  [switch]$NodeModules
)

Write-Host "Cleaning project..." -ForegroundColor Green

if ($All -or $Build) {
  Write-Host "Removing build artifacts..." -ForegroundColor Blue
  if (Test-Path "apps/web/dist") {
    Remove-Item -Recurse -Force "apps/web/dist"
    Write-Host "   OK Removed apps/web/dist" -ForegroundColor Gray
  }
  if (Test-Path "apps/api/dist") {
    Remove-Item -Recurse -Force "apps/api/dist"
    Write-Host "   OK Removed apps/api/dist" -ForegroundColor Gray
  }
  if (Test-Path ".next") {
    Remove-Item -Recurse -Force ".next"
    Write-Host "   OK Removed .next" -ForegroundColor Gray
  }
}

if ($All -or $Deps -or $NodeModules) {
  Write-Host "Removing dependencies..." -ForegroundColor Blue

  # Stop Docker containers first
  if ($All -or $NodeModules) {
    Write-Host "Stopping Docker containers first..." -ForegroundColor Yellow
    docker-compose down 2>$null
  }

  if (Test-Path "node_modules") {
    Write-Host "   Removing root node_modules..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
    Write-Host "   OK Removed root node_modules" -ForegroundColor Gray
  }
  if (Test-Path "apps/web/node_modules") {
    Write-Host "   Removing frontend node_modules..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "apps/web/node_modules" -ErrorAction SilentlyContinue
    Write-Host "   OK Removed apps/web/node_modules" -ForegroundColor Gray
  }
  if (Test-Path "apps/api/node_modules") {
    Write-Host "   Removing backend node_modules..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "apps/api/node_modules" -ErrorAction SilentlyContinue
    Write-Host "   OK Removed apps/api/node_modules" -ForegroundColor Gray
  }
  if (Test-Path "pnpm-lock.yaml") {
    Remove-Item "pnpm-lock.yaml"
    Write-Host "   OK Removed pnpm-lock.yaml" -ForegroundColor Gray
  }
}

if ($All -or $Docker) {
  Write-Host "Cleaning Docker..." -ForegroundColor Blue
  docker-compose down -v 2>$null
  Write-Host "   OK Stopped containers and removed volumes" -ForegroundColor Gray

  # Remove unused Docker resources
  docker system prune -f 2>$null | Out-Null
  Write-Host "   OK Cleaned Docker system" -ForegroundColor Gray

  # Remove Docker build cache
  docker builder prune -f 2>$null | Out-Null
  Write-Host "   OK Cleaned Docker build cache" -ForegroundColor Gray
}

if (!$All -and !$Docker -and !$Deps -and !$Build -and !$NodeModules) {
  Write-Host "Please specify what to clean:" -ForegroundColor Yellow
  Write-Host "  -All          Clean everything" -ForegroundColor White
  Write-Host "  -Build        Clean build artifacts" -ForegroundColor White
  Write-Host "  -Deps         Clean dependencies" -ForegroundColor White
  Write-Host "  -NodeModules  Clean node_modules (stops Docker first)" -ForegroundColor White
  Write-Host "  -Docker       Clean Docker containers and volumes" -ForegroundColor White
  Write-Host ""
  Write-Host "Examples:" -ForegroundColor Cyan
  Write-Host "  ./scripts/clean.ps1 -All" -ForegroundColor White
  Write-Host "  ./scripts/clean.ps1 -NodeModules" -ForegroundColor White
  Write-Host "  ./scripts/clean.ps1 -Build -Deps" -ForegroundColor White
  exit 0
}

Write-Host "Cleanup complete!" -ForegroundColor Green
