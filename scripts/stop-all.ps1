# scripts/stop-all.ps1
# Stop all services

Write-Host "Stopping all services..." -ForegroundColor Yellow

# Stop Docker services
docker-compose down

Write-Host "All services stopped!" -ForegroundColor Green
Write-Host ""
Write-Host "If frontend was running locally, press Ctrl+C in that terminal to stop it." -ForegroundColor Cyan
