import { ITaskRepository } from '@/domain/repositories/ITaskRepository';
import { IPermissionService } from '@/domain/services/IPermissionService';

export type UnassignMemberParams = {
  taskId: string;
  memberId: string;
  userId: string;
  userRole: string;
};

export class UnassignMemberUseCase {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly permissionService: IPermissionService
  ) {}

  async execute(params: UnassignMemberParams): Promise<void> {
    const task = await this.taskRepository.findById(params.taskId);
    if (!task) {
      throw new Error('Aufgabe nicht gefunden');
    }

    const canAssign = await this.permissionService.canAssignTask(
      params.userRole,
      params.userId,
      task
    );
    if (!canAssign) {
      throw new Error('Keine Berechtigung zum Entfernen von Mitgliedern');
    }

    await this.taskRepository.unassignMember(params.taskId, params.memberId);
  }
}
