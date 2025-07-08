# scripts/dev.ps1
# Development startup script

Write-Host "Starting Faninitiative Spandau Development Environment" -ForegroundColor Green

# Check if Docker is running
try {
  docker info *> $null
  if ($LASTEXITCODE -ne 0) {
    throw "Docker not running"
  }
}
catch {
  Write-Host "Docker is not running. Please start Docker first." -ForegroundColor Red
  exit 1
}

# Check if pnpm is installed
if (!(Get-Command pnpm -ErrorAction SilentlyContinue)) {
  Write-Host "pnpm is not installed. Installing..." -ForegroundColor Yellow
  npm install -g pnpm@9.15.1
}

# Create necessary directories
if (!(Test-Path "database/init")) {
  New-Item -ItemType Directory -Path "database/init" -Force | Out-Null
}
if (!(Test-Path "logs")) {
  New-Item -ItemType Directory -Path "logs" -Force | Out-Null
}

# Copy environment files if they don't exist
if (!(Test-Path ".env")) {
  Write-Host "Creating .env file from template..." -ForegroundColor Blue
  Copy-Item ".env.example" ".env"
}

if (!(Test-Path "apps/web/.env.development")) {
  Write-Host "Creating frontend development environment file..." -ForegroundColor Blue
  Copy-Item "apps/web/.env.example" "apps/web/.env.development"
}

# Start development environment
Write-Host "Starting Docker containers..." -ForegroundColor Blue
docker-compose up -d

# Wait for services to be ready
Write-Host "Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check if services are running
$runningServices = docker-compose ps --filter "status=running" -q
if ($runningServices) {
  Write-Host "Development environment is ready!" -ForegroundColor Green
  Write-Host ""
  Write-Host "Services:" -ForegroundColor Cyan
  Write-Host "   Frontend: http://localhost:5173" -ForegroundColor White
  Write-Host "   Backend API: http://localhost:3000" -ForegroundColor White
  Write-Host "   Database: localhost:3306" -ForegroundColor White
  Write-Host "   phpMyAdmin: http://localhost:8080" -ForegroundColor White
  Write-Host ""
  Write-Host "Logs:" -ForegroundColor Cyan
  Write-Host "   docker-compose logs -f frontend" -ForegroundColor White
  Write-Host "   docker-compose logs -f backend" -ForegroundColor White
  Write-Host ""
  Write-Host "Stop:" -ForegroundColor Cyan
  Write-Host "   docker-compose down" -ForegroundColor White
}
else {
  Write-Host "Some services failed to start. Check logs:" -ForegroundColor Red
  docker-compose logs
}
