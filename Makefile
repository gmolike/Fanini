# Makefile (Windows PowerShell Version) - Erweitert

help: ## Show this help message
	@echo "Faninitiative Spandau e.V. - Development Commands"
	@echo "=================================================="
	@powershell -Command "& { Get-Content Makefile | Select-String '##' | ForEach-Object { $$parts = $$_.Line.Split('##'); if ($$parts.Length -eq 2) { Write-Host ('  {0,-20} {1}' -f $$parts[0].Split(':')[0].Trim(), $$parts[1].Trim()) -ForegroundColor Cyan } } }"

# Setup Commands
setup: ## Initial project setup
	@powershell -ExecutionPolicy Bypass -File scripts/setup.ps1

# Development Commands - Different Modes
dev: ## Start ALL services in Docker (default)
	@powershell -ExecutionPolicy Bypass -File scripts/dev-all-docker.ps1

dev-all: ## Start ALL services in Docker
	@powershell -ExecutionPolicy Bypass -File scripts/dev-all-docker.ps1

dev-backend: ## Start backend in Docker, frontend locally
	@powershell -ExecutionPolicy Bypass -File scripts/dev-backend-docker.ps1

dev-frontend: ## Start frontend in Docker, backend locally
	@powershell -ExecutionPolicy Bypass -File scripts/dev-frontend-docker.ps1

# Status & Control
status: ## Show status of all services
	@powershell -ExecutionPolicy Bypass -File scripts/status.ps1

stop: ## Stop all services
	@powershell -ExecutionPolicy Bypass -File scripts/stop-all.ps1

# Rest der Commands...
build: ## Build for production
	@powershell -ExecutionPolicy Bypass -File scripts/build.ps1

test: ## Run all tests
	@powershell -ExecutionPolicy Bypass -File scripts/test.ps1

clean: ## Clean build artifacts
	@powershell -ExecutionPolicy Bypass -File scripts/clean.ps1 -Build
