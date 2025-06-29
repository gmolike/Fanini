# API Endpoints

## Basis-URL

```
Development: http://localhost:3000/api/v1
Staging: https://api-staging.faninitiative-spandau.de/v1
Production: https://api.faninitiative-spandau.de/v1
```

## Authentifizierung

Alle geschützten Endpoints erfordern einen Bearer Token im Authorization Header:

```
Authorization: Bearer <token>
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "version": "1.0",
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "field": ["error message"]
    }
  }
}
```

## Endpoints nach Bereich

### Authentication

#### POST /auth/login

Login über EasyVerein OAuth

```json
// Request
{
  "code": "oauth_code_from_easyverein",
  "redirect_uri": "https://app.faninitiative-spandau.de/auth/callback"
}

// Response
{
  "success": true,
  "data": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token",
    "expires_in": 86400,
    "user": {
      "id": "usr_123",
      "email": "user@example.com",
      "roles": ["mitglied", "team_event"]
    }
  }
}
```

#### POST /auth/refresh

Token erneuern

```json
// Request
{
  "refresh_token": "refresh_token"
}

// Response (wie bei /auth/login)
```

#### POST /auth/logout

Logout

```json
// Response
{
  "success": true,
  "data": {
    "message": "Successfully logged out"
  }
}
```

### Mitglieder

#### GET /mitglieder

Mitgliederliste abrufen

```
Query Parameters:
- page: number (default: 1)
- limit: number (default: 20, max: 100)
- search: string (Name/Email)
- rolle: string (Rollen-Filter)
- istAktiv: boolean
- hatVertraulichkeitserklaerung: boolean
```

#### GET /mitglieder/{id}

Einzelnes Mitglied abrufen

```json
// Response
{
  "success": true,
  "data": {
    "id": "usr_123",
    "vorname": "Max",
    "nachname": "Mustermann",
    "email": "max@example.com",
    "rollen": ["mitglied", "team_event"],
    "sichtbarkeitProfil": "intern"
    // ...
  }
}
```

#### PUT /mitglieder/{id}

Mitglied aktualisieren (nur eigenes Profil oder mit Berechtigung)

```json
// Request
{
  "telefon": "+49 123 456789",
  "beschreibung": "Neue Beschreibung",
  "sichtbarkeitEmail": "vorstand"
}

// Response
{
  "success": true,
  "data": {
    "id": "usr_123"
  }
}
```

### Events

#### GET /events

Event-Liste abrufen

```
Query Parameters:
- page: number
- limit: number
- datum_von: date (ISO 8601)
- datum_bis: date
- status: string (entwurf|geplant|genehmigt|aktiv|abgeschlossen|abgesagt)
- istOeffentlich: boolean
- istVertraulich: boolean
- sportbereich: string
- verantwortlichId: string
```

#### GET /events/{id}

Einzelnes Event abrufen

#### POST /events

Neues Event erstellen

```json
// Request
{
  "titel": "Fanfahrt nach Berlin",
  "beschreibung": "Gemeinsame Fahrt zum Auswärtsspiel",
  "datum": "2024-06-15",
  "uhrzeit": "14:00",
  "ort": {
    "name": "Hauptbahnhof Spandau",
    "adresse": {
      "strasse": "Bahnhofstr",
      "hausnummer": "1",
      "plz": "13581",
      "stadt": "Berlin"
    }
  },
  "typ": "fanfahrt",
  "maxTeilnehmer": 50,
  "anmeldeschluss": "2024-06-10T23:59:59Z",
  "budget": 1000
}

// Response
{
  "success": true,
  "data": {
    "id": "evt_456"
  }
}
```

#### PUT /events/{id}

Event aktualisieren

#### DELETE /events/{id}

Event löschen (nur Entwurf-Status)

#### POST /events/{id}/genehmigung

Event genehmigen (Beirat/Vorstand)

```json
// Request
{
  "kommentar": "Genehmigt mit Auflagen"
}
```

#### POST /events/{id}/teilnahme

Zu Event anmelden

```json
// Request
{
  "kommentar": "Bringe 2 Freunde mit"
}

// Response
{
  "success": true,
  "data": {
    "id": "teilnahme_789",
    "status": "angemeldet"
  }
}
```

#### DELETE /events/{id}/teilnahme

Von Event abmelden

#### GET /events/{id}/teilnehmer

Teilnehmerliste abrufen

### Aufgaben

#### GET /aufgaben

Aufgabenliste

```
Query Parameters:
- eventId: string
- bereichId: string
- verantwortlichId: string
- zugewiesenAn: string
- status: string
- prioritaet: string
- frist_von: date
- frist_bis: date
```

#### GET /aufgaben/{id}

Einzelne Aufgabe

#### POST /aufgaben

Neue Aufgabe erstellen

```json
// Request
{
  "titel": "Location buchen",
  "beschreibung": "Raum für Event reservieren",
  "eventId": "evt_456",
  "prioritaet": "hoch",
  "frist": "2024-06-01",
  "zugewiesenAn": ["usr_123", "usr_456"]
}
```

#### PUT /aufgaben/{id}

Aufgabe aktualisieren

#### PUT /aufgaben/{id}/status

Aufgabenstatus ändern

```json
// Request
{
  "status": "erledigt",
  "kommentar": "Location gebucht, Bestätigung erhalten"
}
```

#### POST /aufgaben/{id}/zuweisung

Aufgabe zuweisen/umverteilen

```json
// Request
{
  "mitgliedIds": ["usr_789"],
  "kommentar": "Bitte übernehmen"
}
```

