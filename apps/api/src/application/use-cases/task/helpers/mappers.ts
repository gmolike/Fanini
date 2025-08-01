// apps/api/src/application/use-cases/task/helpers/mappers.ts
import type {
  TaskListDTO,
  TaskDetailDTO,
  TaskCommentDTO,
  UserReferenceDTO,
  TaskDependencyDTO,
  TaskPermissionsDTO,
} from "@/application/dto/task";
import type { Task } from "@/domain/entities/Task";
import type { TaskComment } from "@/domain/entities/TaskComment";
import type { IMemberRepository } from "@/domain/repositories/IMemberRepository";
import type { ITaskRepository } from "@/domain/repositories/ITaskRepository";
import {
  canChangeTaskStatus,
  canEditTask,
  canDeleteTask,
  canAssignTask,
} from "./permissions";
import { convertTaskContext } from "./utils";

/**
 * Mappt eine Task-Entität zu einem ListDTO
 */
export const mapTaskToListDTO = async (
  task: Task,
  userId: string,
  userRole: string,
  memberRepository: IMemberRepository,
  taskRepository: ITaskRepository,
  istBlockiert?: boolean,
): Promise<TaskListDTO> => {
  // Lade benötigte Daten parallel
  const [verantwortlicher, zugewiesenePersonen, ersteller] = await Promise.all([
    task.verantwortlichId
      ? memberRepository.findById(task.verantwortlichId)
      : null,
    Promise.all(
      task.zugewiesenAn.map(async (id) => {
        const member = await memberRepository.findById(id);
        return member
          ? {
              id: member.id,
              name: `${member.vorname} ${member.nachname}`,
              avatarUrl: member.profilbild,
            }
          : null;
      }),
    ),
    memberRepository.findById(task.erstelltVon),
  ]);

  // Erstelle Permissions
  const permissions: TaskPermissionsDTO = {
    canEdit: canEditTask(task, userId, userRole),
    canDelete: canDeleteTask(task, userId, userRole),
    canChangeStatus: canChangeTaskStatus(task, userId, userRole),
    canAssign: canAssignTask(task, userId, userRole),
    canComment: true,
    canViewDetails: true,
  };

  return {
    id: task.id,
    titel: task.titel,
    status: task.status,
    prioritaet: task.prioritaet,
    frist: task.frist?.toISOString(),
    verantwortlicher: verantwortlicher
      ? {
          id: verantwortlicher.id,
          name: `${verantwortlicher.vorname} ${verantwortlicher.nachname}`,
          avatarUrl: verantwortlicher.profilbild,
        }
      : undefined,
    zugewiesenePersonen: zugewiesenePersonen.filter(
      Boolean,
    ) as UserReferenceDTO[],
    istStandardaufgabe: task.istStandardaufgabe,
    istBlockiert: istBlockiert ?? task.status === "blockiert",
    // istUeberfaellig entfernt - nicht in TaskListDTO
    erstelltVon: {
      id: task.erstelltVon,
      name: ersteller
        ? `${ersteller.vorname} ${ersteller.nachname}`
        : "Unbekannt",
    },
    erstelltAm: task.erstelltAm.toISOString(),
    context: convertTaskContext(task.context),
    permissions,
  };
};

/**
 * Mappt mehrere Tasks zu ListDTOs
 */
export const mapTasksToListDTOs = async (
  tasks: Task[],
  userId: string,
  userRole: string,
  memberRepository: IMemberRepository,
  taskRepository: ITaskRepository,
  blockedTaskIds?: string[],
): Promise<TaskListDTO[]> => {
  return Promise.all(
    tasks.map((task) =>
      mapTaskToListDTO(
        task,
        userId,
        userRole,
        memberRepository,
        taskRepository,
        blockedTaskIds?.includes(task.id),
      ),
    ),
  );
};

/**
 * Mappt Task zu DetailDTO
 */
