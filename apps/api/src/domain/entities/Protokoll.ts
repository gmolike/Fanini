// apps/api/src/domain/entities/Protokoll.ts
import { generateId } from "@faninitiative/shared";
import type { Prioritaet } from "./Benachrichtigung";

export type ProtokollTyp = "vorstandssitzung" | "mitgliederversammlung" | "beiratssitzung" | "sonstiges";
export type ProtokollStatus = "entwurf" | "genehmigt";

/**
 * Tagesordnungspunkt
 * @description Punkt einer Sitzung
 */
export type Tagesordnungspunkt = {
  readonly id: string;
  readonly protokollId?: string;
  readonly titel: string;
  readonly beschreibung?: string;
  readonly prioritaet: Prioritaet;
  readonly eingereichtVon: string;
  readonly eingereichtAm: Date;
  readonly bereichId: string;
  readonly ergebnis?: string;
  readonly massnahmen?: string[];
  eingereichtVonName?: string;
};

/**
 * Protokoll Entity
 * @description Sitzungsprotokoll
 */
export type Protokoll = {
  readonly id: string;
  readonly bereichId: string;
  readonly datum: Date;
  readonly titel: string;
  readonly typ: ProtokollTyp;
  readonly teilnehmerIds: string[];
  readonly protokollantId: string;
  readonly sitzungsleiterId: string;
  readonly status: ProtokollStatus;
  readonly inhalt?: string;
  readonly genehmigtAm?: Date;
  readonly genehmigtVon?: string;
  readonly erstelltAm: Date;
  readonly aktualisiertAm: Date;
  readonly tagesordnungspunkte: Tagesordnungspunkt[];
  metadata?: {
    protokollantName?: string;
    sitzungsleiterName?: string;
    punktCount?: number;
  };
};
