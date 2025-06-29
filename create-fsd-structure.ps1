# PowerShell Script zum Erstellen der FSD-Struktur für Faninitiative Spandau
# Verwendung: ./create-fsd-structure.ps1

# Basis-Pfad
$basePath = "frontend/src"

# Funktion zum Erstellen von Verzeichnissen und Dateien
function Create-FileWithDirectory {
  param (
    [string]$FilePath
  )

  $directory = Split-Path -Path $FilePath -Parent

  # Erstelle Verzeichnis wenn es nicht existiert
  if (!(Test-Path -Path $directory)) {
    New-Item -ItemType Directory -Path $directory -Force | Out-Null
    Write-Host "Verzeichnis erstellt: $directory" -ForegroundColor Green
  }

  # Erstelle Datei wenn sie nicht existiert
  if (!(Test-Path -Path $FilePath)) {
    New-Item -ItemType File -Path $FilePath -Force | Out-Null
    Write-Host "Datei erstellt: $FilePath" -ForegroundColor Cyan
  }
  else {
    Write-Host "Datei existiert bereits: $FilePath" -ForegroundColor Yellow
  }
}

Write-Host "`n=== Erstelle FSD-Struktur für Faninitiative Spandau ===" -ForegroundColor Magenta
Write-Host "Basis-Pfad: $basePath`n" -ForegroundColor Gray

# shared/design-system/tokens
$designTokens = @(
  "$basePath/shared/design-system/tokens/colors.ts",
  "$basePath/shared/design-system/tokens/typography.ts",
  "$basePath/shared/design-system/tokens/spacing.ts",
  "$basePath/shared/design-system/tokens/breakpoints.ts",
  "$basePath/shared/design-system/tokens/index.ts"
)

# shared/design-system/themes
$designThemes = @(
  "$basePath/shared/design-system/themes/fanini-theme.ts",
  "$basePath/shared/design-system/themes/index.ts"
)

# shared/ui/primitives
$uiPrimitives = @(
  "$basePath/shared/ui/primitives/Box/Box.tsx",
  "$basePath/shared/ui/primitives/Box/Box.config.ts",
  "$basePath/shared/ui/primitives/Box/index.ts",
  "$basePath/shared/ui/primitives/Text/Text.tsx",
  "$basePath/shared/ui/primitives/Text/Text.config.ts",
  "$basePath/shared/ui/primitives/Text/TextWithOverflow.tsx",
  "$basePath/shared/ui/primitives/Text/index.ts",
  "$basePath/shared/ui/primitives/Icon/Icon.tsx",
  "$basePath/shared/ui/primitives/Icon/Icon.config.ts",
  "$basePath/shared/ui/primitives/Icon/index.ts",
  "$basePath/shared/ui/primitives/index.ts"
)

# shared/ui/components
$uiComponents = @(
  "$basePath/shared/ui/components/Button/Button.tsx",
  "$basePath/shared/ui/components/Button/Button.config.ts",
  "$basePath/shared/ui/components/Button/ButtonGroup.tsx",
  "$basePath/shared/ui/components/Button/index.ts",
  "$basePath/shared/ui/components/Typography/Heading.tsx",
  "$basePath/shared/ui/components/Typography/Paragraph.tsx",
  "$basePath/shared/ui/components/Typography/Typography.config.ts",
  "$basePath/shared/ui/components/Typography/index.ts",
  "$basePath/shared/ui/components/DataDisplay/DataField.tsx",
  "$basePath/shared/ui/components/DataDisplay/DataField.config.ts",
  "$basePath/shared/ui/components/DataDisplay/DataGrid.tsx",
  "$basePath/shared/ui/components/DataDisplay/DataGrid.config.ts",
  "$basePath/shared/ui/components/DataDisplay/index.ts",
  "$basePath/shared/ui/components/Feedback/Spinner.tsx",
  "$basePath/shared/ui/components/Feedback/Skeleton.tsx",
  "$basePath/shared/ui/components/Feedback/ErrorMessage.tsx",
  "$basePath/shared/ui/components/Feedback/LoadingState.tsx",
  "$basePath/shared/ui/components/Feedback/Feedback.config.ts",
  "$basePath/shared/ui/components/Feedback/index.ts",
  "$basePath/shared/ui/components/index.ts"
)

