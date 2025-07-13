import { Task, TaskStatus } from '@/domain/entities/Task';
import { ITaskRepository } from '@/domain/repositories/ITaskRepository';
import { IPermissionService } from '@/domain/services/IPermissionService';

export type ChangeTaskStatusParams = {
  id: string;
  status: TaskStatus;
  kommentar?: string;
  userId: string;
  userRole: string;
  ipAddress?: string;
  userAgent?: string;
};

export class ChangeTaskStatusUseCase {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly permissionService: IPermissionService
  ) {}

  async execute(params: ChangeTaskStatusParams): Promise<Task> {
    // 1. Task laden
    const task = await this.taskRepository.findById(params.id);
    if (!task) {
      throw new Error('Aufgabe nicht gefunden');
    }

    // 2. Workflow-Validierung
    const allowedTransitions = this.getAllowedStatusTransitions(task.status);
    if (!allowedTransitions.includes(params.status)) {
      throw new Error(
        `Übergang von ${task.status} zu ${params.status} nicht erlaubt`
      );
    }

    // 3. Berechtigungsprüfung
    const canChangeStatus = await this.permissionService.canChangeTaskStatus(
      params.userRole,
      params.userId,
      task,
      params.status
    );
    if (!canChangeStatus) {
      throw new Error('Keine Berechtigung für diese Status-Änderung');
    }

    // 4. Spezielle Validierungen
    if (params.status === 'erledigt') {
      // Prüfe ob alle Abhängigkeiten erledigt sind
      if (task.abhaengigVon && task.abhaengigVon.length > 0) {
        const dependencies = await Promise.all(
          task.abhaengigVon.map(id => this.taskRepository.findById(id))
        );

        const unfinishedDeps = dependencies.filter(
          dep => dep && dep.status !== 'erledigt'
        );

        if (unfinishedDeps.length > 0) {
          throw new Error('Alle abhängigen Aufgaben müssen zuerst erledigt werden');
        }
      }

      // Prüfe ob alle Materialien besorgt sind
      const unbeschaffteMaterialien = task.materialien.filter(m => !m.besorgt);
      if (unbeschaffteMaterialien.length > 0) {
        throw new Error('Alle Materialien müssen zuerst besorgt werden');
      }
    }

    // 5. Status ändern
    const updates: Partial<Task> = {
      status: params.status
    };

    // Bei Erledigung zusätzliche Felder setzen
    if (params.status === 'erledigt') {
      updates.erledigtAm = new Date();
      updates.erledigtVon = params.userId;
    }

    const updatedTask = await this.taskRepository.update(task.id, updates);

    // 6. Kommentar hinzufügen wenn vorhanden
    if (params.kommentar) {
      await this.taskRepository.addComment({
        taskId: task.id,
        autorId: params.userId,
        text: `Status geändert: ${task.status} → ${params.status}\n${params.kommentar}`,
        erwaehntePersonen: []
      });
    }

    return updatedTask;
  }

  private getAllowedStatusTransitions(currentStatus: TaskStatus): TaskStatus[] {
    const transitions: Record<TaskStatus, TaskStatus[]> = {
      'offen': ['in_bearbeitung', 'blockiert'],
      'in_bearbeitung': ['review', 'blockiert', 'offen'],
      'review': ['erledigt', 'in_bearbeitung', 'blockiert'],
      'erledigt': [],
      'blockiert': ['offen', 'in_bearbeitung']
    };

    return transitions[currentStatus] || [];
  }
}
