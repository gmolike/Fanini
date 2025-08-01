// apps/api/src/application/use-cases/task/helpers.ts

import { TaskListDTO, TaskPermissionsDTO } from "@/application/dto/task/TaskListDTO";
import { Task, TaskContext } from "@/domain/entities";
import { IMemberRepository, ITaskRepository } from "@/domain/repositories";

/**
 * Mappt Tasks zu List DTOs
 */
export const mapTasksToListDTOs = async (
  tasks: Task[],
  userId: string,
  userRole: string,
  memberRepository: IMemberRepository,
  taskRepository: ITaskRepository,
  blockedTaskIds: Set<string>
): Promise<TaskListDTO[]> => {
  return Promise.all(
    tasks.map(async (task) => {
      // Batch-Load für Performance
      const [verantwortlicher, assignees, ersteller, contextName] = await Promise.all([
        task.verantwortlichId
          ? memberRepository.findById(task.verantwortlichId)
          : null,
        Promise.all(
          task.zugewiesenAn.map(id => memberRepository.findById(id))
        ),
        memberRepository.findById(task.erstelltVon),
        resolveContextName(task.context, taskRepository),
      ]);

      const dto: TaskListDTO = {
        id: task.id,
        titel: task.titel,
        beschreibung: task.beschreibung,
        status: task.status,
        prioritaet: task.prioritaet,
        frist: task.frist?.toISOString(),
        kategorie: task.kategorie,
        context: {
          type: task.context.type,
          id: task.context.id || undefined,
          name: contextName,
        },
        verantwortlicher: verantwortlicher
          ? {
              id: verantwortlicher.id,
              name: `${verantwortlicher.vorname} ${verantwortlicher.nachname}`,
              avatarUrl: verantwortlicher.profilbild,
            }
          : undefined,
        zugewiesenePersonen: assignees
          .filter(Boolean)
          .map(a => ({
            id: a.id,
            name: `${a.vorname} ${a.nachname}`,
            avatarUrl: a.profilbild,
          })),
        istStandardaufgabe: task.istStandardaufgabe,
        materialienStatus: task.materialien.length > 0
          ? {
              total: task.materialien.length,
              besorgt: task.materialien.filter(m => m.besorgt).length,
            }
          : undefined,
        abhaengigVon: task.abhaengigVon,
        istBlockiert: blockedTaskIds.has(task.id),
        erstelltVon: {
          id: ersteller?.id || task.erstelltVon,
          name: ersteller
            ? `${ersteller.vorname} ${ersteller.nachname}`
            : "Unbekannt",
        },
        erstelltAm: task.erstelltAm.toISOString(),
        aktualisiertAm: task.aktualisiertAm.toISOString(),
        completionPercentage: calculateCompletionPercentage(task),
        permissions: getTaskPermissions(task, userId, userRole),
      };

      return dto;
    })
  );
};

/**
 * Berechnet Task Permissions
 */
const getTaskPermissions = (
  task: Task,
  userId: string,
  userRole: string
): TaskPermissionsDTO => {
  const isAssigned = task.zugewiesenAn.includes(userId);
  const isResponsible = task.verantwortlichId === userId;
  const isCreator = task.erstelltVon === userId;
  const isLeadership = ["VORSTAND", "BEIRAT", "ADMIN"].includes(userRole);

  return {
    canEdit: isAssigned || isResponsible || isCreator || isLeadership,
    canDelete: (isCreator && task.status === "offen") || userRole === "ADMIN",
    canChangeStatus: isAssigned || isResponsible || isLeadership,
    canAssign: isResponsible || isLeadership,
    canComment: true,
    canViewDetails: true,
  };
};

/**
 * Prüft ob Task blockiert ist
 */
const isTaskBlocked = async (
  task: Task,
  taskRepository: ITaskRepository
): Promise<boolean> => {
  if (!task.abhaengigVon || task.abhaengigVon.length === 0) return false;

  const dependencies = await Promise.all(
    task.abhaengigVon.map(id => taskRepository.findById(id))
  );

  return dependencies.some(dep => dep && dep.status !== "erledigt");
};

/**
 * Löst Context-Namen auf
 */
const resolveContextName = async (
  context: TaskContext,
  repository: ITaskRepository
): Promise<string | undefined> => {
  // TODO: Event/Team Namen auflösen
  if (context.type === "event" && context.id) {
    // return eventRepository.findById(context.id)?.title;
  }
  return undefined;
};

/**
 * Berechnet Fortschritt in Prozent
 */
const calculateCompletionPercentage = (task: Task): number => {
  if (task.status === "erledigt") return 100;
  if (task.status === "review") return 90;
  if (task.status === "in_bearbeitung") return 50;
  if (task.status === "blockiert") return 0;
  return 0;
};
