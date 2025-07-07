# create-docs-structure.ps1
# Erstellt die komplette Dokumentationsstruktur fuer Faninitiative Spandau
# UTF-8 mit BOM fuer korrekte Umlaut-Darstellung

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "📁 Erstelle Dokumentationsstruktur fuer Faninitiative Spandau..." -ForegroundColor Green

# Basis-Verzeichnisse erstellen
$directories = @(
  "docs",
  "docs\01-anforderungen",
  "docs\02-architektur",
  "docs\03-use-cases",
  "docs\04-api",
  "docs\05-entwicklung",
  "docs\assets",
  "docs\assets\diagrams",
  "docs\assets\images"
)

foreach ($dir in $directories) {
  if (!(Test-Path $dir)) {
    New-Item -ItemType Directory -Path $dir -Force | Out-Null
    Write-Host "✅ Erstellt: $dir" -ForegroundColor Gray
  }
}

# Funktion zum Erstellen von UTF-8 Dateien
function Create-UTF8File {
  param(
    [string]$Path,
    [string]$Content
  )
  $Content | Out-File -FilePath $Path -Encoding UTF8 -Force
}

# Haupt-README
$mainReadme = @'
# Faninitiative Spandau - Dokumentation

## 📚 Inhaltsverzeichnis

### 1. [Anforderungen](./01-anforderungen/)
- [Projektuebersicht](./01-anforderungen/README.md)
- [Funktionale Anforderungen](./01-anforderungen/funktionale-anforderungen.md)
- [Technische Anforderungen](./01-anforderungen/technische-anforderungen.md)
- [Verbesserungsvorschlaege](./01-anforderungen/verbesserungsvorschlaege.md)

### 2. [Architektur](./02-architektur/)
- [System-Architektur](./02-architektur/system-architektur.md)
- [Datenmodell](./02-architektur/datenmodell.md)
- [FSD-Struktur](./02-architektur/fsd-struktur.md)

### 3. [Use-Cases](./03-use-cases/)
- [Akteur-Use-Case-Matrix](./03-use-cases/akteur-matrix.md)
- [Use-Case Diagramme](./03-use-cases/use-case-diagramme.md)
- [Ablaufdiagramme](./03-use-cases/ablaufdiagramme.md)

### 4. [API-Dokumentation](./04-api/)
- [Endpoints](./04-api/endpoints.md)
- [Datentypen](./04-api/datentypen.md)

### 5. [Entwicklung](./05-entwicklung/)
- [Coding Standards](./05-entwicklung/coding-standards.md)
- [Git Workflow](./05-entwicklung/git-workflow.md)
- [Deployment](./05-entwicklung/deployment.md)

## 🚀 Schnellstart fuer verschiedene Rollen

### 📋 Product Owner / Stakeholder
- [Was macht die Webseite?](./01-anforderungen/README.md)
- [Welche Features gibt es?](./01-anforderungen/funktionale-anforderungen.md)
- [Wer kann was machen?](./03-use-cases/akteur-matrix.md)

### 👩‍💻 Frontend-Entwickler (FSD)
- [FSD-Projektstruktur](./02-architektur/fsd-struktur.md)
- [Entities & Features](./02-architektur/datenmodell.md)
- [API-Endpoints](./04-api/endpoints.md)
- [Code-Beispiele](./05-entwicklung/coding-standards.md)

