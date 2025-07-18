import type { MemberRole, SensitivityLevel } from './types';

/**
 * Prüft ob ein Nutzer sensitive Daten sehen darf
 */
export const canViewSensitiveData = (
  userRole: MemberRole | undefined,
  sensitivityLevel: SensitivityLevel
): boolean => {
  if (!userRole) return false;

  const roleHierarchy: Record<MemberRole, number> = {
    ADMIN: 100,
    VORSTAND: 90,
    BEIRAT: 80,
    KASSENPRUFER: 70,
    TEAM_EVENT: 60,
    TEAM_TECHNIK: 60,
    TEAM_MEDIEN: 60,
    TEAM_VEREIN: 50,
    MITGLIED: 10,
  };

  const sensitivityThresholds: Record<SensitivityLevel, number> = {
    none: 0,
    low: 50,
    medium: 70,
    high: 80,
    critical: 90,
  };

  const userLevel = roleHierarchy[userRole];
  const requiredLevel = sensitivityThresholds[sensitivityLevel];

  return userLevel >= requiredLevel;
};

/**
 * Prüft ob ein Nutzer ein Mitglied bearbeiten darf
 */
export const canEditMember = (
  userRole: MemberRole | undefined,
  targetMemberId: string,
  currentUserId: string
): boolean => {
  if (!userRole) return false;

  // Jeder kann sein eigenes Profil bearbeiten
  if (targetMemberId === currentUserId) return true;

  // Nur bestimmte Rollen können andere bearbeiten
  return ['ADMIN', 'VORSTAND', 'BEIRAT', 'TEAM_VEREIN'].includes(userRole);
};

/**
 * Prüft ob Änderungen eine Genehmigung benötigen
 */
export const needsApproval = (userRole: MemberRole | undefined): boolean => {
  return userRole === 'TEAM_VEREIN';
};
