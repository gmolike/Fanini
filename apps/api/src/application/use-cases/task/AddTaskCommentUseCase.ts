// apps/api/src/application/use-cases/task/AddTaskCommentUseCase.ts
import type { ITaskRepository } from "@/domain/repositories/ITaskRepository";
import type { IMemberRepository } from "@/domain/repositories/IMemberRepository";
import type { AuditLogService } from "@/application/services/AuditLogService";
import type { TaskCommentDTO } from "@/application/dto/task";
import { createTaskComment } from "@/domain/entities/TaskComment";
import { createNotFoundError, createBusinessError } from "@/application/dto/common";

/**
 * Add Task Comment Parameters
 */
export type AddTaskCommentParams = {
  readonly taskId: string;
  readonly text: string;
  readonly erwaehntePersonen?: string[];
  readonly userId: string;
  readonly userRole: string;
  readonly userName?: string;
};

/**
 * Add Task Comment Result
 */
export type AddTaskCommentResult = {
  readonly success: boolean;
  readonly comment?: TaskCommentDTO;
  readonly error?: any;
};

/**
 * Add Task Comment Use Case
 * @description Fügt einen Kommentar zu einer Task hinzu
 */
export type AddTaskCommentUseCase = {
  execute: (params: AddTaskCommentParams) => Promise<AddTaskCommentResult>;
};

export const createAddTaskCommentUseCase = (
  taskRepository: ITaskRepository,
  memberRepository: IMemberRepository,
  auditLogService: AuditLogService
): AddTaskCommentUseCase => ({
  execute: async ({ taskId, text, erwaehntePersonen, userId, userRole, userName }) => {
    try {
      // 1. Task laden
      const task = await taskRepository.findById(taskId);
      if (!task) {
        return {
          success: false,
          error: createNotFoundError("Task", taskId),
        };
      }

      // 2. Erwähnte Personen validieren
      if (erwaehntePersonen && erwaehntePersonen.length > 0) {
        for (const personId of erwaehntePersonen) {
          const member = await memberRepository.findById(personId);
          if (!member) {
            return {
              success: false,
              error: createBusinessError(`Erwähnte Person ${personId} existiert nicht`),
            };
          }
        }
      }

      // 3. Kommentar erstellen
      const comment = await taskRepository.addComment({
        taskId,
        autorId: userId,
        text,
        erwaehntePersonen: erwaehntePersonen || [],
      });

      // 4. Autor-Details laden
      const autor = await memberRepository.findById(userId);

      // 5. Zu DTO mappen
      const commentDto: TaskCommentDTO = {
        id: comment.id,
        text: comment.text,
        autor: {
          id: userId,
          name: autor ? `${autor.vorname} ${autor.nachname}` : "Unbekannt",
          avatarUrl: autor?.profilbild,
        },
        erstelltAm: comment.erstelltAm.toISOString(),
        erwaehntePersonen: erwaehntePersonen ?
          await mapMemberReferences(erwaehntePersonen, memberRepository) : undefined,
        istIntern: true,
      };

      // 6. Audit Log
      await auditLogService.logAction({
        userId,
        userName,
        action: "created",
        entityType: "task",
        entityId: taskId,
        entityName: `Kommentar zu: ${task.titel}`,
        metadata: {
          commentLength: text.length,
          mentionedCount: erwaehntePersonen?.length || 0,
        },
      });

      return {
        success: true,
        comment: commentDto,
      };

    } catch (error) {
      console.error("AddTaskCommentUseCase error:", error);
      return {
        success: false,
        error: createBusinessError("Fehler beim Hinzufügen des Kommentars"),
      };
    }
  },
});

const mapMemberReferences = async (
  memberIds: string[],
  memberRepository: IMemberRepository
) => {
  const members = await Promise.all(
    memberIds.map(id => memberRepository.findById(id))
  );

  return members
    .filter(Boolean)
    .map(m => ({
      id: m!.id,
      name: `${m!.vorname} ${m!.nachname}`,
      avatarUrl: m!.profilbild,
    }));
};
