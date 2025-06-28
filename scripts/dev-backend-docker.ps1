# scripts/dev-backend-docker.ps1
# Backend im Docker, Frontend lokal

Write-Host "Starting Backend services in Docker, Frontend locally..." -ForegroundColor Green

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

# Start only backend services
Write-Host "Starting backend Docker containers..." -ForegroundColor Blue
docker-compose up -d mysql phpmyadmin backend

# Wait for backend services
Write-Host "Waiting for backend services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# Check backend status
$backendServices = docker-compose ps mysql backend phpmyadmin --filter "status=running" -q
if ($backendServices) {
  Write-Host "Backend services are ready!" -ForegroundColor Green
  Write-Host ""
  Write-Host "Docker Services:" -ForegroundColor Cyan
  Write-Host "   Backend API: http://localhost:3000" -ForegroundColor White
  Write-Host "   Database: localhost:3306" -ForegroundColor White
  Write-Host "   phpMyAdmin: http://localhost:8080" -ForegroundColor White
  Write-Host ""

  # Start frontend locally
  Write-Host "Starting frontend locally..." -ForegroundColor Blue
  Write-Host "Navigate to frontend directory and run 'pnpm dev'" -ForegroundColor Yellow
  Write-Host ""
  Write-Host "Manual command:" -ForegroundColor Cyan
  Write-Host "   cd frontend && pnpm dev" -ForegroundColor White
  Write-Host ""

  # Ask if user wants to auto-start frontend
  $response = Read-Host "Start frontend automatically? (y/n)"
  if ($response -eq 'y' -or $response -eq 'Y') {
    Write-Host "Starting frontend..." -ForegroundColor Blue
    Set-Location frontend

    # Check if dependencies are installed
    if (!(Test-Path "node_modules")) {
      Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
      pnpm install
    }

    Write-Host "Frontend starting at http://localhost:5173" -ForegroundColor Green
    pnpm dev
  }
}
else {
  Write-Host "Backend services failed to start:" -ForegroundColor Red
  docker-compose ps mysql backend phpmyadmin
}
