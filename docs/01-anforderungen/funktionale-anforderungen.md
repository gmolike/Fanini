# Funktionale Anforderungen

## 1. Öffentlicher Bereich

### 1.1 Event-Übersicht

- Vergangene Events mit gefilterter Darstellung
- Zukünftige Events mit eingeschränkten Informationen
- Freigabe-Flag für öffentliche Sichtbarkeit wird aus internem Bereich gesteuert
- Kalenderansicht für Events
- Filterung nach Sportbereich möglich

### 1.2 Newsletter

- Anzeige auf der Webseite
- E-Mail-Verteiler Integration
- Anmeldeformular für Interessierte
- Verwaltung erfolgt über internen Bereich
- Automatischer Versand bei neuen öffentlichen Events

### 1.3 Dokumentenbereich

- Vereinssatzung als PDF/HTML
- Zusatzdokumente (rechtlich freigegeben)
- Nur-Lese-Zugriff für alle Besucher
- Versionsverwaltung sichtbar
- Download-Möglichkeit

### 1.4 Creator-Showcase

- Künstlerprofile mit Werken
- Galerie-Ansicht für Werke
- Verlinkung zu Social Media
- Selbstverwaltung über internen Bereich
- Vorgegebenes Design-Template
- Filterung nach Werk-Typ (Bild, Video, Audio, Text)

### 1.5 Kontakt & Feedback

- Kontaktformular mit Kategorien
- E-Mail-Versand an zuständiges Team
- Interne Ticket-Erstellung
- Verbesserungsvorschläge einreichen
- Automatische Eingangsbestätigung

### 1.6 Mediengalerie

- Foto-Galerie (Hauptfokus)
- Video-Integration (sekundär)
- Event-bezogene Gruppierung
- Lazy Loading für Performance
- Lightbox-Ansicht

### 1.7 Sportbereich

- Übersicht der Sportteams (dynamisch erweiterbar)
- Historische Seasons von Eintracht Spandau GmbH
- Aktuell: League of Legends, Valorant
- Erweiterbar für lokale Sportvereine
- Erfolge und Statistiken

## 2. Interner Bereich

### 2.1 Authentifizierung & Autorisierung

#### 2.1.1 Login

- OAuth-Integration mit EasyVerein
- Automatische Mitgliedsdaten-Synchronisation
- Session-Management
- Remember-Me Funktionalität
- Passwort-Reset über EasyVerein

#### 2.1.2 Rollenmodell

**Hierarchie:**

- Admin (Vollzugriff)
- Vorstand (erweiterte Verwaltung)
- Beirat (Verwaltungsfunktionen)
- Kassenprüfer (Finanz-Einsicht)
- Teams:
  - Team Event (Event-Management)
  - Team Technik (technische Wartung)
  - Team Medien (Content-Verwaltung)
  - Team Verein (Mitgliederverwaltung)
- Mitglied mit Vertraulichkeitserklärung
- Mitglied (Basis)

**Rollenprinzipien:**

- Mehrfachzuweisung möglich
- Höchste Rolle gilt bei Konflikten
- Explizite Rollenzuweisung für Team-Benachrichtigungen
- Vertraulichkeits-Flag für sensible Inhalte

### 2.2 Dashboard & Notifications

#### 2.2.1 Personalisiertes Dashboard

- Anstehende Events
- Zugewiesene Aufgaben
- Ungelesene Benachrichtigungen
- Quick-Links zu häufigen Aktionen
- Persönliche Statistiken

#### 2.2.2 Notification-System

- In-App Benachrichtigungen
- E-Mail-Benachrichtigungen (konfigurierbar)
- Push-Notifications (Mobile)
- Label-System nach Bereichen
- Direkte Verlinkung zu relevanten Items
- Priorisierung (Kritisch, Hoch, Mittel, Niedrig)

### 2.3 Event-Management

#### 2.3.1 Event-Erstellung

- Pflichtfelder: Titel, Beschreibung, Datum, Ort, Verantwortlicher
- Optionale Felder: Budget, Max. Teilnehmer, Ticket-Link, Sportbereich
- Status-Verwaltung (Entwurf → Geplant → Genehmigt → Aktiv → Abgeschlossen)
- Öffentlichkeits-Flag
- Vertraulichkeits-Flag

#### 2.3.2 Aufgabenverwaltung

