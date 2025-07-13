import { ITaskRepository } from "@/domain/repositories/ITaskRepository";

export type NotifyTaskAssigneesParams = {
  taskId: string;
  nachricht: string;
  typ: "zuweisung" | "statusaenderung" | "kommentar" | "frist";
  userId: string;
};

export class NotifyTaskAssigneesUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(params: NotifyTaskAssigneesParams): Promise<void> {
    const task = await this.taskRepository.findById(params.taskId);
    if (!task) {
      throw new Error("Aufgabe nicht gefunden");
    }

    // TODO: Hier würde die tatsächliche Benachrichtigungslogik implementiert
    // Z.B. über einen NotificationService

    // Für jetzt nur ein Kommentar
    await this.taskRepository.addComment({
      taskId: params.taskId,
      autorId: params.userId,
      text: `[System] ${params.nachricht}`,
      erwaehntePersonen: task.zugewiesenAn,
    });
  }
}
