import { Task } from "@/domain/entities/Task";
import { ITaskRepository } from "@/domain/repositories/ITaskRepository";
import { IPermissionService } from "@/domain/services/IPermissionService";
import { IMemberRepository } from "@/domain/repositories/IMemberRepository";

export type GetTaskByIdParams = {
  id: string;
  userId: string;
  userRole: string;
};

export type TaskWithDetails = Task & {
  verantwortlicher?: {
    id: string;
    name: string;
  };
  zugewiesenePersonen: Array<{
    id: string;
    name: string;
    zugewiesenAm: Date;
  }>;
  kommentare: Array<{
    id: string;
    text: string;
    autor: {
      id: string;
      name: string;
    };
    erstelltAm: Date;
  }>;
  abhaengigeAufgaben?: Array<{
    id: string;
    titel: string;
    status: string;
  }>;
};

export class GetTaskByIdUseCase {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly memberRepository: IMemberRepository,
    private readonly permissionService: IPermissionService,
  ) {}

  async execute(params: GetTaskByIdParams): Promise<TaskWithDetails | null> {
    // 1. Task laden
    const task = await this.taskRepository.findById(params.id);
    if (!task) {
      return null;
    }

    // 2. Berechtigungsprüfung (synchron, nicht async)
    const canView = this.permissionService.canViewTask(
      params.userRole,
      params.userId,
      task,
    );
    if (!canView) {
      throw new Error("Keine Berechtigung zum Anzeigen dieser Aufgabe");
    }

    // 3. Details laden
    const [assignments, comments] = await Promise.all([
      this.taskRepository.getAssignments(task.id),
      this.taskRepository.getComments(task.id),
    ]);

    // 4. Verantwortlicher laden
    let verantwortlicher;
    if (task.verantwortlichId) {
      const member = await this.memberRepository.findById(
        task.verantwortlichId,
      );
      if (member) {
        verantwortlicher = {
          id: member.id,
          name: `${member.vorname} ${member.nachname}`,
        };
      }
    }

    // 5. Zugewiesene Personen mit Details
    const zugewiesenePersonen = await Promise.all(
      assignments.map(async (assignment) => {
        const member = await this.memberRepository.findById(
          assignment.mitgliedId,
        );
        return {
          id: assignment.mitgliedId,
          name: member ? `${member.vorname} ${member.nachname}` : "Unbekannt",
          zugewiesenAm: assignment.zugewiesenAm,
        };
      }),
    );

    // 6. Kommentare mit Autor-Details
    const kommentare = await Promise.all(
      comments.map(async (comment) => {
        const autor = await this.memberRepository.findById(comment.autorId);
        return {
          id: comment.id,
          text: comment.text,
          autor: {
            id: comment.autorId,
            name: autor ? `${autor.vorname} ${autor.nachname}` : "Unbekannt",
          },
          erstelltAm: comment.erstelltAm,
        };
      }),
    );

    // 7. Abhängige Aufgaben laden
    let abhaengigeAufgaben;
    if (task.abhaengigVon && task.abhaengigVon.length > 0) {
      const dependencies = await Promise.all(
        task.abhaengigVon.map(async (depId) => {
          const depTask = await this.taskRepository.findById(depId);
          return depTask
            ? {
                id: depTask.id,
                titel: depTask.titel,
                status: depTask.status,
              }
            : null;
        }),
      );
      abhaengigeAufgaben = dependencies.filter((dep) => dep !== null) as Array<{
        id: string;
        titel: string;
        status: string;
      }>;
    }

    return {
      ...task,
      verantwortlicher,
      zugewiesenePersonen,
      kommentare,
      abhaengigeAufgaben,
    };
  }
}
