// apps/api/src/domain/value-objects/SensitiveField.ts

/**
 * Sensitivity Level für Felder
 */
export type SensitivityLevel = 'low' | 'medium' | 'high' | 'critical';

/**
 * Sensitive Field Value Object
 * @description Definiert ein sensitives Feld und seine Zugriffsanforderungen
 */
export type SensitiveField = {
  readonly entityType: string;
  readonly fieldName: string;
  readonly sensitivityLevel: SensitivityLevel;
  readonly requiredPermission: string;
  readonly description?: string;
};

/**
 * Visibility Level für individuelle Einstellungen
 */
export type VisibilityLevel = 'private' | 'team' | 'members' | 'public';

/**
 * Field Visibility Override
 * @description Individuelle Sichtbarkeitseinstellung eines Mitglieds
 */
export type FieldVisibilityOverride = {
  readonly memberId: string;
  readonly fieldName: string;
  readonly visibilityLevel: VisibilityLevel;
};

/**
 * Mapping von Visibility Level zu benötigten Rollen
 */
export const visibilityToRoleMapping: Record<VisibilityLevel, string[]> = {
  private: [], // Nur der Benutzer selbst
  team: ['TEAM_EVENT', 'TEAM_MEDIEN', 'TEAM_TECHNIK', 'TEAM_VEREIN', 'BEIRAT', 'VORSTAND', 'ADMIN'],
  members: ['MITGLIED'], // Alle Mitglieder
  public: ['*'], // Öffentlich
};

/**
 * Standard Sensitive Fields für Mitglieder
 */
export const memberSensitiveFields: Record<string, SensitiveField> = {
  email: {
    entityType: 'member',
    fieldName: 'email',
    sensitivityLevel: 'medium',
    requiredPermission: 'member.view_contact',
    description: 'E-Mail Adresse'
  },
  telefon: {
    entityType: 'member',
    fieldName: 'telefon',
    sensitivityLevel: 'medium',
    requiredPermission: 'member.view_contact',
    description: 'Telefonnummer'
  },
  adresse: {
    entityType: 'member',
    fieldName: 'adresse',
    sensitivityLevel: 'high',
    requiredPermission: 'member.view_sensitive',
    description: 'Wohnadresse'
  },
  geburtsdatum: {
    entityType: 'member',
    fieldName: 'geburtsdatum',
    sensitivityLevel: 'high',
    requiredPermission: 'member.view_sensitive',
    description: 'Geburtsdatum'
  },
  iban: {
    entityType: 'member',
    fieldName: 'iban',
    sensitivityLevel: 'critical',
    requiredPermission: 'member.view_sensitive',
    description: 'Bankverbindung'
  },
  mitgliedsnummer: {
    entityType: 'member',
    fieldName: 'mitgliedsnummer',
    sensitivityLevel: 'medium',
    requiredPermission: 'member.view_basic',
    description: 'Mitgliedsnummer'
  }
};
