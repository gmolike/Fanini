# scripts/build.ps1
# Production build script

Write-Host "🏗️  Building for production..." -ForegroundColor Green

# Clean previous builds
Write-Host "🧹 Cleaning previous builds..." -ForegroundColor Blue
if (Test-Path "frontend/dist") {
  Remove-Item -Recurse -Force "frontend/dist"
}
if (Test-Path "backend/dist") {
  Remove-Item -Recurse -Force "backend/dist"
}

# Install production dependencies
Write-Host "📦 Installing production dependencies..." -ForegroundColor Blue
pnpm install --prod

# Build frontend
Write-Host "⚛️  Building frontend..." -ForegroundColor Blue
Set-Location frontend
pnpm build

# Verify build
if (Test-Path "dist") {
  Write-Host "✅ Frontend build successful" -ForegroundColor Green
  Write-Host "📊 Build size:" -ForegroundColor Cyan
  $size = (Get-ChildItem -Recurse "dist" | Measure-Object -Property Length -Sum).Sum
  $sizeInMB = [math]::Round($size / 1MB, 2)
  Write-Host "   $sizeInMB MB" -ForegroundColor White
}
else {
  Write-Host "❌ Frontend build failed" -ForegroundColor Red
  Set-Location ..
  exit 1
}

Set-Location ..

# Build backend (Phase 3)
Write-Host "🔧 Backend build will be implemented in Phase 3" -ForegroundColor Yellow

Write-Host "✅ Production build complete!" -ForegroundColor Green
