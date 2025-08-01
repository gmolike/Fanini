// apps/api/src/application/use-cases/task/AssignTaskUseCase.ts
import type { ITaskRepository } from "@/domain/repositories/ITaskRepository";
import type { IMemberRepository } from "@/domain/repositories/IMemberRepository";
import type { IBenachrichtigungRepository } from "@/domain/repositories/IBenachrichtigungRepository";
import type { AuditLogService } from "@/application/services/AuditLogService";
import { createBenachrichtigung } from "@/domain/entities/Benachrichtigung";
import {
  createNotFoundError,
  createPermissionError,
  createBusinessError
} from "@/application/dto/common";

/**
 * Assign Task Parameters
 */
export type AssignTaskParams = {
  readonly taskId: string;
  readonly memberIds: string[];
  readonly kommentar?: string;
  readonly userId: string;
  readonly userRole: string;
  readonly userName?: string;
};

/**
 * Assign Task Result
 */
export type AssignTaskResult = {
  readonly success: boolean;
  readonly error?: any;
  readonly assignedCount?: number;
};

/**
 * Assign Task Use Case
 * @description Weist eine Task Mitgliedern zu
 */
export type AssignTaskUseCase = {
  execute: (params: AssignTaskParams) => Promise<AssignTaskResult>;
};

export const createAssignTaskUseCase = (
  taskRepository: ITaskRepository,
  memberRepository: IMemberRepository,
  benachrichtigungRepository: IBenachrichtigungRepository,
  auditLogService: AuditLogService
): AssignTaskUseCase => ({
  execute: async ({ taskId, memberIds, kommentar, userId, userRole, userName }) => {
    try {
      // 1. Task laden
      const task = await taskRepository.findById(taskId);
      if (!task) {
        return {
          success: false,
          error: createNotFoundError("Task", taskId),
        };
      }

      // 2. Berechtigungsprüfung
      const canAssign = canAssignTask(task, userId, userRole);
      if (!canAssign) {
        return {
          success: false,
          error: createPermissionError("Task zuweisen"),
        };
      }

      // 3. Mitglieder validieren
      const validMembers = [];
      for (const memberId of memberIds) {
        const member = await memberRepository.findById(memberId);
        if (!member?.ist_aktiv) {
          return {
            success: false,
            error: createBusinessError(`Mitglied ${memberId} ist nicht aktiv`),
          };
        }
        validMembers.push(member);
      }

      // 4. Zuweisungen durchführen
      await taskRepository.assignMembers(taskId, memberIds, userId);

      // 5. System-Kommentar hinzufügen
      const memberNames = validMembers.map(m => `${m.vorname} ${m.nachname}`);
      const commentText = `Mitglieder zugewiesen: ${memberNames.join(", ")}${
        kommentar ? `\n${kommentar}` : ""
      }`;

      await taskRepository.addComment({
        taskId,
        autorId: userId,
        text: commentText,
        erwaehntePersonen: memberIds,
      });

      // 6. Benachrichtigungen erstellen
      for (const member of validMembers) {
        if (member.id !== userId) { // Nicht sich selbst benachrichtigen
          const benachrichtigung = createBenachrichtigung({
            empfaengerId: member.id,
            typ: "aufgabe_zugewiesen",
            titel: "Neue Aufgabe zugewiesen",
            nachricht: `${userName || "Ein Teammitglied"} hat Ihnen die Aufgabe "${task.titel}" zugewiesen.`,
            kontextTyp: "task",
            kontextId: taskId,
            prioritaet: task.prioritaet === "kritisch" ? "hoch" : "medium",
          });

          await benachrichtigungRepository.create(benachrichtigung);
        }
      }

      // 7. Audit Log
      await auditLogService.logAction({
        userId,
        userName,
        action: "assigned",
        entityType: "task",
        entityId: taskId,
        entityName: task.titel,
        metadata: {
          assignedMembers: memberIds,
          memberNames,
          comment: kommentar,
        },
      });

      return {
        success: true,
        assignedCount: memberIds.length,
      };

    } catch (error) {
      console.error("AssignTaskUseCase error:", error);
      return {
        success: false,
        error: createBusinessError("Fehler beim Zuweisen der Task"),
      };
    }
  },
});

const canAssignTask = (task: any, userId: string, userRole: string): boolean => {
  if (["ADMIN", "VORSTAND", "BEIRAT"].includes(userRole)) return true;
  return task.verantwortlichId === userId;
};