# shared/layouts
$layouts = @(
  "$basePath/shared/layouts/BaseLayout/BaseLayout.tsx",
  "$basePath/shared/layouts/BaseLayout/BaseLayout.config.ts",
  "$basePath/shared/layouts/BaseLayout/index.ts",
  "$basePath/shared/layouts/AppLayout/AppLayout.tsx",
  "$basePath/shared/layouts/AppLayout/AppLayout.config.ts",
  "$basePath/shared/layouts/AppLayout/index.ts",
  "$basePath/shared/layouts/SplitLayout/SplitLayout.tsx",
  "$basePath/shared/layouts/SplitLayout/SplitLayout.config.ts",
  "$basePath/shared/layouts/SplitLayout/index.ts",
  "$basePath/shared/layouts/index.ts"
)

# shared/layouts/components
$layoutComponents = @(
  "$basePath/shared/layouts/components/Header/Header.tsx",
  "$basePath/shared/layouts/components/Header/Header.config.ts",
  "$basePath/shared/layouts/components/Header/HeaderLogo.tsx",
  "$basePath/shared/layouts/components/Header/HeaderNav.tsx",
  "$basePath/shared/layouts/components/Header/index.ts",
  "$basePath/shared/layouts/components/Footer/Footer.tsx",
  "$basePath/shared/layouts/components/Footer/Footer.config.ts",
  "$basePath/shared/layouts/components/Footer/index.ts",
  "$basePath/shared/layouts/components/Navigation/Navigation.tsx",
  "$basePath/shared/layouts/components/Navigation/Navigation.config.ts",
  "$basePath/shared/layouts/components/Navigation/NavigationItem.tsx",
  "$basePath/shared/layouts/components/Navigation/index.ts",
  "$basePath/shared/layouts/components/Breadcrumb/Breadcrumb.tsx",
  "$basePath/shared/layouts/components/Breadcrumb/Breadcrumb.config.ts",
  "$basePath/shared/layouts/components/Breadcrumb/BreadcrumbContext.tsx",
  "$basePath/shared/layouts/components/Breadcrumb/useBreadcrumb.ts",
  "$basePath/shared/layouts/components/Breadcrumb/index.ts",
  "$basePath/shared/layouts/components/index.ts"
)

# shared/lib
$lib = @(
  "$basePath/shared/lib/formatters/date.ts",
  "$basePath/shared/lib/formatters/currency.ts",
  "$basePath/shared/lib/formatters/index.ts",
  "$basePath/shared/lib/composers/styleComposer.ts",
  "$basePath/shared/lib/composers/configMerger.ts",
  "$basePath/shared/lib/composers/index.ts"
)

# shared/providers
$providers = @(
  "$basePath/shared/providers/ErrorBoundary/ErrorBoundary.tsx",
  "$basePath/shared/providers/ErrorBoundary/ErrorFallback.tsx",
  "$basePath/shared/providers/ErrorBoundary/index.ts",
  "$basePath/shared/providers/index.ts"
)

# app/providers
$appProviders = @(
  "$basePath/app/providers/AppProvider.tsx",
  "$basePath/app/providers/BreadcrumbProvider.tsx",
  "$basePath/app/providers/DesignSystemProvider.tsx",
  "$basePath/app/providers/index.ts"
)

# Alle Dateien zusammenfassen
$allFiles = $designTokens + $designThemes + $uiPrimitives + $uiComponents +
$layouts + $layoutComponents + $lib + $providers + $appProviders

# Statistik-Variablen
$totalFiles = $allFiles.Count
$createdFiles = 0
$existingFiles = 0

# Dateien erstellen
foreach ($file in $allFiles) {
  Create-FileWithDirectory -FilePath $file
  if (Test-Path -Path $file) {
    $createdFiles++
  }
}

# Zusammenfassung
Write-Host "`n=== Zusammenfassung ===" -ForegroundColor Magenta
Write-Host "Gesamt: $totalFiles Dateien" -ForegroundColor White
Write-Host "Erfolgreich erstellt: $createdFiles Dateien" -ForegroundColor Green
Write-Host "`nFSD-Struktur wurde erfolgreich angelegt!" -ForegroundColor Green
Write-Host "`nNächste Schritte:" -ForegroundColor Yellow
Write-Host "1. Implementiere die Komponenten-Logik" -ForegroundColor White
Write-Host "2. Füge die Design-Token hinzu" -ForegroundColor White
Write-Host "3. Konfiguriere die Provider" -ForegroundColor White
Write-Host "4. Integriere mit TanStack Router/Query" -ForegroundColor White
