// apps/api/src/domain/entities/Ausgabe.ts
import { generateId } from "@faninitiative/shared";

export type AusgabeKategorie =
  | "material"
  | "verpflegung"
  | "reisekosten"
  | "marketing"
  | "technik"
  | "sonstiges";

export type AusgabeStatus = "eingereicht" | "genehmigt" | "abgelehnt";

/**
 * Ausgabe Entity
 * @description Repräsentiert eine Ausgabe/Kostenerstattung für ein Event
 */
export type Ausgabe = {
  readonly id: string;
  readonly eventId: string;
  readonly beschreibung: string;
  readonly betrag: number;
  readonly kategorie: AusgabeKategorie;
  readonly belegUrl?: string;
  readonly rechnungsnummer?: string;
  readonly status: AusgabeStatus;
  readonly eingereichtVon: string;
  readonly eingereichtAm: Date;
  readonly genehmigtVon?: string;
  readonly genehmigtAm?: Date;
  readonly ablehnungsgrund?: string;
  metadata?: {
    eventTitel?: string;
    einreicherName?: string;
  };
};

/**
 * Erstellt eine neue Ausgabe
 */
export const createAusgabe = (params: {
  eventId: string;
  beschreibung: string;
  betrag: number;
  kategorie: AusgabeKategorie;
  belegUrl?: string;
  rechnungsnummer?: string;
  eingereichtVon: string;
}): Ausgabe => ({
  id: generateId(),
  eventId: params.eventId,
  beschreibung: params.beschreibung,
  betrag: params.betrag,
  kategorie: params.kategorie,
  belegUrl: params.belegUrl,
  rechnungsnummer: params.rechnungsnummer,
  status: "eingereicht",
  eingereichtVon: params.eingereichtVon,
  eingereichtAm: new Date()
});

/**
 * Prüft ob Ausgabe bearbeitet werden kann
 */
export const canEditAusgabe = (ausgabe: Ausgabe, userId: string): boolean => {
  return ausgabe.status === "eingereicht" && ausgabe.eingereichtVon === userId;
};
