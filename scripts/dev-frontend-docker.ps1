# scripts/dev-frontend-docker.ps1
# Frontend im Docker, Backend lokal (seltener verwendet)

Write-Host "Starting Frontend in Docker, Backend locally..." -ForegroundColor Green

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

# Start only frontend and database services
Write-Host "Starting frontend and database in Docker..." -ForegroundColor Blue
docker-compose up -d mysql phpmyadmin frontend

# Wait for services
Write-Host "Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check status
$frontendServices = docker-compose ps mysql frontend phpmyadmin --filter "status=running" -q
if ($frontendServices) {
  Write-Host "Frontend and Database services are ready!" -ForegroundColor Green
  Write-Host ""
  Write-Host "Docker Services:" -ForegroundColor Cyan
  Write-Host "   Frontend: http://localhost:5173" -ForegroundColor White
  Write-Host "   Database: localhost:3306" -ForegroundColor White
  Write-Host "   phpMyAdmin: http://localhost:8080" -ForegroundColor White
  Write-Host ""
  Write-Host "Note: Backend needs to be started locally for Phase 3" -ForegroundColor Yellow
}
else {
  Write-Host "Frontend services failed to start:" -ForegroundColor Red
  docker-compose ps mysql frontend phpmyadmin
}
