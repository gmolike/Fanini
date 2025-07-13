import { TaskComment } from '@/domain/entities/TaskComment';
import { ITaskRepository } from '@/domain/repositories/ITaskRepository';
import { IMemberRepository } from '@/domain/repositories/IMemberRepository';
import { IPermissionService } from '@/domain/services/IPermissionService';

export type AddTaskCommentParams = {
  taskId: string;
  text: string;
  erwaehntePersonen?: string[];
  userId: string;
  userRole: string;
};

export class AddTaskCommentUseCase {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly memberRepository: IMemberRepository
  ) {}

  async execute(params: AddTaskCommentParams): Promise<TaskComment & { autor: { id: string; name: string } }> {
    // 1. Task laden um Berechtigung zu prüfen
    const task = await this.taskRepository.findById(params.taskId);
    if (!task) {
      throw new Error('Aufgabe nicht gefunden');
    }

    // 2. Erwähnte Personen validieren
    if (params.erwaehntePersonen && params.erwaehntePersonen.length > 0) {
      for (const personId of params.erwaehntePersonen) {
        const member = await this.memberRepository.findById(personId);
        if (!member) {
          throw new Error(`Erwähnte Person ${personId} existiert nicht`);
        }
      }
    }

    // 3. Kommentar hinzufügen
    const comment = await this.taskRepository.addComment({
      taskId: params.taskId,
      autorId: params.userId,
      text: params.text,
      erwaehntePersonen: params.erwaehntePersonen || []
    });

    // 4. Autor-Details laden
    const autor = await this.memberRepository.findById(params.userId);

    return {
      ...comment,
      autor: {
        id: params.userId,
        name: autor ? `${autor.vorname} ${autor.nachname}` : 'Unbekannt'
      }
    };
  }
}
