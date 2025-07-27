// apps/api/src/application/use-cases/member/GetMemberByIdUseCase.ts

import type {
  AuditLogEntryDTO,
  InternalMemberDetailDTO,
  MemberPermissionsDTO,
  PublicMemberDetailDTO,
} from "@/application/dto/member";
import type { MemberDataFilterService } from "@/application/services/MemberDataFilterService";
import type { ICreatorRepository } from "@/domain/repositories/ICreatorRepository";
import type { IEventRepository } from "@/domain/repositories/IEventRepository";
import type { IMemberRepository } from "@/domain/repositories/IMemberRepository";
import type { ITaskRepository } from "@/domain/repositories/ITaskRepository";
import type { Permission } from "@/domain/value-objects/Permission";

/**
 * Get Member By Id Parameters
 */
export type GetMemberByIdParams = {
  /** Member ID */
  readonly id: string;
  /** User ID (optional für öffentliche Ansicht) */
  readonly userId?: string;
  /** User Role (optional für öffentliche Ansicht) */
  readonly userRole?: string;
  /** User Permissions (optional für öffentliche Ansicht) */
  readonly userPermissions?: Permission[];
};

/**
 * Get Member By Id Result
 */
export type GetMemberByIdResult =
  | PublicMemberDetailDTO
  | InternalMemberDetailDTO
  | null;

/**
 * Get Member By Id Use Case
 * @description Lädt Mitglieder-Details basierend auf Berechtigungen
 */
export type GetMemberByIdUseCase = {
  execute: (params: GetMemberByIdParams) => Promise<GetMemberByIdResult>;
};

/**
 * Factory für GetMemberByIdUseCase
 */
