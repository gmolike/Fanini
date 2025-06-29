# Ablaufdiagramme

## 1. Event-Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Entwurf: Event erstellen

    Entwurf --> Geplant: Basisdaten vollständig
    Geplant --> Genehmigung: Antrag stellen

    Genehmigung --> Genehmigt: Vorstand/Beirat bestätigt
    Genehmigung --> Geplant: Änderungen erforderlich

    Genehmigt --> Aktiv: Eventdatum erreicht
    Genehmigt --> Abgesagt: Event absagen

    Aktiv --> Abgeschlossen: Event beenden
    Abgeschlossen --> [*]
    Abgesagt --> [*]

    note right of Abgeschlossen
        Keine Bearbeitung mehr möglich
        Nur noch Kommentare
    end note
```

## 2. Event-Erstellung (Sequenzdiagramm)

```mermaid
sequenceDiagram
    participant M as Mitglied (Team Event)
    participant F as Frontend
    participant B as Backend
    participant DB as Datenbank
    participant N as Notification Service
    participant VB as Vorstand/Beirat

    M->>F: Event erstellen öffnen
    F->>F: UUID generieren
    F->>M: Formular anzeigen

    M->>F: Basisdaten eingeben
    Note over M,F: Titel, Beschreibung, Datum, Ort

    M->>F: Verantwortlichen wählen
    F->>B: GET /api/mitglied?rolle=team_event
    B->>DB: Mitglieder abfragen
    DB->>B: Mitgliederliste
    B->>F: Mitgliederliste
    F->>M: Auswahl anzeigen

    M->>F: Aufgaben hinzufügen
    F->>B: GET /api/aufgabe/standard
    B->>F: Standardaufgaben

    M->>F: Event speichern
    F->>B: POST /api/event
    B->>B: Validierung
    B->>DB: Event speichern
    DB->>B: Success
    B->>F: {id: "event-uuid"}

    B->>N: Benachrichtigung erstellen
    N->>VB: Email/Push Notification

    F->>M: Erfolg anzeigen
```

## 3. Event-Genehmigung

```mermaid
sequenceDiagram
    participant VB as Vorstand/Beirat
    participant F as Frontend
    participant B as Backend
    participant DB as Datenbank
    participant N as Notification Service
    participant TE as Team Event

    VB->>F: Dashboard öffnen
    F->>B: GET /api/benachrichtigung/ungelesen
    B->>F: Genehmigungsanfragen

    VB->>F: Event-Details öffnen
    F->>B: GET /api/event/{id}
    B->>F: Event-Daten

    alt Genehmigung
        VB->>F: Event genehmigen
        F->>B: POST /api/event/{id}/genehmigung
        B->>DB: Status = GENEHMIGT
        B->>N: Benachrichtigung an Team
        N->>TE: Event genehmigt
        B->>F: {id: "event-uuid"}
    else Ablehnung
        VB->>F: Änderungen anfordern
        F->>B: POST /api/kommentar
        B->>DB: Kommentar speichern
        B->>N: Benachrichtigung
        N->>TE: Änderungen erforderlich
    end

    F->>VB: Status Update anzeigen
```

## 4. Event-Anmeldung

```mermaid
sequenceDiagram
    participant M as Mitglied
    participant F as Frontend
    participant B as Backend
    participant DB as Datenbank
    participant E as Email Service

    M->>F: Event-Details öffnen
    F->>B: GET /api/event/{id}
    B->>F: Event mit Teilnehmerzahl

    F->>F: Anmeldebutton anzeigen
    Note over F: Prüfung: Anmeldeschluss, Max. Teilnehmer

    M->>F: Zur Teilnahme anmelden
    F->>B: POST /api/event/{id}/teilnahme

    B->>DB: Teilnehmerzahl prüfen
    alt Platz verfügbar
        B->>DB: Teilnahme speichern
        B->>E: Bestätigungsmail
        E->>M: Email-Bestätigung
        B->>F: {id: "teilnahme-uuid", status: "angemeldet"}
        F->>M: Erfolgsmeldung
    else Event voll
        B->>DB: Warteliste
        B->>F: {id: "teilnahme-uuid", status: "warteliste"}
        F->>M: Warteliste-Info
    end
