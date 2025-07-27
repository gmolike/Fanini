// apps/api/src/domain/entities/EmailVorlage.ts
import { generateId } from "@faninitiative/shared";

export type EmailKategorie =
  | "willkommen"
  | "event_einladung"
  | "event_erinnerung"
  | "event_absage"
  | "mitgliedschaft"
  | "newsletter"
  | "system";

/**
 * EmailVorlage Entity
 * @description Template für E-Mail-Kommunikation
 */
export type EmailVorlage = {
  readonly id: string;
  readonly titel: string;
  readonly betreff: string;
  readonly inhalt: string;
  readonly kategorie: EmailKategorie;
  readonly platzhalter: string[];
  readonly istAktiv: boolean;
  readonly erstelltAm: Date;
  readonly aktualisiertAm: Date;
};

/**
 * Erstellt eine neue E-Mail-Vorlage
 */
export const createEmailVorlage = (params: {
  titel: string;
  betreff: string;
  inhalt: string;
  kategorie: EmailKategorie;
}): Omit<EmailVorlage, "id" | "erstelltAm" | "aktualisiertAm" | "platzhalter"> => ({
  titel: params.titel,
  betreff: params.betreff,
  inhalt: params.inhalt,
  kategorie: params.kategorie,
  istAktiv: true
});
