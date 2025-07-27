// apps/api/src/application/dto/member/MemberListDTO.ts

/**
 * Public Member List DTO
 * @description Öffentlich sichtbare Mitglieder-Informationen für Listen
 */
export type PublicMemberListDTO = {
  /** Member ID */
  readonly id: string;

  /** Vollständiger Name */
  readonly name: string;

  /** Mitglied seit (ISO 8601) */
  readonly memberSince: string;

  /** Profilbild URL */
  readonly avatarUrl?: string;

  /** Kurze Beschreibung */
  readonly description?: string;

  /** Ist Creator? */
  readonly isCreator?: boolean;

  /** Primäre Rolle (falls öffentlich sichtbar) */
  readonly primaryRole?: string;
};

/**
 * Internal Member List DTO
 * @description Erweiterte Mitglieder-Informationen für interne Nutzer
 */
export type InternalMemberListDTO = PublicMemberListDTO & {
  /** E-Mail (permission-basiert) */
  readonly email?: string;

  /** Telefon (permission-basiert) */
  readonly phone?: string;

  /** Alle Rollen */
  readonly roles: string[];

  /** Ist aktiv? */
  readonly isActive: boolean;

  /** Letzter Login (ISO 8601) */
  readonly lastLogin?: string;

  /** Hat Vertraulichkeitserklärung? */
  readonly hasConfidentialityAgreement: boolean;

  /** Benutzer-Berechtigungen für dieses Mitglied */
  readonly permissions: MemberPermissionsDTO;
};

/**
 * Member Permissions DTO
 * @description Was darf der aktuelle Nutzer mit diesem Mitglied?
 */
export type MemberPermissionsDTO = {
  readonly canViewEmail: boolean;
  readonly canViewPhone: boolean;
  readonly canViewAddress: boolean;
  readonly canViewSensitive: boolean;
  readonly canEdit: boolean;
  readonly canEditRoles: boolean;
  readonly canDeactivate: boolean;
  readonly canViewAuditLog: boolean;
};
