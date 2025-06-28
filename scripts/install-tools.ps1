# scripts/install-tools.ps1
# Windows tools installer

param(
  [switch]$Force
)

Write-Host "🛠️  Installing Development Tools for Windows" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Check if running as administrator
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
$isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin -and -not $Force) {
  Write-Host "⚠️  This script should be run as Administrator for best results." -ForegroundColor Yellow
  Write-Host "   Some installations may require elevated privileges." -ForegroundColor Yellow
  Write-Host "   Use -Force to continue anyway." -ForegroundColor Yellow
  Write-Host ""
  Write-Host "To run as Administrator:" -ForegroundColor Cyan
  Write-Host "1. Right-click PowerShell and 'Run as Administrator'" -ForegroundColor White
  Write-Host "2. Run: Set-Location '$PWD'" -ForegroundColor White
  Write-Host "3. Run: ./scripts/install-tools.ps1" -ForegroundColor White
  exit 1
}

# Check if winget is available
if (!(Get-Command winget -ErrorAction SilentlyContinue)) {
  Write-Host "❌ winget not found!" -ForegroundColor Red
  Write-Host "Please install App Installer from Microsoft Store:" -ForegroundColor Yellow
  Write-Host "https://www.microsoft.com/store/productId/9NBLGGH4NNS1" -ForegroundColor Blue
  exit 1
}

$tools = @(
  @{
    Name  = "Docker Desktop"
    Id    = "Docker.DockerDesktop"
    Check = { Get-Command docker -ErrorAction SilentlyContinue }
  },
  @{
    Name  = "Node.js"
    Id    = "OpenJS.NodeJS"
    Check = { Get-Command node -ErrorAction SilentlyContinue }
  },
  @{
    Name  = "Git"
    Id    = "Git.Git"
    Check = { Get-Command git -ErrorAction SilentlyContinue }
  },
  @{
    Name  = "Visual Studio Code"
    Id    = "Microsoft.VisualStudioCode"
    Check = { Get-Command code -ErrorAction SilentlyContinue }
  }
)

foreach ($tool in $tools) {
  Write-Host ""
  Write-Host "📦 Installing $($tool.Name)..." -ForegroundColor Blue

  if (& $tool.Check) {
    Write-Host "   ✅ $($tool.Name) is already installed" -ForegroundColor Green
  }
  else {
    try {
      winget install --id=$($tool.Id) -e --silent
      Write-Host "   ✅ $($tool.Name) installed successfully" -ForegroundColor Green
    }
    catch {
      Write-Host "   ❌ Failed to install $($tool.Name)" -ForegroundColor Red
      Write-Host "   Manual installation may be required" -ForegroundColor Yellow
    }
  }
}

# Install pnpm
Write-Host ""
Write-Host "📦 Installing pnpm..." -ForegroundColor Blue
try {
  if (Get-Command pnpm -ErrorAction SilentlyContinue) {
    Write-Host "   ✅ pnpm is already installed" -ForegroundColor Green
  }
  else {
    npm install -g pnpm@9.15.1
    Write-Host "   ✅ pnpm installed successfully" -ForegroundColor Green
  }
}
catch {
  Write-Host "   ❌ Failed to install pnpm" -ForegroundColor Red
  Write-Host "   Run manually: npm install -g pnpm@9.15.1" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Tool installation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Restart your terminal/PowerShell" -ForegroundColor White
Write-Host "2. Start Docker Desktop" -ForegroundColor White
Write-Host "3. Run: ./scripts/check-requirements.ps1" -ForegroundColor White
Write-Host "4. Run: ./scripts/setup.ps1" -ForegroundColor White
