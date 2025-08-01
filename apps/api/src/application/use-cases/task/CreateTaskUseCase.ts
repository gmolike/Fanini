// apps/api/src/application/use-cases/task/CreateTaskUseCase.ts
import type { ITaskRepository } from "@/domain/repositories/ITaskRepository";
import type { IMemberRepository } from "@/domain/repositories/IMemberRepository";
import type { IEventRepository } from "@/domain/repositories/IEventRepository";
import type { AuditLogService } from "@/application/services/AuditLogService";
import type { CreateTaskDTO, TaskDetailDTO } from "@/application/dto/task";
import { createTask } from "@/domain/entities/Task";
import {
  createValidationError,
  createBusinessError,
  ERROR_CODES,
} from "@/application/dto/common";

/**
 * Create Task Parameters
 */
export type CreateTaskParams = {
  readonly data: CreateTaskDTO;
  readonly userId: string;
  readonly userRole: string;
  readonly userName?: string;
  readonly context?: {
    readonly ipAddress?: string;
    readonly userAgent?: string;
  };
};

/**
 * Create Task Result
 */
export type CreateTaskResult = {
  readonly success: boolean;
  readonly task?: TaskDetailDTO;
  readonly error?: any;
};

/**
 * Create Task Use Case
 * @description Erstellt eine neue Task mit Validierung und Audit Logging
 */
export type CreateTaskUseCase = {
  execute: (params: CreateTaskParams) => Promise<CreateTaskResult>;
};

/**
 * Factory für CreateTaskUseCase
 */
export const createCreateTaskUseCase = (
  taskRepository: ITaskRepository,
  memberRepository: IMemberRepository,
  eventRepository: IEventRepository,
  auditLogService: AuditLogService,
): CreateTaskUseCase => ({
  execute: async ({ data, userId, userRole, userName, context }) => {
    try {
      // 1. Berechtigungsprüfung basierend auf Context
      const canCreate = await canCreateTaskForContext(
        userRole,
        data.context.type,
        data.context.id,
        eventRepository,
      );

      if (!canCreate) {
        return {
          success: false,
          error: createPermissionError(
            "Task erstellen",
            `${data.context.type} context`,
          ),
        };
      }

      // 2. Context-Validierung
      if (data.context.type !== "general" && !data.context.id) {
        return {
          success: false,
          error: createValidationError(
            "context.id",
            "Context ID erforderlich für Event/Team Tasks",
          ),
        };
      }

      // 3. Verantwortlicher validieren
      if (data.verantwortlichId) {
        const responsible = await memberRepository.findById(
          data.verantwortlichId,
        );
        if (!responsible || !responsible.ist_aktiv) {
          return {
            success: false,
            error: createBusinessError(
              "Verantwortlicher muss ein aktives Mitglied sein",
              ERROR_CODES.BUSINESS_RULE_VIOLATION,
            ),
          };
        }
      }

      // 4. Zugewiesene Personen validieren
      if (data.zugewiesenAn && data.zugewiesenAn.length > 0) {
        for (const memberId of data.zugewiesenAn) {
          const member = await memberRepository.findById(memberId);
          if (!member || !member.ist_aktiv) {
            return {
              success: false,
              error: createBusinessError(
                `Mitglied ${memberId} ist nicht aktiv`,
                ERROR_CODES.BUSINESS_RULE_VIOLATION,
              ),
            };
          }
        }
      }

      // 5. Frist validieren
      if (data.frist) {
        const fristDate = new Date(data.frist);
        if (fristDate < new Date()) {
          return {
            success: false,
            error: createValidationError(
              "frist",
              "Frist muss in der Zukunft liegen",
            ),
          };
        }
      }

      // 6. Dependencies validieren
      if (data.abhaengigVon && data.abhaengigVon.length > 0) {
        const validationResult = await validateDependencies(
          data.abhaengigVon,
          data.context.id || "",
          taskRepository,
        );
        if (!validationResult.valid) {
          return {
            success: false,
            error: createBusinessError(validationResult.error!),
          };
        }
      }

      // 7. Task erstellen
      const task = createTask({
        titel: data.titel,
        beschreibung: data.beschreibung,
        context: {
          type: data.context.type,
          id: data.context.id || null,
        },
        verantwortlichId: data.verantwortlichId,
        prioritaet: data.prioritaet,
        frist: data.frist ? new Date(data.frist) : undefined,
        erstelltVon: userId,
      });

      // Erweiterte Felder
      const fullTask = {
        ...task,
        zugewiesenAn: data.zugewiesenAn || [],
        materialien:
          data.materialien?.map((m) => ({ ...m, besorgt: false })) || [],
        abhaengigVon: data.abhaengigVon,
        kategorie: data.kategorie,
        istStandardaufgabe: data.istStandardaufgabe || false,
      };

      // 8. Speichern
      const savedTask = await taskRepository.create(fullTask);

      // 9. Audit Log
      await auditLogService.logCreation({
        userId,
        userName,
        entityType: "task",
        entityId: savedTask.id,
        entityName: savedTask.titel,
        metadata: {
          context: data.context,
          priority: data.prioritaet,
          assigneeCount: data.zugewiesenAn?.length || 0,
          hasDependencies: !!data.abhaengigVon?.length,
          hasDeadline: !!data.frist,
        },
        context,
      });

      // 10. Zu DTO mappen
      const taskDto = await mapTaskToDetailDTO(
        savedTask,
        userId,
        userRole,
        memberRepository,
        taskRepository,
      );

      return {
        success: true,
        task: taskDto,
      };
    } catch (error) {
      console.error("CreateTaskUseCase error:", error);

      await auditLogService.logAction({
        userId,
        userName,
        action: "rejected",
        entityType: "task",
        entityId: "new",
        metadata: {
          error: (error as Error).message,
          context: data.context,
        },
        context,
      });

      return {
        success: false,
        error: createBusinessError(
          "Fehler beim Erstellen der Task",
          ERROR_CODES.SYSTEM_INTERNAL_ERROR,
        ),
      };
    }
  },
});

// Helper Functions
const canCreateTaskForContext = async (
  userRole: string,
  contextType: "event" | "team" | "general",
  contextId: string | undefined,
  eventRepository: IEventRepository,
): Promise<boolean> => {
  // Team Event darf immer Tasks erstellen
  if (["TEAM_EVENT", "BEIRAT", "VORSTAND", "ADMIN"].includes(userRole)) {
    return true;
  }

  // Bei Event-Context prüfen ob User beteiligt ist
  if (contextType === "event" && contextId) {
    const event = await eventRepository.findById(contextId);
    if (event) {
      // Verantwortlicher oder Stellvertreter dürfen Tasks erstellen
      return (
        event.responsibleMemberId === userId ||
        event.deputyMemberIds?.includes(userId) ||
        false
      );
    }
  }

  return false;
};

const validateDependencies = async (
  dependencyIds: string[],
  currentTaskId: string,
  taskRepository: ITaskRepository,
): Promise<{ valid: boolean; error?: string }> => {
  for (const depId of dependencyIds) {
    const depTask = await taskRepository.findById(depId);
    if (!depTask) {
      return {
        valid: false,
        error: `Abhängige Aufgabe ${depId} existiert nicht`,
      };
    }

    // Verhindere zirkuläre Abhängigkeiten
    if (depTask.abhaengigVon?.includes(currentTaskId)) {
      return {
        valid: false,
        error: "Zirkuläre Abhängigkeit erkannt",
      };
    }
  }

  return { valid: true };
};
