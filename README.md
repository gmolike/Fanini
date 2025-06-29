# Faninitiative Spandau e.V. - Webplattform

<div align="center">
  <img src="./docs/logo.svg" alt="Faninitiative Spandau Logo" width="200" />
  
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-19.0-61dafb.svg)](https://reactjs.org/)
  [![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)
  [![License](https://img.shields.io/badge/License-Private-red.svg)](./LICENSE)
</div>

## 🏟️ Über das Projekt

Moderne Webplattform für den offiziellen Fanverein der Eintracht Spandau GmbH. Die Plattform dient als zentrale Anlaufstelle für Vereinsmitglieder zur Kommunikation, Event-Organisation und Informationsweitergabe.

### 🎯 Hauptfunktionen

- **Öffentlicher Bereich**: Vereinsübersicht, Satzung, Creator-Bereich, Event-Galerie
- **Mitgliederbereich**: Event-Management, Todo-Listen, Mitgliederprofile, Vereinsorganisation
- **Authentifizierung**: Nahtlose Integration mit EasyVerein
- **Medien**: Google Drive Integration für Bilder und Fotos

## 🚀 Quick Start

### Windows (Empfohlen)

```powershell
# 1. Repository klonen
git clone https://github.com/your-org/faninitiative-spandau.git
cd faninitiative-spandau

# 2. Requirements prüfen
./scripts/check-requirements.ps1

# 3. Projekt einrichten
./scripts/setup.ps1

# 4. Entwicklungsumgebung starten
./scripts/dev.ps1
# oder
make dev
```

### Verfügbare Entwicklungsmodi

```powershell
# Alle Services in Docker (Standard)
make dev

# Backend in Docker, Frontend lokal
make dev-backend

# Frontend in Docker, Backend lokal
make dev-frontend
```

## 📋 Voraussetzungen

### System Requirements

- **OS**: Windows 10/11 (64-bit) oder macOS/Linux
- **RAM**: Mindestens 8GB empfohlen
- **Speicher**: 10GB freier Speicherplatz

### Software

- **Node.js**: 20.x LTS
- **pnpm**: 10.12.4
- **Docker Desktop**: Aktuelle Version
- **Git**: 2.x

### Installation unter Windows

```powershell
# Mit winget (Windows Package Manager)
winget install --id=Docker.DockerDesktop -e
winget install --id=OpenJS.NodeJS -e
winget install --id=Git.Git -e

# pnpm nach Node.js Installation
npm install -g pnpm@10.12.4
```

## 🏗️ Projektstruktur

```
faninitiative-spandau/
├── frontend/               # React Frontend (FSD-Architektur)
│   ├── src/
│   │   ├── app/           # App-weite Provider & Konfiguration
│   │   ├── pages/         # TanStack Router Pages
│   │   ├── widgets/       # Zusammengesetzte UI-Blöcke
│   │   ├── features/      # Business Features
│   │   ├── entities/      # Business Entities
│   │   └── shared/        # Geteilte Utilities & UI
│   └── ...
├── backend/               # Backend (Phase 3)
├── database/              # MySQL Schema & Migrations
├── scripts/               # Development Scripts
├── docker-compose.yml     # Docker Services
└── ...
```

## 🛠️ Tech Stack

### Frontend

- **Framework**: React 19 mit TypeScript
- **Architektur**: Feature-Sliced Design (FSD)
- **Routing**: TanStack Router
- **State Management**: TanStack Query
- **UI**: Tailwind CSS 4, shadcn/ui
- **Forms**: React Hook Form + Zod

### Backend (Phase 3)

- **Runtime**: Containerisiertes Next.js
- **Architektur**: Clean Architecture mit DDD
- **Datenbank**: MySQL 8.0
- **APIs**: RESTful + EasyVerein/Google Drive Integration

## 📦 Verfügbare Scripts

### Development

```powershell
# Entwicklung starten
make dev                    # Alle Services in Docker
make dev-backend           # Backend Docker + Frontend lokal
make dev-frontend          # Frontend Docker + Backend lokal

# Service-Status
make status                # Zeigt Status aller Services
make stop                  # Stoppt alle Services
```

### Database

```powershell
make db-reset              # Datenbank zurücksetzen
make db-backup             # Backup erstellen
make db-shell              # MySQL Shell öffnen
make db-status             # Datenbank Status
```

### Build & Test

```powershell
make build                 # Production Build
make test                  # Tests ausführen
make lint                  # Code linting
make format                # Code formatieren
```

### Cleanup

```powershell
make clean                 # Build-Artefakte löschen
make clean-all             # Alles löschen (inkl. node_modules)
make clean-docker          # Docker volumes löschen
```

## 🔧 Konfiguration

### Umgebungsvariablen

1. Kopiere `.env.example` zu `.env`
2. Passe die Werte an:

```env
# Database
DATABASE_URL=mysql://fanini:password@localhost:3306/fanini_db

# External APIs
EASYVEREIN_API_KEY=your-key
GOOGLE_DRIVE_API_KEY=your-key
```

### VS Code Empfehlungen

Das Projekt enthält empfohlene Extensions in `.vscode/extensions.json`. Installiere diese für die beste Entwicklungserfahrung.

## 🚦 Entwicklungsphasen

### ✅ Phase 1: Frontend-Setup (Aktuell)

- FSD-Architektur implementiert
- Basis-Komponenten und Layouts
- Routing mit TanStack Router
- Docker-Entwicklungsumgebung

### 📅 Phase 2: Frontend-Features

- Authentifizierung mit EasyVerein
- Event-Management System
- Mitgliederverwaltung
- Google Drive Integration

### 📅 Phase 3: Backend-Implementation

- Clean Architecture Setup
- API-Endpoints
- Datenbank-Integration
- Externe Service-Anbindungen

## 🤝 Entwicklungsrichtlinien

### Code Style

- **Dateinamen**: PascalCase für .tsx, camelCase für .ts
- **Komponenten**: Component Composition Pattern
- **Keine Pluralisierung**: "MemberList" statt "Members"
- **Types über Interfaces**
- **Const über Functions**

### FSD-Prinzipien

```typescript
// ✅ Richtig: Import aus public API
import { UserProfile } from "@features/user-profile";

// ❌ Falsch: Deep import
import { UserProfile } from "@features/user-profile/ui/UserProfile";
```

### Git Workflow

```bash
# Branch erstellen
git checkout -b feature/event-management

# Commit (Conventional Commits)
git commit -m "feat: add event registration flow"

# Push
git push origin feature/event-management
```

## 📊 Services & Ports

| Service     | URL                   | Beschreibung             |
| ----------- | --------------------- | ------------------------ |
| Frontend    | http://localhost:5173 | React Development Server |
| Backend API | http://localhost:3000 | Next.js API (Phase 3)    |
| MySQL       | localhost:3306        | Datenbank                |
| phpMyAdmin  | http://localhost:8080 | Datenbank-UI             |

## 🐛 Troubleshooting

### Docker Probleme

```powershell
# Docker neu starten
docker-compose down
docker-compose up -d

# Logs prüfen
docker-compose logs -f frontend
```

### Node Modules Probleme

```powershell
# Clean install
make clean-all
make setup
```

### Port bereits belegt

```powershell
# Prozess auf Port finden (Windows)
netstat -ano | findstr :5173

# Prozess beenden
taskkill /PID <PID> /F
```

## 📝 Lizenz

Dieses Projekt ist privat und nur für Mitglieder der Faninitiative Spandau e.V. zugänglich.

## 👥 Team

- **Projektleitung**: [Name]
- **Frontend**: [Name]
- **Backend**: [Name]
- **Design**: [Name]

## 📞 Support

Bei Fragen oder Problemen:

- Email: dev@fanini.live
- Discord: [Link zum Dev-Channel]

---

<div align="center">
  <strong>Gemeinsam für Eintracht Spandau! 💙❤️</strong>
</div>
