# Technische Anforderungen

## 1. Technische Grundprinzipien

### 1.1 ID-Generierung

- IDs werden ausschließlich im Frontend generiert
- Verwendung von UUID v4 oder ähnlichem
- Format: `{entity}_{timestamp}{random}` (z.B. `evt_1234567890abcdef`)
- Keine Auto-Increment IDs in der Datenbank

### 1.2 API-Design

- RESTful Prinzipien
- Minimale Response bei Mutations (nur IDs)
- Explizites Nachladen von Daten nach Create/Update
- Versionierung über URL-Pfad (`/api/v1/`)

### 1.3 Naming Conventions

- **Keine Pluralisierung**: `EventList` statt `Events`
- **Deutsche Domain-Begriffe**: `Mitglied`, `Aufgabe`, `Veranstaltung`
- **Englische technische Begriffe**: `Controller`, `Service`, `Repository`
- **Komponenten**: PascalCase (`EventForm.tsx`)
- **TypeScript Dateien**: camelCase (`eventService.ts`)
- **Types über Interfaces**
- **Const über Functions** wo möglich

### 1.4 Datenmodellierung

- Jeder Datensatz hat eine eindeutige ID
- Verknüpfungen über Fremdschlüssel-IDs
- Keine Datenbank-Dopplungen
- Soft-Deletes für kritische Daten
- Audit-Fields (created_at, updated_at, created_by, updated_by)

## 2. Frontend-Architektur (FSD)

### 2.1 Feature-Sliced Design

```
frontend/src/
├── app/           # App-Konfiguration, Router, Provider
├── entities/      # Business-Entitäten
├── features/      # User-Features
├── pages/         # Seiten-Komponenten
├── shared/        # Geteilte Utilities
└── widgets/       # Zusammengesetzte UI-Blöcke
```

### 2.2 Custom FSD-Anpassungen

- TSX-Hauptdatei liegt direkt im Feature-Ordner (nicht im ui-Unterordner)
- Export immer über index.ts
- Strikte Layer-Isolation
- Dependency Rule: Nur von oben nach unten

### 2.3 State Management

- **TanStack Query** für Server-State
- **React Context** für globalen UI-State
- **React Hook Form** für Formulare
- **Zustand** für komplexen Client-State (falls nötig)

### 2.4 Technologie-Stack

- **React 19** mit TypeScript
- **Vite** als Build-Tool
- **TanStack Router** für Routing
- **Tailwind CSS 4** für Styling
- **shadcn/ui** für UI-Komponenten
- **React Hook Form** für Formulare
- **Zod** für Validierung

## 3. Backend-Architektur

### 3.1 Clean Architecture

```
backend/src/
├── domain/        # Geschäftslogik, Entitäten
├── application/   # Use Cases, Services
├── infrastructure/# Externe Services, DB
└── presentation/  # API Controllers
```

### 3.2 Domain Driven Design

- Aggregates für zusammenhängende Entitäten
- Value Objects für komplexe Typen
- Domain Events für Seiteneffekte
- Repository Pattern für Datenzugriff

### 3.3 Technologie-Stack

- **Next.js** (containerisiert)
- **TypeScript** durchgängig
- **MySQL** als Hauptdatenbank
- **Redis** für Caching/Sessions
- **Docker** für Containerisierung

## 4. API-Spezifikation

### 4.1 Endpoint-Struktur

```
GET    /api/v1/{entity}              # Liste
GET    /api/v1/{entity}/{id}         # Detail
POST   /api/v1/{entity}              # Create
PUT    /api/v1/{entity}/{id}         # Update
DELETE /api/v1/{entity}/{id}         # Delete
```

### 4.2 Response-Format

```typescript
// Success Response
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "version": "1.0"
  }
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": { ... }
  }
}

// Create/Update Response (minimal)
{
  "success": true,
  "data": {
    "id": "evt_1234567890abcdef"
  }
}
```

### 4.3 Authentifizierung

