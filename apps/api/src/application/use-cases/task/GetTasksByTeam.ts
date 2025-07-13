import { Task } from "@/domain/entities/Task";
import { ITaskRepository } from "@/domain/repositories/ITaskRepository";

export type GetTasksByTeamParams = {
  teamId: string;
  userId: string;
  userRole: string;
};

export class GetTasksByTeamUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(params: GetTasksByTeamParams): Promise<Task[]> {
    return await this.taskRepository.getTasksByTeam(params.teamId);
  }
}
