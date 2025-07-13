import { Task } from '@/domain/entities/Task';
import { ITaskRepository, TaskFilters } from '@/domain/repositories/ITaskRepository';
import { IPermissionService } from '@/domain/services/IPermissionService';

export type GetTasksParams = {
  filters?: TaskFilters & {
    nurMeine?: boolean;
    mitMirGeteilt?: boolean;
  };
  userId: string;
  userRole: string;
};

export class GetTasksUseCase {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly permissionService: IPermissionService
  ) {}

  async execute(params: GetTasksParams): Promise<Task[]> {
    const filters = { ...params.filters };

    // Basis-Filter basierend auf Rolle
    if (!['ADMIN', 'VORSTAND', 'BEIRAT'].includes(params.userRole)) {
      // Normale Mitglieder sehen nur:
      // - Ihre eigenen Tasks
      // - Tasks an denen sie beteiligt sind
      // - Öffentliche Team/General Tasks

      if (filters.nurMeine) {
        filters.zugewiesenAn = params.userId;
      } else if (!filters.verantwortlichId && !filters.zugewiesenAn) {
        // Komplexere Filterlogik würde hier folgen
        filters.zugewiesenAn = params.userId;
      }
    }

    const tasks = await this.taskRepository.findAll(filters);

    // Zusätzliche Filterung basierend auf Berechtigungen
    return tasks.filter(task =>
      this.permissionService.canViewTask(params.userRole, params.userId, task)
    );
  }
}
