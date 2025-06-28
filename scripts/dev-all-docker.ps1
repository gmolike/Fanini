# scripts/dev-all-docker.ps1
# Alle Services im Docker

Write-Host "Starting ALL services in Docker..." -ForegroundColor Green

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

# Start all services
Write-Host "Starting Docker containers..." -ForegroundColor Blue
docker-compose up -d

# Wait for services
Write-Host "Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check status
$runningServices = docker-compose ps --filter "status=running" -q
if ($runningServices) {
  Write-Host "All services are ready!" -ForegroundColor Green
  Write-Host ""
  Write-Host "Services:" -ForegroundColor Cyan
  Write-Host "   Frontend: http://localhost:5173" -ForegroundColor White
  Write-Host "   Backend API: http://localhost:3000" -ForegroundColor White
  Write-Host "   Database: localhost:3306" -ForegroundColor White
  Write-Host "   phpMyAdmin: http://localhost:8080" -ForegroundColor White
  Write-Host ""
  Write-Host "Commands:" -ForegroundColor Cyan
  Write-Host "   Logs: docker-compose logs -f" -ForegroundColor White
  Write-Host "   Stop: docker-compose down" -ForegroundColor White
}
else {
  Write-Host "Some services failed to start:" -ForegroundColor Red
  docker-compose ps
}
