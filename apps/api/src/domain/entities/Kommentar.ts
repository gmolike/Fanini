// apps/api/src/domain/entities/Kommentar.ts
import { generateId } from "@faninitiative/shared";

/**
 * Kommentar Entity
 * @description Kommentar zu Events, Aufgaben oder Dokumenten
 */
export type Kommentar = {
  readonly id: string;
  readonly text: string;
  readonly eventId?: string;
  readonly aufgabeId?: string;
  readonly dokumentId?: string;
  readonly autorId: string;
  readonly erstelltAm: Date;
  readonly erwaehntePersonenIds?: string[];
  readonly istIntern: boolean;
  autorName?: string;
  autorBild?: string;
};

/**
 * Erstellt einen neuen Kommentar
 */
export const createKommentar = (params: {
  text: string;
  autorId: string;
  eventId?: string;
  aufgabeId?: string;
  dokumentId?: string;
  erwaehntePersonenIds?: string[];
  istIntern?: boolean;
}): Kommentar => ({
  id: generateId(),
  text: params.text,
  autorId: params.autorId,
  eventId: params.eventId,
  aufgabeId: params.aufgabeId,
  dokumentId: params.dokumentId,
  erstelltAm: new Date(),
  erwaehntePersonenIds: params.erwaehntePersonenIds,
  istIntern: params.istIntern || false
});