```

## 5. Creator-Workflow

```mermaid
sequenceDiagram
    participant P as Person
    participant F as Frontend
    participant B as Backend
    participant Bei as Beirat
    participant DB as Datenbank

    P->>F: Creator-Antrag stellen
    F->>B: POST /api/creator/antrag
    B->>DB: Antrag speichern
    B->>Bei: Benachrichtigung

    Bei->>F: Antrag prüfen
    F->>B: GET /api/creator/antrag/{id}
    B->>F: Antragsdaten

    Bei->>F: Antrag genehmigen
    F->>B: POST /api/creator/{id}/autorisierung
    B->>DB: Creator-Profil aktivieren
    B->>P: Benachrichtigung

    P->>F: Creator-Bereich öffnen
    F->>B: GET /api/creator/profil
    B->>F: Profildaten

    P->>F: Werk hochladen
    F->>F: Datei validieren
    F->>B: POST /api/creator/{id}/werk
    B->>DB: Werk speichern
    B->>F: {id: "werk-uuid"}

    Note over F,B: Automatische Anzeige im öffentlichen Bereich
```

## 6. Aufgaben-Management

```mermaid
flowchart TD
    Start([Aufgabe erstellen])

    Start --> Type{Aufgabentyp?}

    Type -->|Event-Aufgabe| Event[Event auswählen]
    Type -->|Bereichs-Aufgabe| Bereich[Bereich auswählen]

    Event --> Details[Details eingeben<br/>- Titel<br/>- Beschreibung<br/>- Frist]
    Bereich --> Details

    Details --> Assign{Zuweisung?}

    Assign -->|Direkt| Person[Person auswählen]
    Assign -->|Später| Save[Speichern]

    Person --> Notify[Benachrichtigung<br/>senden]
    Notify --> Save

    Save --> Track[In Dashboard<br/>anzeigen]

    Track --> Status{Status?}

    Status -->|In Bearbeitung| Work[Bearbeitung]
    Status -->|Erledigt| Done[Abschließen]

    Work --> Status
    Done --> End([Ende])
```

## 7. Social Media Post Workflow

```mermaid
sequenceDiagram
    participant TM as Team Medien
    participant F as Frontend
    participant B as Backend
    participant A as Approval System
    participant VB as Vorstand/Beirat
    participant SM as Social Media

    TM->>F: Social Media Post erstellen
    F->>F: UUID generieren

    alt Mit Event
        TM->>F: Event verknüpfen
        F->>B: GET /api/event/genehmigt
        B->>F: Event-Liste
        TM->>F: Event auswählen
    end

    TM->>F: Post-Inhalt eingeben
    TM->>F: Veröffentlichungsdatum setzen
    TM->>F: Zur Genehmigung einreichen

    F->>B: POST /api/social-media
    B->>A: Approval-Workflow starten
    A->>VB: Benachrichtigung

    VB->>F: Post reviewen
    F->>B: GET /api/social-media/{id}
    B->>F: Post-Details

    alt Genehmigung
        VB->>F: Post genehmigen
        F->>B: POST /api/social-media/{id}/genehmigung
        B->>A: Status = GENEHMIGT

        Note over B,SM: Warte auf Veröffentlichungsdatum

        B->>SM: Post veröffentlichen
        SM->>B: Erfolg
        B->>TM: Benachrichtigung
    else Ablehnung
        VB->>F: Änderungen anfordern
        F->>B: POST /api/kommentar
        B->>TM: Benachrichtigung
    end
