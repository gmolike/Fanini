import { Task } from "@/domain/entities/Task";
import { ITaskRepository } from "@/domain/repositories/ITaskRepository";
import { IPermissionService } from "@/domain/services/IPermissionService";

export type CompleteTaskParams = {
  id: string;
  kommentar?: string;
  userId: string;
  userRole: string;
};

export class CompleteTaskUseCase {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly permissionService: IPermissionService,
  ) {}

  async execute(params: CompleteTaskParams): Promise<Task> {
    const task = await this.taskRepository.findById(params.id);
    if (!task) {
      throw new Error("Aufgabe nicht gefunden");
    }

    const canComplete = await this.permissionService.canChangeTaskStatus(
      params.userRole,
      params.userId,
      task,
      "erledigt",
    );
    if (!canComplete) {
      throw new Error("Keine Berechtigung zum Abschließen dieser Aufgabe");
    }

    // Prüfe Abhängigkeiten
    if (task.abhaengigVon && task.abhaengigVon.length > 0) {
      const dependencies = await Promise.all(
        task.abhaengigVon.map((id) => this.taskRepository.findById(id)),
      );

      const unfinished = dependencies.filter(
        (dep) => dep && dep.status !== "erledigt",
      );
      if (unfinished.length > 0) {
        throw new Error(
          "Alle abhängigen Aufgaben müssen zuerst erledigt werden",
        );
      }
    }

    const updates: Partial<Task> = {
      status: "erledigt",
      erledigtAm: new Date(),
      erledigtVon: params.userId,
    };

    const updatedTask = await this.taskRepository.update(task.id, updates);

    if (params.kommentar) {
      await this.taskRepository.addComment({
        taskId: task.id,
        autorId: params.userId,
        text: `Aufgabe erledigt. ${params.kommentar}`,
        erwaehntePersonen: [],
      });
    }

    return updatedTask;
  }
}
