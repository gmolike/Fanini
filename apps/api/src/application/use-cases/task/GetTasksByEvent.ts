import { Task } from '@/domain/entities/Task';
import { ITaskRepository } from '@/domain/repositories/ITaskRepository';
import { IEventRepository } from '@/domain/repositories/IEventRepository';
import { IPermissionService } from '@/domain/services/IPermissionService';

export type GetTasksByEventParams = {
  eventId: string;
  userId: string;
  userRole: string;
};

export class GetTasksByEventUseCase {
  constructor(
    private readonly taskRepository: ITaskRepository
  ) {}

  async execute(params: GetTasksByEventParams): Promise<Task[]> {
    // Berechtigung wird über Event-Berechtigung geprüft
    return await this.taskRepository.getTasksByEvent(params.eventId);
  }
}
