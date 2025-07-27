// apps/api/src/application/dto/finance/CreateAusgabeDTO.ts

import { AusgabeKategorie } from "@/domain/entities";

/**
 * Create Ausgabe DTO
 * @description Daten für Ausgaben-Erstellung
 */
export type CreateAusgabeDTO = {
  readonly eventId: string;
  readonly beschreibung: string;
  readonly betrag: number;
  readonly kategorie: AusgabeKategorie;
  readonly rechnungsnummer?: string;
  readonly belegFile?: FileUploadDTO;
};

/**
 * Update Ausgabe DTO
 * @description Daten für Ausgaben-Aktualisierung
 */
export type UpdateAusgabeDTO = {
  readonly beschreibung?: string;
  readonly betrag?: number;
  readonly kategorie?: AusgabeKategorie;
  readonly rechnungsnummer?: string;
  readonly belegFile?: FileUploadDTO;
  readonly changeComment?: string;
};

/**
 * Approve Ausgabe DTO
 * @description Daten für Ausgaben-Genehmigung
 */
export type ApproveAusgabeDTO = {
  readonly approvalComment?: string;
  readonly adjustedAmount?: number;
};

/**
 * Reject Ausgabe DTO
 * @description Daten für Ausgaben-Ablehnung
 */
export type RejectAusgabeDTO = {
  readonly rejectionReason: string;
  readonly suggestions?: string;
};

/**
 * File Upload DTO
 */
export type FileUploadDTO = {
  readonly fileName: string;
  readonly mimeType: string;
  readonly size: number;
  readonly base64Data: string;
};

/**
 * Validation Rules
 */
export const AUSGABE_VALIDATION = {
  betrag: {
    min: 0.01,
    max: 10000,
    required: true,
  },
  beschreibung: {
    minLength: 10,
    maxLength: 500,
    required: true,
  },
  rechnungsnummer: {
    pattern: /^[A-Z0-9\-\/]+$/,
    maxLength: 50,
    required: false,
  },
  beleg: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    required: false,
  }
} as const;
