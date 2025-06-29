# Datentypen (TypeScript)

## Basis-Typen

### API Response Types

```typescript
// Generische API Response
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: ApiMeta;
}

interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

interface ApiMeta {
  timestamp: string;
  version: string;
  pagination?: Pagination;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
```

## Domain-Entitäten

### Mitglied

```typescript
interface Mitglied {
  // Identifikation
  id: string;
  easyVereinId: string;

  // Stammdaten
  vorname: string;
  nachname: string;
  email: string;
  telefon?: string;

  // Status
  istAktiv: boolean;
  hatVertraulichkeitserklaerung: boolean;
  mitgliedSeit: Date;
  austrittsDatum?: Date;

  // Profildaten
  profilbild?: string;
  beschreibung?: string;
  skills?: string[];
  interessen?: string[];

  // Sichtbarkeit
  sichtbarkeitEmail: Sichtbarkeit;
  sichtbarkeitTelefon: Sichtbarkeit;
  sichtbarkeitProfil: Sichtbarkeit;

  // Metadaten
  erstelltAm: Date;
  aktualisiertAm: Date;
  letzterLogin?: Date;

  // Beziehungen
  rollen?: Rolle[];
  creatorProfil?: Creator;
}

enum Sichtbarkeit {
  OEFFENTLICH = "oeffentlich",
  INTERN = "intern",
  VORSTAND = "vorstand",
  PRIVAT = "privat",
}

// DTOs
interface CreateMitgliedDto {
  vorname: string;
  nachname: string;
  email: string;
  telefon?: string;
}

interface UpdateMitgliedDto {
  telefon?: string;
  beschreibung?: string;
  skills?: string[];
  interessen?: string[];
  sichtbarkeitEmail?: Sichtbarkeit;
  sichtbarkeitTelefon?: Sichtbarkeit;
  sichtbarkeitProfil?: Sichtbarkeit;
}
```

### Event

```typescript
interface Event {
  // Identifikation
  id: string;

  // Basisdaten
  titel: string;
  beschreibung: string;
  kurzbeschreibung?: string;

  // Zeit & Ort
  datum: Date;
  uhrzeit: string;
  dauer?: number;
  ort: Ort;

  // Kategorisierung
  typ: EventTyp;
  sportbereich?: Sportbereich;
  tags?: string[];

  // Status & Sichtbarkeit
  status: EventStatus;
  istOeffentlich: boolean;
  istVertraulich: boolean;

  // Organisation
  verantwortlichId: string;
  stellvertreterIdList?: string[];

  // Finanzen
  budget?: number;
  budgetVerbraucht: number;

  // Teilnahme
  maxTeilnehmer?: number;
  minTeilnehmer?: number;
  anmeldeschluss?: Date;
  ticketLink?: string;
  teilnahmegebuehr?: number;

  // Metadaten
  erstelltAm: Date;
  erstelltVon: string;
  geaendertAm?: Date;
  geaendertVon?: string;
  genehmigtAm?: Date;
  genehmigtVon?: string;
  abgesagtAm?: Date;
  abgesagtVon?: string;
  abgesagtGrund?: string;

  // Beziehungen (optional laden)
  verantwortlicher?: Mitglied;
  teilnehmer?: EventTeilnahme[];
  aufgaben?: Aufgabe[];
  ausgaben?: Ausgabe[];
}

interface Ort {
  name: string;
  adresse?: Adresse;
  beschreibung?: string;
  koordinaten?: Koordinaten;
}

interface Adresse {
  strasse: string;
  hausnummer: string;
  plz: string;
  stadt: string;
  land?: string;
}

interface Koordinaten {
  lat: number;
  lng: number;
}

enum EventStatus {
  ENTWURF = "entwurf",
  GEPLANT = "geplant",
  GENEHMIGT = "genehmigt",
  AKTIV = "aktiv",
  ABGESCHLOSSEN = "abgeschlossen",
  ABGESAGT = "abgesagt",
}

enum EventTyp {
  VEREINSTREFFEN = "vereinstreffen",
  SPORTVERANSTALTUNG = "sportveranstaltung",
  FANFAHRT = "fanfahrt",
  SOCIAL = "social",
  SITZUNG = "sitzung",
  WORKSHOP = "workshop",
  TURNIER = "turnier",
  SONSTIGES = "sonstiges",
}

enum Sportbereich {
  LEAGUE_OF_LEGENDS = "league_of_legends",
  VALORANT = "valorant",
  FUSSBALL = "fussball",
  ESPORTS_ALLGEMEIN = "esports_allgemein",
  SONSTIGES = "sonstiges",
}

// DTOs
interface CreateEventDto {
  titel: string;
  beschreibung: string;
  kurzbeschreibung?: string;
  datum: string; // ISO 8601
  uhrzeit: string;
  dauer?: number;
  ort: CreateOrtDto;
  typ: EventTyp;
  sportbereich?: Sportbereich;
  maxTeilnehmer?: number;
  anmeldeschluss?: string;
  budget?: number;
}

interface CreateOrtDto {
  name: string;
  adresse?: Adresse;
  beschreibung?: string;
}
```

