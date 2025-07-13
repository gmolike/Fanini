import { Task } from '@/domain/entities/Task';
import { ITaskRepository } from '@/domain/repositories/ITaskRepository';

export type GetMyTasksParams = {
  userId: string;
  userRole: string;
};

export class GetMyTasksUseCase {
  constructor(
    private readonly taskRepository: ITaskRepository
  ) {}

  async execute(params: GetMyTasksParams): Promise<Task[]> {
    return await this.taskRepository.getMyTasks(params.userId);
  }
}