### 🔧 Backend-Entwickler
- [System-Architektur](./02-architektur/system-architektur.md)
- [Datenbank-Schema](./02-architektur/datenmodell.md#entity-relationship-diagram)
- [API-Spezifikation](./04-api/)

### 🎨 UI/UX Designer
- [User Flows](./03-use-cases/ablaufdiagramme.md)
- [Nutzerrollen](./03-use-cases/akteur-matrix.md)
- [Feature-uebersicht](./01-anforderungen/funktionale-anforderungen.md)

## 📅 Dokumentations-Version
- **Version**: 1.0.0
- **Stand**: {0}
- **Status**: Initial
'@ -f (Get-Date -Format "dd.MM.yyyy")

Create-UTF8File -Path "docs\README.md" -Content $mainReadme

# Anforderungen README
$anforderungenReadme = @'
# Projektuebersicht - Faninitiative Spandau e.V.

## 🎯 Projektziel
Entwicklung einer modernen Webplattform fuer den Fanverein der Eintracht Spandau GmbH, die als zentrale Kommunikations- und Organisationsplattform fuer Vereinsmitglieder und Interessierte dient.

## 🌟 Kernfunktionen

### Öffentlicher Bereich
- **Event-uebersicht**: Vergangene und zukuenftige Veranstaltungen
- **Vereinsinformationen**: Satzung und öffentliche Dokumente
- **Creator-Showcase**: Kuenstlerprofile und Werke
- **Kontakt**: Anfragen und Newsletter-Anmeldung
- **Mediengalerie**: Fotos und Videos
- **Sportbereich**: Teams und Erfolge

### Interner Bereich (Login erforderlich)
- **Event-Management**: Planung und Organisation von Veranstaltungen
- **Aufgabenverwaltung**: Zuweisung und Tracking von Tasks
- **Mitgliederverwaltung**: Profile und Berechtigungen
- **Finanzverwaltung**: Budgets und Ausgaben
- **Content-Management**: Social Media und Newsletter
- **Protokolle**: Sitzungen und Beschluesse

## 🔐 Authentifizierung
- Integration mit **EasyVerein** (bestehendes Vereinsverwaltungstool)
- OAuth-basierter Login
- Rollenbasierte Zugriffskontrolle

## 👥 Nutzergruppen
1. **Gaeste**: Öffentliche Informationen
2. **Mitglieder**: Basis-Zugriff auf interne Bereiche
3. **Teams**: Erweiterte Funktionen je nach Bereich
   - Team Event
   - Team Medien
   - Team Verein
   - Team Technik
4. **Beirat**: Verwaltungsfunktionen
5. **Vorstand**: Vollzugriff
6. **Creator**: Spezielle Kuenstlerprofile
7. **Admin**: Technische Administration

## 📅 Projektphasen

### Phase 1: Frontend-Setup & Basis
- Technische Infrastruktur
- Authentifizierung
- Basis-Features

### Phase 2: Frontend-Entwicklung
- Alle UI-Komponenten
- Mock-API Integration
- Mobile Optimierung

### Phase 3: Backend-Implementation
- API-Entwicklung
- Datenbank-Setup
- Externe Integrationen

## 🔗 Weiterfuehrende Dokumente
- [Funktionale Anforderungen](./funktionale-anforderungen.md)
- [Technische Anforderungen](./technische-anforderungen.md)
- [Verbesserungsvorschlaege](./verbesserungsvorschlaege.md)
'@

Create-UTF8File -Path "docs\01-anforderungen\README.md" -Content $anforderungenReadme

# Architektur README
$architekturReadme = @'
# Architektur-Dokumentation

## 📋 uebersicht

Diese Sektion beschreibt die technische Architektur der Faninitiative-Plattform.

## 📑 Dokumente

- [System-Architektur](./system-architektur.md) - Technischer Stack und Deployment
- [Datenmodell](./datenmodell.md) - Entitaeten und Beziehungen
- [FSD-Struktur](./fsd-struktur.md) - Frontend-Architektur mit Feature-Sliced Design

## 🏗️ Architektur-Prinzipien

1. **Separation of Concerns**: Klare Trennung zwischen Frontend und Backend
2. **Feature-Sliced Design**: Modulare Frontend-Architektur
3. **Clean Architecture**: Domain-Driven Design im Backend
4. **API-First**: RESTful API als zentrale Schnittstelle
5. **Security by Design**: Authentifizierung ueber EasyVerein OAuth
'@

Create-UTF8File -Path "docs\02-architektur\README.md" -Content $architekturReadme

# Use-Cases README
$useCasesReadme = @'
# Use-Cases und Nutzerszenarien

## 📋 uebersicht

Diese Sektion dokumentiert alle Use-Cases und Nutzerinteraktionen der Plattform.

## 📑 Dokumente

- [Akteur-Use-Case-Matrix](./akteur-matrix.md) - Wer kann was machen?
- [Use-Case Diagramme](./use-case-diagramme.md) - Visuelle Darstellung aller Use-Cases
- [Ablaufdiagramme](./ablaufdiagramme.md) - Detaillierte Prozessablaeufe

## 👥 Hauptakteure

1. **Gast** - Öffentlicher Besucher
2. **Mitglied** - Registriertes Vereinsmitglied
3. **Team Event** - Event-Organisation
4. **Team Medien** - Content & Social Media
5. **Beirat** - Vereinsverwaltung
6. **Vorstand** - Vereinsfuehrung
7. **Creator** - Kuenstler/Content-Ersteller
8. **Admin** - Technische Administration
'@

Create-UTF8File -Path "docs\03-use-cases\README.md" -Content $useCasesReadme

# API README
$apiReadme = @'
# API-Dokumentation

## 📋 uebersicht

RESTful API-Dokumentation fuer die Faninitiative-Plattform.

## 📑 Dokumente

- [Endpoints](./endpoints.md) - Alle API-Endpunkte
- [Datentypen](./datentypen.md) - TypeScript Interfaces und Typen

## 🔑 API-Prinzipien

1. **RESTful Design**: Standard HTTP-Verben (GET, POST, PUT, DELETE)
2. **JSON**: Alle Requests und Responses in JSON
3. **Versionierung**: API-Version im URL-Pfad (`/api/v1/`)
4. **Authentifizierung**: Bearer Token via EasyVerein OAuth
5. **Fehlerbehandlung**: Standardisierte Fehlerresponses

## 🚀 Basis-URL

```
Development: http://localhost:3000/api/v1
Production: https://api.faninitiative-spandau.de/v1
```
'@

Create-UTF8File -Path "docs\04-api\README.md" -Content $apiReadme

# Entwicklung README
$entwicklungReadme = @'
# Entwicklungs-Dokumentation

## 📋 uebersicht

Richtlinien und Standards fuer die Entwicklung.

## 📑 Dokumente

- [Coding Standards](./coding-standards.md) - Code-Konventionen und Best Practices
- [Git Workflow](./git-workflow.md) - Branching-Strategie und Commit-Regeln
- [Deployment](./deployment.md) - Build und Deployment-Prozess

## 🛠️ Entwicklungsumgebung

### Voraussetzungen
- Node.js 20+
- pnpm 9.15.1+
- Git
- VS Code (empfohlen)

### Quick Start
```bash
# Repository klonen
git clone https://github.com/org/faninitiative-spandau.git

# Dependencies installieren
pnpm install

# Frontend starten
pnpm dev:frontend

# Backend starten (Phase 3)
pnpm dev:backend
```
'@

Create-UTF8File -Path "docs\05-entwicklung\README.md" -Content $entwicklungReadme

# Assets README
$assetsReadme = @'
# Assets

## 📁 Struktur

- `/diagrams` - Technische Diagramme (ER, Architektur, etc.)
- `/images` - Screenshots, Mockups, Logos

## 📝 Namenskonvention

- Kleinschreibung
- Bindestriche statt Leerzeichen
- Beschreibende Namen

### Beispiele:
- `entity-relationship-diagram.svg`
- `event-creation-flow.png`
- `fsd-struktur.svg`
'@

Create-UTF8File -Path "docs\assets\README.md" -Content $assetsReadme

# Leere Dokumentationsdateien erstellen
$emptyFiles = @(
  # Anforderungen
  "docs\01-anforderungen\funktionale-anforderungen.md",
  "docs\01-anforderungen\technische-anforderungen.md",
  "docs\01-anforderungen\verbesserungsvorschlaege.md",

  # Architektur
  "docs\02-architektur\system-architektur.md",
  "docs\02-architektur\datenmodell.md",
  "docs\02-architektur\fsd-struktur.md",

  # Use-Cases
  "docs\03-use-cases\akteur-matrix.md",
  "docs\03-use-cases\use-case-diagramme.md",
  "docs\03-use-cases\ablaufdiagramme.md",

  # API
  "docs\04-api\endpoints.md",
  "docs\04-api\datentypen.md",

  # Entwicklung
  "docs\05-entwicklung\coding-standards.md",
  "docs\05-entwicklung\git-workflow.md",
  "docs\05-entwicklung\deployment.md"
)

foreach ($file in $emptyFiles) {
  if (!(Test-Path $file)) {
    New-Item -ItemType File -Path $file -Force | Out-Null
    Write-Host "✅ Erstellt: $file" -ForegroundColor Gray
  }
}

# .gitkeep fuer leere Ordner
$gitkeepFiles = @(
  "docs\assets\diagrams\.gitkeep",
  "docs\assets\images\.gitkeep"
)

foreach ($file in $gitkeepFiles) {
  if (!(Test-Path $file)) {
    New-Item -ItemType File -Path $file -Force | Out-Null
  }
}

Write-Host "`n✅ Dokumentationsstruktur erfolgreich erstellt!" -ForegroundColor Green
Write-Host "`n📝 Naechste Schritte:" -ForegroundColor Yellow
Write-Host "1. Kopiere die Inhalte aus den Artifacts in die entsprechenden Dateien:" -ForegroundColor White
Write-Host "   - 'Anforderungsdokumentation' → funktionale-anforderungen.md & technische-anforderungen.md" -ForegroundColor Gray
Write-Host "   - 'Entitaeten-uebersicht' → datenmodell.md" -ForegroundColor Gray
Write-Host "   - 'Use-Case Diagramme' → use-case-diagramme.md & ablaufdiagramme.md" -ForegroundColor Gray
Write-Host "   - 'Akteur-Use-Case-Matrix' → akteur-matrix.md" -ForegroundColor Gray
Write-Host "   - 'Code-Dokumentation Beispiel' → coding-standards.md & fsd-struktur.md" -ForegroundColor Gray
Write-Host "`n2. Committe die Dokumentation:" -ForegroundColor White
Write-Host "   git add docs/" -ForegroundColor Cyan
Write-Host "   git commit -m 'docs: Initiale Projektdokumentation hinzugefuegt'" -ForegroundColor Cyan
Write-Host "`n3. Optional: GitHub Wiki einrichten fuer Business-Dokumentation" -ForegroundColor White

# Zusammenfassung anzeigen
Write-Host "`n📊 Erstellte Struktur:" -ForegroundColor Green
$fileCount = (Get-ChildItem -Path "docs" -Recurse -File).Count
$dirCount = (Get-ChildItem -Path "docs" -Recurse -Directory).Count
Write-Host "   - Ordner: $dirCount" -ForegroundColor Gray
Write-Host "   - Dateien: $fileCount" -ForegroundColor Gray