### Rolle & Berechtigung

```typescript
interface Rolle {
  id: string;
  name: RollenTyp;
  bezeichnung: string;
  beschreibung: string;
  hierarchieEbene: number;
  istSystemRolle: boolean;
  farbe?: string;
  icon?: string;
  berechtigungen?: Berechtigung[];
}

enum RollenTyp {
  ADMIN = "admin",
  VORSTAND = "vorstand",
  BEIRAT = "beirat",
  KASSENPRUFER = "kassenprufer",
  TEAM_EVENT = "team_event",
  TEAM_TECHNIK = "team_technik",
  TEAM_MEDIEN = "team_medien",
  TEAM_VEREIN = "team_verein",
  MITGLIED = "mitglied",
}

interface Berechtigung {
  id: string;
  aktion: string;
  ressource: string;
  bedingung?: string;
}

interface MitgliedRolle {
  mitgliedId: string;
  rolleId: string;
  zugewiesenAm: Date;
  zugewiesenVon: string;
  gueltigBis?: Date;
}
```

### Aufgabe

```typescript
interface Aufgabe {
  id: string;
  titel: string;
  beschreibung?: string;

  // Zuordnung
  eventId?: string;
  bereichId?: string;
  uebergeordneteAufgabeId?: string;

  // Verantwortung
  verantwortlichId?: string;
  zugewiesenAn: string[];

  // Status & Priorität
  status: AufgabeStatus;
  prioritaet: Prioritaet;
  fortschritt: number;

  // Zeitplanung
  frist?: Date;
  geschaetzterAufwand?: number;
  tatsaechlicherAufwand?: number;

  // Tracking
  erstelltAm: Date;
  erstelltVon: string;
  aktualisiertAm: Date;
  aktualisiertVon: string;
  erledigtAm?: Date;
  erledigtVon?: string;

  // Kategorisierung
  istStandardaufgabe: boolean;
  kategorie?: string;
  tags?: string[];

  // Checkliste
  checklistItems?: ChecklistItem[];

  // Wiederkehrend
  istWiederkehrend: boolean;
  wiederholungsregel?: string;

  // Beziehungen
  event?: Event;
  bereich?: Bereich;
  verantwortlicher?: Mitglied;
  bearbeiter?: Mitglied[];
}

interface ChecklistItem {
  id: string;
  text: string;
  istErledigt: boolean;
  erledigtVon?: string;
  erledigtAm?: Date;
}

enum AufgabeStatus {
  OFFEN = "offen",
  IN_BEARBEITUNG = "in_bearbeitung",
  REVIEW = "review",
  ERLEDIGT = "erledigt",
  ABGEBROCHEN = "abgebrochen",
  BLOCKIERT = "blockiert",
}

enum Prioritaet {
  NIEDRIG = "niedrig",
  MITTEL = "mittel",
  HOCH = "hoch",
  KRITISCH = "kritisch",
}

// DTOs
interface CreateAufgabeDto {
  titel: string;
  beschreibung?: string;
  eventId?: string;
  bereichId?: string;
  prioritaet: Prioritaet;
  frist?: string;
  zugewiesenAn?: string[];
}
```

### Creator & Werk

```typescript
interface Creator {
  id: string;
  mitgliedId: string;

  // Profildaten
  kuenstlername?: string;
  profiltext: string;
  portfolioLink?: string;
  profilbanner?: string;

  // Status
  istAktiv: boolean;
  istVerifiziert: boolean;
  aktivSeit: Date;
  deaktiviertAm?: Date;
  deaktiviertGrund?: string;

  // Social Media
  instagram?: string;
  twitter?: string;
  tiktok?: string;
  youtube?: string;
  twitch?: string;
  website?: string;

  // Kategorien
  kategorien: CreatorKategorie[];

  // Statistiken
  anzahlWerke: number;
  anzahlAufrufe: number;
  letzteAktivitaet: Date;

  // Beziehungen
  mitglied?: Mitglied;
  werke?: Werk[];
}

enum CreatorKategorie {
  GRAFIK_DESIGN = "grafik_design",
  FOTOGRAFIE = "fotografie",
  VIDEO = "video",
  MUSIK = "musik",
  SCHREIBEN = "schreiben",
  STREAMING = "streaming",
  SONSTIGES = "sonstiges",
}

interface Werk {
  id: string;
  creatorId: string;

  // Grunddaten
  titel: string;
  beschreibung?: string;
  typ: WerkTyp;
  kategorien: string[];

  // Medien
  dateiUrl: string;
  thumbnailUrl?: string;
  dateigroesse: number;
  dateityp: string;

  // Metadaten
  erstelltAm: Date;
  hochgeladenAm: Date;
  veroeffentlichtAm?: Date;
  aktualisiertAm: Date;

  // Sichtbarkeit
  istOeffentlich: boolean;
  istGepinnt: boolean;
  reihenfolge: number;

  // Statistiken
  aufrufe: number;
  likes: number;

  // Lizenz
  lizenz?: string;
  quellenangabe?: string;

  // Beziehungen
  creator?: Creator;
}

enum WerkTyp {
  BILD = "bild",
  VIDEO = "video",
  AUDIO = "audio",
  TEXT = "text",
  ANIMATION = "animation",
  DESIGN = "design",
}
```