export const createGetMemberByIdUseCase = (
  memberRepository: IMemberRepository,
  eventRepository: IEventRepository,
  taskRepository: ITaskRepository,
  creatorRepository: ICreatorRepository,
  memberDataFilterService: MemberDataFilterService,
): GetMemberByIdUseCase => ({
  execute: async ({ id, userId, userRole, userPermissions }) => {
    // 1. Lade Mitglied
    const member = await memberRepository.findById(id);
    if (!member || (!member.ist_aktiv && userRole !== "ADMIN")) {
      return null;
    }

    // 2. Basis-Daten für öffentliche Ansicht
    const publicEvents = await eventRepository.findAll({
      responsibleId: member.id,
      isPublic: true,
      status: "genehmigt",
    });

    // 3. Creator-Profil laden
    let creatorProfile = null;
    if (member.is_creator) {
      creatorProfile = await creatorRepository.findByMemberId(member.id);
    }

    // 4. Öffentliche Ansicht
    if (!userId || !userPermissions) {
      const publicDTO: PublicMemberDetailDTO = {
        id: member.id,
        name: `${member.vorname} ${member.nachname}`,
        memberSince: member.mitglied_seit.toISOString(),
        avatarUrl: member.profilbild,
        description: member.beschreibung,
        publicEvents: publicEvents.map((event) => ({
          id: event.id,
          title: event.title,
          date: event.date.toISOString(),
          role: "responsible",
        })),
        creatorProfile: creatorProfile
          ? {
              id: creatorProfile.id,
              artistName: creatorProfile.artistName,
              types: creatorProfile.types || [],
              portfolioUrl: creatorProfile.portfolio,
              workCount: creatorProfile.works?.length || 0,
            }
          : undefined,
        publicRoles: member.public_roles || [],
      };

      return publicDTO;
    }

    // 5. Interne Ansicht - Permission-basierte Filterung
    const filteredMember = memberDataFilterService.filterMemberData(
      member,
      userPermissions,
    );

    // 6. Zusätzliche Daten für interne Ansicht
    const [tasks, allEvents] = await Promise.all([
      taskRepository.findAll({
        zugewiesenAn: member.id,
        nurAktive: true,
      }),
      eventRepository.findAll(), // Lade alle Events
    ]);

    // 7. Finde Events wo das Mitglied Teilnehmer ist
    const eventParticipations = [];
    for (const event of allEvents) {
      const participants = await eventRepository.getParticipants(event.id);
      const participation = participants.find((p) => p.id === member.id);
      if (participation) {
        eventParticipations.push({
          eventId: event.id,
          eventTitle: event.title,
          date: event.date.toISOString(),
          status: participation.status as
            | "registered"
            | "attended"
            | "cancelled",
          registeredAt: participation.registeredAt.toISOString(),
        });
      }
    }

    // 8. Audit Log - Nur wenn explizit implementiert
    const auditLog: AuditLogEntryDTO[] = [];
    // TODO: Wenn Audit-Log Feature implementiert wird, hier aktivieren
    // if ((userRole === "VORSTAND" || userRole === "ADMIN") && eventRepository.getAuditLog) {
    //   const eventAuditEntries = await eventRepository.getAuditLog(member.id);
    //   auditLog.push(...mapAuditEntries(eventAuditEntries));
    // }

    // 9. Berechne Permissions
    const permissions = getMemberPermissions(
      member,
      userId,
      userRole!,
      userPermissions,
    );

    // 10. Erstelle Internal DTO
    const internalDTO: InternalMemberDetailDTO = {
      // Public fields
      id: member.id,
      name: `${member.vorname} ${member.nachname}`,
      memberSince: member.mitglied_seit.toISOString(),
      avatarUrl: member.profilbild,
      description: member.beschreibung,
      publicEvents: publicEvents.map((event) => ({
        id: event.id,
        title: event.title,
        date: event.date.toISOString(),
        role: "responsible",
      })),
      creatorProfile: creatorProfile
        ? {
            id: creatorProfile.id,
            artistName: creatorProfile.artistName,
            types: creatorProfile.types || [],
            portfolioUrl: creatorProfile.portfolio,
            workCount: creatorProfile.works?.length || 0,
          }
        : undefined,
      publicRoles: member.public_roles || [],

      // Internal fields (permission-basiert)
      email: permissions.canViewEmail ? filteredMember.email : undefined,
      phone: permissions.canViewPhone ? filteredMember.telefon : undefined,
      address:
        permissions.canViewAddress && member.adresse
          ? {
              street: member.adresse.strasse,
              houseNumber: member.adresse.hausnummer,
              zipCode: member.adresse.plz,
              city: member.adresse.stadt,
              country: member.adresse.land,
            }
          : undefined,
      birthdate: permissions.canViewSensitive
        ? member.geburtsdatum?.toISOString()
        : undefined,
      memberNumber: member.mitgliedsnummer,
      roles:
        member.roles?.map((role: any) => ({
          id: role.id,
          name: role.name,
          displayName: role.display_name,
          assignedAt: role.assigned_at.toISOString(),
          assignedBy: role.assigned_by,
        })) || [],
      assignedTasks: tasks.map((task) => ({
        id: task.id,
        title: task.titel,
        status: task.status,
        priority: task.prioritaet,
        deadline: task.frist?.toISOString(),
      })),
      eventParticipations,
      contactPreferences: member.contact_preferences
        ? {
            preferredChannel: member.contact_preferences.preferred_channel,
            newsletterSubscribed: member.contact_preferences.newsletter,
            eventReminders: member.contact_preferences.event_reminders,
            taskNotifications: member.contact_preferences.task_notifications,
          }
        : undefined,
      visibilitySettings: {
        emailVisibility: member.sichtbarkeit_email || "private",
        phoneVisibility: member.sichtbarkeit_telefon || "private",
        addressVisibility: member.sichtbarkeit_adresse || "private",
        profileVisibility: member.sichtbarkeit_profil || "members",
      },
      permissions,
      metadata: {
        createdAt: member.erstellt_am.toISOString(),
        updatedAt: member.aktualisiert_am.toISOString(),
        lastLogin: member.letzter_login?.toISOString(),
        loginCount: member.login_count || 0,
        isActive: member.ist_aktiv,
        hasConfidentialityAgreement: member.hat_vertraulichkeitserklaerung,
        authSource: member.auth_source || "easyverein",
      },
      auditLog: auditLog.length > 0 ? auditLog : undefined,
    };

    return internalDTO;
  },
});

// Helper Funktion
const getMemberPermissions = (
  member: any,
  userId: string,
  userRole: string,
  userPermissions: Permission[],
): MemberPermissionsDTO => {
  const isOwnProfile = member.user_id === userId;
  const isAdmin = userRole === "ADMIN";
  const isVorstand = userRole === "VORSTAND";
  const isBeirat = userRole === "BEIRAT";

  const hasPermission = (permission: string): boolean => {
    return userPermissions.some(
      (p) =>
        p.resource === "*" ||
        (p.resource === "member" &&
          (p.action === "*" || p.action === permission.split(".")[1])),
    );
  };

  return {
    canViewEmail: isOwnProfile || hasPermission("member.view_contact"),
    canViewPhone: isOwnProfile || hasPermission("member.view_contact"),
    canViewAddress: isOwnProfile || hasPermission("member.view_sensitive"),
    canViewSensitive: isOwnProfile || hasPermission("member.view_sensitive"),
    canEdit: isOwnProfile || hasPermission("member.edit_all"),
    canEditRoles: hasPermission("member.assign_role"),
    canDeactivate: isAdmin || isVorstand,
    canViewAuditLog: isAdmin || isVorstand,
  };
};
