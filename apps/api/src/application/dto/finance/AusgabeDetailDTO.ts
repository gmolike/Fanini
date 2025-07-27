// apps/api/src/application/dto/finance/AusgabeDetailDTO.ts

import { AusgabeKategorie, AusgabeStatus } from "@/domain/entities";
import { AuditLogEntryDTO } from "../event";
import { AusgabePermissionsDTO } from "./AusgabeListDTO";
import { ApprovalRequestDTO } from "./ApprovalRequestDTO";

/**
 * Public Ausgabe Detail DTO
 * @description Öffentlich sichtbare detaillierte Ausgaben-Informationen
 */
export type PublicAusgabeDetailDTO = {
  readonly id: string;
  readonly event: {
    readonly id: string;
    readonly title: string;
    readonly date: string;
    readonly budget?: number;
    readonly budgetUsed: number;
  };
  readonly betrag: number;
  readonly kategorie: AusgabeKategorie;
  readonly status: AusgabeStatus;
  readonly eingereichtAm: string;
};

/**
 * Internal Ausgabe Detail DTO
 * @description Vollständige Ausgaben-Details für interne Nutzer
 */
export type InternalAusgabeDetailDTO = PublicAusgabeDetailDTO & {
  readonly beschreibung: string;
  readonly belegUrl?: string;
  readonly rechnungsnummer?: string;
  readonly eingereichtVon: UserReferenceDTO;
  readonly genehmigtVon?: UserReferenceDTO;
  readonly genehmigtAm?: string;
  readonly ablehnungsgrund?: string;
  readonly approvalRequest?: ApprovalRequestDTO;
  readonly metadata: AusgabeMetadataDTO;
  readonly permissions: AusgabePermissionsDTO;
  readonly auditLog?: AuditLogEntryDTO[];
};

/**
 * Helper Types
 */
export type UserReferenceDTO = {
  readonly id: string;
  readonly name: string;
  readonly email?: string;
  readonly role?: string;
};

export type AusgabeMetadataDTO = {
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly version: number;
  readonly hasBeenEdited: boolean;
  readonly editCount: number;
};