- Standardaufgaben-Katalog
- Neue Aufgaben erstellen
- Zuweisung an Mitglieder
- Fristen setzen
- Status-Tracking
- Kommentarfunktion
- Erinnerungen bei Fristablauf

#### 2.3.3 Teilnehmerverwaltung

- Online-Anmeldung für Mitglieder
- Wartelisten-Funktion
- Teilnahmebestätigung
- Export-Funktion für Teilnehmerlisten
- Check-In Funktion

#### 2.3.4 Budget-Management

- Budget-Definition pro Event
- Ausgaben-Tracking
- Beleg-Upload
- Genehmigungsworkflow
- Echtzeit-Budgetübersicht
- Warnung bei Überschreitung

### 2.4 Kommunikation & Content

#### 2.4.1 Social Media Management

- Post-Vorbereitung mit Preview
- Multi-Plattform Support
- Event-Verknüpfung
- Zeitgesteuertes Posting
- Approval-Workflow
- Hashtag-Verwaltung
- Medien-Upload

#### 2.4.2 Kommentarsystem

- Kommentare zu Events, Aufgaben, Dokumenten
- @-Erwähnungen mit Benachrichtigung
- Threading für Diskussionen
- Bearbeitungs-Historie
- Lösch-Funktion (rollenbasiert)

#### 2.4.3 E-Mail Vorlagen

- Vordefinierte Templates
- Platzhalter-System
- Kategorisierung
- Versionsverwaltung
- Test-Versand

### 2.5 Mitgliederverwaltung

#### 2.5.1 Profilverwaltung

- Kontaktdaten pflegen
- Profilbild Upload
- Sichtbarkeitseinstellungen (Öffentlich/Intern/Vorstand)
- Skill-/Interessen-Tags
- Verfügbarkeiten eintragen

#### 2.5.2 Mitgliederliste

- Suchfunktion
- Filter nach Rollen/Teams
- Kontaktmöglichkeiten
- Export-Funktionen (rollenbasiert)
- Geburtstagsliste

#### 2.5.3 Creator-Verwaltung

- Antragstellung als Creator
- Beirat-Autorisierung
- Profil-Aktivierung/Deaktivierung
- Portfolio-Verwaltung
- Social Media Integration

### 2.6 Organisatorisches

#### 2.6.1 Protokoll-Management

- Sitzungsprotokolle erstellen
- Teilnehmer erfassen
- Tagesordnungspunkte
- Beschluss-Dokumentation
- Aufgaben-Generierung aus Protokollen
- PDF-Export

#### 2.6.2 Dokumentenverwaltung

- Upload/Download Funktionen
- Versionierung
- Zugriffsrechte-Verwaltung
- Kategorisierung
- Volltextsuche
- Bearbeitungshistorie

#### 2.6.3 Finanzübersicht

- Dashboard für Kassenwart/Vorstand
- Event-bezogene Auswertungen
- Jahresübersichten
- Export für Buchhaltung
- Belegarchiv

### 2.7 Technische Features

#### 2.7.1 Suche

- Globale Suche über alle Bereiche
- Filteroptionen
- Gespeicherte Suchen
- Relevanz-Sortierung

#### 2.7.2 Datenexport

- CSV/Excel Export
- PDF-Generierung
- API für externe Tools
- Backup-Funktionalität

#### 2.7.3 Mobile Optimierung

- Responsive Design
- Touch-optimierte Bedienung
- Offline-Funktionalität für kritische Features
- Progressive Web App

## 3. Systemübergreifende Anforderungen

### 3.1 Performance

- Ladezeiten < 3 Sekunden
- Optimistische UI-Updates
- Lazy Loading für Medien
- Caching-Strategien

### 3.2 Sicherheit

- DSGVO-konform
- Verschlüsselte Verbindungen (HTTPS)
- Regelmäßige Sicherheits-Updates
- Audit-Logging für kritische Aktionen

### 3.3 Benutzerfreundlichkeit

- Intuitive Navigation
- Kontextsensitive Hilfe
- Mehrsprachigkeit (DE/EN)
- Barrierefreiheit (WCAG 2.1)

### 3.4 Integrationen

- EasyVerein (Pflicht)
- Google Drive API (Medien)
- Social Media APIs
- E-Mail Service Provider
- Kalender-Export (iCal)