export const mapTaskToDetailDTO = async (
  task: Task,
  userId: string,
  userRole: string,
  memberRepository: IMemberRepository,
  taskRepository: ITaskRepository,
): Promise<TaskDetailDTO> => {
  // Lade alle benötigten Daten parallel
  const [verantwortlicher, zugewiesenePersonen, comments, dependentTasks] =
    await Promise.all([
      task.verantwortlichId
        ? memberRepository.findById(task.verantwortlichId)
        : null,
      Promise.all(task.zugewiesenAn.map((id) => memberRepository.findById(id))),
      taskRepository.getComments
        ? await taskRepository.getComments(task.id)
        : [],
      task.abhaengigVon
        ? Promise.all(
            task.abhaengigVon.map((id) => taskRepository.findById(id)),
          )
        : [],
    ]);

  // Mappe Kommentare mit Autor-Informationen
  const kommentare: TaskCommentDTO[] = await mapComments(
    comments,
    memberRepository,
  );

  // Erstelle Abhängigkeiten-DTOs mit korrekter Struktur inkl. status
  const abhaengigVon: TaskDependencyDTO[] | undefined = task.abhaengigVon
    ? dependentTasks.map((depTask, index) => ({
        taskId: task.abhaengigVon![index],
        titel: depTask?.titel || "Unbekannte Aufgabe",
        status: depTask?.status || "offen", // Status hinzugefügt
        istErledigt: depTask?.status === "erledigt",
        blockiertAktuell: depTask?.status !== "erledigt",
      }))
    : undefined;

  // Erstelle Permissions
  const permissions: TaskPermissionsDTO = {
    canEdit: canEditTask(task, userId, userRole),
    canDelete: canDeleteTask(task, userId, userRole),
    canChangeStatus: canChangeTaskStatus(task, userId, userRole),
    canAssign: canAssignTask(task, userId, userRole),
    canComment: true,
    canViewDetails: true,
  };

  return {
    id: task.id,
    titel: task.titel,
    beschreibung: task.beschreibung,
    context: convertTaskContext(task.context),
    verantwortlicher: verantwortlicher
      ? {
          id: verantwortlicher.id,
          name: `${verantwortlicher.vorname} ${verantwortlicher.nachname}`,
          avatarUrl: verantwortlicher.profilbild,
        }
      : undefined,
    zugewiesenePersonen: zugewiesenePersonen.filter(Boolean).map((m) => ({
      id: m!.id,
      name: `${m!.vorname} ${m!.nachname}`,
      avatarUrl: m!.profilbild,
    })),
    status: task.status,
    prioritaet: task.prioritaet,
    frist: task.frist?.toISOString(),
    materialien: task.materialien,
    abhaengigVon,
    istStandardaufgabe: task.istStandardaufgabe,
    kategorie: task.kategorie,
    erstelltAm: task.erstelltAm.toISOString(),
    aktualisiertAm: task.aktualisiertAm.toISOString(),
    erledigtAm: task.erledigtAm?.toISOString(),
    erledigtVon: task.erledigtVon,
    // istUeberfaellig entfernt - prüfe ob es in TaskDetailDTO existiert
    kommentare,
    permissions,
  };
};

/**
 * Hilfsfunktion zum Mappen von Kommentaren
 */
const mapComments = async (
  comments: TaskComment[],
  memberRepository: IMemberRepository,
): Promise<TaskCommentDTO[]> => {
  return Promise.all(
    comments.map(async (comment) => {
      // Lade Autor
      const autor = await memberRepository.findById(comment.autorId);

      // Lade erwähnte Personen
      const erwaehntePersonen = await Promise.all(
        comment.erwaehntePersonen.map(async (id) => {
          const person = await memberRepository.findById(id);
          return person
            ? {
                id: person.id,
                name: `${person.vorname} ${person.nachname}`,
                avatarUrl: person.profilbild,
              }
            : null;
        }),
      );

      return {
        id: comment.id,
        text: comment.text,
        autor: {
          id: comment.autorId,
          name: autor ? `${autor.vorname} ${autor.nachname}` : "Unbekannt",
          avatarUrl: autor?.profilbild,
        },
        erstelltAm: comment.erstelltAm.toISOString(),
        erwaehntePersonen: erwaehntePersonen.filter(
          Boolean,
        ) as UserReferenceDTO[],
        istIntern: true,
      };
    }),
  );
};

/**
 * Mappt Task zu Summary DTO (falls benötigt)
 */
export const mapTaskToSummaryDTO = (task: Task) => ({
  id: task.id,
  titel: task.titel,
  status: task.status,
  prioritaet: task.prioritaet,
  frist: task.frist?.toISOString(),
  context: convertTaskContext(task.context),
});
