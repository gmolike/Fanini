import { Task } from "@/domain/entities/Task";
import { ITaskRepository } from "@/domain/repositories/ITaskRepository";
import { IPermissionService } from "@/domain/services/IPermissionService";

export type BlockTaskParams = {
  id: string;
  grund: string;
  userId: string;
  userRole: string;
};

export class BlockTaskUseCase {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly permissionService: IPermissionService,
  ) {}

  async execute(params: BlockTaskParams): Promise<Task> {
    const task = await this.taskRepository.findById(params.id);
    if (!task) {
      throw new Error("Aufgabe nicht gefunden");
    }

    const canBlock = await this.permissionService.canChangeTaskStatus(
      params.userRole,
      params.userId,
      task,
      "blockiert",
    );
    if (!canBlock) {
      throw new Error("Keine Berechtigung zum Blockieren dieser Aufgabe");
    }

    const updates: Partial<Task> = {
      status: "blockiert",
    };

    const updatedTask = await this.taskRepository.update(task.id, updates);

    await this.taskRepository.addComment({
      taskId: task.id,
      autorId: params.userId,
      text: `Aufgabe blockiert: ${params.grund}`,
      erwaehntePersonen: [],
    });

    return updatedTask;
  }
}