### Creator & Werke

#### GET /creators

Creator-Liste (öffentlich)

#### GET /creators/{id}

Creator-Profil

#### POST /creators

Creator-Antrag stellen

```json
// Request
{
  "kuenstlername": "DJ Spandau",
  "profiltext": "Electronic Music Producer",
  "kategorien": ["musik", "video"],
  "portfolio": "https://soundcloud.com/djspandau"
}
```

#### PUT /creators/{id}

Creator-Profil aktualisieren

#### POST /creators/{id}/autorisierung

Creator autorisieren (Beirat)

#### GET /creators/{id}/werke

Werke eines Creators

#### POST /werke

Neues Werk hochladen

```json
// Request (Multipart Form Data)
{
  "titel": "Event Poster Design",
  "beschreibung": "Poster für Sommerfest",
  "typ": "bild",
  "kategorien": ["design", "poster"],
  "datei": <file>
}
```

### Social Media

#### GET /social-media

Post-Liste

#### POST /social-media

Neuen Post erstellen

```json
// Request
{
  "inhalt": "Morgen startet unser Event! 🎉",
  "plattformen": ["instagram", "twitter"],
  "eventId": "evt_456",
  "postDatum": "2024-06-14T18:00:00Z",
  "hashtags": ["#eintracht", "#spandau"],
  "medienUrls": ["https://drive.google.com/..."]
}
```

#### PUT /social-media/{id}

Post bearbeiten

#### POST /social-media/{id}/genehmigung

Post genehmigen

```json
// Request
{
  "genehmigt": true,
  "kommentar": "Bitte noch Uhrzeit ergänzen"
}
```

### Finanzen

#### GET /ausgaben

Ausgabenliste

```
Query Parameters:
- eventId: string
- status: string
- kategorie: string
- eingereichtVon: string
```

#### POST /ausgaben

Neue Ausgabe einreichen

```json
// Request
{
  "eventId": "evt_456",
  "beschreibung": "Busmiete für Fanfahrt",
  "betrag": 450.0,
  "kategorie": "transport",
  "belegUrl": "https://drive.google.com/..."
}
```

#### POST /ausgaben/{id}/genehmigung

Ausgabe genehmigen/ablehnen

```json
// Request
{
  "genehmigt": true,
  "kommentar": "Genehmigt"
}
```

### Dokumente

#### GET /dokumente

Dokumentenliste

```
Query Parameters:
- typ: string
- istOeffentlich: boolean
```

#### GET /dokumente/{id}

Dokument abrufen

#### POST /dokumente

Neues Dokument hochladen (Vorstand)

#### PUT /dokumente/{id}

Dokument aktualisieren

### Benachrichtigungen

#### GET /benachrichtigungen

Eigene Benachrichtigungen

```
Query Parameters:
- gelesen: boolean
- prioritaet: string
- limit: number
```

#### PUT /benachrichtigungen/{id}/gelesen

Benachrichtigung als gelesen markieren

#### PUT /benachrichtigungen/alle-gelesen

Alle als gelesen markieren

### Kommentare

#### GET /kommentare

Kommentare abrufen

```
Query Parameters:
- kontextTyp: string (event|aufgabe|dokument)
- kontextId: string
```

#### POST /kommentare

Neuen Kommentar erstellen

```json
// Request
{
  "text": "Super Idee! @usr_123 kannst du das übernehmen?",
  "kontextTyp": "event",
  "kontextId": "evt_456",
  "erwaehntePersonenIdList": ["usr_123"]
}
```

### System & Utilities

#### GET /system/status

System-Status (öffentlich)

```json
// Response
{
  "success": true,
  "data": {
    "status": "operational",
    "version": "1.0.0",
    "uptime": 864000
  }
}
```

#### GET /system/enums

Alle Enum-Werte abrufen

```json
// Response
{
  "success": true,
  "data": {
    "eventStatus": ["entwurf", "geplant", ...],
    "eventTyp": ["vereinstreffen", "sportveranstaltung", ...],
    "prioritaet": ["niedrig", "mittel", "hoch", "kritisch"],
    // ...
  }
}
```

## Spezielle Endpoints

### Suche

#### GET /suche

Globale Suche

```
Query Parameters:
- q: string (Suchbegriff)
- type: string[] (event|mitglied|aufgabe|dokument)
- limit: number
```

### Dashboard

#### GET /dashboard

Personalisierte Dashboard-Daten

```json
// Response
{
  "success": true,
  "data": {
    "anstehendeEvents": [...],
    "offeneAufgaben": [...],
    "neuesteBenachrichtigungen": [...],
    "statistiken": {
      "eventsBesucht": 12,
      "aufgabenErledigt": 45
    }
  }
}
```

### Reports

#### GET /reports/events/{id}

Event-Report (PDF)

#### GET /reports/finanzen

Finanz-Report

```
Query Parameters:
- von: date
- bis: date
- format: string (pdf|excel)
```

## Rate Limiting

- Unauthentifiziert: 60 Requests/Stunde
- Authentifiziert: 600 Requests/Stunde
- Admin: Unlimited

Header bei Limit:

```
X-RateLimit-Limit: 600
X-RateLimit-Remaining: 599
X-RateLimit-Reset: 1640995200
```

## Webhooks (für Integrationen)

### POST /webhooks/easyverein

EasyVerein Update-Webhook

```
Headers:
X-EasyVerein-Signature: <signature>
```

### POST /webhooks/drive

Google Drive Update-Webhook
