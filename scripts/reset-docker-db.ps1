# scripts/reset-docker-db.ps1

Write-Host "Docker Database Reset fuer Faninitiative Spandau" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Warnung
Write-Host "WARNUNG: Dies wird alle Daten loeschen!" -ForegroundColor Yellow
$confirm = Read-Host "Fortfahren? (j/n)"

if ($confirm -ne "j") {
    Write-Host "Abgebrochen." -ForegroundColor Red
    exit
}

# Reset durchfuehren
Write-Host ""
Write-Host "[1] Stoppe MySQL Container..." -ForegroundColor White
docker-compose stop mysql

Write-Host "[2] Loesche Container und Volume..." -ForegroundColor White
docker-compose rm -f -v mysql

Write-Host "[3] Starte MySQL neu mit docker-compose..." -ForegroundColor White
docker-compose up -d mysql

Write-Host "[4] Warte 20 Sekunden auf MySQL..." -ForegroundColor White
Start-Sleep -Seconds 20

Write-Host "[5] Fuehre Migration aus..." -ForegroundColor White
pnpm db:migrate

Write-Host "[6] Fuege Test-Daten ein..." -ForegroundColor White
pnpm db:seed:complete

Write-Host ""
Write-Host "=== FERTIG ===" -ForegroundColor Green
Write-Host ""
Write-Host "Test-Login:" -ForegroundColor Cyan
Write-Host "   E-Mail: admin@fanini-spandau.de" -ForegroundColor White
Write-Host "   Passwort: Admin2025!" -ForegroundColor White
