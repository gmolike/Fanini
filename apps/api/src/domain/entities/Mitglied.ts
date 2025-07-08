// Eine Entität ist wie ein Bauplan - sie beschreibt, wie ein "Mitglied" aussieht

export interface Mitglied {
  // Identifikation
  id: string;                    // Eindeutige ID (z.B. "usr_123abc")
  easyVereinId?: string;         // ID von EasyVerein (wenn vorhanden)

  // Persönliche Daten
  vorname: string;               // Max
  nachname: string;              // Mustermann
  email: string;                 // max@example.com
  telefon?: string;              // Optional: +49 123 456789

  // Status
  istAktiv: boolean;             // true = aktives Mitglied
  hatVertraulichkeitserklaerung: boolean; // Hat Vertraulichkeitserklärung unterschrieben?
  mitgliedSeit: Date;            // Wann ist die Person beigetreten?
  austrittsDatum?: Date;         // Falls ausgetreten

  // Profil
  profilbild?: string;           // URL zum Profilbild
  beschreibung?: string;         // "Ich bin Fan seit..."

  // Sichtbarkeit (wer darf was sehen?)
  sichtbarkeitEmail: Sichtbarkeit;
  sichtbarkeitTelefon: Sichtbarkeit;
  sichtbarkeitProfil: Sichtbarkeit;

  // Metadaten (automatisch gefüllt)
  erstelltAm: Date;
  aktualisiertAm: Date;
  letzterLogin?: Date;
}

// Enum = Eine Liste von festen Werten
export enum Sichtbarkeit {
  OEFFENTLICH = "oeffentlich",   // Jeder kann es sehen
  INTERN = "intern",             // Nur Mitglieder
  VORSTAND = "vorstand",         // Nur Vorstand
  PRIVAT = "privat"              // Nur ich selbst
}

// Type für neue Mitglieder (ohne ID und Metadaten)
export type CreateMitgliedDto = Omit<
  Mitglied,
  'id' | 'erstelltAm' | 'aktualisiertAm' | 'letzterLogin'
>;

// Type für Updates (alles optional)
export type UpdateMitgliedDto = Partial<
  Omit<Mitglied, 'id' | 'erstelltAm' | 'aktualisiertAm'>
>;
