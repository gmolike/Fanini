import { ITaskRepository } from '@/domain/repositories/ITaskRepository';
import { IPermissionService } from '@/domain/services/IPermissionService';

export type DeleteTaskParams = {
  id: string;
  userId: string;
  userRole: string;
  ipAddress?: string;
  userAgent?: string;
};

export class DeleteTaskUseCase {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly permissionService: IPermissionService
  ) {}

  async execute(params: DeleteTaskParams): Promise<void> {
    // 1. Task laden
    const task = await this.taskRepository.findById(params.id);
    if (!task) {
      throw new Error('Aufgabe nicht gefunden');
    }

    // 2. Berechtigungsprüfung
    const canDelete = await this.permissionService.canDeleteTask(
      params.userRole,
      params.userId,
      task
    );
    if (!canDelete) {
      throw new Error('Keine Berechtigung zum Löschen dieser Aufgabe');
    }

    // 3. Status-Prüfung
    if (task.status !== 'offen' && params.userRole !== 'ADMIN') {
      throw new Error('Nur offene Aufgaben können gelöscht werden');
    }

    // 4. Prüfen ob andere Tasks davon abhängen
    const dependentTasks = await this.taskRepository.findAll({
      nurAktive: true
    });

    const hasDependents = dependentTasks.some(t =>
      t.abhaengigVon?.includes(params.id)
    );

    if (hasDependents) {
      throw new Error('Aufgabe kann nicht gelöscht werden, da andere Aufgaben davon abhängen');
    }

    // 5. Soft Delete
    await this.taskRepository.softDelete(params.id);
  }
}
