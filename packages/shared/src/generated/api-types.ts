// Auto-generated types from backend
// DO NOT EDIT MANUALLY

// ========== ENUMS ==========
export type RoleName =
  | "ADMIN"
  | "VORSTAND"
  | "BEIRAT"
  | "KASSENPRUFER"
  | "TEAM_EVENT"
  | "TEAM_MEDIEN"
  | "TEAM_TECHNIK"
  | "TEAM_VEREIN"
  | "MITGLIED";

export type EventType =
  | "vereinstreffen"
  | "sportveranstaltung"
  | "fanfahrt"
  | "social"
  | "sitzung"
  | "workshop"
  | "turnier"
  | "sonstiges";

export type EventStatus =
  | "entwurf"
  | "geplant"
  | "genehmigt"
  | "aktiv"
  | "abgeschlossen"
  | "abgesagt";

export type SportBereich =
  | "league_of_legends"
  | "fussball"
  | "esports_allgemein"
  | "sonstiges";

export type TaskStatus =
  | "offen"
  | "in_bearbeitung"
  | "review"
  | "erledigt"
  | "blockiert";

export type TaskPriority = "niedrig" | "mittel" | "hoch" | "kritisch";

export type SichtbarkeitLevel = "alle" | "mitglieder" | "vorstand" | "niemand";

// ========== SUB-TYPES ==========
export type Adresse = {
  strasse: string;
  hausnummer: string;
  plz: string;
  stadt: string;
};

export type Notfallkontakt = {
  name: string;
  telefon: string;
};

export type Sichtbarkeit = {
  email: SichtbarkeitLevel;
  telefon: SichtbarkeitLevel;
  profil: SichtbarkeitLevel;
};

export type EventLocation = {
  name: string;
  address?: string;
  description?: string;
};

export type TaskContext = {
  type: "event" | "team" | "general";
  id: string | null;
};

export type TaskMaterial = {
  name: string;
  menge: number;
  einheit: string;
  beschreibung?: string;
  besorgt: boolean;
};

// ========== USER & AUTH ==========
export type User = {
  id: string;
  email: string;
  vorname: string;
  nachname: string;
  mitgliedsnummer?: string;
  authSource: "local" | "easyverein";
  easyVereinId?: string;
  role?: RoleName;
  istAktiv: boolean;
  erstelltAm: Date;
  aktualisiertAm: Date;
  letzterLogin?: Date;
};

// ========== MEMBER ==========
export type MemberListItem = {
  id: string;
  vorname: string;
  nachname: string;
  email: string;
  telefon?: string;
  mitgliedsnummer: string;
  istAktiv: boolean;
  mitgliedSeit: string;
  geburtsdatum?: string;
  rolle: RoleName[];
  profilbild?: string;
  letzteAktivitaet?: string;
  vollstaendigerName?: string;
};

export type MemberDetail = MemberListItem & {
  adresse?: Adresse;
  notfallkontakt?: Notfallkontakt;
  iban?: string;
  hatVertraulichkeitserklaerung: boolean;
  sichtbarkeit?: Sichtbarkeit;
  createdAt: string;
  updatedAt: string;
};

// ========== EVENT ==========
export type Event = {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  date: Date;
  time: string;
  durationMinutes?: number;
  location: EventLocation;
  type: EventType;
  sportBereich?: SportBereich;
  status: EventStatus;
  isPublic: boolean;
  isConfidential: boolean;
  responsibleMemberId: string;
  deputyMemberIds?: string[];
  budget?: number;
  budgetUsed: number;
  maxParticipants?: number;
  registrationDeadline?: Date;
  ticketLink?: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy?: string;
  approvedAt?: Date;
  approvedBy?: string;
};

// ========== TASK ==========
export type Task = {
  id: string;
  titel: string;
  beschreibung?: string;
  context: TaskContext;
  verantwortlichId?: string;
  zugewiesenAn: string[];
  status: TaskStatus;
  prioritaet: TaskPriority;
  frist?: Date;
  materialien: TaskMaterial[];
  abhaengigVon?: string[];
  istStandardaufgabe: boolean;
  kategorie?: string;
  erstelltVon: string;
  erstelltAm: Date;
  aktualisiertAm: Date;
  erledigtAm?: Date;
  erledigtVon?: string;
  geloescht: boolean;
};

// ========== REQUESTS ==========
export type CreateMemberRequest = {
  memberType: "member" | "creator" | "sponsor" | "partner";
  vorname: string;
  nachname: string;
  email: string;
  telefon?: string;
  kuenstlername?: string;
  portfolio?: string;
  passwordOption: "none" | "generate" | "manual";
  password?: string;
  sendCredentials: boolean;
};

export type UpdateMemberRequest = {
  vorname?: string;
  nachname?: string;
  email?: string;
  telefon?: string;
  mitgliedsnummer?: string;
  istAktiv?: boolean;
  geburtsdatum?: string;
  adresse?: Adresse;
  iban?: string;
  notfallkontakt?: Notfallkontakt;
};

export type CreateEventRequest = {
  title: string;
  description: string;
  shortDescription?: string;
  date: string;
  time: string;
  location: EventLocation;
  type: EventType;
  responsibleMemberId: string;
  isPublic?: boolean;
};

export type CreateTaskRequest = {
  titel: string;
  beschreibung?: string;
  context_type: "event" | "team" | "general";
  context_id?: string;
  verantwortlich_id?: string;
  prioritaet?: TaskPriority;
  frist?: string;
  materialien?: Array<{
    name: string;
    menge: number;
    einheit: string;
    beschreibung?: string;
  }>;
  abhaengig_von?: string[];
  kategorie?: string;
};

// ========== RESPONSES ==========
export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  meta?: Record<string, any>;
};

export type PaginatedResponse<T = any> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    filtered?: boolean;
  };
};