### Kommunikation

```typescript
interface Kommentar {
  id: string;
  text: string;

  // Kontext (polymorphe Beziehung)
  kontextTyp: KommentarKontext;
  kontextId: string;

  // Hierarchie
  uebergeordneterKommentarId?: string;

  // Autor
  autorId: string;
  erstelltAm: Date;
  bearbeitetAm?: Date;
  bearbeitetVon?: string;

  // Erwähnungen
  erwaehntePersonenIdList: string[];

  // Status
  istIntern: boolean;
  istGeloescht: boolean;
  geloeschtAm?: Date;
  geloeschtVon?: string;

  // Reaktionen
  reaktionen?: Reaktion[];

  // Beziehungen
  autor?: Mitglied;
  antworten?: Kommentar[];
}

interface Reaktion {
  mitgliedId: string;
  typ: ReaktionTyp;
  erstelltAm: Date;
}

enum KommentarKontext {
  EVENT = "event",
  AUFGABE = "aufgabe",
  DOKUMENT = "dokument",
  PROTOKOLL = "protokoll",
  AUSGABE = "ausgabe",
}

enum ReaktionTyp {
  LIKE = "like",
  HERZ = "herz",
  DAUMEN_HOCH = "daumen_hoch",
  DAUMEN_RUNTER = "daumen_runter",
  LACHEN = "lachen",
  UEBERRASCHT = "ueberrascht",
}

interface Benachrichtigung {
  id: string;
  empfaengerId: string;
  typ: BenachrichtigungTyp;
  titel: string;
  nachricht: string;
  kontextTyp?: string;
  kontextId?: string;
  gelesen: boolean;
  gelesenAm?: Date;
  versendetAm: Date;
  prioritaet: Prioritaet;
  aktionsUrl?: string;

  // Beziehungen
  empfaenger?: Mitglied;
}

enum BenachrichtigungTyp {
  AUFGABE_ZUGEWIESEN = "aufgabe_zugewiesen",
  EVENT_AENDERUNG = "event_aenderung",
  KOMMENTAR_ERWAEHNUNG = "kommentar_erwaehnung",
  GENEHMIGUNG_ERFORDERLICH = "genehmigung_erforderlich",
  FRIST_ERINNERUNG = "frist_erinnerung",
  SYSTEM = "system",
}
```

### Finanzen

```typescript
interface Ausgabe {
  id: string;
  eventId: string;

  // Daten
  beschreibung: string;
  betrag: number;
  kategorie: AusgabeKategorie;

  // Beleg
  belegUrl?: string;
  rechnungsnummer?: string;
  lieferant?: string;

  // Status
  status: AusgabeStatus;
  eingereichtVon: string;
  eingereichtAm: Date;

  // Genehmigung
  genehmigtVon?: string;
  genehmigtAm?: Date;
  abgelehntVon?: string;
  abgelehntAm?: Date;
  ablehnungsgrund?: string;

  // Auszahlung
  ausgezahltAm?: Date;
  zahlungsreferenz?: string;

  // Beziehungen
  event?: Event;
  einreicher?: Mitglied;
  genehmiger?: Mitglied;
}

enum AusgabeKategorie {
  VERPFLEGUNG = "verpflegung",
  TRANSPORT = "transport",
  MATERIAL = "material",
  UNTERKUNFT = "unterkunft",
  SONSTIGES = "sonstiges",
}

enum AusgabeStatus {
  EINGEREICHT = "eingereicht",
  GENEHMIGT = "genehmigt",
  ABGELEHNT = "abgelehnt",
  AUSGEZAHLT = "ausgezahlt",
}
```

### Weitere Entitäten

