# scripts/setup.ps1
# Initial project setup script

Write-Host "Setting up Faninitiative Spandau Project" -ForegroundColor Green

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Blue
pnpm install

# Try to generate route tree (optional, kann fehlschlagen in Phase 1)
Write-Host "Attempting to generate route tree..." -ForegroundColor Blue
try {
  Set-Location frontend
  # Prüfe ob das TanStack Router Plugin verfügbar ist
  if (Test-Path "../node_modules/@tanstack/router-plugin/dist/cli.js") {
    pnpm exec tsx ../node_modules/@tanstack/router-plugin/dist/cli.js generate
    Write-Host "Route tree generated successfully!" -ForegroundColor Green
  }
  else {
    Write-Host "TanStack Router plugin not found. Will be configured in Phase 2." -ForegroundColor Yellow
  }
}
catch {
  Write-Host "Route tree generation skipped. Will be configured in Phase 2." -ForegroundColor Yellow
}
finally {
  Set-Location ..
}

# Create initial database schema (for Phase 3)
Write-Host "Creating database schema..." -ForegroundColor Blue
if (!(Test-Path "database/init")) {
  New-Item -ItemType Directory -Path "database/init" -Force | Out-Null
}

$schemaContent = @"
-- Initial schema for Faninitiative Spandau e.V.
-- This will be implemented in Phase 3

CREATE DATABASE IF NOT EXISTS fanini_db;
USE fanini_db;

-- Users table (will be mapped to EasyVerein)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    easyverein_id VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('member', 'admin', 'moderator') DEFAULT 'member',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATETIME NOT NULL,
    location VARCHAR(255),
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Todos table
CREATE TABLE IF NOT EXISTS todos (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    event_id VARCHAR(36),
    assigned_to VARCHAR(36),
    due_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);
"@

$schemaContent | Out-File -FilePath "database/init/01-schema.sql" -Encoding UTF8

Write-Host "Project setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "   1. Copy .env.example to .env and configure" -ForegroundColor White
Write-Host "   2. Run: ./scripts/dev.ps1" -ForegroundColor White
Write-Host "   3. Start coding!" -ForegroundColor White