- OAuth 2.0 über EasyVerein
- JWT für Session-Token
- Refresh-Token Mechanismus
- Token-Lifetime: 24h (Access), 30d (Refresh)

## 5. Datenbank

### 5.1 Schema-Design

- Normalisierung bis 3NF
- Denormalisierung nur für Performance
- JSON-Columns für flexible Daten
- Indices für häufige Queries

### 5.2 Migrations

- Versionierte Migrations
- Up/Down Scripte
- Automatische Migration bei Deployment
- Rollback-Fähigkeit

### 5.3 Backup-Strategie

- Tägliche automatische Backups
- Point-in-Time Recovery
- Geografisch verteilte Backups
- Regelmäßige Restore-Tests

## 6. Sicherheit

### 6.1 Authentifizierung & Autorisierung

- Multi-Faktor-Authentifizierung (optional)
- Rollenbasierte Zugriffskontrolle (RBAC)
- Attribute-Based Access Control für Feinsteuerung
- API-Rate-Limiting

### 6.2 Datenschutz

- DSGVO-Konformität
- Verschlüsselung at-rest und in-transit
- Personenbezogene Daten anonymisierbar
- Audit-Logging für Datenzugriffe

### 6.3 Security Headers

```
Content-Security-Policy
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security
```

## 7. Performance

### 7.1 Frontend-Optimierung

- Code-Splitting auf Route-Ebene
- Lazy Loading für Komponenten
- Image Optimization (WebP, AVIF)
- Service Worker für Offline-Support

### 7.2 Backend-Optimierung

- Response-Caching mit Redis
- Database Query Optimization
- Connection Pooling
- Horizontal Scaling vorbereitet

### 7.3 Performance-Ziele

- Time to Interactive: < 3s
- Largest Contentful Paint: < 2.5s
- First Input Delay: < 100ms
- Cumulative Layout Shift: < 0.1

## 8. Testing

### 8.1 Test-Strategie

- Unit Tests: 80% Coverage
- Integration Tests für kritische Pfade
- E2E Tests für Hauptworkflows
- Performance Tests
- Security Tests

### 8.2 Test-Tools

- **Frontend**: Vitest, React Testing Library, Playwright
- **Backend**: Jest, Supertest
- **E2E**: Playwright
- **Performance**: Lighthouse CI

## 9. Deployment & DevOps

### 9.1 Environments

- Development (local)
- Staging (Test-System)
- Production

### 9.2 CI/CD Pipeline

```yaml
1. Code Push → GitHub
2. Automated Tests
3. Build & Dockerize
4. Deploy to Staging
5. E2E Tests
6. Manual Approval
7. Deploy to Production
```

### 9.3 Monitoring

- Application Performance Monitoring (APM)
- Error Tracking (Sentry)
- Uptime Monitoring
- Log Aggregation (ELK Stack)

## 10. Externe Integrationen

### 10.1 EasyVerein API

- OAuth 2.0 Integration
- Mitgliedsdaten-Sync
- Webhook für Updates
- Fallback bei Ausfall

### 10.2 Google Drive API

- Service Account Authentication
- Ordnerstruktur-Management
- Upload/Download Handling
- Quota-Management

### 10.3 E-Mail Service

- Transactional Emails (SendGrid/AWS SES)
- Template-Management
- Bounce-Handling
- Unsubscribe-Management

## 11. Infrastruktur

### 11.1 Hosting

- Frontend: Vercel/Netlify (CDN)
- Backend: Containerized (AWS/GCP)
- Database: Managed MySQL
- File Storage: Google Drive + CDN

### 11.2 Domains & SSL

- Hauptdomain: faninitiative-spandau.de
- Subdomains: app., api., cdn.
- SSL-Zertifikate: Let's Encrypt
- Auto-Renewal

### 11.3 Disaster Recovery

- RTO (Recovery Time Objective): 4h
- RPO (Recovery Point Objective): 1h
- Automated Failover
- Dokumentierte Recovery-Prozesse
