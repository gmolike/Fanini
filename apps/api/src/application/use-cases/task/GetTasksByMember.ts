import { Task } from "@/domain/entities/Task";
import { ITaskRepository } from "@/domain/repositories/ITaskRepository";

export type GetTasksByMemberParams = {
  memberId: string;
  userId: string;
  userRole: string;
};

export class GetTasksByMemberUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(params: GetTasksByMemberParams): Promise<Task[]> {
    // Berechtigung wird im Controller geprüft
    return await this.taskRepository.findAll({
      zugewiesenAn: params.memberId,
      nurAktive: true,
    });
  }
}
