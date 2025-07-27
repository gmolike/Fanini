// apps/api/src/domain/entities/Benachrichtigung.ts
import { generateId } from "@faninitiative/shared";

export type BenachrichtigungTyp =
  | "event_anmeldung"
  | "event_erinnerung"
  | "aufgabe_zugewiesen"
  | "aufgabe_faellig"
  | "erwaehnung"
  | "genehmigung_erforderlich"
  | "genehmigung_erteilt"
  | "genehmigung_abgelehnt"
  | "system";

export type Prioritaet = "niedrig" | "medium" | "hoch" | "kritisch";

/**
 * Benachrichtigung Entity
 * @description System-Benachrichtigung an einen Empfänger
 */
export type Benachrichtigung = {
  readonly id: string;
  readonly empfaengerId: string;
  readonly typ: BenachrichtigungTyp;
  readonly titel: string;
  readonly nachricht: string;
  readonly kontextTyp?: string;
  readonly kontextId?: string;
  readonly gelesen: boolean;
  readonly gelesenAm?: Date;
  readonly versendetAm: Date;
  readonly prioritaet: Prioritaet;
};

/**
 * Erstellt eine neue Benachrichtigung
 */
export const createBenachrichtigung = (params: {
  empfaengerId: string;
  typ: BenachrichtigungTyp;
  titel: string;
  nachricht: string;
  kontextTyp?: string;
  kontextId?: string;
  prioritaet?: Prioritaet;
}): Benachrichtigung => ({
  id: generateId(),
  empfaengerId: params.empfaengerId,
  typ: params.typ,
  titel: params.titel,
  nachricht: params.nachricht,
  kontextTyp: params.kontextTyp,
  kontextId: params.kontextId,
  gelesen: false,
  versendetAm: new Date(),
  prioritaet: params.prioritaet || "medium"
});