```

## 8. Login-Flow (EasyVerein OAuth)

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant EV as EasyVerein
    participant DB as Datenbank

    U->>F: Login-Button klicken
    F->>B: GET /api/auth/oauth-url
    B->>F: EasyVerein OAuth URL

    F->>U: Redirect zu EasyVerein
    U->>EV: Login bei EasyVerein
    EV->>U: Authorisierung bestätigen
    EV->>F: Redirect mit Code

    F->>B: POST /api/auth/login {code}
    B->>EV: Code gegen Token tauschen
    EV->>B: Access Token + User Info

    B->>DB: Mitglied suchen/erstellen
    B->>DB: Session erstellen
    B->>F: JWT Token + User Data

    F->>F: Token speichern
    F->>U: Dashboard anzeigen
```

## 9. Finanzen-Workflow

```mermaid
stateDiagram-v2
    [*] --> Eingereicht: Ausgabe einreichen

    Eingereicht --> Prüfung: Zur Prüfung

    Prüfung --> Genehmigt: Kassenwart/Vorstand genehmigt
    Prüfung --> Abgelehnt: Ablehnung mit Grund

    Genehmigt --> Auszahlung: Überweisung
    Auszahlung --> Ausgezahlt: Bestätigung

    Ausgezahlt --> [*]
    Abgelehnt --> [*]

    Abgelehnt --> Eingereicht: Korrektur & Neueinreichung
```

## 10. Notification-Flow

```mermaid
flowchart LR
    subgraph "Trigger"
        T1[Event-Änderung]
        T2[Aufgabe zugewiesen]
        T3[Kommentar-Erwähnung]
        T4[Genehmigung erforderlich]
        T5[Frist-Erinnerung]
    end

    subgraph "Notification Service"
        NS[Service]
        NQ[(Queue)]
        NR[Rules Engine]
    end

    subgraph "Delivery"
        D1[In-App]
        D2[Email]
        D3[Push]
    end

    T1 --> NS
    T2 --> NS
    T3 --> NS
    T4 --> NS
    T5 --> NS

    NS --> NQ
    NQ --> NR

    NR -->|Rolle prüfen| D1
    NR -->|Präferenz| D2
    NR -->|Mobile| D3

    style NS fill:#ffd54f
    style NR fill:#ffb300
```

## 11. Datenfluss-Übersicht

```mermaid
graph LR
    subgraph "Frontend (FSD)"
        P[Pages]
        W[Widgets]
        F[Features]
        E[Entities]
        S[Shared/API]
    end

    subgraph "Backend"
        API[API Routes]
        UC[Use Cases]
        DOM[Domain]
        INF[Infrastructure]
    end

    subgraph "External"
        EV[EasyVerein]
        GD[Google Drive]
        DB[(MySQL)]
    end

    P --> W
    W --> F
    F --> E
    E --> S

    S <--> API
    API --> UC
    UC --> DOM
    DOM --> INF

    INF <--> DB
    INF <--> EV
    INF <--> GD

    style P fill:#e1f5fe
    style W fill:#b3e5fc
    style F fill:#81d4fa
    style E fill:#4fc3f7
    style S fill:#29b6f6
```

## 12. Event-Timeline Beispiel

```mermaid
gantt
    title Event-Ablauf: Fanfahrt nach Berlin
    dateFormat YYYY-MM-DD

    section Planung
    Event erstellen           :done, 2024-05-01, 1d
    Details ausarbeiten      :done, 2024-05-02, 3d
    Genehmigung anfordern    :done, 2024-05-05, 1d

    section Genehmigung
    Beirat Review           :done, 2024-05-06, 2d
    Event genehmigt         :done, 2024-05-08, 1d

    section Vorbereitung
    Anmeldung öffnen        :done, 2024-05-09, 1d
    Social Media Post       :active, 2024-05-10, 14d
    Aufgaben verteilen      :active, 2024-05-10, 7d

    section Durchführung
    Anmeldeschluss          :crit, 2024-05-20, 1d
    Teilnehmer bestätigen   :2024-05-21, 2d
    Event-Tag               :milestone, 2024-05-25, 0d

    section Nachbereitung
    Fotos hochladen         :2024-05-26, 3d
    Ausgaben abrechnen      :2024-05-26, 7d
    Event abschließen       :2024-06-02, 1d
```