```typescript
// Dokument
interface Dokument {
  id: string;
  titel: string;
  typ: DokumentTyp;
  inhalt?: string;
  dateiUrl?: string;
  istOeffentlich: boolean;
  bearbeitbarVon: string[];
  version: number;
  versionKommentar?: string;
  erstelltAm: Date;
  erstelltVon: string;
  aktualisiertAm: Date;
  aktualisiertVon: string;
}

enum DokumentTyp {
  SATZUNG = "satzung",
  PROTOKOLL = "protokoll",
  FORMULAR = "formular",
  ANLEITUNG = "anleitung",
  SONSTIGES = "sonstiges",
}

// Social Media Post
interface SocialMediaPost {
  id: string;
  inhalt: string;
  plattformen: SocialMediaPlattform[];
  eventId?: string;
  postDatum?: Date;
  status: PostStatus;
  erstelltVon: string;
  erstelltAm: Date;
  approvedVon?: string;
  approvedAm?: Date;
  hashtags: string[];
  medienUrls: string[];
  linkUrl?: string;
  statistiken?: PostStatistiken;
}

enum SocialMediaPlattform {
  INSTAGRAM = "instagram",
  TWITTER = "twitter",
  FACEBOOK = "facebook",
  LINKEDIN = "linkedin",
  TIKTOK = "tiktok",
}

enum PostStatus {
  ENTWURF = "entwurf",
  REVIEW = "review",
  GENEHMIGT = "genehmigt",
  GEPLANT = "geplant",
  VEROEFFENTLICHT = "veroeffentlicht",
  ARCHIVIERT = "archiviert",
}

interface PostStatistiken {
  views: number;
  likes: number;
  shares: number;
  comments: number;
  clicks: number;
}

// Event-Teilnahme
interface EventTeilnahme {
  id: string;
  eventId: string;
  mitgliedId: string;
  angemeldetAm: Date;
  status: TeilnahmeStatus;
  kommentar?: string;
  istBestaetigt: boolean;
  bestaetigtAm?: Date;
  bestaetigtVon?: string;
  teilgenommenAm?: Date;
  feedbackGegeben: boolean;

  // Beziehungen
  event?: Event;
  mitglied?: Mitglied;
}

enum TeilnahmeStatus {
  ANGEMELDET = "angemeldet",
  WARTELISTE = "warteliste",
  BESTAETIGT = "bestaetigt",
  ABGESAGT = "abgesagt",
  TEILGENOMMEN = "teilgenommen",
  NICHT_ERSCHIENEN = "nicht_erschienen",
}

// Protokoll
interface Protokoll {
  id: string;
  bereichId: string;
  datum: Date;
  titel: string;
  typ: ProtokollTyp;
  teilnehmerIdList: string[];
  protokollantId: string;
  sitzungsleiterId: string;
  status: ProtokollStatus;
  inhalt?: string;
  genehmigtAm?: Date;
  genehmigtVon?: string;

  // Beziehungen
  bereich?: Bereich;
  protokollant?: Mitglied;
  sitzungsleiter?: Mitglied;
  tagesordnungspunkte?: Tagesordnungspunkt[];
}

enum ProtokollTyp {
  VORSTANDSSITZUNG = "vorstandssitzung",
  BEIRATSSITZUNG = "beiratssitzung",
  MITGLIEDERVERSAMMLUNG = "mitgliederversammlung",
  TEAMSITZUNG = "teamsitzung",
}

enum ProtokollStatus {
  ENTWURF = "entwurf",
  REVIEW = "review",
  GENEHMIGT = "genehmigt",
  ARCHIVIERT = "archiviert",
}

// Bereich
interface Bereich {
  id: string;
  name: string;
  beschreibung: string;
  verantwortlichId: string;
  mitgliederIdList: string[];
}
```

## Utility Types

```typescript
// Für partielle Updates
type PartialUpdate<T> = {
  [P in keyof T]?: T[P];
};

// Für API Responses
type ApiListResponse<T> = ApiResponse<{
  items: T[];
  pagination: Pagination;
}>;

// Für Create DTOs (ohne ID und Metadaten)
type CreateDto<T> = Omit<
  T,
  "id" | "erstelltAm" | "erstelltVon" | "aktualisiertAm" | "aktualisiertVon"
>;

// Für Filteroptionen
interface FilterOptions<T> {
  where?: Partial<T>;
  orderBy?: keyof T;
  orderDirection?: "asc" | "desc";
  limit?: number;
  offset?: number;
  include?: string[];
}

// Für Validierungsfehler
interface ValidationError {
  field: string;
  message: string;
  code: string;
}
```

## Frontend-spezifische Types

```typescript
// Form States
interface FormState<T> {
  values: T;
  errors: Record<keyof T, string>;
  touched: Record<keyof T, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

// Loading States
interface LoadingState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

// Query Parameters
interface EventQueryParams {
  page?: number;
  limit?: number;
  datumVon?: string;
  datumBis?: string;
  status?: EventStatus;
  istOeffentlich?: boolean;
  sportbereich?: Sportbereich;
}

// Route Parameters
interface RouteParams {
  eventId?: string;
  mitgliedId?: string;
  aufgabeId?: string;
}
```
