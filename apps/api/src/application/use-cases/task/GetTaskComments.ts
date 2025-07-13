import { TaskComment } from '@/domain/entities/TaskComment';
import { ITaskRepository } from '@/domain/repositories/ITaskRepository';
import { IPermissionService } from '@/domain/services/IPermissionService';

export type GetTaskCommentsParams = {
  taskId: string;
  userId: string;
  userRole: string;
};

export class GetTaskCommentsUseCase {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly permissionService: IPermissionService
  ) {}

  async execute(params: GetTaskCommentsParams): Promise<TaskComment[]> {
    const task = await this.taskRepository.findById(params.taskId);
    if (!task) {
      throw new Error('Aufgabe nicht gefunden');
    }

    const canView = this.permissionService.canViewTask(
      params.userRole,
      params.userId,
      task
    );
    if (!canView) {
      throw new Error('Keine Berechtigung zum Anzeigen der Kommentare');
    }

    return await this.taskRepository.getComments(params.taskId);
  }
}
