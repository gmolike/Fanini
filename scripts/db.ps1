# scripts/db.ps1
# Database management script

param(
  [string]$Action
)

function Show-Help {
  Write-Host "Database Management Commands" -ForegroundColor Cyan
  Write-Host "=================================" -ForegroundColor Cyan
  Write-Host ""
  Write-Host "Usage: ./scripts/db.ps1 <action>" -ForegroundColor White
  Write-Host ""
  Write-Host "Actions:" -ForegroundColor Yellow
  Write-Host "  reset    Reset database (removes all data)" -ForegroundColor White
  Write-Host "  backup   Create database backup" -ForegroundColor White
  Write-Host "  restore  Restore from backup file" -ForegroundColor White
  Write-Host "  logs     Show database logs" -ForegroundColor White
  Write-Host "  shell    Open MySQL shell" -ForegroundColor White
  Write-Host "  status   Show database status" -ForegroundColor White
  Write-Host ""
  Write-Host "Examples:" -ForegroundColor Cyan
  Write-Host "  ./scripts/db.ps1 reset" -ForegroundColor White
  Write-Host "  ./scripts/db.ps1 backup" -ForegroundColor White
}

switch ($Action) {
  "reset" {
    Write-Host "Resetting database..." -ForegroundColor Blue
    docker-compose down mysql
    docker volume rm faninitiative-spandau_mysql_data 2>$null
    docker-compose up -d mysql
    Write-Host "Database reset complete!" -ForegroundColor Green
  }

  "backup" {
    Write-Host "Creating database backup..." -ForegroundColor Blue
    if (!(Test-Path "backups")) {
      New-Item -ItemType Directory -Path "backups" -Force | Out-Null
    }
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupFile = "backups/backup_$timestamp.sql"
    docker-compose exec -T mysql mysqldump -u fanini -ppassword fanini_db > $backupFile
    Write-Host "Backup created: $backupFile" -ForegroundColor Green
  }

  "restore" {
    Write-Host "Available backups:" -ForegroundColor Blue
    if (Test-Path "backups") {
      Get-ChildItem "backups/*.sql" | ForEach-Object { "  $($_.Name)" }
      Write-Host ""
      $backupFile = Read-Host "Enter backup filename"
      if (Test-Path "backups/$backupFile") {
        Write-Host "Restoring from $backupFile..." -ForegroundColor Blue
        Get-Content "backups/$backupFile" | docker-compose exec -T mysql mysql -u fanini -ppassword fanini_db
        Write-Host "Database restored!" -ForegroundColor Green
      }
      else {
        Write-Host "Backup file not found!" -ForegroundColor Red
      }
    }
    else {
      Write-Host "No backups directory found!" -ForegroundColor Red
    }
  }

  "logs" {
    Write-Host "Database logs:" -ForegroundColor Blue
    docker-compose logs -f mysql
  }

  "shell" {
    Write-Host "Opening MySQL shell..." -ForegroundColor Blue
    docker-compose exec mysql mysql -u fanini -ppassword fanini_db
  }

  "status" {
    Write-Host "Database Status:" -ForegroundColor Blue
    Write-Host "===================" -ForegroundColor Blue
    $mysqlStatus = docker-compose ps mysql --format "table"
    Write-Host $mysqlStatus
    Write-Host ""
    Write-Host "Connection Info:" -ForegroundColor Cyan
    Write-Host "  Host: localhost" -ForegroundColor White
    Write-Host "  Port: 3306" -ForegroundColor White
    Write-Host "  Database: fanini_db" -ForegroundColor White
    Write-Host "  Username: fanini" -ForegroundColor White
    Write-Host "  phpMyAdmin: http://localhost:8080" -ForegroundColor White
  }

  default {
    Show-Help
  }
}
