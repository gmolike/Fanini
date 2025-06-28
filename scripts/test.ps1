# scripts/test.ps1
# Test runner script

Write-Host "🧪 Running tests..." -ForegroundColor Green

# Frontend tests
Write-Host "⚛️  Running frontend tests..." -ForegroundColor Blue
Set-Location frontend
pnpm test
Set-Location ..

# Backend tests (Phase 3)
Write-Host "🔧 Backend tests will be implemented in Phase 3" -ForegroundColor Yellow

# Integration tests (Phase 3)
Write-Host "🔗 Integration tests will be implemented in Phase 3" -ForegroundColor Yellow

Write-Host "✅ Tests complete!" -ForegroundColor Green
