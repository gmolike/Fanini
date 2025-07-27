// apps/api/src/application/dto/finance/AusgabeListDTO.ts

import { AusgabeKategorie, AusgabeStatus } from "@/domain/entities/Ausgabe";

/**
 * Public Ausgabe List DTO
 * @description Öffentlich sichtbare Ausgaben-Informationen für Listen
 */
export type PublicAusgabeListDTO = {
  readonly id: string;
  readonly eventId: string;
  readonly eventTitle: string;
  readonly betrag: number;
  readonly kategorie: AusgabeKategorie;
  readonly status: AusgabeStatus;
  readonly eingereichtAm: string;
};

/**
 * Internal Ausgabe List DTO
 * @description Erweiterte Ausgaben-Informationen für interne Nutzer
 */
export type InternalAusgabeListDTO = PublicAusgabeListDTO & {
  readonly beschreibung: string;
  readonly eingereichtVon: {
    readonly id: string;
    readonly name: string;
  };
  readonly genehmigtVon?: {
    readonly id: string;
    readonly name: string;
  };
  readonly genehmigtAm?: string;
  readonly ablehnungsgrund?: string;
  readonly rechnungsnummer?: string;
  readonly permissions: AusgabePermissionsDTO;
};

/**
 * Ausgabe Permissions DTO
 * @description Was darf der aktuelle Nutzer mit dieser Ausgabe?
 */
export type AusgabePermissionsDTO = {
  readonly canEdit: boolean;
  readonly canDelete: boolean;
  readonly canApprove: boolean;
  readonly canReject: boolean;
  readonly canViewReceipt: boolean;
};
