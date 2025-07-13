import { createTask, Task } from '@/domain/entities/Task';
import { ITaskRepository } from '@/domain/repositories/ITaskRepository';
import { IMemberRepository } from '@/domain/repositories/IMemberRepository';
import { IPermissionService } from '@/domain/services/IPermissionService';

export type CreateTaskParams = {
  titel: string;
  beschreibung?: string;
  context_type: 'event' | 'team' | 'general';
  context_id?: string;
  verantwortlich_id?: string;
  prioritaet?: 'niedrig' | 'mittel' | 'hoch' | 'kritisch';
  frist?: string;
  materialien?: Array<{
    name: string;
    menge: number;
    einheit: string;
    beschreibung?: string;
  }>;
  abhaengig_von?: string[];
  kategorie?: string;
  userId: string;
  userRole: string;
  ipAddress?: string;
  userAgent?: string;
};

export class CreateTaskUseCase {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly memberRepository: IMemberRepository,
    private readonly permissionService: IPermissionService
  ) {}

  async execute(params: CreateTaskParams): Promise<Task> {
    // 1. Berechtigungsprüfung
    const canCreate = await this.permissionService.canCreateTask(
      params.userRole,
      params.context_type
    );
    if (!canCreate) {
      throw new Error('Keine Berechtigung zum Erstellen von Aufgaben');
    }

    // 2. Context-Validierung
    if (params.context_type !== 'general' && !params.context_id) {
      throw new Error('Context ID erforderlich für Event/Team Tasks');
    }

    // 3. Validierung: Verantwortlicher existiert
    if (params.verantwortlich_id) {
      const responsible = await this.memberRepository.findById(params.verantwortlich_id);
      if (!responsible || !responsible.ist_aktiv) {
        throw new Error('Verantwortlicher muss ein aktives Mitglied sein');
      }
    }

    // 4. Validierung: Frist in Zukunft
    if (params.frist) {
      const fristDate = new Date(params.frist);
      if (fristDate < new Date()) {
        throw new Error('Frist muss in der Zukunft liegen');
      }
    }

    // 5. Validierung: Dependencies existieren
    if (params.abhaengig_von && params.abhaengig_von.length > 0) {
      for (const depId of params.abhaengig_von) {
        const depTask = await this.taskRepository.findById(depId);
        if (!depTask) {
          throw new Error(`Abhängige Aufgabe ${depId} existiert nicht`);
        }
        // Verhindere zirkuläre Abhängigkeiten
        if (depTask.abhaengigVon?.includes(params.context_id || '')) {
          throw new Error('Zirkuläre Abhängigkeit erkannt');
        }
      }
    }

    // 6. Task erstellen
    const task = createTask({
      titel: params.titel,
      beschreibung: params.beschreibung,
      context: {
        type: params.context_type,
        id: params.context_id || null
      },
      verantwortlichId: params.verantwortlich_id,
      prioritaet: params.prioritaet,
      frist: params.frist ? new Date(params.frist) : undefined,
      erstelltVon: params.userId
    });

    // Erweiterte Felder setzen
    const fullTask: Omit<Task, 'id' | 'erstelltAm' | 'aktualisiertAm'> = {
      ...task,
      materialien: params.materialien?.map(m => ({ ...m, besorgt: false })) || [],
      abhaengigVon: params.abhaengig_von,
      kategorie: params.kategorie
    };

    // 7. Speichern
    const savedTask = await this.taskRepository.create(fullTask);

    return savedTask;
  }
}
