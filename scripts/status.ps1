# scripts/status.ps1
# Show status of all services

Write-Host "Service Status Overview" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan
Write-Host ""

# Docker services
Write-Host "Docker Services:" -ForegroundColor Blue
docker-compose ps

Write-Host ""
Write-Host "Available Endpoints:" -ForegroundColor Green
Write-Host "   Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "   Backend API: http://localhost:3000" -ForegroundColor White
Write-Host "   Database: localhost:3306" -ForegroundColor White
Write-Host "   phpMyAdmin: http://localhost:8080" -ForegroundColor White

Write-Host ""
Write-Host "Useful Commands:" -ForegroundColor Yellow
Write-Host "   View logs: docker-compose logs -f [service]" -ForegroundColor White
Write-Host "   Restart service: docker-compose restart [service]" -ForegroundColor White
Write-Host "   Stop all: docker-compose down" -ForegroundColor White
