import { Task } from '@/domain/entities/Task';
import { ITaskRepository } from '@/domain/repositories/ITaskRepository';
import { IMemberRepository } from '@/domain/repositories/IMemberRepository';
import { IPermissionService } from '@/domain/services/IPermissionService';

export type UpdateTaskParams = {
  id: string;
  data: Partial<{
    titel: string;
    beschreibung: string;
    verantwortlich_id: string;
    prioritaet: 'niedrig' | 'mittel' | 'hoch' | 'kritisch';
    frist: string;
    materialien: Array<{
      name: string;
      menge: number;
      einheit: string;
      beschreibung?: string;
      besorgt: boolean;
    }>;
    abhaengig_von: string[];
    kategorie: string;
  }>;
  userId: string;
  userRole: string;
  ipAddress?: string;
  userAgent?: string;
};

export class UpdateTaskUseCase {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly memberRepository: IMemberRepository,
    private readonly permissionService: IPermissionService
  ) {}

  async execute(params: UpdateTaskParams): Promise<Task> {
    // 1. Task laden
    const task = await this.taskRepository.findById(params.id);
    if (!task) {
      throw new Error('Aufgabe nicht gefunden');
    }

    // 2. Berechtigungsprüfung
    const canEdit = await this.permissionService.canEditTask(
      params.userRole,
      params.userId,
      task
    );
    if (!canEdit) {
      throw new Error('Keine Berechtigung zum Bearbeiten dieser Aufgabe');
    }

    // 3. Status-spezifische Einschränkungen
    if (task.status === 'erledigt' && params.userRole !== 'ADMIN') {
      throw new Error('Erledigte Aufgaben können nicht bearbeitet werden');
    }

    // 4. Validierungen
    if (params.data.verantwortlich_id) {
      const responsible = await this.memberRepository.findById(params.data.verantwortlich_id);
      if (!responsible || !responsible.ist_aktiv) {
        throw new Error('Verantwortlicher muss ein aktives Mitglied sein');
      }
    }

    if (params.data.frist) {
      const fristDate = new Date(params.data.frist);
      if (fristDate < new Date() && task.status !== 'erledigt') {
        throw new Error('Frist muss in der Zukunft liegen');
      }
    }

    // 5. Zirkuläre Abhängigkeiten prüfen
    if (params.data.abhaengig_von) {
      for (const depId of params.data.abhaengig_von) {
        if (depId === params.id) {
          throw new Error('Aufgabe kann nicht von sich selbst abhängen');
        }
        const depTask = await this.taskRepository.findById(depId);
        if (!depTask) {
          throw new Error(`Abhängige Aufgabe ${depId} existiert nicht`);
        }
        // Recursive check würde hier folgen...
      }
    }

    // 6. Update vorbereiten
    const updates: Partial<Task> = {
      ...params.data,
      frist: params.data.frist ? new Date(params.data.frist) : undefined
    };

    // 7. Speichern
    const updatedTask = await this.taskRepository.update(params.id, updates);

    return updatedTask;
  }
}
