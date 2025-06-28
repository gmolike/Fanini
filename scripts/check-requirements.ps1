# scripts/check-requirements.ps1
# Windows requirements checker

Write-Host "Checking Windows Development Requirements" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green
Write-Host ""

$requirements = @()
$warnings = @()
$errors = @()

# Check PowerShell version
$psVersion = $PSVersionTable.PSVersion
Write-Host "PowerShell Version: $($psVersion.Major).$($psVersion.Minor)" -ForegroundColor Blue
if ($psVersion.Major -lt 5) {
  $errors += "PowerShell 5.0+ required, found $($psVersion.Major).$($psVersion.Minor)"
}
else {
  $requirements += "OK PowerShell $($psVersion.Major).$($psVersion.Minor)"
}

# Check Node.js
try {
  $nodeVersion = node --version 2>$null
  if ($nodeVersion) {
    $nodeVersionNumber = $nodeVersion.Substring(1)
    $nodeMajor = [int]($nodeVersionNumber.Split('.')[0])
    Write-Host "Node.js Version: $nodeVersion" -ForegroundColor Blue
    if ($nodeMajor -lt 18) {
      $warnings += "Node.js 18+ recommended, found $nodeVersion"
    }
    else {
      $requirements += "OK Node.js $nodeVersion"
    }
  }
}
catch {
  $errors += "Node.js not found. Please install Node.js 20+"
}

# Check pnpm
try {
  $pnpmVersion = pnpm --version 2>$null
  if ($pnpmVersion) {
    Write-Host "pnpm Version: $pnpmVersion" -ForegroundColor Blue
    $requirements += "OK pnpm $pnpmVersion"
  }
}
catch {
  $warnings += "pnpm not found. Run: npm install -g pnpm@9.15.1"
}

# Check Docker
try {
  $dockerVersion = docker --version 2>$null
  if ($dockerVersion) {
    Write-Host "Docker Version: $dockerVersion" -ForegroundColor Blue
    $requirements += "OK $dockerVersion"

    # Check if Docker is running
    try {
      docker info *> $null
      if ($LASTEXITCODE -eq 0) {
        $requirements += "OK Docker is running"
      }
      else {
        $warnings += "Docker is installed but not running"
      }
    }
    catch {
      $warnings += "Docker is installed but not running"
    }
  }
}
catch {
  $errors += "Docker not found. Please install Docker Desktop"
}

# Check Git
try {
  $gitVersion = git --version 2>$null
  if ($gitVersion) {
    Write-Host "Git Version: $gitVersion" -ForegroundColor Blue
    $requirements += "OK $gitVersion"
  }
}
catch {
  $warnings += "Git not found. Please install Git for Windows"
}

# Check Windows version
$windowsVersion = (Get-CimInstance Win32_OperatingSystem).Caption
Write-Host "Windows Version: $windowsVersion" -ForegroundColor Blue
$requirements += "OK $windowsVersion"

# Check Hyper-V (required for Docker)
try {
  $hyperV = Get-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V-All 2>$null
  if ($hyperV -and $hyperV.State -eq "Enabled") {
    $requirements += "OK Hyper-V enabled"
  }
  else {
    $warnings += "Hyper-V may not be enabled (required for Docker)"
  }
}
catch {
  $warnings += "Cannot check Hyper-V status"
}

# Check available memory
$memory = (Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1GB
Write-Host "Available RAM: $([math]::Round($memory, 1)) GB" -ForegroundColor Blue
if ($memory -lt 8) {
  $warnings += "8GB+ RAM recommended for development environment"
}
else {
  $memoryRounded = [math]::Round($memory, 1)
  $requirements += "OK Sufficient RAM ($memoryRounded GB)"
}

# Check available disk space
$disk = Get-CimInstance Win32_LogicalDisk | Where-Object { $_.DeviceID -eq 'C:' }
$freeSpace = $disk.FreeSpace / 1GB
Write-Host "Free Disk Space (C:): $([math]::Round($freeSpace, 1)) GB" -ForegroundColor Blue
if ($freeSpace -lt 10) {
  $warnings += "10GB+ free disk space recommended"
}
else {
  $freeSpaceRounded = [math]::Round($freeSpace, 1)
  $requirements += "OK Sufficient disk space ($freeSpaceRounded GB free)"
}

# Display results
Write-Host ""
Write-Host "Requirements Check Results:" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan

if ($requirements.Count -gt 0) {
  Write-Host ""
  Write-Host "Satisfied Requirements:" -ForegroundColor Green
  foreach ($req in $requirements) {
    Write-Host "   $req" -ForegroundColor White
  }
}

if ($warnings.Count -gt 0) {
  Write-Host ""
  Write-Host "Warnings:" -ForegroundColor Yellow
  foreach ($warning in $warnings) {
    Write-Host "   $warning" -ForegroundColor White
  }
}

if ($errors.Count -gt 0) {
  Write-Host ""
  Write-Host "Missing Requirements:" -ForegroundColor Red
  foreach ($error in $errors) {
    Write-Host "   $error" -ForegroundColor White
  }
}

Write-Host ""
if ($errors.Count -eq 0) {
  Write-Host "Your system is ready for development!" -ForegroundColor Green
  if ($warnings.Count -gt 0) {
    Write-Host "Consider addressing the warnings above for optimal experience." -ForegroundColor Yellow
  }
}
else {
  Write-Host "Please install missing requirements before continuing." -ForegroundColor Red
  Write-Host ""
  Write-Host "Quick Installation Commands:" -ForegroundColor Cyan
  Write-Host "===========================" -ForegroundColor Cyan
  Write-Host "# Install with winget (Windows Package Manager):" -ForegroundColor Gray
  Write-Host "winget install --id=Docker.DockerDesktop -e" -ForegroundColor White
  Write-Host "winget install --id=OpenJS.NodeJS -e" -ForegroundColor White
  Write-Host "winget install --id=Git.Git -e" -ForegroundColor White
  Write-Host ""
  Write-Host "# Install pnpm after Node.js:" -ForegroundColor Gray
  Write-Host "npm install -g pnpm@9.15.1" -ForegroundColor White
}
