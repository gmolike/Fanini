import { ITaskRepository } from '@/domain/repositories/ITaskRepository';
import { IMemberRepository } from '@/domain/repositories/IMemberRepository';
import { IPermissionService } from '@/domain/services/IPermissionService';

export type AssignTaskParams = {
  taskId: string;
  memberIds: string[];
  kommentar?: string;
  userId: string;
  userRole: string;
};

export class AssignTaskUseCase {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly memberRepository: IMemberRepository,
    private readonly permissionService: IPermissionService
  ) {}

  async execute(params: AssignTaskParams): Promise<void> {
    // 1. Task laden
    const task = await this.taskRepository.findById(params.taskId);
    if (!task) {
      throw new Error('Aufgabe nicht gefunden');
    }

    // 2. Berechtigungsprüfung
    const canAssign = await this.permissionService.canAssignTask(
      params.userRole,
      params.userId,
      task
    );
    if (!canAssign) {
      throw new Error('Keine Berechtigung zum Zuweisen dieser Aufgabe');
    }

    // 3. Validierung: Alle Mitglieder existieren und sind aktiv
    for (const memberId of params.memberIds) {
      const member = await this.memberRepository.findById(memberId);
      if (!member || !member.ist_aktiv) {
        throw new Error(`Mitglied ${memberId} ist nicht aktiv`);
      }
    }

    // 4. Zuweisungen durchführen
    await this.taskRepository.assignMembers(
      params.taskId,
      params.memberIds,
      params.userId
    );

    // 5. Kommentar hinzufügen
    if (params.kommentar || params.memberIds.length > 0) {
      const memberNames = await Promise.all(
        params.memberIds.map(async (id) => {
          const member = await this.memberRepository.findById(id);
          return member ? `${member.vorname} ${member.nachname}` : id;
        })
      );

      await this.taskRepository.addComment({
        taskId: params.taskId,
        autorId: params.userId,
        text: `Mitglieder zugewiesen: ${memberNames.join(', ')}${params.kommentar ? '\n' + params.kommentar : ''}`,
        erwaehntePersonen: params.memberIds
      });
    }
  }
}
